import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: 'Douban Polish',
                namespace: 'http://tampermonkey.net/',
                version: '3.3.1',
                description: 'Modernize Douban interface with auto-expand comments and rating filters',
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
