import { log } from '../utils/logger.js';

let replyModal = null;

/**
 * 初始化回应弹窗功能
 */
export function initReplyModal() {
    // 监听所有影评区域的点击事件（事件委托）
    document.addEventListener('click', handleReplyClick, true);
    log('回应弹窗功能已初始化');
}

/**
 * 处理回应按钮点击
 */
function handleReplyClick(e) {
    // 查找点击的是否是回应链接
    const replyLink = e.target.closest('a[href*="/review/"], a[href*="#comments"]');
    if (!replyLink) return;
    
    // 检查链接文本是否包含"回应"
    const text = replyLink.textContent.trim();
    if (!text.includes('回应') && !text.includes('回复')) return;
    
    // 阻止默认跳转
    e.preventDefault();
    e.stopPropagation();
    
    const href = replyLink.getAttribute('href');
    if (!href) return;
    
    // 获取完整URL
    const url = href.startsWith('http') ? href : `https://${location.hostname}${href}`;
    
    // 显示弹窗
    showReplyModal(url, replyLink);
}

/**
 * 显示回应弹窗
 */
function showReplyModal(url, triggerElement) {
    // 如果弹窗已存在，先移除
    if (replyModal) {
        replyModal.remove();
    }
    
    // 创建弹窗
    replyModal = document.createElement('div');
    replyModal.className = 'douban-reply-modal';
    replyModal.innerHTML = `
        <div class="reply-modal-overlay"></div>
        <div class="reply-modal-content">
            <div class="reply-modal-header">
                <h3>回应</h3>
                <button class="reply-modal-close">×</button>
            </div>
            <div class="reply-modal-body">
                <div class="reply-loading">加载中...</div>
            </div>
        </div>
    `;
    
    // 绑定关闭事件
    replyModal.querySelector('.reply-modal-close').addEventListener('click', closeModal);
    replyModal.querySelector('.reply-modal-overlay').addEventListener('click', closeModal);
    
    // ESC键关闭
    document.addEventListener('keydown', handleEscKey);
    
    document.body.appendChild(replyModal);
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
    
    // 加载回应内容
    loadReplies(url);
}

/**
 * 加载回应内容
 */
async function loadReplies(url) {
    try {
        log('开始加载回应:', url);
        const response = await fetch(url, {
            credentials: 'include', // 包含 cookies
            headers: {
                'Accept': 'text/html,application/xhtml+xml'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        log('获取到HTML，长度:', html.length);
        
        // 解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 检查是否是豆瓣页面
        if (!doc.querySelector('title') || !html.includes('douban')) {
            throw new Error('返回内容不是豆瓣页面');
        }
        
        // 提取评论区HTML
        const commentsSection = extractCommentsSection(doc);
        log('提取结果:', commentsSection ? '有内容' : '无内容');
        
        // 更新弹窗内容
        updateModalContent(commentsSection, url);
        
    } catch (error) {
        log('加载回应失败:', error);
        const body = replyModal?.querySelector('.reply-modal-body');
        if (body) {
            body.innerHTML = `
                <div class="reply-error">
                    <p>加载失败: ${error.message}</p>
                    <a href="${url}" target="_blank" class="reply-open-original">在原页面查看</a>
                </div>
            `;
        }
    }
}

/**
 * 提取评论区HTML
 * 优先提取豆瓣原有的评论区DOM结构
 */
function extractCommentsSection(doc) {
    // 方法1: 尝试找到评论列表容器（优先查找已渲染的DOM）
    const commentsContainer = doc.querySelector('#comments.comment-list');
    if (commentsContainer) {
        const children = commentsContainer.querySelectorAll('.comment-item, [data-cid]');
        log('找到评论区DOM容器，子评论元素数:', children.length);
        if (children.length > 0) {
            return commentsContainer.outerHTML;
        }
    }
    
    // 方法2: 尝试从 script 中的 _COMMENTS_CONFIG 重新构建评论区
    const scripts = doc.querySelectorAll('script');
    log('查找脚本数量:', scripts.length);
    
    for (const script of scripts) {
        const text = script.textContent;
        if (text.includes('_COMMENTS_CONFIG') && text.includes('comments')) {
            log('找到包含 _COMMENTS_CONFIG 的脚本');
            
            try {
                // 使用大括号匹配算法提取完整对象
                const varIdx = text.indexOf('var _COMMENTS_CONFIG');
                if (varIdx === -1) continue;
                
                const eqIdx = text.indexOf('=', varIdx);
                if (eqIdx === -1) continue;
                
                // 找到起始大括号
                let startIdx = -1;
                for (let i = eqIdx + 1; i < text.length; i++) {
                    if (text[i] === '{') {
                        startIdx = i;
                        break;
                    }
                }
                if (startIdx === -1) continue;
                
                // 大括号匹配找到结束位置
                let braceCount = 1;
                let inStr = false;
                let strChar = '';
                let endIdx = -1;
                
                for (let i = startIdx + 1; i < text.length; i++) {
                    const ch = text[i];
                    const prevCh = text[i - 1];
                    
                    if (inStr) {
                        // 检查字符串结束（处理转义）
                        if (ch === strChar && prevCh !== '\\') {
                            inStr = false;
                        }
                    } else {
                        if (ch === '"' || ch === "'") {
                            inStr = true;
                            strChar = ch;
                        } else if (ch === '{') {
                            braceCount++;
                        } else if (ch === '}') {
                            braceCount--;
                            if (braceCount === 0) {
                                endIdx = i + 1;
                                break;
                            }
                        }
                    }
                }
                
                if (endIdx === -1) {
                    log('未能找到对象结束位置');
                    continue;
                }
                
                let configStr = text.substring(startIdx, endIdx);
                log('提取到对象，长度:', configStr.length);
                
                // 清理函数定义 - afterRender 属性包含一个函数
                // 把函数替换为null
                configStr = configStr.replace(/'afterRender'\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*(,|$)/, "'afterRender':null$1");
                
                // 清理其他可能的函数
                configStr = configStr.replace(/'\w+'\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*(,|$)/g, (match, endChar) => "null" + endChar);
                
                log('清理后长度:', configStr.length);
                
                // 使用 Function 构造器解析
                const parseFunc = new Function('return ' + configStr);
                const config = parseFunc();
                
                if (config && config.comments && Array.isArray(config.comments) && config.comments.length > 0) {
                    log('成功解析，评论数:', config.comments.length);
                    return buildCommentsHTML(config.comments);
                } else {
                    log('解析成功但没有评论数据，comments:', config?.comments);
                }
            } catch (e) {
                log('解析失败:', e.message, e.stack?.substring(0, 200));
                
                // 备用方案：直接提取 comments 数组
                try {
                    log('尝试备用方案：直接提取 comments 数组');
                    const commentsMatch = text.match(/'comments'\s*:\s*(\[[\s\S]*\])\s*,?\s*'/);
                    if (commentsMatch) {
                        const commentsJson = commentsMatch[1]
                            .replace(/'([^']*)':/g, '"$1":')  // 键名单引号转双引号
                            .replace(/'/g, '"');  // 值单引号转双引号
                        const comments = JSON.parse(commentsJson);
                        if (comments && comments.length > 0) {
                            log('备用方案成功，评论数:', comments.length);
                            return buildCommentsHTML(comments);
                        }
                    }
                } catch (e2) {
                    log('备用方案也失败:', e2.message);
                }
            }
        }
    }
    
    // 方法3: 尝试获取页面中任何可能包含评论的元素
    const anyComments = doc.querySelectorAll('[data-cid]');
    if (anyComments.length > 0) {
        log('找到', anyComments.length, '个评论元素，但未在预期容器中');
    }
    
    log('未能提取到评论区数据');
    return null;
}

/**
 * 根据评论数据构建豆瓣样式的评论区HTML
 */
function buildCommentsHTML(comments) {
    const commentsHtml = comments.map(comment => {
        const author = comment.author || {};
        const avatar = author.avatar || 'https://img3.doubanio.com/f/shire/3eacdfaa61874a0910d83207302268420e8d5161/pics/icon/default_user_medium.png';
        const isAuthor = comment.is_owner || false;
        
        // 子回复
        let repliesHtml = '';
        if (comment.replies && comment.replies.length > 0) {
            const repliesContent = comment.replies.map(reply => {
                const rAuthor = reply.author || {};
                const rAvatar = rAuthor.avatar || 'https://img3.doubanio.com/f/shire/3eacdfaa61874a0910d83207302268420e8d5161/pics/icon/default_user_medium.png';
                const rIsAuthor = reply.is_owner || false;
                
                return `
                    <div class="reply-item" data-cid="${reply.id}">
                        <div class="bg-img">
                            <a href="${rAuthor.url || '#'}">
                                <img width="24" height="24" src="${rAvatar}" alt="${rAuthor.name || '未知用户'}">
                            </a>
                        </div>
                        <div class="reply-con">
                            <div class="reply-meta">
                                <a href="${rAuthor.url || '#'}">${rAuthor.name || '未知用户'}</a>
                                ${rIsAuthor ? '<span class="author-tag">作者</span>' : ''}
                                <span class="reply-time">${reply.create_time || ''}</span>
                            </div>
                            <div class="reply-content">
                                ${reply.ref_comment ? `<span class="reply-quote">${reply.ref_comment.author?.name || ''}: ${reply.ref_comment.text}</span>` : ''}
                                ${reply.text || ''}
                            </div>
                            <div class="reply-actions">
                                <span class="reply-vote">赞(${reply.vote_count || 0})</span>
                                <span class="reply-report">投诉</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            repliesHtml = `<div class="reply-list">${repliesContent}</div>`;
        }
        
        return `
            <div class="comment-item" data-cid="${comment.id}">
                <div class="avatar">
                    <a href="${author.url || '#'}">
                        <img width="32" height="32" src="${avatar}" alt="${author.name || '未知用户'}">
                    </a>
                </div>
                <div class="content">
                    <div class="header">
                        <a href="${author.url || '#'}">${author.name || '未知用户'}</a>
                        ${isAuthor ? '<span class="author-tag">作者</span>' : ''}
                        <span class="time">${comment.create_time || ''}</span>
                    </div>
                    <p>${comment.text || ''}</p>
                    <div class="actions">
                        <span class="vote-count">赞(${comment.vote_count || 0})</span>
                        <span class="reply-btn">回应</span>
                        <span class="report">投诉</span>
                    </div>
                    ${repliesHtml}
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div id="comments" class="comment-list">
            ${commentsHtml}
        </div>
    `;
}

/**
 * 更新弹窗内容
 */
function updateModalContent(commentsHtml, url) {
    const body = replyModal?.querySelector('.reply-modal-body');
    if (!body) return;
    
    if (!commentsHtml) {
        // 使用iframe作为备用方案，并添加锚点让页面自动滚动到评论区
        const iframeUrl = url.includes('#') ? url : url + '#comments';
        body.innerHTML = `
            <div class="reply-iframe-wrapper">
                <iframe src="${iframeUrl}" frameborder="0" style="width:100%;height:100%;min-height:500px;"></iframe>
            </div>
        `;
        return;
    }
    
    body.innerHTML = `
        <div class="douban-comments-wrapper">
            ${commentsHtml}
        </div>
    `;
}

/**
 * 关闭弹窗
 */
function closeModal() {
    if (replyModal) {
        replyModal.remove();
        replyModal = null;
    }
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscKey);
}

/**
 * 处理ESC键
 */
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}
