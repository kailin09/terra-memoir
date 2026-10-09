# 邮箱验证与密码登录设置

注册时需要填写昵称、邮箱和密码；Supabase 会发送验证码确认邮箱。确认后，用户以后可直接用邮箱和密码登录。旧的 OTP 账户仍可选择邮箱验证码登录，并在验证时设置密码。

1. 在 Supabase 打开 **Authentication → Sign In / Providers → Email**，启用邮箱登录和邮箱确认。
2. 在 **Authentication → Emails → Confirm signup** 模板中使用 `{{ .Token }}` 显示注册验证码；普通验证码登录使用 **Magic link or OTP** 模板。
3. 在 **Authentication → Emails → Reset password** 模板中使用 `{{ .Token }}`，以便用户通过 6 位验证码重设密码。
4. 从项目 API 设置中复制 Project URL 和公开的 anon/publishable key。
5. 在项目根目录的 `.env.local` 中设置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。不要把 SMTP 密码放进前端环境变量。
6. 在 Supabase Auth 的 URL 配置中添加本地开发网址和之后的正式网址。
7. 邮件发送需要在 **Authentication → Emails → SMTP Settings** 配置 SMTP 服务。

邮箱验证通过后，应用会建立登录状态，并把旅行回忆同步到 Supabase。云同步使用每个账号独立的一行 JSONB 记录，包含地点、旅行日期、回忆、照片和账目；表启用了 RLS，每个账号只能读取和修改自己的行。照片当前以压缩后的图片数据随回忆保存，适合原型阶段；图片数量增加后建议迁移到 Supabase Storage。

## 启用云端同步

1. 打开 Supabase 项目 → **SQL Editor**。
2. 打开项目里的 `supabase/schema.sql`，复制全部内容到 SQL Editor 并运行一次。
3. 确认项目 API 的 `public` schema 已通过 **Project Settings → API → Exposed schemas** 暴露给 Data API。
4. 回到应用并登录。页面顶部会显示云端载入/同步状态；首次登录会将本机已有回忆上传，之后自动同步。

若页面显示“同步异常”，点开页面顶部状态查看错误说明。运行 SQL 前不要删除 Supabase 中已有的用户或数据。旅行照片仍会保留在浏览器本机缓存作为临时副本。

账户安全页面提供密码更新（要求当前密码验证）、忘记密码邮件验证码流程，以及退出时撤销当前 Supabase 会话并清除当前浏览器登录令牌。退出不会删除本机缓存的旅行记录或云端回忆。
