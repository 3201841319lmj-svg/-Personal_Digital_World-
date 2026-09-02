# 🕊️ 文件传输助手们 (File Assistant Hub) V1.7

> **“手机负责快速输入，电脑负责深度整理。信息不是永久仓库，而是高效过滤器。”**

集成主题 Feed 流、OpenClaw Agent 作用域控制与四级数据生命周期归档控制中心。

---

## 📖 项目简介

**文件传输助手们 (File Assistant Hub)** 是一款遵循 **MUJI × Apple Journal × 日式侘寂风 (Wabi-Sabi)** 审美体系的个人数字中转与整理工作台。旨在解决多端投递信息混乱、AI 盲目读取历史浪费算力、缺乏明确数据生命周期清理机制的问题。

### 🌟 核心理念与亮点

1. **纯图标极简视觉 (Icon-Only Minimalism)**
   - 全站按钮与功能操作抛弃冗余文字说明，采用极简圆角图标。
   - 配套思源宋体 (`Noto Serif SC`) 作为 UI 标题与功能区字体，展现典雅的高端期刊风质感。

2. **OpenClaw Agent 零损耗原则 (Zero-Idle Latency)**
   - OpenClaw Agent 平时保持彻底静默与零资源占用，绝不下推或静默读取聊天记录。
   - 仅在用户通过 **Agent 范围选择器 (AgentScopeModal)** 配置指定话题、日期与文件格式后按需唤醒。

3. **无限多轮对话链 (Thread Conversation)**
   - 支持对 AI 或用户消息进行引用与追问，追问时无缝直连 AI 实时连续解答。
   - 包含专属追问脉络线 (Thread Line) 与莫兰迪雾蓝配色引用块。

4. **四级数据生命周期管理 (4-Tier Data Lifecycle)**
   - **Workspace (临时工作区)**: 默认保留 14 天，超时自动整理。
   - **Trash (回收站)**: 缓冲 7 天后永久清理。
   - **Favorites (长期收藏)** & **Archive (结构化档案)**: 经过用户确认后的数据升级为 **`☁ 已保护`** 状态，永久豁免清理。

5. **20 款 MUJI 莫兰迪淡雅色盘 (20 Morandi Color Presets)**
   - 目标管理 (Target) 内置 20 款日系莫兰迪色块（雾霾蓝、苔藓绿、烟灰紫、暖柿橙、亚麻棕等），支持自定义任务类型配置。

---

## 🛠️ 技术栈与架构

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8.1
- **图标系统**: Lucide React
- **字体系统**: Noto Serif SC (思源宋体) + Outfit (现代无衬线体)
- **数据持久化**: LocalStorage 本地全量数据响应式存储与 JSON 数据流

---

## 📁 目录结构

```
File_Assistant_Hub/
├── README.md               # 项目主说明文档
├── REQUIREMENTS.md         # 详细需求归纳与功能演进说明
├── DATA_LIFECYCLE_GUIDE.md # 数据生命周期与结构化存储指引
├── index.html              # HTML 模板 (含思源宋体引入)
├── vite.config.ts          # Vite 配置文件
├── package.json            # 依赖与脚本
└── src/
    ├── types/              # TypeScript 类型定义 (FeedItem, Topic, TargetTask, ArchiveSection...)
    ├── services/           # 存储服务 (StorageService) 与 Mock 数据
    ├── styles/             # 全局美学样式与配色系统 (index.css)
    └── components/         # 模块组件
        ├── Header.tsx           # 顶部极简图标栏
        ├── Sidebar.tsx          # 折叠历史对话与收藏侧边栏
        ├── HomeEntryView.tsx    # 首页信息投递箱
        ├── FeedView.tsx         # 消息 Feed 流与追问对话链
        ├── TargetView.tsx       # 目标管理与等格月历 (20 色盘)
        ├── ArchiveView.tsx      # 6+1 维结构化档案库
        ├── AgentScopeModal.tsx  # OpenClaw 作用域选择器
        ├── SearchModal.tsx      # 全域/作用域分级搜索
        └── SettingsModal.tsx    # 存储统计与同步日志
```

---

## 🚀 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 生产环境打包构建
npm run build
```

## 📱 PWA 与手机桌面图标

- PWA 图标登记：`CAT-002 Archivist / 档案猫`
- 角色动作：戴书记员帽，一只手挠头，另一只手抱文件夹
- Manifest：`public/manifest.webmanifest`
- Service Worker：`public/sw.js`（仅缓存 PWA 壳资源，不缓存 `/api/*` 或业务数据）
- 图标目录：`public/icons/`

生产环境必须通过 HTTPS 提供服务。若站点启用访问门禁，应允许匿名读取 Manifest、Service Worker、离线页与图标资源，否则 Android 无法正确安装为独立 PWA。

---

## 📜 关联文档

- [查看项目需求归纳文档 (REQUIREMENTS.md)](./REQUIREMENTS.md)
- [查看数据生命周期指引 (DATA_LIFECYCLE_GUIDE.md)](./DATA_LIFECYCLE_GUIDE.md)
