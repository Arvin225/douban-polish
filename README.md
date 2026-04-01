# Douban Polish - 体验更现代化的豆瓣

基于 Vite + vite-plugin-monkey 的豆瓣界面优化脚本。

## 功能特性

- 自动展开短评/影评
- 评分星级过滤
- 独立滚动区域
- 导航面板快速跳转
- 剧透/图片筛选

## 项目结构

```
douban-polish/
├── src/
│   ├── main.js              # 入口文件
│   ├── config.js            # 全局配置
│   ├── utils/
│   │   ├── dom.js           # DOM操作工具
│   │   ├── logger.js        # 日志工具
│   │   └── observers.js     # 观察器工具
│   ├── modules/
│   │   ├── base.js          # 基础优化模块
│   │   ├── shortComments.js # 短评模块
│   │   ├── reviews.js       # 影评模块（修复重复展开）
│   │   └── navigation.js    # 导航面板
│   └── styles/
│       └── index.css        # 样式文件
├── scripts/
│   └── publish-greasyfork.js # GreasyFork发布脚本
├── .github/workflows/
│   └── publish.yml          # GitHub Actions自动发布
├── docs/
│   └── PUBLISH.md           # 发布文档
├── dist/                    # 构建输出（自动生成）
├── package.json
├── vite.config.js
└── README.md
```

## 使用方式

### 开发模式（热更新）

```bash
npm install
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建后会在 `dist/` 目录生成 `douban-polish.user.js`，直接复制到 Tampermonkey 即可。

### 发布到 GreasyFork

```bash
# 配置 API 密钥和 Script ID 后
npm run publish:greasyfork
```

详见 [docs/PUBLISH.md](docs/PUBLISH.md)

## 支持页面

- 豆瓣电影：`https://movie.douban.com/subject/*`
- 豆瓣读书：`https://book.douban.com/subject/*`
- 豆瓣音乐：`https://music.douban.com/subject/*`
