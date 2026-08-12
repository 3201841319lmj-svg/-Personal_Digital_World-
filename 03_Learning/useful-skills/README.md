# 🌟 Useful Skills & MCP Tools Collection

> 个人精选与收藏的实用 AI 技能、MCP (Model Context Protocol) 插件及自动化工具库。

---

## 📌 目录

- [📱 社交平台与内容运营](#-社交平台与内容运营)
- [🤖 AI & 智能体工具](#-ai--智能体工具)
- [🛠️ 开发与效率工具](#️-开发与效率工具)
- [📝 技能添加模板](#-技能添加模板)

---

## 📱 社交平台与内容运营

### 1. [xiaohongshu-mcp](https://github.com/xpzouying/xiaohongshu-mcp)

- **作者/仓库**: [`xpzouying/xiaohongshu-mcp`](https://github.com/xpzouying/xiaohongshu-mcp)
- **类别**: MCP 插件 / 小红书自动化
- **简介**: 专为 AI 助手（如 Claude Desktop, Cursor, Windsurf 等）设计的小红书 Model Context Protocol 服务，支持通过 AI 工作流直接与小红书平台进行数据交互与自动运营。
- **核心功能**:
  - 🔑 **账号与会话管理**: 支持基于 Cookie 的登录状态检查与会话保持。
  - 📝 **内容自动发布**: 支持图文笔记自动化发布（含标题、正文、多图处理）。
  - 🔍 **数据检索与搜索**: 支持获取首页推荐、搜索用户/笔记/产品，以及读取笔记详细内容。
  - 💬 **互动交互**: 支持提取笔记评论与自动化回复互动。
- **使用提示**:
  - ⚠️ **登录状态维护**: 小红书限制多端网页同时登录，运行该 MCP 时请避免在其他浏览器中同时登录同一账号，以防 Cookie 失效被踢下线。

---

## 🤖 AI & 智能体工具

### 1. [human-writing (活人感写作)](https://github.com/KKKKhazix/human-writing)

- **作者/仓库**: [`KKKKhazix/human-writing`](https://github.com/KKKKhazix/human-writing)
- **类别**: AI Agent Skill / 中文写作与通用改稿
- **本地路径**: [`skills/human-writing/`](./skills/human-writing/)
- **简介**: 让 AI 写的中文读起来像一个具体的人在说话。通用中文创作与改稿 Skill，解决 AI 写作“流畅但冷漠抽象、无具体人说话感”的通病，开箱即用。
- **核心功能**:
  - 📝 **事实与材料核准**: 现实题材核准事实、数字、引语和亲历，虚构题材检查人物、行动与因果。
  - 🚀 **信息量推进**: 要求每段都要带来新内容（新事实/新动作/新例子/新后果），拒绝车辘辘话。
  - 🗣️ **白话打底与词序调整**: 消除报告腔、模型腔，严禁滥用冒号、破折号及“不是……而是……”等翻案句。
  - 🔍 **成稿自动化检查**: 附带 Python 校验脚本 `check_prose.py` 逐段检测硬性禁令与句长变异系数。
- **使用提示**:
  - 支持向 AI 发送 `使用 $human-writing，把我的材料写成一篇有活人感和中文韵律的作品。` 调用。
  - 包含蒸馏版文件 [`human-writing-lite.md`](./skills/human-writing/dist/human-writing-lite.md)，可以直接复制到 ChatGPT/千问等聊天窗口使用。

### 2. [Spherse](https://github.com/3201841319lmj-svg/Spherse)

- **个人镜像仓库**: [`3201841319lmj-svg/Spherse`](https://github.com/3201841319lmj-svg/Spherse) (完整项目代码库)
- **上游原仓库**: [`mengrru/Spherse`](https://github.com/mengrru/Spherse)
- **官网**: [spherse.mengru.work](https://spherse.mengru.work)
- **类别**: AI 智能体 / Multi-Agent 世界构建 / 学习研究
- **简介**: 在 Spherse 中使用 AI Agents 构建专属数字世界 (Build your own world with AI agents inside Spherse)。
- **核心功能**:
  - 🤖 **Multi-Agent 智能体协作**: 结合 AI Agent 与多智能体架构进行角色扮演 (AI Roleplay) 与世界构建 (Worldbuilding)。
  - 🌐 **可视化工作空间**: 提供智能体交互场景与 Agent Workspaces。
  - 🛠️ **学习与研究**: 基于 TypeScript 开发，包含完整代码及多 Agent Harness 架构。
- **使用提示**:
  - 已 Fork 完整代码到个人 GitHub 仓库 `3201841319lmj-svg/Spherse`，可直接同步至 Gitee 镜像拉取全量代码。

---

## 🛠️ 开发与效率工具

*(暂无，等待添加)*

---

## 📝 技能添加模板

如果有新发现的有用技能，可复制下方格式添加到对应分类中：

```markdown
### N. [项目名称](项目GitHub链接)

- **作者/仓库**: `owner/repo`
- **类别**: 插件分类 / 工具类型
- **简介**: 一句话说明项目的核心价值与作用。
- **核心功能**:
  - 🔹 功能点 1
  - 🔹 功能点 2
- **使用提示**: 配置要求或注意事项。
```

---
*Maintained with ❤️*
