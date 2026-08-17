# 📊 数据生命周期与数据管理指引 (Data Lifecycle & Storage Guide)

文档版本：V1.7  
适用范围：`File_Assistant_Hub` 数据存储与持久化规范  
数据存储机制：LocalStorage + JSON 交互序列化

---

## 一、 数据生命周期四级模型 (4-Tier Model)

为贯彻“信息不是永久仓库，而是高效过滤器”的宗旨，系统引入四级生命周期隔离机制：

```
┌────────────────────────────────────────────────────────────────────────┐
│                        投递 / 产生中转信息                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
         ┌─────────────────────────────────────────────────────┐
         │ Tier 1: Workspace (临时工作区)                      │
         │ • 默认存留 14 天                                     │
         │ • 无保护标记，超时进入待清理缓冲区                      │
         └──────────────────────────┬──────────────────────────┘
                                    │ (超时 / 手动删除)
                                    ▼
         ┌─────────────────────────────────────────────────────┐
         │ Tier 2: Trash (回收站)                              │
         │ • 存留 7 天缓冲期                                    │
         │ • 允许随时二次确认还原或彻底清除                      │
         └──────────────────────────┬──────────────────────────┘
                                    │ (7天结束)
                                    ▼
         ┌─────────────────────────────────────────────────────┐
         │ 彻底物理摧毁 (Permanent Expiry)                     │
         └─────────────────────────────────────────────────────┘

                            【用户主动确认保护】
                                    │
                                    ▼
         ┌─────────────────────────────────────────────────────┐
         │ Tier 3: Favorites (长期收藏) & Tier 4: Archive (档案)│
         │ • 升级为 ☁ 已保护 (isProtected = true)               │
         │ • 永久豁免 14 天清理规则                             │
         │ • 映射云端物理目录 /cloud_archive/<category>/       │
         └─────────────────────────────────────────────────────┘
```

---

## 二、 本地存储数据键值 Schema

本地数据由 `StorageService` (`src/services/storage.ts`) 统一调度，映射表如下：

| Key 名 | 描述 | 数据类型 | 说明 |
|--------|------|----------|------|
| `fah_topics` | 历史话题列表 | `Topic[]` | 存放历史对话主题、分组与收藏状态 |
| `fah_feeds` | 消息卡片集合 | `FeedItem[]` | 存放 Feed 流卡片、引用关系与保护状态 |
| `fah_favorites` | 收藏文件夹列表 | `FavoriteFolder[]` | 收藏分类夹与条目计数 |
| `fah_targets` | 目标与任务 | `TargetTask[]` | 包含日期、完成状态、小红旗 🚩 与子任务 |
| `fah_task_categories` | 任务类型配置 | `TaskCategoryConfig[]` | 包含 20 色莫兰迪配色及自定义类型名称 |
| `fah_archives` | 结构化档案 | `ArchiveSection[]` | 6+1 维长期记忆要点 |
| `fah_sync_logs` | 同步日志 | `SyncLog[]` | 记录入库、修改与云端导出操作 |
| `fah_settings` | 用户偏好设置 | `AppSettings` | 主题模式、同步时间等 |

---

## 三、 核心 TypeScript 数据接口

```typescript
// 消息 Feed 项定义
export interface FeedItem {
  id: string;
  topicId: string;
  type: 'text' | 'pdf' | 'image' | 'doc' | 'link' | 'video' | 'audio' | 'agent';
  title?: string;
  content?: string;
  fileName?: string;
  fileSize?: string;
  timestamp: string;
  dateGroup: string;
  
  // OpenClaw Agent 属性
  isAgent?: boolean;
  agentName?: string;
  summaryBullets?: string[];
  suggestedAction?: string;
  
  // 引用与追问对话链 (Thread Conversation)
  quotedContent?: string;
  quotedTargetId?: string; // 引用源卡片 ID
  replyToAgentId?: string; // 所回复的 AI 卡片 ID

  // 数据生命周期控制
  location?: 'workspace' | 'favorites' | 'archive';
  isProtected?: boolean; // ☁ 已保护标记
  expireDays?: number;   // 默认 14 天
}

// 目标任务定义 (含 20 色莫兰迪配色)
export interface TargetTask {
  id: string;
  title: string;
  category: string; // e.g. '工作' | '学习' | '生活' | '健康' | '医疗'
  color: string;    // Morandi Hex Color (e.g. #71859A)
  completed: boolean;
  flagged?: boolean; // 小红旗 🚩
  date: string;     // YYYY-MM-DD
  subtasks?: { id: string; title: string; completed: boolean; flagged?: boolean }[];
}
```

---

## 四、 结构化档案云端归档路径指引

已升轨为 **`☁ 已保护`** 状态的数据及档案结构，在逻辑上映射至系统的云端目录架构：

```
File_Assistant_Hub/
└── cloud_archive/
    ├── profile/      # 个人属性、性格、价值观沉淀
    ├── work/         # 工作项目、客户需求、决策纪要
    ├── life/         # 生活日常、习惯与家庭事件
    ├── health/       # 健康指标、医疗记录、健身计划
    ├── tools/        # 工具配置、Prompt、软件快捷指令
    ├── inspiration/  # 创意想法、未立项灵感
    └── trash/        # 缓冲回收站 (7天后注销)
```

---

## 五、 手动数据同步与恢复指引

1. **一键结构化导出**：
   在 **档案 (Archive)** 页面中，点击【同步保存到云端】可将结构化数据全量写入最新快照，并在设置中生成 SyncLog 记录。
2. **清除与重置数据**：
   通过设置 modal (`SettingsModal.tsx`) 可查看【临时区容量】与【已保护长期内存】，必要时可点击重置恢复至系统初始化示例值。
