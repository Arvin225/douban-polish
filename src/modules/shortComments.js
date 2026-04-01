import { TYPE_NAMES, SELECTORS } from '../config.js';
import { log } from '../utils/logger.js';
import { findContainer, findContainerByTitle, createHeader } from '../utils/dom.js';
import { applyBaseOptimization } from './base.js';

/**
 * 查找短评容器
 */
export function findShortCommentContainer() {
    let container = findContainer(SELECTORS.short);
    if (!container) {
        container = findContainerByTitle(TYPE_NAMES.short, SELECTORS.short);
    }
    return container;
}

/**
 * 优化短评区域
 */
export function optimizeShortComments(container) {
    const items = container.querySelectorAll('.comment-item, .short-comment-item, .item');
    const count = items.length;
    
    if (!applyBaseOptimization(container, 'short', count)) return;
    
    // 添加标题栏
    const header = createHeader(TYPE_NAMES.short, count);
    container.insertBefore(header, container.firstChild);
    
    // 添加评分标签
    addRatingTags(container);
    
    // 添加过滤控件
    addFilterControls(container);
    
    log(`短评区域优化完成，共 ${count} 条`);
}

/**
 * 添加评分标签
 */
function addRatingTags(container) {
    const items = container.querySelectorAll('.comment-item, .short-comment-item, .item');
    
    items.forEach(item => {
        if (item.dataset.ratingTagged) return;
        
        let rating = extractRating(item);
        
        item.dataset.rating = rating;
        item.dataset.ratingTagged = 'true';
        
        if (rating > 0) {
            const tag = document.createElement('span');
            tag.className = `rating-tag rating-${rating}`;
            tag.textContent = '★'.repeat(rating);
            
            const header = item.querySelector('.header, .hd, .comment-header, .title, .user-info');
            if (header) header.insertBefore(tag, header.firstChild);
        }
    });
}

/**
 * 提取评分
 */
function extractRating(item) {
    let rating = 0;
    const ratingEl = item.querySelector('.rating, .stars, [class*="star"], .allstar');
    
    if (ratingEl) {
        const className = ratingEl.className || '';
        const match = className.match(/allstar(\d+)/) || className.match(/rating(\d+)/);
        if (match) rating = parseInt(match[1]) / 10;
        
        const title = ratingEl.getAttribute('title');
        if (title) {
            const map = { '力荐': 5, '推荐': 4, '还行': 3, '较差': 2, '很差': 1 };
            for (const [k, v] of Object.entries(map)) {
                if (title.includes(k)) rating = v;
            }
        }
    }
    
    if (!rating) {
        const text = item.textContent;
        const map = { '力荐': 5, '推荐': 4, '还行': 3, '较差': 2, '很差': 1 };
        for (const [k, v] of Object.entries(map)) {
            if (text.includes(k)) rating = v;
        }
    }
    
    return rating;
}

/**
 * 添加过滤控件
 */
function addFilterControls(container) {
    const header = container.querySelector('.opt-header');
    if (!header || header.querySelector('.filter-bar')) return;
    
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';
    filterBar.innerHTML = `
        <div class="star-filter">
            <span>筛选:</span>
            <span class="star-option active" data-rating="0">全部</span>
            <span class="star-option" data-rating="5">★★★★★</span>
            <span class="star-option" data-rating="4">★★★★</span>
            <span class="star-option" data-rating="3">★★★</span>
            <span class="star-option" data-rating="2">★★</span>
            <span class="star-option" data-rating="1">★</span>
        </div>
    `;
    
    filterBar.querySelectorAll('.star-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            const rating = parseInt(e.target.dataset.rating);
            filterBar.querySelectorAll('.star-option').forEach(o => o.classList.remove('active'));
            e.target.classList.add('active');
            filterByRating(container, rating);
        });
    });
    
    header.appendChild(filterBar);
}

/**
 * 按评分过滤
 */
function filterByRating(container, rating) {
    const items = container.querySelectorAll('[data-rating]');
    let visible = 0;
    
    items.forEach(item => {
        const itemRating = parseInt(item.dataset.rating) || 0;
        const show = rating === 0 || itemRating === rating;
        item.classList.toggle('rating-hidden', !show);
        if (show) visible++;
    });
    
    const countEl = container.querySelector('.opt-count');
    const total = countEl.dataset.total;
    countEl.textContent = `显示 ${visible}/${total} 条`;
}
