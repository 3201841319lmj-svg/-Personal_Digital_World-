# 腾讯云 CVM 自建部署

本文档供 Hermes 在腾讯云 CVM 上部署“今日烘焙单”。正式来源是产品仓库，不使用 WorkBuddy 静态包。

## 1. 固定来源

- GitHub：`https://github.com/3201841319lmj-svg/-Personal_Digital_World-.git`
- 分支：`codex/today-todo-app-20260824`
- 项目子目录：`04_Life/Daily_System/today-todo-app`

Hermes 应使用自己的独立克隆。不要复制其他代理的 `.git` 目录，也不要把令牌写进克隆 URL、命令历史或文档。

## 2. 前置条件

- Linux CVM，已安装 Docker Engine 与 Docker Compose 插件。
- 已有 Nginx；域名 DNS 指向 CVM 后再配置 HTTPS。
- 安全组只开放实际需要的 `80/443`。容器端口 `3010` 只绑定 `127.0.0.1`，不要对公网开放。

## 3. 拉取源码

```bash
sudo install -d -m 0755 /srv/pdw-apps
cd /srv/pdw-apps
git clone --branch codex/today-todo-app-20260824 --single-branch \
  https://github.com/3201841319lmj-svg/-Personal_Digital_World-.git \
  personal-digital-world
cd /srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app
git rev-parse HEAD
```

若仓库要求认证，使用 Hermes 自己的最小权限凭据或 deploy key；不要在聊天、日志或仓库中放明文令牌。

## 4. Supabase

1. 在 Supabase SQL Editor 执行 `supabase/schema.sql`。
2. 在 Authentication Providers 中启用 Anonymous Sign-Ins。
3. 在服务器项目目录新建 `.env`：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
TODAY_TODO_PORT=3010
```

```bash
chmod 600 .env
```

`anon key` 可供前端使用，安全边界依赖 RLS。绝不能填写或打包 `service_role` key。若 Supabase 两项留空，应用会回退到当前浏览器的 `localStorage`。

## 5. 构建与启动

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 today-todo-app
curl -I http://127.0.0.1:3010/
```

验收标准：容器状态为 healthy，本机请求返回 `200`，日志没有持续报错。

## 6. Nginx 与 HTTPS

复制 `deploy/nginx-today-todo.conf.example` 到现有 Nginx 配置区，将 `TODO_DOMAIN` 替换为真实域名。先运行：

```bash
sudo nginx -t
```

只有检查通过后才 reload。HTTPS 证书应复用 CVM 现有证书流程；不要覆盖其他站点配置。

## 7. 更新

```bash
cd /srv/pdw-apps/personal-digital-world
git switch codex/today-todo-app-20260824
git pull --ff-only
cd 04_Life/Daily_System/today-todo-app
docker compose up -d --build
docker compose ps
```

## 8. 回滚

先记录当前提交和目标提交，再在独立克隆中切换到已验证提交并重建：

```bash
git rev-parse HEAD
git switch --detach KNOWN_GOOD_COMMIT
docker compose up -d --build
```

回滚后保留日志与提交号，并通知用户；不要使用 `git reset --hard`。

## 9. 最终验收

- 域名 HTTPS 可访问，手机端布局正常。
- 新建、完成、删除任务与子任务正常，删除存在二次确认。
- 历史菜单只显示最近 15 天。
- Supabase 模式下刷新后数据仍存在，RLS 隔离通过。
- `docker compose ps` 为 healthy，Nginx 配置检查通过。
- 回报域名、提交哈希、容器状态和数据模式；不得回报任何密钥值。
