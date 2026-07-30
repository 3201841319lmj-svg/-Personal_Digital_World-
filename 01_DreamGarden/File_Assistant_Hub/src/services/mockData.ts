import type { Topic, FeedItem, FavoriteFolder, TargetTask, ArchiveSection, AppSettings, SyncLog, ArchiveRecentUpdate, StorageStats, TaskCategoryConfig } from '../types';

export const DEFAULT_TASK_CATEGORIES: TaskCategoryConfig[] = [
  { id: 'cat-work', name: '工作', color: '#71859A' },
  { id: 'cat-study', name: '学习', color: '#4B7B61' },
  { id: 'cat-life', name: '生活', color: '#7168A4' },
  { id: 'cat-health', name: '健康', color: '#D98236' },
  { id: 'cat-medical', name: '医疗', color: '#E74C3C' },
];

export const INITIAL_TOPICS: Topic[] = [
  { id: 'topic-1', title: '客户方案', time: '10:30', category: 'today', parentCategory: '工作', subCategory: '客户资料' },
  { id: 'topic-2', title: 'OpenClaw 研究', time: '09:22', category: 'today', parentCategory: 'AI', subCategory: 'OpenClaw' },
  { id: 'topic-3', title: '灵感收集', time: '08:15', category: 'today', parentCategory: '生活', subCategory: '灵感' },
  { id: 'topic-4', title: '旅行计划', time: '昨天', category: 'yesterday', parentCategory: '生活', subCategory: '旅行' },
  { id: 'topic-5', title: '健身记录', time: '昨天', category: 'yesterday', parentCategory: '生活', subCategory: '健康' },
  { id: 'topic-6', title: '产品想法', time: '7月20日', category: 'earlier', parentCategory: '工作', subCategory: '产品' },
  { id: 'topic-7', title: '阅读笔记', time: '7月18日', category: 'earlier', parentCategory: '学习', subCategory: '读书' },
];

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    topicId: 'topic-1',
    type: 'pdf',
    fileName: '客户方案最终版.pdf',
    fileSize: '2.4 MB',
    timestamp: '10:30',
    dateGroup: '7月25日',
    location: 'workspace',
    expireDays: 14,
  },
  {
    id: 'feed-2',
    topicId: 'topic-1',
    type: 'image',
    fileName: '方案封面设计.png',
    fileSize: '1.2 MB',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    timestamp: '10:31',
    dateGroup: '7月25日',
    location: 'favorites',
    isProtected: true,
  },
  {
    id: 'feed-3',
    topicId: 'topic-1',
    type: 'text',
    content: `客户方案的反馈：\n1. 页面风格偏商务一些\n2. 增加数据可视化部分\n3. 颜色以蓝色系为主`,
    timestamp: '10:32',
    dateGroup: '7月25日',
    location: 'workspace',
    expireDays: 14,
  },
  {
    id: 'feed-4',
    topicId: 'topic-1',
    type: 'agent',
    isAgent: true,
    agentName: 'OpenClaw',
    summaryBullets: [
      '客户方案已完成最终版',
      '客户反馈重点集中在风格、数据可视化和颜色',
      '下一步建议：优化页面风格，补充可视化图表'
    ],
    suggestedAction: '需要我为您生成具体的优化建议或结构草案吗？',
    timestamp: '10:35',
    dateGroup: '7月25日',
    location: 'archive',
    isProtected: true,
  },
  {
    id: 'feed-5',
    topicId: 'topic-1',
    type: 'doc',
    fileName: '客户需求文档.docx',
    fileSize: '1.6 MB',
    timestamp: '16:20',
    dateGroup: '7月24日',
    location: 'workspace',
    expireDays: 13,
  },
  {
    id: 'feed-6',
    topicId: 'topic-1',
    type: 'link',
    title: '客户公司官网',
    linkUrl: 'https://example.com',
    timestamp: '16:21',
    dateGroup: '7月24日',
    location: 'workspace',
    expireDays: 13,
  }
];

export const INITIAL_FAVORITE_FOLDERS: FavoriteFolder[] = [
  { id: 'fav-1', name: '灵感', count: 64 },
  { id: 'fav-2', name: '产品想法', count: 39 },
  { id: 'fav-3', name: 'AI研究', count: 18 },
  { id: 'fav-4', name: '工作资料', count: 86 },
  { id: 'fav-5', name: '旅行参考', count: 45 },
];

export const INITIAL_TARGETS: TargetTask[] = [
  {
    id: 'target-1',
    title: '完成客户方案最终版',
    category: '工作',
    color: '#71859A',
    completed: false,
    flagged: true, // 🚩 小红旗
    date: '2026-07-25',
    timeRange: '10:00 - 14:00',
    durationHours: 4.0,
    subtasks: [
      { id: 'sub-1', title: '整理客户反馈', completed: false, flagged: true, time: '10:00' },
      { id: 'sub-2', title: '优化页面风格', completed: false, time: '11:30' },
      { id: 'sub-3', title: '补充数据可视化', completed: false, time: '13:30' }
    ]
  },
  {
    id: 'target-2',
    title: '学习 AI 相关知识',
    category: '学习',
    color: '#4B7B61',
    completed: false,
    flagged: false,
    date: '2026-07-25',
    timeRange: '15:30 - 17:30',
    durationHours: 2.0,
    subtasks: [
      { id: 'sub-4', title: '阅读论文 1 篇', completed: false, flagged: true, time: '15:30' },
      { id: 'sub-5', title: '整理笔记', completed: false, time: '17:00' }
    ]
  },
  {
    id: 'target-3',
    title: '打羽毛球',
    category: '健康',
    color: '#D98236',
    completed: false,
    flagged: false,
    date: '2026-07-25',
    timeRange: '19:30 - 20:30',
    durationHours: 1.0,
    subtasks: [
      { id: 'sub-6', title: '热身 10 分钟', completed: false, time: '19:30' },
      { id: 'sub-7', title: '对抗训练', completed: false, time: '19:45' },
      { id: 'sub-8', title: '拉伸放松', completed: false, time: '20:25' }
    ]
  },
  {
    id: 'target-4',
    title: '定期健康体检与医疗报销',
    category: '医疗',
    color: '#E74C3C',
    completed: false,
    flagged: true,
    date: '2026-07-25',
    timeRange: '09:00 - 10:30',
    durationHours: 1.5,
    subtasks: [
      { id: 'sub-9', title: '预约复查项目', completed: true, time: '09:00' },
      { id: 'sub-10', title: '整理医疗单据', completed: false, flagged: true, time: '10:00' }
    ]
  },
  {
    id: 'target-5',
    title: '记录饮食与热量',
    category: '生活',
    color: '#7168A4',
    completed: true,
    flagged: false,
    date: '2026-07-25',
    timeRange: '21:00 - 21:30',
    durationHours: 0.5
  }
];

export const INITIAL_ARCHIVES: ArchiveSection[] = [
  {
    id: 'arch-profile',
    title: '我的档案',
    category: 'profile',
    itemCount: 32,
    updatedAt: '2026-07-25 18:30',
    summary: '基本信息与偏好',
    highlights: ['喜欢日式侘寂与 MUJI 极简风格', '信息生命周期管理优先', '习惯手机极速投递，电脑深度整理']
  },
  {
    id: 'arch-work',
    title: '我的工作',
    category: 'work',
    itemCount: 86,
    updatedAt: '2026-07-25 22:30',
    summary: '工作内容与任务',
    highlights: ['客户方案重点：商务风、蓝色系、可视化', '设计文件存储于 /archive/work/ 目录']
  },
  {
    id: 'arch-life',
    title: '我的生活',
    category: 'life',
    itemCount: 45,
    updatedAt: '2026-07-24 21:00',
    summary: '生活内容与习惯',
    highlights: ['旅行路线规划、居家美学搜集', '生活清单自动分类至 /archive/life/']
  },
  {
    id: 'arch-health',
    title: '我的健康',
    category: 'health',
    itemCount: 28,
    updatedAt: '2026-07-24 21:05',
    summary: '健康记录与运动',
    highlights: ['羽毛球训练打卡（每周2次）', '每日饮食与卡路里阶段记录']
  },
  {
    id: 'arch-tools',
    title: '我的工具',
    category: 'tools',
    itemCount: 39,
    updatedAt: '2026-07-22 14:15',
    summary: '账号·链接·工具',
    highlights: ['OpenClaw Agent 接口与控制台', '腾讯云 File_Assistant_Hub 长期空间挂载']
  },
  {
    id: 'arch-inspiration',
    title: '我的灵感',
    category: 'inspiration',
    itemCount: 64,
    updatedAt: '2026-07-25 18:12',
    summary: '想法与创意',
    highlights: ['MUJI × Apple Journal 极简无打扰设计', '不替用户制造垃圾，仅管理筛选后长远记忆']
  },
  {
    id: 'arch-trash',
    title: '垃圾堆',
    category: 'trash',
    itemCount: 12,
    updatedAt: '2026-07-20 12:00',
    summary: '暂未分类的内容',
    highlights: ['自动进入待清理列表 (14天后进入7天回收站)']
  }
];

export const INITIAL_RECENT_UPDATES: ArchiveRecentUpdate[] = [
  { id: 'rec-1', categoryTitle: '我的工作', categoryKey: 'work', updatedAt: '2026-07-25 22:30', count: 5 },
  { id: 'rec-2', categoryTitle: '我的灵感', categoryKey: 'inspiration', updatedAt: '2026-07-25 18:12', count: 8 },
  { id: 'rec-3', categoryTitle: '我的健康', categoryKey: 'health', updatedAt: '2026-07-24 21:05', count: 3 },
];

export const INITIAL_SYNC_LOGS: SyncLog[] = [
  { 
    id: 'sync-1', 
    timestamp: '2026-07-26 10:35:12', 
    action: 'SAVE_TO_LONGTERM', 
    source: 'workspace', 
    destination: 'archive/work/', 
    path: 'File_Assistant_Hub/archive/work/client_proposal.json', 
    status: 'success' 
  },
  { 
    id: 'sync-2', 
    timestamp: '2026-07-26 09:22:45', 
    action: 'ADD', 
    source: 'workspace', 
    destination: 'openclaw_memory/', 
    path: 'File_Assistant_Hub/openclaw_memory/summaries/openclaw_config.json', 
    status: 'success' 
  },
  { 
    id: 'sync-3', 
    timestamp: '2026-07-25 18:30:00', 
    action: 'UPDATE', 
    source: 'workspace', 
    destination: 'favorites/travel/', 
    path: 'File_Assistant_Hub/favorites/inspiration/inspiration_hub.json', 
    status: 'success' 
  }
];

export const INITIAL_STORAGE_STATS: StorageStats = {
  workspaceSize: '2.3 GB',
  pendingCleanFiles: 45,
  favoritesCount: 152,
  archiveCount: 86,
  memoryCount: 24,
};

export const INITIAL_SETTINGS: AppSettings = {
  openClawConnected: true,
  cloudSyncEnabled: true,
  lastSyncTime: '2026-07-26 10:35',
  themeMode: 'warm-paper',
  fontFamily: 'serif',
  fontSize: 'normal'
};
