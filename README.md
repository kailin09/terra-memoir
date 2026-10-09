# Terra Memoir · 行旅拾忆

<p align="center">
  <strong>把走过的地方，留给未来的自己。</strong><br />
  A quiet, personal atlas for the places and moments you want to remember.
</p>

<p align="center">
  <em>旅行地图 · 旅程回忆 · 照片与电子手账 · 云端同步</em>
</p>

---

## 关于项目

**Terra Memoir（行旅拾忆）** 是一款旅行回忆网页应用。把去过的地点、旅程中的照片、手账和开销收进一册可回看的私人旅行档案。

项目目前以网页应用形式运行，使用 Supabase 账号和数据库同步用户记录。当前仓库提供应用源码与本地运行说明，**暂未配置公开在线演示**。

## 主要功能

| 功能 | 说明 |
| --- | --- |
| 🌍 旅行地图 | 在地图上浏览记录过的地点和足迹 |
| 📔 旅程手账 | 按旅程整理文字、照片与贴纸，支持预览和导出 |
| 🎟️ 票根与回忆 | 将同一趟旅程中的回忆整理在一起 |
| 🔎 搜索与筛选 | 按国家、城市和年份找回旅行记录 |
| ☁️ 账号与同步 | 使用 Supabase Auth 登录，并将记录同步到云端 |
| 💾 数据备份 | 提供旅行数据导出，方便保存个人副本 |

## 本地运行

### 环境要求

- Node.js 22.13 或更高版本
- npm

### 启动开发环境

```bash
npm install
npm run dev
```

开发服务器启动后，按终端提示打开本地地址。

## 配置 Supabase

1. 创建 Supabase 项目。
2. 在 SQL Editor 运行 [supabase/schema.sql](supabase/schema.sql)，创建数据表和访问策略。
3. 在项目根目录创建 `.env.local`，按 [supabase.env.example](supabase.env.example) 填写 Project URL 和公开客户端 key。
4. 按 [AUTH_SETUP.md](AUTH_SETUP.md) 配置邮箱验证和网站 URL。
5. 重启开发服务器。

> 浏览器端只使用 Supabase 的公开 anon/publishable key，并依赖 Row Level Security 控制用户数据访问。不要提交 `.env.local`、SMTP 密码、`service_role` key 或 secret key。

## 部署到 Netlify

仓库根目录的 [netlify.toml](netlify.toml) 已设置构建命令、静态发布目录和 Node.js 版本。将 GitHub 仓库连接到 Netlify 后，选择 `main` 分支；Base directory 留空。Netlify 会使用配置文件中的 `npm run build` 和 `dist/client`。

在 Netlify 的环境变量设置中添加以下构建变量，并应用到所有部署环境：

- `VITE_SUPABASE_URL`：Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`：Supabase 公开 anon/publishable key

完成后重新部署。不要设置 Supabase `service_role` 或 secret key。

## 数据与隐私说明

- 用户旅行记录通过 Supabase 同步。
- 照片会先压缩，再随记录保存；这适合当前的小规模使用。扩大使用量前，建议迁移到 Supabase Storage。
- 云端同步不等同于独立备份；重要数据请定期使用应用内的导出功能另存一份。

## English

**Terra Memoir** is a personal travel journal for keeping places, trip memories, photos, scrapbook pages, and expenses together. It uses Supabase Authentication and database sync.

See the sections above for local setup and Supabase configuration. The repository does not currently have a public live demo.

## 项目文档

- [邮箱验证配置](AUTH_SETUP.md)
- [Supabase 数据库结构](supabase/schema.sql)
- [环境变量示例](supabase.env.example)
