# AI Home Farm Interface - 文件结构设计 V2.0 (FILE_STRUCTURE.md)

## 1. 升级后的项目目录树

```
ai-home-farm-interface-preview/
├── COMPONENT_TREE.md               # 组件树设计文档 V2.0
├── FILE_STRUCTURE.md                # 文件结构设计文档 V2.0
├── STATE_MANAGEMENT.md              # 状态管理方案文档 V2.0
├── UI_IMPLEMENTATION_PLAN.md        # 首页UI实现计划文档 V2.0
│
├── index.html                       # HTML 入口
├── package.json                     # 依赖项
├── vite.config.ts                   # Vite 配置
├── tsconfig.json                    # TS 配置
│
├── public/                          # 静态资源
│   └── assets/                      # 手绘/像素生成插图
│
└── src/
    ├── main.tsx                     # 根入口
    ├── App.tsx                      # App 主架构
    ├── index.css                    # 全局 CSS 变量与移动端响应式样式
    ├── vite-env.d.ts                # CSS Modules 声明
    │
    ├── types/                       # 强类型定义
    │   ├── index.ts                 # 全站基础类型
    │   ├── agent.ts                 # AgentConfig, ProviderType 接口
    │   └── user.ts                  # UserProfile, Signature 开关
    │
    ├── services/                    # Agent Provider 服务抽象接口
    │   ├── agentProvider.ts         # AgentProviderInterface 工厂
    │   ├── openClawService.ts       # OpenClaw 腾讯云主控连接服务
    │   ├── openaiProvider.ts        # OpenAI 兼容 API 接入服务
    │   └── geminiProvider.ts        # Gemini API 接入服务
    │
    ├── components/                  # 组件库
    │   ├── Header/
    │   │   ├── HeaderSection.tsx    # 顶部纯图标栏，农场页专属欢迎语
    │   │   └── HeaderSection.module.css
    │   │
    │   ├── Showcase/
    │   │   ├── HomeShowcaseCard.tsx # 精简冗余文字后的展示框插件
    │   │   └── Showcase.module.css
    │   │
    │   ├── Composer/
    │   │   ├── FarmChatComposer.tsx # 纯图标工具栏，星芒思考深度浮层
    │   │   ├── ThinkingDepthMenu.tsx# 普通/深度/极深选择浮层
    │   │   └── Composer.module.css
    │   │
    │   ├── Navigation/
    │   │   ├── HomeNavigation.tsx   # 移动端同行极简单排导航栏 (🌱农场 ✉️信箱 ☕客厅 📖书房)
    │   │   └── Navigation.module.css
    │   │
    │   ├── Drawer/
    │   │   ├── HistoryDrawer.tsx    # 全覆盖式抽屉，无头像，格式【Agent名字】标题
    │   │   └── Drawer.module.css
    │   │
    │   ├── Modal/
    │   │   ├── SettingsModal.tsx    # 配置中心（5大顺位分类）
    │   │   ├── AgentSelectorModal.tsx
    │   │   └── Modal.module.css
    │   │
    │   └── Settings/                # 设置页面分栏子组件
    │       ├── UserProfileTab.tsx   # 农场主资料与签名开关
    │       ├── AgentManagementTab.tsx # Agent 管理与 OpenClaw 主控标识
    │       ├── MemoryManagementTab.tsx# 独立记忆与 OpenClaw 全局记忆
    │       ├── ModelConfigTab.tsx   # API Key / Base URL / Model 编辑
    │       └── ThemeConfigTab.tsx   # 外观与主题
    │
    ├── pages/                       # 页面级组件
    │   ├── HomePage.tsx             # 农场主归家视图
    │   ├── MailboxPage.tsx          # 移动端优先单栏信箱
    │   ├── LivingRoomPage.tsx       # 客厅聊天（支持签名展示）
    │   └── StudyPage.tsx            # 书房
    │
    ├── data/                        # 默认初始化预设
    │   └── defaultData.ts           # 包含 OpenClaw 与 API Agent 默认数据
    │
    └── store/
        └── useHomeStore.tsx         # 全局 Store
```
