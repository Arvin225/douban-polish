// 观察器工具

/**
 * 监听动态内容加载
 */
export function observeDynamicContent(callback, delay = 500) {
    const observer = new MutationObserver(() => {
        clearTimeout(window._doubanOptTimer);
        window._doubanOptTimer = setTimeout(callback, delay);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    return observer;
}

/**
 * 监听路由变化（SPA支持）
 */
export function observeRouteChange(callback) {
    let lastUrl = location.href;
    
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(callback, 1200);
        }
    });
    
    observer.observe(document, {
        subtree: true,
        childList: true
    });
    
    return observer;
}
