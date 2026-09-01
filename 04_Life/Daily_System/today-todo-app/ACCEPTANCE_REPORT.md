# 验收记录

初始验收日期：2026-08-24

SQLite 改造验证日期：2026-09-01

## 已验证

- [x] Next.js 16.3.2 + React + TypeScript 项目可生产构建
- [x] 咖啡与烘焙配色，小猫 SVG 主视觉
- [x] SVG 文件大小 1,380 bytes，低于 200KB
- [x] 三个固定任务板块
- [x] 支持新增、完成、二次确认删除任务
- [x] 支持新增、完成、二次确认删除子任务；完成父任务会同步完成子任务
- [x] 左上角图标菜单查看最近 15 天，页面默认只展示今天
- [x] 刷新后本地数据仍存在
- [x] Supabase 表结构、匿名会话与 RLS 策略已提供（历史方案，已由 SQLite 方案取代）
- [x] Vercel 所需环境变量和部署说明已提供（历史方案，当前部署目标为腾讯云 CVM）
- [x] 桌面与 390px 手机视口无横向溢出
- [x] 手机端紧凑主卡、较小字号和高对比日期标签
- [x] 浏览器运行时无 console error
- [x] `npm run lint` 通过
- [x] `npm run typecheck` 通过
- [x] `npm run build` 通过
- [x] `npm audit --omit=dev` 为 0 个漏洞

## 尚需外部环境确认

- [ ] 在腾讯云 CVM 完成 Docker 构建并验证 named volume 持久化
- [ ] 完成 Nginx 单用户密码门禁、DNS-01 证书和公网 HTTPS 验收
- [ ] 在 CVM 创建一致性备份并完成恢复演练
- [ ] 逐字核对原始 `WORKBUDDY_PROMPT.md` 第 7 节：当前 GitHub 仓库为私有，GitHub CLI 凭据失效，应用内浏览器未登录，未能读取原文

## 2026-09-01 SQLite 改造已验证

- [x] `/api/health` 返回 `storage: sqlite`
- [x] 任务与子任务批量写入和读取成功
- [x] 删除父任务会在数据库中级联删除子任务
- [x] 停止并重启 Next.js 进程后测试任务仍存在
- [x] 在线备份通过 SQLite `quick_check`
- [x] 恢复副本与备份文件 SHA-256 一致
- [x] Supabase SDK 已从依赖树移除，`npm audit` 为 0 个漏洞
- [x] `npm run lint`、`npm run typecheck` 与 standalone `npm run build` 通过
- [ ] 当前 Windows 环境没有 Docker，Compose 构建和 volume 重建测试必须在 CVM 完成
