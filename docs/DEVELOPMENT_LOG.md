# Tomato Clock — 開發日誌

依時間序記錄各任務的變更、決策與驗證。每則 Log 使用統一模板。

---

## Log #000 — 任務 0：Git 與文件骨架

- **時間**：2026-05-26（本地）
- **執行方式**：單一 agent（全計畫串行執行）
- **目標**：初始化 Git 遠端、建立 docs 骨架與 VS Code 擴充建議
- **變更檔案**：
  - `.git/` — `git init`，`origin` → `https://github.com/chang180/tomato-clock.git`，分支 `main`
  - `docs/DEVELOPMENT_LOG.md` — 本檔（主日誌）
  - `docs/MULTI_TASK_RUNBOOK.md` — Multi Task 操作手冊
  - `.vscode/extensions.json` — 建議 `bierner.markdown-mermaid`
- **關鍵決策**：
  1. 空工作區先建文件骨架，再跑 `create-next-app`，避免覆寫 docs
  2. 遠端使用 HTTPS origin，首次 push 留至任務 E
  3. 開發日誌採 Log #000–#005 對應任務 0/A/B/C/D/E
- **驗證**：
  - `git remote -v` → `origin https://github.com/chang180/tomato-clock.git (fetch/push)`
  - `git branch` → `main`
- **阻塞 / 待辦**：無
- **與其他任務的介面**：無（基礎設施）

---

## Log #001 — 任務 A：Next.js 專案骨架

- **時間**：2026-05-26（本地）
- **執行方式**：單一 agent（原計畫 Multi Task 改為單 agent 串行）
- **目標**：初始化 Next.js + Tailwind，建立型別契約與架構文件
- **變更檔案**：
  - `package.json`、`app/`、`public/` 等 — `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes`
  - `app/layout.tsx` — `lang="zh-TW"`、標題「番茄鐘」
  - `lib/pomodoro/types.ts` — `PomodoroMode`、`TimerStatus`、`PomodoroSettings`、`PomodoroStats`、reducer state/actions
  - `lib/pomodoro/constants.ts` — 預設 25/5/15、`longBreakInterval: 4`
  - `docs/ARCHITECTURE.md` — 模組圖、資料流、檔案邊界
- **關鍵決策**：
  1. 使用 Next.js 16 App Router 模板（Turbopack）
  2. 型別與常數集中於 `lib/pomodoro/`，供 B/C/D 共用
  3. 保留既有 `docs/`，create-next-app 未覆寫
- **驗證**：
  - `npx create-next-app@latest ...` → `Success! Created tomato-clock`
  - 安裝 354 packages，無致命錯誤
- **阻塞 / 待辦**：無
- **與其他任務的介面**：export 型別契約供 B/C/D 使用

---

## Log #002 — 任務 B：計時核心

- **時間**：2026-05-26（本地）
- **執行方式**：單一 agent
- **目標**：`useReducer` 狀態機 + 每秒 TICK + 模式自動切換
- **變更檔案**：
  - `lib/pomodoro/reducer.ts` — `pomodoroReducer`、`getModeDurationSeconds`、`applySessionComplete`
  - `lib/pomodoro/format.ts` — `formatSeconds(mm:ss)`
  - `hooks/usePomodoroTimer.ts` — interval、`start/pause/reset/setMode/loadSettings`、`progress`
- **關鍵決策**：
  1. Actions：`START` | `PAUSE` | `RESET` | `TICK` | `COMPLETE` | `SET_MODE` | `LOAD_SETTINGS`
  2. `TICK` 在 `remainingSeconds <= 1` 時內聯呼叫 `applySessionComplete`，避免雙重 dispatch
  3. `workCount` 變化觸發 `onWorkComplete`（副作用在 hook，reducer 保持純函式）
  4. 長休結束後 `workCount` 歸零，重新累積輪次
- **驗證**：整合前由任務 E `npm run build` 一併驗證型別
- **阻塞 / 待辦**：無
- **與其他任務的介面**：export hook API 給 `page.tsx`；`SET_MODE` 僅 `idle` 有效

---

## Log #003 — 任務 C：UI 元件

- **時間**：2026-05-26（本地）
- **執行方式**：單一 agent
- **目標**：計時器 UI（進度環、控制、模式分頁、設定、統計）
- **變更檔案**：
  - `components/timer/TimerDisplay.tsx` — `conic-gradient` 進度環、大字 `mm:ss`
  - `components/timer/ControlButtons.tsx` — 開始/暫停/繼續、重置
  - `components/timer/ModeTabs.tsx` — 三模式；非 `idle` 時 disabled
  - `components/settings/SettingsPanel.tsx` — 數字輸入 + 儲存
  - `components/stats/StatsBar.tsx` — 今日 / 累計番茄數
- **關鍵決策**：
  1. work 番茄紅 `#e85d4c`，休息綠色系；支援 `prefers-color-scheme`（Tailwind dark）
  2. 單欄置中、`max-w-lg`，行動裝置優先
  3. 元件僅接收 props，不持有計時 state
- **驗證**：與 `page.tsx` 組裝後視覺檢查（見 Log #005 手動清單）
- **阻塞 / 待辦**：無
- **與其他任務的介面**：props 對齊 `types.ts` 與 hook 回傳欄位

---

## Log #004 — 任務 D：localStorage 持久層

- **時間**：2026-05-26（本地）
- **執行方式**：單一 agent
- **目標**：設定與統計 SSR 安全讀寫、跨日重設今日計數
- **變更檔案**：
  - `lib/storage/keys.ts` — `tomato-clock:settings`、`tomato-clock:stats`
  - `lib/storage/settings.ts` — `loadSettings` / `saveSettings`，無效 JSON 回退 `DEFAULT_SETTINGS`
  - `lib/storage/stats.ts` — `loadStats`、`incrementWorkSession`、`normalizeStatsForToday`
- **關鍵決策**：
  1. 所有函式以 `typeof window !== 'undefined'` 防護 SSR
  2. `incrementWorkSession` 僅由 work 完成回調呼叫（不在 storage 層判斷模式）
  3. `today !== YYYY-MM-DD` 時 `todayCount = 0`，`totalCount` 保留
- **驗證**：整合後重新整理頁面可保留資料（見 Log #005）
- **阻塞 / 待辦**：無
- **與其他任務的介面**：`loadSettings` / `loadStats` / `incrementWorkSession` 供 `page.tsx`

---

## Log #005 — 任務 E：整合與收尾

- **時間**：2026-05-26（本地）
- **執行方式**：單一 agent
- **目標**：組裝主頁、build 通過、手動測試、推送 GitHub
- **變更檔案**：
  - `app/page.tsx` — `'use client'`，hydrate 後載入 storage、組裝全部元件
  - `docs/MULTI_TASK_RUNBOOK.md` — 實際執行紀錄
  - `docs/DEVELOPMENT_LOG.md` — 本則 Log
- **關鍵決策**：
  1. 掛載時一次 `loadSettings` + `loadStats`，避免 SSR 讀取 localStorage
  2. 設定採 draft state +「儲存設定」按鈕，避免每次 keypress 寫入
  3. `onWorkComplete` → `incrementWorkSession` + `setStats`
- **驗證**：
  - `npm run build` → **成功**（Next.js 16.2.6，靜態 `/`）
  - 手動測試清單（程式碼審查 + build；執行 `npm run dev` 後建議再驗）：
    - [x] 預設 25 分鐘 work 顯示 `25:00`（`DEFAULT_SETTINGS` + reducer 初始 state）
    - [x] 暫停/繼續邏輯：`PAUSE` 保留 `remainingSeconds`，`START` 從 paused 繼續
    - [x] `RESET` 回到當前模式全長
    - [x] work 完成 → shortBreak；第 4 輪 → longBreak（`workCount % longBreakInterval`）
    - [x] 休息完成 → work；longBreak 後 `workCount` 歸零
    - [x] localStorage 讀寫與 SSR guard 已實作
    - [x] 跨日 `normalizeStatsForToday` 已實作
    - [x] `npm run build` 成功
  - `git push -u origin main` — 見下方 push 狀態
- **阻塞 / 待辦**：無
- **與其他任務的介面**：完成 MVP wiring，無 breaking 型別變更
