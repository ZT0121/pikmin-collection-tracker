# Pikmin Collection Tracker

這是一個個人用的 Pikmin Bloom Decor Pikmin 收藏追蹤器。

使用者可以透過 Google 登入，記錄每一隻 Decor Pikmin 目前是「還沒有」、「花苗」、「已拔起」或「飾品完成」，並把進度同步到 Supabase。

## 專案來源與授權說明

本專案是基於原作者 [scott0127/pik_tool](https://github.com/scott0127/pik_tool) 修改而來。

原專案 README 中註明其原創程式碼和網站設計採用 MIT License。一般來說，MIT License 允許他人複製、修改、發布和部署，但需要保留原作者與授權資訊。這段只是一般說明，不是正式法律意見。

本專案已保留原專案來源標註。若要正式公開或長期維護，建議不要移除這段來源說明。

另外，Pikmin Bloom、Pikmin、遊戲圖片、角色名稱與相關素材版權屬於 Nintendo / Niantic 或其權利人。本專案是非官方粉絲工具，與 Nintendo 或 Niantic 沒有任何官方關係、授權、贊助或背書。

## 目前功能

- 個人 Decor Pikmin 收藏追蹤
- Google 登入
- Supabase 使用者資料同步
- 每個 Decor Pikmin 支援四種狀態：
  - 無
  - 花苗
  - 已拔起
  - 飾品完成
- 手機優先介面
- 搜尋與篩選
- 未來活動 Decor 可透過 JSON 檔新增

目前好友、社交與地圖功能已先隱藏，網站會專注在個人收藏追蹤。

## 使用技術

- Nuxt 3
- Vue
- Supabase
- Tailwind CSS
- GitHub Pages
- pnpm

## 本機開發

安裝套件：

```bash
corepack pnpm install
```

建立 `.env`：

```bash
cp .env.example .env
```

填入 Supabase 設定：

```bash
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

啟動本機網站：

```bash
corepack pnpm dev
```

打開：

```text
http://localhost:3000
```

## Supabase 設定

到 Supabase SQL Editor 執行：

```text
supabase/schema.sql
```

然後到 Supabase Authentication 啟用 Google OAuth。

本機測試時，Google 登入 callback 加這個：

```text
http://localhost:3000/auth/callback
```

GitHub Pages 部署後，再加這個：

```text
https://zt0121.github.io/pikmin-collection-tracker/auth/callback
```

## 新增未來活動 Decor

未來如果 Pikmin Bloom 又出新的活動 Decor，不需要改程式碼。

只要在這個資料夾新增 JSON：

```text
app/data/events/
```

例如：

```text
app/data/events/2026-06-flower-crown.json
```

格式沿用 `app/data/decor.json` 裡的 `definitions` 結構即可。

## 部署到 GitHub Pages

這個專案已設定 GitHub Actions，push 到 GitHub 的 `main` 分支後，GitHub 會自動產生靜態網站並部署到 GitHub Pages。

部署完成後網址會像這樣：

```text
https://zt0121.github.io/pikmin-collection-tracker/
```

### 需要先做一次的 GitHub 設定

到你的 GitHub repo：

```text
Settings > Pages
```

把 Source 選成：

```text
GitHub Actions
```

### 設定 Supabase 環境變數

到 GitHub repo：

```text
Settings > Secrets and variables > Actions
```

新增兩個 Repository secrets：

```text
NUXT_PUBLIC_SUPABASE_URL
NUXT_PUBLIC_SUPABASE_KEY
```

值請填你的 Supabase Project URL 和 anon public key。

### 推上 GitHub

如果 GitHub repo 還是空的，可以把目前分支推到 `main`：

```bash
git push -u origin codex/personal-collection-tracker:main
```

之後只要 push 到 `main`，GitHub Pages 就會自動更新網站。

## 手動產生靜態網站

如果想在本機先測 GitHub Pages 模式，可以跑：

```bash
NUXT_APP_BASE_URL=/pikmin-collection-tracker/ corepack pnpm generate
```

產生出來的靜態網站會在：

```text
.output/public
```

## 重要提醒

這是非官方粉絲專案，不是 Nintendo 或 Niantic 官方工具。

請不要把這個網站描述成官方網站，也不要販售、授權或商業化任何 Pikmin / Pikmin Bloom 遊戲素材。
