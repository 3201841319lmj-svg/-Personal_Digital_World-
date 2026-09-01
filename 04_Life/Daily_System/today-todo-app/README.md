# 今日烘焙单

咖啡与烘焙配色的轻量今日待办应用。包含三个固定板块、任务与子任务、最近 15 天历史菜单，并使用 CVM 本机 SQLite 持久化数据。

- 设计规范：[DESIGN.md](./DESIGN.md)
- 验收记录：[ACCEPTANCE_REPORT.md](./ACCEPTANCE_REPORT.md)

## 本地运行

```bash
npm install
npm run dev
```

本地数据库默认写入 `.data/today-todo.sqlite`。浏览器 `localStorage` 只用于首次迁移旧数据和服务器故障时显示最近缓存，不再是权威数据源。

## 数据存储

- 生产数据库：Docker named volume `today-todo-data` 中的 `/data/today-todo.sqlite`。
- 主机备份目录：项目目录下 `backups/`。
- 第一次访问时，如果服务器为空而当前浏览器有旧 localStorage 数据，应用自动导入一次。
- 单用户密码门禁由 Nginx Basic Auth 提供，应用不增加注册或账号管理界面。

## 腾讯云 CVM 自建

推荐由 Hermes 按 [DEPLOY_CVM.md](./DEPLOY_CVM.md) 使用 Docker Compose 部署。项目容器仅绑定 CVM 的 `127.0.0.1:3010`，公网入口交给 Nginx 与 HTTPS。

服务器项目目录建议为：

```text
/srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app
```

运行：

```bash
docker compose up -d --build
```

Hermes 的最小交接清单见 [HERMES_HANDOFF.md](./HERMES_HANDOFF.md)。

## 输出模式

- 默认 `npm run build`：标准 Next.js 构建。
- `NEXT_OUTPUT=standalone npm run build`：CVM/Docker 独立运行包。
- SQLite/API 模式不能使用纯静态导出。

## 验证

```bash
npm run lint
npm run typecheck
npm run build
```

主视觉文件为 `public/cat-baker.svg`，应保持不超过 200KB。

## 安全边界

- 不要提交 `.env.local`、访问令牌或 service-role key。
- 不要把 Nginx 密码文件、证书私钥或 DNSPod Token 放入仓库。
- 容器端口只绑定 `127.0.0.1`，公网访问必须经过 Nginx 密码门禁。
- 删除任务和子任务需要在界面中二次确认。
- 推送前建议运行凭据扫描并检查 `git diff --cached`。
