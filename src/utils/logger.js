import { CONFIG } from '../config.js';

export const log = (...args) => {
    if (CONFIG.debug) {
        console.log('[豆瓣优化]', ...args);
    }
};

export const warn = (...args) => {
    console.warn('[豆瓣优化]', ...args);
};
