# 今日烘焙单

咖啡与烘焙配色的轻量今日待办应用。包含三个固定板块、任务与子任务、最近 15 天历史菜单，并提供 Supabase 持久化和 Vercel 部署配置。

- 设计规范：[DESIGN.md](./DESIGN.md)
- 验收记录：[ACCEPTANCE_REPORT.md](./ACCEPTANCE_REPORT.md)

## 本地运行

```bash
npm install
npm run dev
```

没有 Supabase 环境变量时，应用自动使用浏览器 `localStorage`，便于本地体验。

## Supabase

1. 新建 Supabase 项目，在 SQL Editor 运行 `supabase/schema.sql`。
2. 在 Authentication → Providers 中启用 Anonymous Sign-Ins。
3. 复制 `.env.example` 为 `.env.local`，填写项目 URL 和 anon key。

RLS 将数据限制到当前匿名用户；不要把 service-role key 放进前端环境变量。

## Vercel

将仓库导入 Vercel，并配置：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Build Command 使用 `npm run build`，其余保持 Next.js 默认值即可。

## 验证

```bash
npm run lint
npm run typecheck
npm run build
```

主视觉文件为 `public/cat-baker.svg`，应保持不超过 200KB。

## 安全边界

- 不要提交 `.env.local`、访问令牌或 service-role key。
- 删除任务和子任务需要在界面中二次确认。
- 推送前建议运行凭据扫描并检查 `git diff --cached`。
