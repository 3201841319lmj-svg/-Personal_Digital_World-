# 今日烘焙单

咖啡与烘焙配色的轻量今日待办应用。包含三个固定板块、任务与子任务、最近 15 天历史菜单，并提供 Supabase 持久化和腾讯云 CVM 自建部署配置。

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

## 腾讯云 CVM 自建

推荐由 Hermes 按 [DEPLOY_CVM.md](./DEPLOY_CVM.md) 使用 Docker Compose 部署。项目容器仅绑定 CVM 的 `127.0.0.1:3010`，公网入口交给 Nginx 与 HTTPS。

服务器项目目录建议为：

```text
/srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app
```

在服务器项目目录创建 `.env`，填写：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

然后运行：

```bash
docker compose up -d --build
```

若两个 Supabase 变量留空，应用仍可运行，但只使用当前浏览器的 `localStorage`。

Hermes 的最小交接清单见 [HERMES_HANDOFF.md](./HERMES_HANDOFF.md)。

## 输出模式

- 默认 `npm run build`：标准 Next.js 构建。
- `NEXT_OUTPUT=standalone npm run build`：CVM/Docker 独立运行包。
- `NEXT_OUTPUT=export npm run build`：纯静态导出到 `out/`。

## 验证

```bash
npm run lint
npm run typecheck
npm run build
```

主视觉文件为 `public/cat-baker.svg`，应保持不超过 200KB。

## 安全边界

- 不要提交 `.env.local`、访问令牌或 service-role key。
- CVM 上的 `.env` 必须保持仓库外凭据边界，权限建议为 `600`。
- 删除任务和子任务需要在界面中二次确认。
- 推送前建议运行凭据扫描并检查 `git diff --cached`。
