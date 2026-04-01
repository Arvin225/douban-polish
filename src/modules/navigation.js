import { TYPE_NAMES } from '../config.js';

/**
 * 添加导航面板
 */
export function addNavPanel() {
    if (document.querySelector('.douban-nav')) return;
    
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
