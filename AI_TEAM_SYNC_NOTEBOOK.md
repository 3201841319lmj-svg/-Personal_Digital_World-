# Personal Digital World｜AI 团队、项目与工作区同步笔记

> 版本：2026-07-31 v3.1（Antigravity 记忆与轨迹系统已登记）
> 时区：Asia/Shanghai
> 用途：供 ChatGPT、Codex、Antigravity、CodeBuddy、Hermes、OpenClaw 统一了解团队分工、项目全貌、仓库关系、本地工作区和协作规则。
> 维护原则：已实际确认的信息标为"已核验"；尚未提供或无法证明的信息标为"待登记"，任何 Agent 不得自行猜测。
> 本版本变更摘要：见文末"十一、变更记录"。

---

## 一、项目总身份

- 项目中文名：个人数字世界
- 项目英文名：Personal Digital World
- 组织名称：Personal Digital World AI Studio
- 项目性质：覆盖创意、工作、学习与生活管理的长期个人数字生态系统
- 默认主分支：`main`
- 当前登记项目总数：21 个（含 `99_Archive`）
- 已排除项目：`magic-diary`，不再纳入本项目索引、仓库关系或 Agent 工作范围
- 最高决策者：用户（Founder / CEO）

## 二、仓库与本地源代码

| 类型 | 地址 / 路径 | Remote 名称 | 当前定位 | 状态 |
|---|---|---|---|---|
| Gitee 主仓库 | https://gitee.com/liminjunjun/personal_-digital_-world | `gitee` | 国内首选拉取与推送地址 | 已核验 |
| GitHub 镜像仓库 | https://github.com/3201841319lmj-svg/-Personal_Digital_World- | `origin` | GitHub 镜像、PR 与协作入口 | 已核验 |
| 本地主开发 Git 工作树 | `C:\Users\黎敏君\.gemini\antigravity\scratch\ai-home-farm-interface-preview` | 同时连接 `gitee` 与 `origin` | 产品代码、测试、构建和 Git 操作的权威本地根目录 | 已核验 |
| 默认分支 | `main` | — | 所有正式合并的目标分支 | 已核验 |

### 当前 AI Studio 指示发布状态

- GitHub PR：[PR #1 — AI Studio organization](https://github.com/3201841319lmj-svg/-Personal_Digital_World-/pull/1)
- 分支：`agent/ai-studio-organization`
- 提交：`ce12824e1fb6f2ed5e4dd83ef807807aa8833600`
- 状态：`OPEN`、`Draft`、合并状态 `CLEAN`
- 目标：向仓库根目录新增 `AGENTS.md`，并从 `README.md` 提供入口
- 注意：在 PR 合并进 `main` 前，`AGENTS.md` 仍属于候选指示，不应描述为已进入主分支

### 仓库使用规则

1. Gitee 是国内首选远程仓库，GitHub 是镜像与 PR 协作入口。
2. 推送前必须重新确认目标 remote、当前分支和工作树状态。
3. 不得把 Codex、Antigravity 或其他 Agent 的临时工作目录当作正式仓库。
4. 不得覆盖、重置或删除用户及其他 Agent 尚未确认的改动。
5. 相对路径必须以对应仓库根目录为基准；跨仓库或跨工作区操作必须写明绝对路径。
6. "已规划、已开发、已审核、已合并、已部署、已验收"是不同状态，必须分别提供证据。

---

## 三、AI 团队完整组织架构

### 1. 用户（Founder / CEO）

身份：项目创始人和最高决策者。

负责：

- 产品方向
- 世界观设定
- 商业规划
- 最终决策
- 所有重大事项审批

权限边界：用户拥有所有项目的最终决定权。任何 Agent 都不得代替用户作出重大产品、世界观、商业、权限、发布或不可逆变更决策。

### 2. ChatGPT（小喇叭）

身份：**Chief Product Officer（CPO）／首席产品官**

负责：

- 产品规划
- 产品架构设计
- 系统设计
- Agent 分工设计
- 长期 Roadmap
- 用户体验设计
- 产品需求分析
- 产品方案讨论

核心使命：帮助用户把想法变成完整、可执行的产品方案。

职责边界：一般不负责具体开发与运维。向 Codex 交接时，应提供目标、范围、验收标准、约束和优先级。

### 3. Codex

身份：**Chief Technology Officer（CTO）／技术总监／总工程师**

负责：

- 技术架构
- 项目管理
- Agent 工作流调度
- 代码质量审核
- Bug 排查
- 技术方案制定
- Git 管理
- 最终代码合并
- 项目整体进度管理
- 各 Agent 工作质量抽查

核心使命：负责整个开发流水线，对所有开发成果进行最终技术审核。

职责边界：不得擅自改变用户批准的产品方向、世界观、商业规划或重大产品边界。技术审核不能替代用户的最终验收。

### 4. Antigravity

身份：**产品开发部／开发工程师／设计负责人**

负责：

- 产品开发
- 前端开发
- UI / UX 设计
- 页面实现
- 产品原型
- 用户体验优化
- AI 产品交互实现

核心使命：项目主要开发执行者。

职责边界：按照已确认的产品方案、技术拆解和验收标准实施，不得自行改变产品方向或跳过 Codex 技术审核。

### 5. CodeBuddy

身份：**内容管理部**

负责：

- 文本处理
- 内容整理
- 内容分类
- 标签系统
- 知识库维护
- Archive 管理
- AI 可读数据整理
- 内容质量维护

核心使命：整个项目的内容资产管理中心。

职责边界：不得自行修改产品逻辑、技术架构或 Agent 身份；不得把草稿或历史材料自动视为正式生产内容。

### 6. Hermes

身份：**云端运维部**

负责：

- 云服务器管理
- Linux 环境维护
- Docker
- Nginx
- HTTPS
- 项目部署
- 文件管理
- 日志管理
- 自动备份
- 系统维护

核心使命：负责整个项目稳定运行。

职责边界：部署前必须确认目标版本、环境、回滚方案和审批。不得未经授权删除生产数据、暴露凭据、扩大公网访问或执行不可逆基础设施变更。

### 7. OpenClaw

身份：**Agent 生态管理部**

负责：

- 项目内嵌 Agent 管理
- Agent 身份配置
- Agent Memory 管理
- 用户长期记忆管理
- 云端 Memory 文件夹维护
- 陪伴型 Agent 管理
- 工具型 Agent 管理
- 用户工作、学习、生活与情感陪伴

核心使命：负责整个 Agent 生态系统。

职责边界：不得未经用户授权改写 Agent 核心身份、用户长期记忆或隐私边界；涉及代码、迁移或部署时，分别接受 Codex 技术审核和 Hermes 部署协调。

---

## 四、各 Agent 本地工作区登记表

| 角色 | 本地配置 / 工作区 | 用途 | 核验状态 |
|---|---|---|---|
| 用户 | 无统一技术工作区要求 | 通过各 AI 客户端、仓库和产品入口进行最终决策与验收 | 不适用 |
| ChatGPT（小喇叭） | 无固定 Windows 本地工作区 | 主要为云端对话中的产品规划与方案协作；若产生正式文件，应明确交付位置或进入仓库 | 已按使用方式登记 |
| Codex | `C:\Users\黎敏君\Documents\Codex` | Codex 按日期组织的任务工作区总目录 | 已核验 |
| Codex 当前任务 | `C:\Users\黎敏君\Documents\Codex\2026-07-30\personal-digital-world-gitee-https-gitee` | 本次任务隔离目录，不是主仓库 | 已核验 |
| Codex 过程文件 | `C:\Users\黎敏君\Documents\Codex\2026-07-30\personal-digital-world-gitee-https-gitee\work` | 草稿、分析、临时脚本和隔离 Git 副本 | 已核验 |
| Codex 正式交付 | `C:\Users\黎敏君\Documents\Codex\2026-07-30\personal-digital-world-gitee-https-gitee\outputs` | 面向用户的正式文档与交付文件 | 已核验 |
| Codex 配置根目录 | `C:\Users\黎敏君\.codex` | Codex 配置、Skills、插件、会话与 Memory 的总根；不是产品代码仓库 | 已核验 |
| Codex Memory 根目录 | `C:\Users\黎敏君\.codex\memories` | Codex 长期记忆、索引、摘要、回合证据与受控增量备注的统一根目录 | 已核验 |
| Codex 原始会话证据区 | `C:\Users\黎敏君\.codex\sessions` | 系统管理的原始会话与 rollout 记录；仅在需要精确证据时按需读取 | 已核验 |
| Antigravity 主开发工作树 | `C:\Users\黎敏君\.gemini\antigravity\scratch\ai-home-farm-interface-preview` | Personal Digital World 主开发 Git 工作树 | 已核验 |
| Antigravity 工作流与 Agent 配置 | `C:\Users\黎敏君\.gemini\antigravity\scratch\Antigravity_Workspace` | 工作流、Skills、模板、文档、参考资料与项目副本 | 已核验 |
| Antigravity 记忆与轨迹系统 | 主开发 Git 代码树 + Artifacts 持久化文稿 (`implementation_plan.md` / `walkthrough.md`) + 全量 JSONL 会话轨迹日志 | Antigravity 独立的三层持久化记忆与执行轨迹体系；详见下文说明 | 已核验 |
| Antigravity 项目副本 | `C:\Users\黎敏君\.gemini\antigravity\scratch\Antigravity_Workspace\Projects\ai-home-farm-interface-preview` | Antigravity 工作区内登记的项目副本；不得自动覆盖主开发工作树 | 已核验 |
| Antigravity 文件助手原型 | `C:\Users\黎敏君\.gemini\antigravity\scratch\file-assistant-hub` | File Assistant Hub 独立原型目录 | 已核验 |
| Antigravity 文件助手副本 | `C:\Users\黎敏君\.gemini\antigravity\scratch\Antigravity_Workspace\Projects\file-assistant-hub` | Antigravity 工作区内的 File Assistant Hub 项目副本 | 已核验 |
| CodeBuddy 配置根目录 | `C:\Users\黎敏君\.codebuddy` | CodeBuddy 配置、扩展、插件、Skills 和灵感资料；**不存放正式内容资产** | 已核验 |
| CodeBuddy 正式内容资产工作区 | `C:\Users\黎敏君\CodeBuddy` | 所有 CodeBuddy 负责的文本、分类、标签、知识库和 Archive 内容资产的总根目录；与 `.codebuddy` 配置根严格分离 | 已核验 |
| CodeBuddy 一级分类目录 | `C:\Users\黎敏君\CodeBuddy\` 下的 `学习\`、`工作\`（下设 `金融\` 与 `其他工作\` 两个二级目录）、`项目\`、`Claw\` | 三级分类体系：学习 / 工作（金融/其他工作）/ 项目 / Claw；由用户约定，CodeBuddy 默认按内容性质自动归类 | 已核验 |
| CodeBuddy 任务工作区（按会话隔离） | `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\` | 每次会话任务独立时间戳目录，存放本次任务的草稿、产物、临时脚本与 `.codebuddy` 记忆 | 已核验 |
| CodeBuddy 当前任务工作区 | `C:\Users\黎敏君\CodeBuddy\20260731181712\` | 当前会话任务工作区；用于本笔记 CodeBuddy 侧的回复、变更记录与 `.codebuddy` 记忆 | 已核验 |
| CodeBuddy 知识库与 Archive 写入边界 | 见本节下方"CodeBuddy 写入边界说明" | 明确哪些路径允许写入、哪些路径只读、哪些路径禁止触碰 | 已核验 |
| CodeBuddy 记忆与工作日志系统 | 每个任务工作区 `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\.codebuddy\memory\`（当前实例：`C:\Users\黎敏君\CodeBuddy\20260731181712\.codebuddy\memory\`） | CodeBuddy 独立的本地记忆根；详见下方"CodeBuddy 记忆与日志系统" | 已核验 |
| Hermes 本地工作区 | `未发现已登记目录` | Hermes 以云端服务器和运维环境为主；本地无固定工作区 | 云端/不适用 |
| Hermes 服务器 / 部署根目录 | `云端托管，禁止在共享笔记填写密码或密钥` | Linux、Docker、Nginx、日志、备份与部署均在云端 | 云端/不适用 |
| OpenClaw 配置根目录 | `C:\Users\黎敏君\.openclaw` | Agent、设备、身份、日志、媒体、插件、状态及主配置；本地配置侧已有内容 | 已核验 |
| OpenClaw 本地工作区 | `C:\Users\黎敏君\.openclaw\workspace` | OpenClaw 的本地 Agent 工作区，包含身份、工具、用户和工作区状态文件 | 已核验 |
| OpenClaw 云端 Memory 路径 | `云端托管，禁止在共享密钥` | OpenClaw 核心 Memory 与长期记忆托管在云端 | 云端/不适用 |

### Codex 记忆架构与记忆区

> 由 Codex（CTO／技术总监／总工程师）于 2026-07-31 登记；用于说明 Codex 如何保存跨任务工程上下文、用户稳定偏好、历史决策与可核验的工作证据。

#### 1. 系统定位与自治边界

Codex Memory 是 Codex 自己的本机长期记忆与证据索引体系。它与以下系统相互独立：

- Personal Digital World 产品代码中的 `01_DreamGarden/Shared_Core/Memory_System`
- Pixel Farm 当前实现的三层 Agent Memory Engine
- OpenClaw 的本地 / 云端 Agent Memory
- CodeBuddy 的 `.codebuddy\memory\` 长期记忆与每日日志
- 当前对话的临时上下文
- Codex 当前任务的 `work` 草稿区和 `outputs` 交付区

其他 Agent 可以引用 Codex 明确交付的结论和证据，但不得直接写入、覆盖、重命名或删除 `C:\Users\黎敏君\.codex\memories` 与 `C:\Users\黎敏君\.codex\sessions` 中的文件。需要修正 Codex 记忆时，应把事实和证据交回 Codex，并由用户明确授权记忆更新。

#### 2. 记忆层级与物理路径

| 层级 / 区域 | 绝对路径 | 作用 | 状态 |
|---|---|---|---|
| Memory 总根目录 | `C:\Users\黎敏君\.codex\memories` | Codex 长期记忆体系的统一根目录 | 已核验 |
| 快速摘要层 | `C:\Users\黎敏君\.codex\memories\memory_summary.md` | 保存用户画像、稳定偏好、项目边界和当前重要主题，供任务开始时快速判断相关历史 | 已核验 |
| 可搜索索引层 | `C:\Users\黎敏君\.codex\memories\MEMORY.md` | 按 Task Group 登记主题、关键词、适用范围、复用规则和详细证据指针 | 已核验 |
| 原始记忆汇总层 | `C:\Users\黎敏君\.codex\memories\raw_memories.md` | 汇集阶段性原始记忆条目，并保留线程、时间、任务和来源线索 | 已核验 |
| 回合摘要证据区 | `C:\Users\黎敏君\.codex\memories\rollout_summaries` | 保存历史工作回合的摘要、结果和证据片段，由 `MEMORY.md` 按需指向 | 已核验 |
| 用户指示增量区 | `C:\Users\黎敏君\.codex\memories\extensions\ad_hoc\notes` | 仅在用户明确要求更新 Codex 记忆时，新增小型增量说明；不直接覆盖汇总记忆 | 已核验 |
| 增量区规则 | `C:\Users\黎敏君\.codex\memories\extensions\ad_hoc\instructions.md` | 规定用户指示增量备注及后续整理方式 | 已核验 |
| 原始会话证据区 | `C:\Users\黎敏君\.codex\sessions` | 保存系统管理的原始会话 / rollout 记录；不是日常共享文档区 | 已核验 |
| Codex Skills | `C:\Users\黎敏君\.codex\skills` | Codex 的能力与工作方法配置；和 Memory 配合使用，但不属于记忆内容区 | 已核验 |

#### 3. 默认读取顺序

```text
当前用户请求 + 当前工作区 / 仓库事实
    ↓
memory_summary.md（快速判断是否存在相关历史）
    ↓
MEMORY.md（按项目、Task Group 与关键词定位）
    ↓
rollout_summaries / ad_hoc notes（读取必要的详细结论）
    ↓
sessions 原始 rollout（只在需要精确命令、报错或原始证据时深入）
    ↓
重新核验当前代码、Git、测试、远程与部署状态
```

Memory 用于保持跨任务一致性和快速定位证据，但不能替代当前事实。Git SHA、分支、PR、部署状态、依赖版本、运行结果和文件内容等容易变化的信息，必须在当前任务中重新核验。

#### 4. Personal Digital World 在 Codex Memory 中的位置

Personal Digital World 当前登记在 Codex 的全局 Memory 体系中，不另建一个可由其他 Agent 任意写入的专属 Memory 文件夹：

- 快速入口：`memory_summary.md` 中的 Personal Digital World 项目概况、稳定偏好和路径边界
- 正式索引：`MEMORY.md` 中的 `Personal Digital World — GitHub-to-Gitee mirror and repository security` Task Group
- 历史证据：该 Task Group 指向的 `rollout_summaries` 同步与安全审查摘要，以及必要时对应的原始 session
- 当前共享笔记：本文件位于 Codex `outputs`，属于正式交付文档，但不会因为保存于 `outputs` 就自动成为长期 Memory

#### 5. 写入、更新与安全规则

1. 只有用户明确要求“记住、更新记忆、同步到 Codex Memory”时，Codex 才能创建记忆更新。
2. 收到明确授权后，在 `extensions\ad_hoc\notes` 新增一份小型增量备注；不直接重写 `MEMORY.md`、`memory_summary.md`、`raw_memories.md` 或历史 rollout。
3. 不在 Memory 中保存密码、API Key、Token、私钥、证书正文或其他可直接登录的敏感凭据。
4. 不把完整私密对话、无关个人资料、未经确认的推测或临时状态写成长期事实。
5. 记忆内容必须区分用户决定、稳定事实、历史快照、推断和待验证事项。
6. 历史记忆可能过期；引用仓库、部署、PR、文件或产品现状时，必须重新验证。
7. `work` 中的临时材料和 `outputs` 中的交付文档不会自动进入长期 Memory。
8. Codex Memory、CodeBuddy Memory、OpenClaw Memory 与产品运行时 Memory 必须保持职责、目录和生命周期隔离。

### Antigravity 记忆与轨迹系统

> 由 Antigravity（产品开发部／设计负责人）于 2026-07-31 登记；说明 Antigravity 的三层持久化记忆与全量执行轨迹体系。

#### 1. 三层记忆架构
- **第一层：实时工作记忆 (In-Context Working Memory)**
  - 每次会话的上下文、消息历史与终端实时 Log。
  - 全量执行轨迹在后台按 JSONL 格式落盘至 `<appDataDir>\brain\<conversation-id>\.system_generated\logs\transcript.jsonl`，记录所有工具调用、思考过程与指令逻辑，可随时反查。
- **第二层：持久化项目文稿 (Artifacts & Workspace Snapshots)**
  - 存放于项目工作区/脑图目录下的 Artifacts（如 `implementation_plan.md` 实施计划、`walkthrough.md` 走查总结）及 `PROJECT_INDEX.md` / `README.md`。
  - 记录重大架构设计、需求变更、UI/UX 方案与验证结果，跨会话可随时读取恢复上下文。
- **第三层：实体代码与工具链权威状态 (Git Single Source of Truth)**
  - 以主开发 Git 工作树 `C:\Users\黎敏君\.gemini\antigravity\scratch\ai-home-farm-interface-preview` 中的真实文件、Git Commit 签名、Remote 分支及工具链配置为唯一事实来源，杜绝记忆幻觉。

#### 2. 记忆更新与维护原则
- **偏好与约束**：用户表达的开发偏好（如国内 Gitee 首选、特定样式系统、技术栈规范）实时提炼写入项目配置、`README.md` 及 `AGENTS.md` 共享同步笔记中。
- **进度与日志**：每次代码修改或架构重构完成后，通过 Git Commit 提交消息与 `walkthrough.md` 形成永久可追溯日志。
- **自检与自治**：Antigravity 依靠本地 Git 事实与工作区 Artifacts 自治，其他 Agent 可读取项目索引与方案文稿进行协作对齐。

### CodeBuddy 写入边界说明

> 由 CodeBuddy（内容管理部）于 2026-07-31 登记，明确 CodeBuddy 在不同路径上的写入权限与职责边界。

1. **可写入（CodeBuddy 主战场）**
   - `C:\Users\黎敏君\CodeBuddy\` 全部子目录与文件
   - `C:\Users\黎敏君\CodeBuddy\学习\`：学习笔记、课程资料、AI/编程/语言/读书等内容资产
   - `C:\Users\黎敏君\CodeBuddy\工作\金融\`：金融分析、理财规划、研报、建模类正式工作文件
   - `C:\Users\黎敏君\CodeBuddy\工作\其他工作\`：保险、客户管理、营销文案、其他非金融正式工作文件
   - `C:\Users\黎敏君\CodeBuddy\项目\`：项目级内容副本、方案文档、Archive 素材与主题分类产物
   - `C:\Users\黎敏君\CodeBuddy\Claw\`：OpenClaw 相关材料与登记文档
   - `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\`：当前任务工作区内的全部草稿、脚本、产物与 `.codebuddy` 记忆
2. **只读 / 仅引用（CodeBuddy 可见但不主动写入）**
   - `C:\Users\黎敏君\Documents\Codex\2026-07-30\personal-digital-world-gitee-https-gitee\outputs\`：Codex 的正式交付目录，CodeBuddy 只读、引用，不主动覆盖
   - `C:\Users\黎敏君\.gemini\antigravity\scratch\ai-home-farm-interface-preview\`：Antigravity 主开发工作树，CodeBuddy 不写代码与配置
   - `C:\Users\黎敏君\.codebuddy\extensions\`、`plugins\`、`skills-marketplace\`：CodeBuddy 自有扩展、插件与技能市场，CodeBuddy 不改
3. **禁止触碰（CodeBuddy 不读不写）**
   - `C:\Users\黎敏君\.openclaw\` 及其下任何敏感配置、身份、Token（OpenClaw 内部资产，CodeBuddy 不接触）
   - Hermes 云端服务器、域名证书、部署密钥、生产数据（运维资产，CodeBuddy 不接触）
   - Gitee / GitHub 远程仓库推送：CodeBuddy 不直接 push，必须交回 Codex 由 CTO 负责 Git 流程
4. **写入原则**
   - Archive 与主题分类产物默认先落到 `C:\Users\黎敏君\CodeBuddy\项目\` 对应子目录，纳入版本与状态可追溯
   - 知识库材料以 Markdown 为主，附带必要的 JSON / YAML 结构化元数据；命名遵循"日期_模块_版本"格式
   - 草稿、临时脚本和探索性材料仅放在 `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\` 任务工作区内，任务结束后由用户决定是否归档
   - 任何跨工作区写入（例如把 CodeBuddy 内容推到 Antigravity 主开发树或 Codex outputs）必须先经用户确认与 Codex 技术审核

### CodeBuddy 记忆与日志系统

> 由 CodeBuddy（内容管理部）于 2026-07-31 登记；说明 CodeBuddy 自己的本地记忆与工作日志体系，便于其他 Agent 知道去哪里查看 CodeBuddy 的上下文。

1. **记忆根目录**
   - 每个任务工作区下都有一个独立的 `.codebuddy\` 目录，里面就是 CodeBuddy 自己的"个人配置 + 记忆根"。
   - 当前实例路径：`C:\Users\黎敏君\CodeBuddy\20260731181712\.codebuddy\`
   - 通用模式：`C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\.codebuddy\`
2. **记忆子目录**：`C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\.codebuddy\memory\`
   - `MEMORY.md` — **跨会话长期记忆**（持续更新在原地，不按日追加）
     - 存放：工作区结构、配置根路径、跨 Agent 协作边界、用户长期偏好、登记文档位置等稳定事实。
     - 维护方式：每次出现稳定事实就在原文件用 `replace_in_file` 就地改写。
   - `YYYY-MM-DD.md` — **每日工作日志**（append-only，按日新建）
     - 存放：当天完成的任务、登记的版本、与用户的对话要点、未决问题等。
     - 维护方式：每天一个文件，新内容 `append` 进去，不改写历史日；超过 30 天的旧日志会按主题归并进 `MEMORY.md` 后删除。
3. **自治原则（其他 Agent 必须遵守）**
   - `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\.codebuddy\memory\` 归 CodeBuddy 自治；其他 Agent **只读引用**，不得写入、覆盖、重命名或删除。
   - 若其他 Agent 需要了解 CodeBuddy 的上下文，先读 `MEMORY.md` 拿稳定事实，再读当日 `YYYY-MM-DD.md` 拿最近进度。
   - Codex 协调全 Agent 时如果发现 CodeBuddy 记忆里有过时事实，**把信息发回给 CodeBuddy 让其自行更新**，不要直接改 CodeBuddy 的文件。
4. **当前已记录的关键事实（截至 2026-07-31）**
   - `MEMORY.md` 第 1–4 节：CodeBuddy 工作区结构与跨 Agent 协作边界。
   - `MEMORY.md` 第 5 节：共享同步笔记位置与版本演进（v2 → v2.1 → v2.2）。
   - `MEMORY.md` 第 6 节：用户口径——其他 Agent 主要在云端、不再强制登记本地工作区。
   - `2026-07-31.md`：当日完成 v2 / v2.1 登记的对话要点与本机路径清单。
5. **记忆同步关系**
   - **CodeBuddy 记忆 ⇄ 共享同步笔记**（双向、版本化）
     - CodeBuddy 工作区结构、写入边界等结构性事实：以共享笔记为权威，CodeBuddy 在 `MEMORY.md` 同步一份稳定副本。
     - 共享笔记的版本演进（v2 / v2.1 / v2.2）：CodeBuddy 在自己的 `MEMORY.md` 第 5 节与每日日志中追踪。
   - **CodeBuddy 记忆 ⇄ 团队产出**
     - 用户对话要点、登记请求、版本变更等：先在每日日志落原始记录，再在 `MEMORY.md` 提炼为稳定事实。

### 工作区特别说明

1. `Antigravity_Workspace`、其 `Projects` 副本、独立原型目录和 Personal Digital World 主开发工作树是不同位置，不得静模互相覆盖。
2. Codex 的 `work` 与 `outputs` 都不等于正式产品仓库；正式代码状态仍以主开发 Git 工作树和远程分支为准。
3. `C:\Users\黎敏君\.codebuddy` 只作为 CodeBuddy 配置、扩展、插件、Skills 和灵感资料根目录；CodeBuddy 正式内容资产统一登记在 `C:\Users\黎敏君\CodeBuddy\`，不得混用。
4. OpenClaw 的配置根目录可能包含身份、认证或运行配置；共享时只传路径和职责，不复制敏感内容。
5. Hermes 的云服务器地址、账号、密钥、证书和 Token 不应写入这份面向所有 Agent 的同步笔记。
6. CodeBuddy 与 Codex 共享内容时，CodeBuddy 只在 `C:\Users\黎敏君\CodeBuddy\` 写入正式资产，把引用清单交给 Codex；正式产品文档由 Codex 决定是否落进其 `outputs` 目录。
7. CodeBuddy 在每个任务工作区下都有独立的 `.codebuddy\memory\`（含 `MEMORY.md` 长期记忆 + `YYYY-MM-DD.md` 每日日志），归 CodeBuddy 自治，其他 Agent 只读引用，不得直接改写；详见上方"CodeBuddy 记忆与日志系统"。
8. Codex 的长期 Memory 位于 `C:\Users\黎敏君\.codex\memories\`，原始会话证据位于 `C:\Users\黎敏君\.codex\sessions\`；这些区域归 Codex 自治，其他 Agent 只读引用，不得直接改写；详见上方"Codex 记忆架构与记忆区"。
9. Antigravity 的记忆以主开发 Git 工作树实体文件、Artifacts 文稿及 JSONL 轨迹日志为三大支柱，确保代码逻辑、架构设计与用户偏好绝对可靠，其它 Agent 协作时以主仓库索引 `PROJECT_INDEX.md` 为开发状态的权威参照；详见上方"Antigravity 记忆与轨迹系统"。

---

## 五、当前全部项目索引

### 01_DreamGarden（织梦家园）— 创意与创造

| 项目 / 模块 | 内容简介与定位 | 状态 | 相对路径 |
|---|---|---|---|
| Shared_Core | 共享核心基础设施：Agent 框架、三层 Memory 记忆引擎及可复用 UI 组件库 | 进行中 | `01_DreamGarden/Shared_Core` |
| Pixel_Farm（像素农场） | AI 家园 / 农场交互系统：客厅、卧室、书房、占卜角、床头日记、告示板等场景与交互 | 进行中 | `01_DreamGarden/Pixel_Farm` |
| File_Assistant_Hub（文件助手控制台） | 主题 Feed 消息流、Agent Scope 作用域管理、文件归档与 Task 转换中心 | 进行中 | `01_DreamGarden/File_Assistant_Hub` |
| Babel_Tavern（巴别小馆） | 跨文化、多语言虚拟酒吧与社交互动空间 | 规划中 | `01_DreamGarden/Babel_Tavern` |
| Magic_Workshop（魔法工坊） | 实验性 AI 小工具与创新产品试炼场 | 进行中 | `01_DreamGarden/Magic_Workshop` |
| Dream_System（魔法梦境） | 梦想管理、愿景板与可视化系统 | 规划中 | `01_DreamGarden/Dream_System` |

### 02_Work（工作）— 职业与生产力

| 项目 / 模块 | 内容简介与定位 | 状态 | 相对路径 |
|---|---|---|---|
| Insurance_Tools | 保险试算、费率计算与客户规划辅助工具 | 进行中 | `02_Work/Insurance_Tools` |
| Customer_Manager | 客户档案、跟进日志与数据分析 CRM | 规划中 | `02_Work/Customer_Manager` |
| Knowledge_Base | 业务 SOP、专业知识文档与最佳实践 | 进行中 | `02_Work/Knowledge_Base` |
| Marketing_Materials | 文案、视觉海报与视频宣传素材 | 进行中 | `02_Work/Marketing_Materials` |

### 03_Learning（学习）— 知识与成长

| 项目 / 模块 | 内容简介与定位 | 状态 | 相对路径 |
|---|---|---|---|
| AI_Research | LLM / AI Agent 论文阅读、算法实验与模型评测 | 进行中 | `03_Learning/AI_Research` |
| Programming | Frontend、Backend、DevOps 与 Algorithms 学习实践 | 进行中 | `03_Learning/Programming` |
| Language | 英语、日语等多语种词汇、语法与表达积累 | 进行中 | `03_Learning/Language` |
| Toastmasters | 头马演讲稿、公众表达技巧与领导力记录 | 进行中 | `03_Learning/Toastmasters` |
| Reading | 精读书籍笔记、思考萃取与书单总结 | 进行中 | `03_Learning/Reading` |

### 04_Life（生活）— 生活与管理

| 项目 / 模块 | 内容简介与定位 | 状态 | 相对路径 |
|---|---|---|---|
| Personal_Knowledge | 个人 PKM、个人知识图谱与 Markdown 知识网络 | 进行中 | `04_Life/Personal_Knowledge` |
| Finance | 预算编制、投资理财规划与日常收支分析 | 规划中 | `04_Life/Finance` |
| Travel | 出行攻略、路线安排与旅行日记 | 规划中 | `04_Life/Travel` |
| Health | 运动锻炼、饮食营养与健康数据追踪 | 规划中 | `04_Life/Health` |
| Daily_System | 习惯打卡、待办任务与时间块管理 | 进行中 | `04_Life/Daily_System` |

### 99_Archive（存档区）

| 项目 / 模块 | 内容简介与定位 | 状态 | 相对路径 |
|---|---|---|---|
| Archive | 已停止或历史迭代的遗留代码和文档，保留历史备查 | 存档 | `99_Archive` |

---

## 六、标准协作流程

```text
用户提出需求
    ↓
ChatGPT（产品规划）
    ↓
Codex（技术拆解与任务分配）
    ↓
Antigravity（产品开发）
    ↓
CodeBuddy（内容整理）
    ↓
OpenClaw（Agent 配置与 Memory）
    ↓
Hermes（部署上线）
    ↓
Codex（最终审核与发布）
    ↓
用户验收
```

该流程是默认主流程，不要求每项任务机械经过所有部门。纯产品、纯文档、纯内容、纯运维或小型修复可以跳过不相关环节，但不得跳过实际涉及的职责负责人、必要技术审核、发布审批或用户最终决定。

## 七、所有 Agent 共同遵守的原则

1. 尊重职责边界，不重复工作，不越权决策。
2. 优先完成本部门职责，再主动完成必要协作与交接。
3. 不随意修改其他部门负责的内容。
4. 发现问题及时反馈，不绕过负责人自行处理。
5. 保持统一代码规范、文档规范和项目结构。
6. 所有工作以用户最终需求和最终决定为最高优先级。
7. 修改前确认仓库、分支、目标模块、源文件权威性和未提交改动。
8. 不覆盖、不重置、不删除其他 Agent 或用户尚未确认的工作。
9. 对外发布、生产部署、重大合并、数据迁移、权限调整与不可逆操作必须有授权和回滚方案。
10. 所有成果必须说明当前真实状态与验证证据。

## 八、跨 Agent 交接模板

```text
【任务名称】
【用户原始目标】
【责任部门 / Agent】
【目标仓库】
【本地根路径】
【目标分支】
【目标模块与文件】
【已完成内容】
【尚未完成内容】
【关键决策与禁止事项】
【变更文件 / 产物清单】
【已执行检查及结果】
【已知风险】
【回滚方式】
【下一责任 Agent】
【验收标准】
【需要用户决定的事项】
```

## 九、待各 Agent 补充的信息

请相关 Agent 只回报路径和用途，不在公共笔记中填写密码、Token、密钥或证书正文。

| Agent | 待补充内容 | 状态 |
|---|---|---|
| Codex | Codex Memory 架构、物理路径、读取顺序、Personal Digital World 索引位置与写入安全规则 | ✅ 已补充（2026-07-31）：Memory 根目录 `C:\Users\黎敏君\.codex\memories\`；摘要层 `memory_summary.md`；索引层 `MEMORY.md`；原始汇总 `raw_memories.md`；证据区 `rollout_summaries\` 与 `C:\Users\黎敏君\.codex\sessions\`；用户指示增量区 `extensions\ad_hoc\notes\`；详见第四节"Codex 记忆架构与记忆区" |
| CodeBuddy | 正式内容资产工作区绝对路径；知识库与 Archive 的实际写入边界；CodeBuddy 记忆与工作日志系统登记 | ✅ 已补充（2026-07-31）：工作区根 `C:\Users\黎敏君\CodeBuddy\`；一级分类 `学习\`、`工作\（金融\ / 其他工作\）`、`项目\`、`Claw\`；任务隔离 `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\`；记忆系统 `C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\.codebuddy\memory\`（含 `MEMORY.md` + `YYYY-MM-DD.md`）；详细写入边界见第四节"CodeBuddy 写入边界说明"，记忆体系见第四节"CodeBuddy 记忆与日志系统" |
| Antigravity | 主开发 Git 树代码 + Artifacts 持久化文稿 (`implementation_plan.md`/`walkthrough.md`) + 全量 JSONL 轨迹日志；三层记忆架构 | ✅ 已补充（2026-07-31）：详见第四节"Antigravity 记忆与轨迹系统" |
| Hermes | 本地运维工作区（若有）；服务器项目根目录；部署环境名称；日志与备份路径的非敏感说明 | ☁️ 云端/不适用（2026-07-31）：Hermes 主要资产在云端服务器，无固定本地工作区；不在共享笔记中登记云端地址、账号、密钥、证书、Token |
| OpenClaw | 云端 Memory 根目录的非敏感路径说明；本地与云端 Memory 的同步边界 | ☁️ 云端/不适用（2026-07-31）：OpenClaw 核心 Memory 与长期记忆托管在云端；本地仅保留 `C:\Users\黎敏君\.openclaw\` 配置与 `\.openclaw\workspace\` 工作区，详见第四节登记；不在共享密钥 |
| ChatGPT | 若使用固定项目或文档空间，登记其名称与共享入口；无固定空间则保持"云端对话协作" | ☁️ 云端对话协作（2026-07-31）：用户确认 ChatGPT 以云端对话为主，无固定本地工作区；如未来出现固定空间再补登 |

---

## 十、给所有 Agent 的首次确认语

收到本笔记后，请按以下格式回复用户：

```text
已阅读 Personal Digital World AI Studio 同步笔记。
我的身份：<Agent 与部门>
我的职责：<简述>
我的职责边界：<简述>
我的本地 / 云端工作区：<已核验路径或待登记>
我当前负责的项目：<项目名或暂无>
我发现的路径冲突或缺失：<内容或无>
我承诺在修改前确认仓库、分支、目标模块和现有改动，并接受对应审核与用户最终决定。
```

---

## 十一、变更记录

> 用于追踪本同步笔记每次实质性更新的责任人、内容与影响范围。**任何 Agent 修改本文件后必须追加一条记录**，不得静默改动。

### v2 · 2026-07-31 · CodeBuddy（内容管理部）

- **变更责任人**：CodeBuddy Agent（当前会话工作区 `C:\Users\黎敏君\CodeBuddy\20260731181712\`）
- **变更内容**：
  1. 文头版本行升级为 `2026-07-31 v2（CodeBuddy 工作区已登记）`，并新增"本版本变更摘要"指引。
  2. 第四节"各 Agent 本地工作区登记表"中 CodeBuddy 部分由 1 行扩为 6 行：
     - `CodeBuddy 配置根目录` 标注为"不存放正式内容资产"
     - 新增 `CodeBuddy 正式内容资产工作区`：`C:\Users\黎敏君\CodeBuddy`
     - 新增 `CodeBuddy 一级分类目录`：`学习\`、`工作\`（下分 `金融\` 与 `其他工作\`）、`项目\`、`Claw\`
     - 新增 `CodeBuddy 任务工作区（按会话隔离）`：`C:\Users\黎敏君\CodeBuddy\YYYYMMDDhhmmss\`
     - 新增 `CodeBuddy 当前任务工作区`：`C:\Users\黎敏君\CodeBuddy\20260731181712\`
     - 新增 `CodeBuddy 知识库与 Archive 写入边界` 索引
  3. 第四节新增子章节"CodeBuddy 写入边界说明"，明确可写入 / 只读 / 禁止触碰 / 写入原则四类边界。
  4. 第四节"工作区特别说明"第 3 条措辞更新（不再把 `.codebuddy` 误当资产库），并新增第 6 条说明 CodeBuddy 与 Codex 的协作边界。
  5. 第九节"待各 Agent 补充的信息"增加"状态"列，CodeBuddy 行标记为"✅ 已补充（2026-07-31）"，并附摘要；其余三行保持"待登记"。
  6. 新增第十一节"变更记录"（本节）。
- **影响范围**：仅 CodeBuddy 自身的本地工作区、配置根目录、写入边界、状态行；未触及任何其他 Agent 登记项、产品索引、仓库关系或流程。
- **未变更项**：仓库与本地源代码、团队架构、项目索引、协作流程、共同原则、交接模板、其他三 Agent 状态均保持 v1 原样。

### v2.1 · 2026-07-31 · CodeBuddy（内容管理部）

- **变更责任人**：CodeBuddy Agent（当前会话工作区 `C:\Users\黎敏君\CodeBuddy\20260731181712\`）
- **触发原因**：用户口头确认"其他的 Agent 在云端，不用登记本地工作区了"，要求把"待登记"语义调整为"云端/不适用"，避免在共享笔记里形成长期悬挂的待办。
- **变更内容**：
  1. 文头版本行升级为 `2026-07-31 v2.1（CodeBuddy 登记 + 其余 Agent 标记为云端/不适用）`。
  2. 第四节 Hermes / OpenClaw 行中"待登记"列全部改为"☁️ 云端/不适用"。
  3. 第九节各 Agent 状态调整。
  4. 第十一节追加本 v2.1 条目。

### v2.2 · 2026-07-31 · CodeBuddy（内容管理部）

- **变更责任人**：CodeBuddy Agent（当前会话工作区 `C:\Users\黎敏君\CodeBuddy\20260731181712\`）
- **触发原因**：用户提示"CodeBuddy 自己是有记忆和工作日志的吗？那你记得同步上去"——CodeBuddy 之前登记工作区时漏掉自己的记忆与日志体系，补登。
- **变更内容**：
  1. 文头版本行升级为 `2026-07-31 v2.2（CodeBuddy 记忆与工作日志系统已登记）`。
  2. 第四节新增 `CodeBuddy 记忆与工作日志系统`。
  3. 第四节新增子章节"CodeBuddy 记忆与日志系统"。
  4. 第四节"工作区特别说明"新增第 7 条。
  5. 第十一节追加本 v2.2 条目。

### v3.0 · 2026-07-31 · Codex（CTO／技术总监／总工程师）

- **变更责任人**：Codex（当前任务工作区 `C:\Users\黎敏君\Documents\Codex\2026-07-30\personal-digital-world-gitee-https-gitee\`）
- **触发原因**：用户确认 CodeBuddy 与 Antigravity 已阅读同步，并要求 Codex 完整阅读最新文档，把自己的记忆架构与记忆区同步到同一份共享笔记。
- **变更内容**：
  1. 文头版本升级为 `v3.0（Codex 记忆架构与记忆区已登记）`。
  2. 第四节 Codex 工作区登记新增 `Codex Memory 根目录` 与 `Codex 原始会话证据区`。
  3. 第四节新增“Codex 记忆架构与记忆区”，登记系统定位、自治边界、物理路径、默认读取顺序等。
  4. “工作区特别说明”新增 Codex Memory 自治规则第 8 条。
  5. 第九节新增 Codex 状态行，标记记忆架构登记已完成。
  6. 第十一节追加本 v3.0 变更记录。

### v3.1 · 2026-07-31 · Antigravity（产品开发部）

- **变更责任人**：Antigravity Agent（产品开发部／设计负责人）
- **触发原因**：读取并核查 Codex 提交的 v3.0 版本笔记，补齐并融合 Antigravity 记忆与轨迹系统章节，升级为 v3.1。
- **变更内容**：
  1. 文头版本行升级为 `2026-07-31 v3.1（Antigravity 记忆与轨迹系统已登记）`。
  2. 第四节新增 `Antigravity 记忆与轨迹系统` 登记行，标注状态为“已核验”。
  3. 第四节新增子章节 `Antigravity 记忆与轨迹系统`，详述三层记忆架构（实时工作记忆、持久化文稿 Artifacts、实体代码 Git 权威状态）与维护原则。
  4. 第四节“工作区特别说明”新增第 9 条：明确 Antigravity 记忆支柱与权威参照规则。
  5. 第九节新增 Antigravity 记忆登记行，标记状态为“✅ 已补充（2026-07-31）”。
  6. 第十一节追加本 v3.1 变更记录。
- **影响范围**：仅第四节（新增行 + 新增子章节 + 特别说明加 1 条）、第九节与第十一节变更记录；完全保留 Codex v3.0、CodeBuddy v2.2 及前期所有人登记的架构内容。
- **未变更项**：仓库与本地源代码、团队架构、项目索引、协作流程、共同原则、交接模板保持原样。
