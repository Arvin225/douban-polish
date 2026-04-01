# 发布到 GreasyFork

## 方式一: 本地发布

### 1. 获取 API 密钥

访问 https://greasyfork.org/users/webhook-info 获取你的 API 密钥。

### 2. 设置环境变量

**Windows (PowerShell):**
```powershell
$env:GREASYFORK_API_KEY = "your_api_key_here"
```

**Windows (CMD):**
```cmd
set GREASYFORK_API_KEY=your_api_key_here
```

**Mac/Linux:**
```bash
export GREASYFORK_API_KEY=your_api_key_here
```

### 3. 配置 Script ID

编辑 `package.json`，设置你的脚本 ID:

```json
{
  "greasyfork": {
    "scriptId": "123456",
    "url": "https://greasyfork.org/scripts/123456"
  }
}
```

### 4. 运行发布命令

```bash
npm run build
npm run publish:greasyfork
```

## 方式二: GitHub Actions 自动发布

### 1. Fork/创建 GitHub 仓库

将代码推送到 GitHub 仓库。

### 2. 配置 Secrets

在 GitHub 仓库页面:
- Settings -> Secrets and variables -> Actions
- 添加以下 secrets:
  - `GREASYFORK_API_KEY`: 你的 API 密钥
  - `GREASYFORK_SCRIPT_ID`: 你的脚本 ID

### 3. 自动触发条件

默认配置会在以下情况自动发布:
- 推送到 `main` 或 `master` 分支
- 修改了 `src/` 目录或 `package.json`
- 手动触发 (Actions 页面点击 "Run workflow")

### 4. 查看发布状态

在 GitHub 仓库的 Actions 标签页查看发布日志。

## 首次发布注意事项

1. 如果脚本尚未在 GreasyFork 上创建，需要先手动创建第一个版本
2. 在 GreasyFork 上创建脚本后，从 URL 中获取 Script ID
3. 然后才能使用自动发布功能

## 版本号管理

- 每次发布前更新 `package.json` 中的 `version`
- vite-plugin-monkey 会自动同步 `userscript.version`
- 建议遵循 [语义化版本](https://semver.org/)
