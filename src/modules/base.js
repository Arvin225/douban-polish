import { CONFIG } from '../config.js';
import { log } from '../utils/logger.js';

// 状态管理
export const state = {
    expanded: { short: false, review: false },
    filters: { rating: 0, type: 'all' }
};

/**
 * 安全展开区域（防止跳转）
 */
export function safeExpand(type, findContainerFn, optimizeFn) {
    if (state.expanded[type]) return;
    
    const typeName = type === 'short' ? 
        (CONFIG.pageType === 'movie' ? '短评' : '短评') : 
        (CONFIG.pageType === 'movie' ? '影评' : CONFIG.pageType === 'book' ? '书评' : '乐评');
    
    log(`开始处理${typeName}...`);
    
    let container = findContainerFn(type);
    const expandBtn = findSafeExpandButton(type, typeName);
    
    if (expandBtn) {
        log(`找到安全的展开按钮: "${expandBtn.textContent.trim()}"`);
        
        // 阻止跳转
        const originalHref = expandBtn.getAttribute('href');
        if (originalHref && originalHref.includes('/subject/')) {
            expandBtn.removeAttribute('href');
            log('已移除跳转链接，改为AJAX展开');
        }
        
        expandBtn.click();
        state.expanded[type] = true;
        
        // 等待加载完成
        setTimeout(() => {
            container = findContainerFn(type) || container;
            if (container) optimizeFn(container, type);
        }, 800);
    } else {
        log(`未找到展开按钮，直接优化现有内容`);
        if (container) optimizeFn(container, type);
    }
}

/**
 * 查找安全的展开按钮
 */
function findSafeExpandButton(type, typeName) {
    const keywords = type === 'short' 
        ? ['展开', '更多', '全部', '...', '▼']
        : ['展开', '更多', '全部', '...', '▼', '加载'];
        
    const unsafePatterns = ['/reviews', '/comments', '/subject/', 'douban.com/subject'];
    const candidates = document.querySelectorAll('a, button, .j a, .pl2 a, [data-action="expand"], .expand-btn, .load-more');
    
    for (const btn of candidates) {
        const text = btn.textContent.trim();
        const isMatch = keywords.some(kw => text.includes(kw));
        if (!isMatch) continue;
        
        const href = btn.getAttribute('href') || '';
        const isUnsafe = unsafePatterns.some(p => href.includes(p)) || 
                        (href && !href.startsWith('#') && !href.startsWith('javascript:'));
        
        const hasAjaxMarker = btn.hasAttribute('data-action') || 
                             btn.classList.contains('j') ||
                             btn.onclick ||
                             btn.getAttribute('data-target');
        
        if (isUnsafe && !hasAjaxMarker) {
            log(`跳过跳转链接: "${text}" -> ${href}`);
            continue;
        }
        
        // 检查是否在目标区域
        const parent = btn.closest('.mod, section, [id*="comment"], [id*="review"]');
        if (parent && !parent.textContent.includes(typeName)) continue;
        
        return btn;
    }
    
    return null;
}

/**
 * 应用基础优化样式
 */
export function applyBaseOptimization(container, type, count) {
    if (container.classList.contains('douban-opt-section')) return false;
    
    container.style.setProperty('--h', `${CONFIG.heights[type]}px`);
    container.classList.add('douban-opt-section');
    container.dataset.sectionType = type;
    
    return true;
}
