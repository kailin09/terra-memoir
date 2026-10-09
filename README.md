# Terra Memoir · 行旅拾忆

旅行回忆网页应用：记录旅程、照片、手账和开销，并通过 Supabase 账号进行云同步。

## 本地运行

- Node.js `22.13` 或更高版本
- 安装依赖：`npm install`
- 启动开发服务：`npm run dev`

## Supabase 配置

1. 在 Supabase 项目中运行 [`supabase/schema.sql`](supabase/schema.sql)，创建用户专属的云端旅行记录表及 Row Level Security 策略。
2. 在根目录创建 `.env.local`，填写 Supabase Project URL 和公开的 anon/publishable key。可参考 [`supabase.env.example`](supabase.env.example)。
3. 不要把 `.env.local`、SMTP 密码或 Supabase `service_role` / secret key 提交到 GitHub。浏览器应用只应使用公开客户端 key，并依赖 RLS 限制访问。
4. 配置 Supabase Auth 邮箱验证和正式网站 URL，细节见 [`AUTH_SETUP.md`](AUTH_SETUP.md)。

## 数据说明

旅行记录与照片目前保存在每位用户的 Supabase 记录中；照片以压缩图片数据存储，适合小规模使用。用户可以在网页中导出旅行备份。正式扩大使用量前，可将照片迁移到 Supabase Storage。
