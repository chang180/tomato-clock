# 番茄鐘 (Tomato Clock)

瀏覽器番茄鐘 Web App：專注 / 短休 / 長休計時、設定與統計（localStorage）。

技術棧：Next.js (App Router) + React + TypeScript + Tailwind CSS。

## 本機開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

## 部署至 GitHub Pages

本專案已設定 GitHub Actions，推送 `main` 後會自動建置並發布靜態站。

### 第一次請在 GitHub 設定

1. 儲存庫 **Settings** → **Pages**
2. **Source** 選 **GitHub Actions**

### 上線網址

**https://chang180.github.io/tomato-clock/**

詳細說明見 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 文件

| 檔案 | 說明 |
|------|------|
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | GitHub Pages 部署 |
| [docs/GITHUB_MCP_SETUP.md](docs/GITHUB_MCP_SETUP.md) | GitHub MCP 設定 |
| [docs/DEVELOPMENT_LOG.md](docs/DEVELOPMENT_LOG.md) | 開發日誌 |
| [docs/MULTI_TASK_RUNBOOK.md](docs/MULTI_TASK_RUNBOOK.md) | Multi Task 分工手冊 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架構說明 |

## 建置

```bash
npm run build    # 本機靜態匯出至 out/（無 basePath）
npm run lint
```
