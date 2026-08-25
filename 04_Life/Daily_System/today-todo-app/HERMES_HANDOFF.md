# Hermes 部署交接

目标：将“今日烘焙单”从 WorkBuddy 静态交付切回腾讯云 CVM 自建运行。

## 必须执行

1. 使用 Hermes 自己的独立克隆拉取 `codex/today-todo-app-20260824`。
2. 进入 `04_Life/Daily_System/today-todo-app`。
3. 完整阅读 `README.md`、`DESIGN.md`、`ACCEPTANCE_REPORT.md` 和 `DEPLOY_CVM.md`。
4. 在 CVM 上执行 `docker compose config --quiet`、构建、启动与健康检查。
5. 接入现有 Nginx/HTTPS，不覆盖其他站点，不直接暴露容器端口。
6. 若用户提供 Supabase 项目，只使用 URL 与 anon key，并先执行 `supabase/schema.sql`；绝不使用 service-role key。
7. 完成后回报公开 HTTPS 地址、部署提交、容器健康状态、Supabase 或 localStorage 模式，以及手机端验收结果。

## 不要执行

- 不要部署 `today-todo-static-workbuddy-20260825.zip`。
- 不要自行增加账号、提醒、统计或其他需求外功能。
- 不要在仓库、命令、日志或聊天中写入服务器密码、访问令牌或 service-role key。
- 不要修改产品设计、文案和数据边界。

## 当前验证边界

Codex 已完成 Next.js 本地 lint、类型检查与生产构建。当前 Windows 环境没有 Docker，也没有 CVM 登录权限；Docker、Nginx、HTTPS 和公网访问必须由 Hermes 在 CVM 上实测后才能标记完成。
