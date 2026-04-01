// DOM 操作工具

/**
 * 查找容器元素
 */
export function findContainer(selectors) {
    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.children.length > 0) return el;
    }
    return null;
}

/**
 * 通过标题文本查找容器
 */
export function findContainerByTitle(titleText, selectors) {
    const headings = document.querySelectorAll('h2, h3, .pl2, .mod-hd h2, span, div');
    for (const h of headings) {
        if (h.textContent.includes(titleText)) {
            // 尝试相邻兄弟元素
            let sibling = h.parentElement?.nextElementSibling;
            if (sibling && sibling.children.length > 2) return sibling;
            
            // 尝试父容器内部
            const parent = h.closest('.mod, section, article');
            if (parent) {
                const content = parent.querySelector('.bd, .mod-bd, .content, ul, .list');
                if (content) return content;
            }
        }
    }
    return null;
}

/**
 * 检查元素是否有原生展开按钮
 */
export function hasNativeExpand(item) {
    const nativeExpand = item.querySelector('.expand-btn, [data-action="expand"], .review-expand');
    if (!nativeExpand) return false;
    
    const text = nativeExpand.textContent || '';
    return text.includes('展开') || 
           text.includes('▼') || 
           nativeExpand.getAttribute('data-action') === 'expand';
}

/**
 * 创建粘性标题栏
 */
export function createHeader(title, count) {
    const header = document.createElement('div');
    header.className = 'opt-header';
    header.innerHTML = `
        <span class="opt-title">${title}</span>
        <span class="opt-count" data-total="${count}">共 ${count} 条</span>
    `;
    return header;
}
