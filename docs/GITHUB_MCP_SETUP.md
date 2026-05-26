# GitHub MCP 設定與疑難排解

## 為什麼會啟動失敗？

Cursor 的 **GitHub 插件**（`plugin-github-github`）透過 HTTP 連到 `https://api.githubcopilot.com/mcp/`，並在標頭使用：

```http
Authorization: Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}
```

若 **使用者環境變數未設定** `GITHUB_PERSONAL_ACCESS_TOKEN`，伺服器會驗證失敗，MCP 顯示 errored。

另：若改用 **Docker 版** MCP，需 **Docker Desktop 正在執行**；否則會出現 `dockerDesktopLinuxEngine` 找不到的錯誤。

## 修復步驟（建議）

### 1. 寫入環境變數（已登入 `gh` 時）

在專案根目錄 PowerShell：

```powershell
.\scripts\setup-github-mcp-env.ps1
```

腳本會用 `gh auth token` 寫入 **使用者層級** 的 `GITHUB_PERSONAL_ACCESS_TOKEN`（不會把 token 寫進 repo）。

### 2. 確認全域 MCP 設定

檔案：`%USERPROFILE%\.cursor\mcp.json` 應包含：

```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer ${env:GITHUB_PERSONAL_ACCESS_TOKEN}"
  }
}
```

（已與 MiniMax 並存於同一檔案。）

### 3. 重新啟動 Cursor

完全關閉 Cursor 後再開啟 → **Settings → Tools & MCP** → 確認 **github** 為綠燈。

### 4. 測試

在 Composer 輸入：「列出我的 GitHub repositories」或「查看 chang180/tomato-clock 的 Actions 狀態」。

## PAT 權限建議

若要之後用 MCP 操作 **Actions / Pages 部署**，PAT（或 `gh` 登入 scope）建議包含：

- `repo`
- `workflow`
- `read:org`（若為組織 repo）

建立 PAT：<https://github.com/settings/tokens>

## Docker 備選方案

若偏好本機 Docker 而非 HTTP（需 Docker Desktop **已啟動**）：

```json
"github-docker": {
  "command": "docker",
  "args": [
    "run", "-i", "--rm",
    "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
    "-e", "GITHUB_TOOLSETS",
    "ghcr.io/github/github-mcp-server"
  ],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_PERSONAL_ACCESS_TOKEN}",
    "GITHUB_TOOLSETS": "repos,issues,pull_requests,actions"
  }
}
```

## 安全提醒

- 勿將 PAT 提交到 Git 或貼在 issue。
- 若曾把 token 寫進 `mcp.json` 備份檔，建議到 GitHub **撤銷舊 token** 並重新 `gh auth login` / 執行設定腳本。

## 參考

- [GitHub MCP Server — Install on Cursor](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md)
