import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: '豆瓣界面优化 - 模块化版',
                namespace: 'http://tampermonkey.net/',
                version: '3.3',
                description: '自动展开短评/影评，支持评分过滤，独立滚动区域',
                author: 'You',
                match: [
                    'https://movie.douban.com/subject/*',
                    'https://book.douban.com/subject/*',
                    'https://music.douban.com/subject/*'
                ],
                grant: ['GM_addStyle'],
                'run-at': 'document-end',
            },
        }),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
