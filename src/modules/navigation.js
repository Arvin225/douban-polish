import { TYPE_NAMES } from '../config.js';

/**
 * 检查当前页面是否为独立列表页（影评/短评详情页）
 * 这些页面不需要显示悬浮导航窗口
 */
function isStandaloneListPage() {
    const path = location.pathname;
    // 检查 URL 路径是否匹配独立列表页模式
    const isReviewsPage = path.includes('/reviews') || path.includes('/review');
    const isCommentsPage = path.includes('/comments') || path.includes('/comment');
    
    // 如果在详情页，不显示导航
    if (isReviewsPage || isCommentsPage) {
        return true;
    }
    
    return false;
}

/**
 * 添加导航面板
 */
export function addNavPanel() {
    if (document.querySelector('.douban-nav')) return;
    
    // 在独立列表页不显示导航面板
    if (isStandaloneListPage()) {
        return;
    }
    
    const nav = document.createElement('div');
    nav.className = 'douban-nav';
    nav.innerHTML = `
        <button class="nav-btn" data-target="short">${TYPE_NAMES.short}</button>
        <button class="nav-btn secondary" data-target="review">${TYPE_NAMES.review}</button>
        <button class="nav-btn top">⬆️ 顶部</button>
    `;
    
    nav.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.dataset.target;
            
            if (target) {
                const section = document.querySelector(`[data-section-type="${target}"]`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    section.style.boxShadow = '0 0 20px rgba(0,181,29,0.4)';
                    setTimeout(() => section.style.boxShadow = '', 1500);
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    document.body.appendChild(nav);
}
