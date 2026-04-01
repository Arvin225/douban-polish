import { CONFIG } from './config.js';
import { log } from './utils/logger.js';
import { observeDynamicContent, observeRouteChange } from './utils/observers.js';
import { state, safeExpand } from './modules/base.js';
import { findShortCommentContainer, optimizeShortComments } from './modules/shortComments.js';
import { findReviewContainer, optimizeReviews } from './modules/reviews.js';
import { addNavPanel } from './modules/navigation.js';
import './styles/index.css';

/**
 * 初始化
 */
function init() {
    log('初始化开始，页面类型:', CONFIG.pageType);
    
    setTimeout(() => {
        // 展开并优化短评
        safeExpand('short', findShortCommentContainer, optimizeShortComments);
        
        // 展开并优化影评
        safeExpand('review', findReviewContainer, optimizeReviews);
        
        // 添加导航面板
        addNavPanel();
        
        // 监听动态加载
        setupObservers();
    }, CONFIG.delay);
}

/**
 * 设置观察器
 */
function setupObservers() {
    // 监听新内容
    observeDynamicContent(() => {
        const shortContainer = document.querySelector('[data-section-type="short"]');
        const reviewContainer = document.querySelector('[data-section-type="review"]');
        
        if (shortContainer) {
            // 重新应用评分标签
            const event = new CustomEvent('reapply-ratings', { detail: shortContainer });
            document.dispatchEvent(event);
        }
        
        if (reviewContainer) {
            // 重新增强影评
            const event = new CustomEvent('reapply-reviews', { detail: reviewContainer });
            document.dispatchEvent(event);
        }
    });
    
    // 监听路由变化
    observeRouteChange(() => {
        log('页面路由变化，重新初始化');
        state.expanded = { short: false, review: false };
        init();
    });
}

// 启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    setTimeout(init, 300);
}
