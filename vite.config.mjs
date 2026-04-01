import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: 'Douban Polish - 体验更现代化的豆瓣',
                namespace: 'http://tampermonkey.net/',
                version: '3.3',
                description: '一款专为豆瓣用户设计的浏览器插件，提供了丰富的扩展功能，让原生页面焕然一新！',
                author: 'arvin',
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
