# AI Home Farm Interface - 状态管理方案 V4.0 (STATE_MANAGEMENT.md)

## 1. 动态生活状态与四空间时间切图流

本版新增“餐厅 (`restaurant`) 空间”与全空间“动态生活状态 (Action + Item)”的数据驱动规格。

```
                    ┌─────────────────────────┐
                    │ 四大空间 (SceneType)    │
                    │ farm | magic | study |  │
                    │ restaurant (新增)       │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│ 三段式时间切图          │             │ 动态生活状态生成器      │
│ 早餐/午餐/晚餐          │             │ [Action] + [Item]       │
│ (06-12/12-18/18-06)     │             │ 例: 🌱 播种 🍅 番茄     │
└─────────────────────────┘             └─────────────────────────┘
```

---

## 2. 核心状态接口定义

### 2.1 四空间动态生活档案 (DynamicLivingArchive)
```typescript
export type SceneType = 'farm' | 'magic' | 'study' | 'restaurant';

export interface ActionItemStatus {
  actionIcon: string;  // 动作图标 (例: 🌱, 🍳, ⚙️, 📖)
  actionText: string;  // 动作文字 (例: 播种, 制作, 加工, 阅读)
  itemIcon: string;    // 物品图标 (例: 🍅, 🍞, 💎, 📜)
  itemText: string;    // 物品文字 (例: 番茄, 面包, 矿石, 古籍)
}

export interface DiningTimeImages {
  breakfast: string;  // 早餐 (06:00 - 12:00)
  lunch: string;      // 午餐 (12:00 - 18:00)
  dinner: string;     // 晚餐 (18:00 - 06:00)
}

export interface DynamicLivingArchive {
  id: string;
  sceneType: SceneType;
  displayName: string; // "农场" | "工坊" | "书房" | "餐厅"
  timeImages: DiningTimeImages;
  currentStatus: ActionItemStatus;
  compactStats: Array<{ id: string; icon: string; name: string; count: string }>;
}
```

### 2.2 四空间动作+物品随机生成算法
```typescript
export const generateLivingStatus = (scene: SceneType): ActionItemStatus => {
  // 根据空间类型从对应动作库与物品库中随机提取组合
  // 例如: farm -> 🌱 播种 🍅 番茄
  // restaurant -> 🍳 制作 🍞 面包
};
```
