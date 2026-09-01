# 腾讯云 CVM 自建部署

目标：把“今日烘焙单”部署到 `today.cyberhome.junjun-garden.online`，使用本机 SQLite、Docker 持久化卷和 Nginx 单用户密码门禁。不要覆盖已有 farm、文件助手、Nginx 位置或其他端口。

## 1. 固定来源

- GitHub：`https://github.com/3201841319lmj-svg/-Personal_Digital_World-.git`
- 部署分支：发布时记录实际分支与 commit
- 项目目录：`04_Life/Daily_System/today-todo-app`
- CVM 路径：`/srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app`

所有令牌、密码、私钥都必须留在服务器或操作者的安全凭据存储中，不得写进 Git URL、仓库、聊天或日志。

## 2. 部署前只读审计

```bash
cd /srv/pdw-apps/personal-digital-world
git status --short --branch
git rev-parse HEAD
sudo nginx -t
sudo grep -R -n -C 8 'today\.cyberhome\.junjun-garden\.online' \
  /etc/nginx/sites-enabled /etc/nginx/sites-available 2>/dev/null || true
sudo certbot certificates
```

若服务器工作树有未知改动，停止并确认，不要覆盖。Nginx 修改前先备份包含该子域名的配置文件。

## 3. 构建 SQLite 版本

```bash
cd /srv/pdw-apps/personal-digital-world
git fetch origin
git switch DEPLOY_BRANCH
git pull --ff-only
cd 04_Life/Daily_System/today-todo-app
mkdir -p backups
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 today-todo-app
curl -fsS http://127.0.0.1:3010/api/health
```

健康接口必须返回：

```json
{"status":"ok","storage":"sqlite"}
```

容器端口必须仍然只绑定 `127.0.0.1:3010`。数据位于 Docker named volume `today-todo-data`，删除或重建容器不会删除该 volume；禁止运行 `docker compose down -v`。

## 4. 创建单用户密码门禁

不要把密码放在命令参数中。交互式创建：

```bash
sudo apt-get install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd-today-todo baker
sudo chmod 640 /etc/nginx/.htpasswd-today-todo
sudo chown root:www-data /etc/nginx/.htpasswd-today-todo
```

用户名 `baker` 可以更换。密码只在交互提示中输入，不提交到仓库。

## 5. DNS-01 证书

由于 EdgeOne 会影响 HTTP-01，使用 DNS-01。先在服务器运行：

```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d today.cyberhome.junjun-garden.online
```

Certbot 显示 TXT 值后，在 DNSPod 的 `junjun-garden.online` 区域新增：

```text
记录类型：TXT
主机记录：_acme-challenge.today.cyberhome
记录值：Certbot 当次给出的值
```

用公共 DNS 验证 TXT 已传播后再回到 Certbot 继续。手工 DNS-01 证书不能无人值守自动续期；上线后应另行配置最小权限 DNSPod 自动化，Token 只保存在服务器 mode `600` 的凭据文件中。

## 6. Nginx 443 与密码门禁

`deploy/nginx-today-todo.conf.example` 是完整子域名模板。它必须与现有 `/etc/nginx/sites-enabled/junjun-garden` 中同名 `server_name` 块合并或替换，不能保留两个冲突的同名站点。

```bash
sudo install -d -m 0700 /etc/nginx/backups
sudo cp -L --preserve=mode,ownership,timestamps \
  /etc/nginx/sites-enabled/junjun-garden \
  /etc/nginx/backups/junjun-garden.$(date +%Y%m%d-%H%M%S).conf
sudo nginx -t
sudo systemctl reload nginx
```

只有 `nginx -t` 成功后才能 reload。不要重启其他容器或改动 farm、文件助手配置。

## 7. 数据备份

在线一致性备份使用 SQLite `VACUUM INTO`：

```bash
cd /srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app
docker compose exec -T -u 0 today-todo-app node scripts/backup-sqlite.mjs
ls -lh backups/
```

默认保留最近 30 份。建议以 root cron 每日运行一次以上命令，并把 `backups/` 复制到 CVM 之外的对象存储或另一台设备。

仓库提供 `deploy/backup-today-todo.sh`。可在 root 的 crontab 中配置每日 03:15 备份：

```cron
15 3 * * * /srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app/deploy/backup-today-todo.sh >> /var/log/today-todo-backup.log 2>&1
```

## 8. 恢复

恢复会先保留当前数据库副本。必须先停止主服务，避免覆盖运行中的 WAL 数据库：

```bash
cd /srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app
docker compose stop today-todo-app
docker compose run --rm -u 0 today-todo-app \
  node scripts/restore-sqlite.mjs /backups/BACKUP_FILE.sqlite
docker compose up -d today-todo-app
curl -fsS http://127.0.0.1:3010/api/health
```

## 9. 回滚

回滚应用代码时保留 SQLite volume：

```bash
git rev-parse HEAD
git switch --detach KNOWN_GOOD_COMMIT
docker compose up -d --build
```

不要使用 `git reset --hard`，不要运行 `docker compose down -v`。若旧版本是 localStorage-only，它不会读取 SQLite，但 volume 仍应保留，以便再次前滚。

## 10. 最终验收

- 未认证访问 HTTPS 返回 `401`，正确密码可进入。
- `/api/health` 经容器本机返回 SQLite `ok`。
- 新建、完成、删除任务与子任务正常。
- 首次访问可把旧 localStorage 数据迁入服务器空库。
- 刷新页面、重建容器后任务仍存在。
- 备份文件通过 `PRAGMA quick_check`，恢复演练成功。
- HTTPS 证书域名、有效期和证书链正确。
- farm、文件助手及其他端口/站点保持正常。
