import { SceneType, ActionItemStatus } from '../types';

export interface ActionOption {
  icon: string;
  text: string;
}

export interface ItemOption {
  icon: string;
  text: string;
}

const STUDY_DATABASE = {
  actions: [
    { icon: '📖', text: '阅读' },
    { icon: '🗂️', text: '整理' },
    { icon: '✍️', text: '记录' },
    { icon: '🔬', text: '研究' },
    { icon: '💬', text: '讨论' },
    { icon: '💡', text: '学习' }
  ],
  items: [
    { icon: '📚', text: '书籍' },
    { icon: '📝', text: '笔记' },
    { icon: '📄', text: '论文' },
    { icon: '🗺️', text: '地图' },
    { icon: '📜', text: '古籍' },
    { icon: '📂', text: '资料' }
  ]
};

export const LIVING_STATUS_DATABASE: Record<SceneType, { actions: ActionOption[]; items: ItemOption[] }> = {
  farm: {
    actions: [
      { icon: '🌱', text: '播种' },
      { icon: '💧', text: '浇水' },
      { icon: '🌿', text: '除草' },
      { icon: '👀', text: '观察' },
      { icon: '🧺', text: '收获' },
      { icon: '💰', text: '出售' },
      { icon: '🛒', text: '购入' }
    ],
    items: [
      { icon: '🍅', text: '番茄' },
      { icon: '🥒', text: '黄瓜' },
      { icon: '🍎', text: '苹果' },
      { icon: '🌾', text: '小麦' },
      { icon: '🎃', text: '南瓜' },
      { icon: '🍓', text: '草莓' },
      { icon: '🌽', text: '玉米' },
      { icon: '🥕', text: '胡萝卜' }
    ]
  },
  magic: {
    actions: [
      { icon: '⚙️', text: '加工' },
      { icon: '🔍', text: '研究' },
      { icon: '🔨', text: '制作' },
      { icon: '🧪', text: '实验' },
      { icon: '🔮', text: '炼制' }
    ],
    items: [
      { icon: '💎', text: '矿石' },
      { icon: '✨', text: '魔法材料' },
      { icon: '📜', text: '魔法书' },
      { icon: '🏺', text: '果酱' },
      { icon: '🪑', text: '家具' },
      { icon: '🧪', text: '药剂' }
    ]
  },
  study: STUDY_DATABASE,
  library: STUDY_DATABASE,
  restaurant: {
    actions: [
      { icon: '🍳', text: '制作' },
      { icon: '🥘', text: '烹饪' },
      { icon: '🍽️', text: '摆放' },
      { icon: '🧹', text: '整理' }
    ],
    items: [
      { icon: '🍞', text: '面包' },
      { icon: '🥗', text: '沙拉' },
      { icon: '🍲', text: '汤品' },
      { icon: '🍰', text: '甜点' },
      { icon: '🧃', text: '果汁' },
      { icon: '🥩', text: '烤肉' }
    ]
  }
};

export const getRandomLivingStatus = (scene: SceneType): ActionItemStatus => {
  const spaceData = LIVING_STATUS_DATABASE[scene] || LIVING_STATUS_DATABASE.farm;
  const randomAction = spaceData.actions[Math.floor(Math.random() * spaceData.actions.length)];
  const randomItem = spaceData.items[Math.floor(Math.random() * spaceData.items.length)];

  return {
    actionIcon: randomAction.icon,
    actionText: randomAction.text,
    itemIcon: randomItem.icon,
    itemText: randomItem.text
  };
};
