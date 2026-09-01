# Hermes 部署交接

目标：部署“今日烘焙单”的 SQLite 服务器存储版本，并完成 `today.cyberhome.junjun-garden.online` 的单用户密码门禁和 DNS-01 HTTPS。

## 必须执行

1. 使用服务器现有独立克隆，核验部署分支、commit 与工作树状态。
2. 完整阅读 `README.md`、`DESIGN.md`、`ACCEPTANCE_REPORT.md` 和 `DEPLOY_CVM.md`。
3. 修改 Nginx 前备份，只处理该子域名的 server block。
4. 构建后验证 `/api/health`、容器 healthy 和 `127.0.0.1:3010` 绑定。
5. 使用交互式 `htpasswd` 创建门禁，不在消息或命令参数中传密码。
6. 使用 DNS-01 签发证书；DNSPod Token 不进入聊天、仓库或日志。
7. 验证任务写入、刷新、容器重建后的 SQLite 持久化。
8. 创建一致性备份并至少完成一次可恢复性检查。
9. 回报公网地址、commit、容器状态、证书状态、数据卷和备份状态，不回报任何凭据值。

## 禁止执行

- 不要运行 `docker compose down -v`。
- 不要覆盖 farm、文件助手、旧 Nginx 路径或其他端口。
- 不要自行加入注册、提醒、标签、统计或其他产品功能。
- 不要提交 SQLite 数据库、备份、密码文件、证书私钥或 DNSPod Token。
- 不要在未完成公网、持久化与恢复验证前宣称部署成功。

## 回滚原则

应用代码和 SQLite 数据分别回滚。切换已知良好 commit 时保留 `today-todo-data` volume；数据库恢复必须先停主容器，并保留恢复前副本。
