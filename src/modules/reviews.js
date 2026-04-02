import { TYPE_NAMES, SELECTORS } from '../config.js';
import { log } from '../utils/logger.js';
import { findContainer, findContainerByTitle, createHeader, hasNativeExpand } from '../utils/dom.js';
import { applyBaseOptimization } from './base.js';

/**
 * 检查当前页面是否为独立列表页（影评/短评详情页）
 */
function isStandaloneListPage() {
    const path = location.pathname;
    return path.includes('/reviews') || path.includes('/review') ||
           path.includes('/comments') || path.includes('/comment');
}

/**
 * 查找影评容器
 */
export function findReviewContainer() {
    // 在独立列表页不查找容器
    if (isStandaloneListPage()) {
        return null;
    }
    let container = findContainer(SELECTORS.review);
    if (!container) {
        container = findContainerByTitle(TYPE_NAMES.review, SELECTORS.review);
    }
    return container;
}

/**
 * 优化影评区域
 */
export function optimizeReviews(container) {
    const items = container.querySelectorAll('.review-item, .article, .review, [data-cid]');
    const count = items.length;
    
    if (!applyBaseOptimization(container, 'review', count)) return;
    
    // 添加标题栏
    const header = createHeader(TYPE_NAMES.review, count);
    container.insertBefore(header, container.firstChild);
    
    // 智能增强影评（避免重复展开）
    smartEnhanceReviews(container);
    
    // 添加过滤控件
    addReviewFilters(container);
    
    log(`影评区域优化完成，共 ${count} 条`);
}

/**
 * 智能增强影评 - 核心修复：避免与豆瓣原生展开按钮冲突
 */
function smartEnhanceReviews(container) {
    const items = container.querySelectorAll('.review-item, .article, .review, [data-cid]');
    
    items.forEach(item => {
        // 跳过已处理的
        if (item.classList.contains('script-enhanced') || 
            item.classList.contains('douban-native-enhanced')) {
            return;
        }
        
        // 检查是否有豆瓣原生展开功能
        if (hasNativeExpand(item)) {
            item.classList.add('douban-native-enhanced');
            log('跳过已有原生展开按钮的影评');
            return;
        }
        
        // 对没有原生展开的影评，添加脚本展开功能
        const content = item.querySelector('.short-content, .review-content, .content, .main-bd > div');
        if (content && content.textContent.trim().length > 150) {
            addScriptExpand(item, content);
        } else {
            item.classList.add('script-enhanced');
        }
    });
}

/**
 * 添加脚本展开功能
 */
function addScriptExpand(item, content) {
    content.classList.add('script-expand-content');
    
    const expandBtn = document.createElement('span');
    expandBtn.className = 'script-expand-btn';
    expandBtn.innerHTML = '展开全文 <span style="font-size:10px">▼</span>';
    
    expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = content.classList.contains('expanded');
        content.classList.toggle('expanded');
        expandBtn.innerHTML = isExpanded ? 
            '展开全文 <span style="font-size:10px">▼</span>' : 
            '收起 <span style="font-size:10px">▲</span>';
    });
    
    // 插入按钮
    if (content.nextElementSibling) {
        content.parentElement.insertBefore(expandBtn, content.nextElementSibling);
    } else {
        item.appendChild(expandBtn);
    }
    
    item.classList.add('review-item-enhanced', 'script-enhanced');
}

/**
 * 添加影评过滤控件
 */
function addReviewFilters(container) {
    const header = container.querySelector('.opt-header');
    if (!header || header.querySelector('.filter-bar')) return;
    
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';
    filterBar.innerHTML = `
        <button class="filter-btn active" data-filter="all">全部</button>
        <button class="filter-btn" data-filter="spoiler">有剧透</button>
        <button class="filter-btn" data-filter="nospoiler">无剧透</button>
        <button class="filter-btn" data-filter="image">带图片</button>
    `;
    
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterReviews(container, e.target.dataset.filter);
        });
    });
    
    header.appendChild(filterBar);
}

/**
 * 过滤影评
 */
function filterReviews(container, type) {
    const items = container.querySelectorAll('.review-item, .article, .review, [data-cid]');
    let visible = 0;
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const hasSpoiler = text.includes('剧透') || text.includes('spoiler');
        const hasImage = item.querySelector('img') !== null;
        
        let show = true;
        if (type === 'spoiler') show = hasSpoiler;
        else if (type === 'nospoiler') show = !hasSpoiler;
        else if (type === 'image') show = hasImage;
        
        item.style.display = show ? '' : 'none';
        if (show) visible++;
    });
    
    container.querySelector('.opt-count').textContent = `显示 ${visible} 条`;
}
