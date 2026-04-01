// 全局配置
export const CONFIG = {
    heights: {
        short: 500,
        review: 600
    },
    delay: 1000,
    debug: true,
    pageType: location.hostname.includes('movie') ? 'movie' :
              location.hostname.includes('book') ? 'book' : 'music',
};

export const TYPE_NAMES = {
    movie: { short: '短评', review: '影评' },
    book: { short: '短评', review: '书评' },
    music: { short: '短评', review: '乐评' },
}[CONFIG.pageType];

// 选择器配置
export const SELECTORS = {
    movie: {
        short: ['#comments-section', '.short-comment', '#hot-comments', '.comment-list', '.mod-bd .short-comment'],
        review: ['#reviews-wrapper', '.reviews', '#reviews', '.review-list', '.mod-bd .review', '.review-section']
    },
    book: {
        short: ['.short-comment', '#comments', '.comment-list', '[data-type="comments"]', '#db-comments-section'],
        review: ['.review-list', '#reviews', '.reviews', '.article-list', '#db-reviews-section']
    },
    music: {
        short: ['.short-comment', '#comments', '.comment-list', '#hot-comments'],
        review: ['.review-list', '#reviews', '.music-review', '.mod-bd .review']
    }
}[CONFIG.pageType];
