# 部署至 GitHub Pages

本專案使用 **Next.js 靜態匯出**（`output: 'export'`），透過 **GitHub Actions** 部署到 GitHub Pages。

## 上線網址

部署成功後（repo 名稱為 `tomato-clock`）：

**https://chang180.github.io/tomato-clock/**

## 一次性設定（在 GitHub 網站）

1. 開啟 [tomato-clock 儲存庫](https://github.com/chang180/tomato-clock)
2. **Settings** → **Pages**
3. **Build and deployment** → **Source** 選 **GitHub Actions**（不要選 Deploy from a branch）
4. 儲存後即可

或使用 GitHub CLI（與 MCP / `gh` 相同權限）：

```bash
gh api -X POST repos/chang180/tomato-clock/pages -f build_type=workflow
```

> 若未啟用 Pages，`deploy-pages` 會失敗並顯示 `HttpError: Not Found`。建置 job 可能已成功，僅 deploy job 失敗。

## 自動部署流程

推送至 `main` 分支會觸發 [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml)：

1. `npm ci` → `npm run build`（`GITHUB_PAGES=true`，啟用 `basePath: /tomato-clock`）
2. 上傳 `out/` 目錄
3. `deploy-pages` 發布到 GitHub Pages

也可在 **Actions** 分頁手動執行 **Deploy to GitHub Pages**（`workflow_dispatch`）。

## 本機模擬 Pages 建置

```bash
# Git Bash / macOS / Linux
GITHUB_PAGES=true npm run build
npx serve out
```

PowerShell：

```powershell
$env:GITHUB_PAGES="true"; npm run build
npx serve out
```

瀏覽器需帶路徑前綴測試，例如 `http://localhost:3000/tomato-clock/`（依 `serve` 實際埠號調整）。

一般開發仍用 `npm run dev`（無 `basePath`，網址為 http://localhost:3000）。

## 常見問題

| 狀況 | 處理 |
|------|------|
| Actions 成功但網站 404 | 確認 Pages Source 為 **GitHub Actions**；等 1–2 分鐘快取 |
| CSS/JS 404 | 確認建置時有 `GITHUB_PAGES=true`（workflow 已設定） |
| 換 repo 名稱 | 修改 [`next.config.ts`](../next.config.ts) 的 `repoBasePath` |
