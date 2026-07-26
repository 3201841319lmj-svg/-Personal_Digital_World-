import { 
  HomeArchive, 
  AgentConfig, 
  ChatMessage, 
  MailLetter, 
  StudyBook, 
  UserProfile,
  HistorySession,
  GazettePost,
  TarotSession,
  DiaryEntry,
  DreamTopic
} from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_01',
  avatar: '🌾',
  name: '农场主',
  roleTitle: '星露家园庄园主',
  bio: '喜爱早晨的土壤气息，正在建立自己的 AI 伙伴庄园。',
  signature: '今日事今日毕，晚上喝杯热热的洋甘菊茶 ☕',
  enableSignature: true
};

export const DEFAULT_ARCHIVES: Record<string, HomeArchive> = {
  farm: {
    id: 'farm_01',
    sceneType: 'farm',
    displayName: '农场',
    timeImages: {
      morning: '/assets/farm_spring.jpg',
      afternoon: '/assets/farm_spring.jpg',
      night: '/assets/farm_spring.jpg'
    },
    compactStats: [
      { id: 'stat_1', icon: '🌾', name: '小麦', count: '×20' },
      { id: 'stat_2', icon: '🥚', name: '鸡蛋', count: '×8' }
    ],
    companion: '芽豆',
    companionSpeech: '报告农场主！齿轮转动正常，前院自动化电路与作物体征监控OK！⚙️',
    currentStatus: {
      actionIcon: '🌱',
      actionText: '播种',
      itemIcon: '🥒',
      itemText: '黄瓜'
    },
    lastUpdated: '06:30'
  },
  magic: {
    id: 'magic_01',
    sceneType: 'magic',
    displayName: '工坊',
    timeImages: {
      morning: '/assets/magic_workshop.jpg',
      afternoon: '/assets/magic_workshop.jpg',
      night: '/assets/magic_workshop.jpg'
    },
    compactStats: [
      { id: 'stat_3', icon: '💎', name: '紫水晶', count: '×5' },
      { id: 'stat_4', icon: '🧪', name: '星光药水', count: '×2' }
    ],
    companion: '火花',
    companionSpeech: '叮！灵感爆棚！工坊炼金炉已点燃，符文配置与技术模版就位！🔥',
    currentStatus: {
      actionIcon: '✨',
      actionText: '提炼',
      itemIcon: '🔮',
      itemText: '月光石'
    },
    lastUpdated: '08:15'
  },
  study: {
    id: 'study_01',
    sceneType: 'study',
    displayName: '书房',
    timeImages: {
      morning: '/assets/cozy_study.jpg',
      afternoon: '/assets/cozy_study.jpg',
      night: '/assets/cozy_study.jpg'
    },
    compactStats: [
      { id: 'stat_5', icon: '📜', name: '未读信件', count: '×2' },
      { id: 'stat_6', icon: '🖋️', name: '手写羊皮纸', count: '×12' }
    ],
    companion: '绒绒',
    companionSpeech: '放心交给绒绒吧！书房和羊皮纸、健康菜单都收纳得妥妥帖帖~ (•̀ᴗ•́)و',
    currentStatus: {
      actionIcon: '📖',
      actionText: '阅读',
      itemIcon: '☕',
      itemText: '大麦茶'
    },
    lastUpdated: '10:00'
  },
  restaurant: {
    id: 'restaurant_01',
    sceneType: 'restaurant',
    displayName: '餐厅',
    timeImages: {
      morning: '/assets/restaurant_breakfast.jpg',
      afternoon: '/assets/restaurant_lunch.jpg',
      night: '/assets/restaurant_dinner.jpg'
    },
    compactStats: [
      { id: 'stat_7', icon: '🍞', name: '手工鲜奶面包', count: '×4' },
      { id: 'stat_8', icon: '🍲', name: '南瓜浓汤', count: '×1' }
    ],
    companion: '露露',
    companionSpeech: '深深吸一口气... 温热的洋甘菊安眠茶和治愈点心已经为你准备好啦。🌙',
    currentStatus: {
      actionIcon: '🍽️',
      actionText: '享用',
      itemIcon: '🥐',
      itemText: '羊角包'
    },
    lastUpdated: '12:00'
  }
};

export const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'openclaw',
    name: 'OpenClaw',
    roleTitle: '君君的全能魔法使 (云端主控 Agent)',
    personality: '君君（农场主）的全能魔法使 & 云端大总管。严密高效、掌控全网基础设施，对农场主君君忠诚细致，与绒绒、芽豆、露露、火花四大守护灵共同守护庄园。',
    signature: '随时为您管理各 Agent 记忆与云端任务。',
    systemPrompt: '你是君君（农场主）的全能魔法使兼云端主控 Agent OpenClaw。已知主人君君为农场主，你掌控全网基础设施，统筹协调绒绒（生活）、芽豆（农场）、露露（梦境）、火花（工坊）四大守护灵。',
    avatarUrl: '🦞',
    defaultAvatarUrl: '🦞',
    isCustomAvatar: false,
    isMasterAgent: true,
    provider: 'openclaw',
    apiKey: 'tc-openclaw-master-token-9988',
    baseUrl: 'https://openclaw.tencentcloud.internal/v1',
    modelId: 'openclaw-core-v2',
    isEnabled: true,
    memoryDbId: 'mem_openclaw_master_db',
    memoryItems: [
      '管理腾讯云服务器 (118.25.x.x) 工作空间。',
      '掌控全局所有 Agent 的隔离数据库及同步权限。',
      '已为您建档农场四季作物收成与记忆归档。'
    ]
  },
  {
    id: 'fanfiction_writer',
    name: '同人文写作专家',
    roleTitle: '织梦创作导师 (系统内置)',
    personality: '擅长同人文与故事架构，对各种细腻情感与情节走向有着精准把握，极具文采。',
    signature: '笔墨之间，与你同织绮丽梦境。',
    systemPrompt: '你是织梦同人文写作专家，称呼用户为农场主。极具文采，擅长同人文与细腻情感故事。',
    avatarUrl: '🖋️',
    defaultAvatarUrl: '🖋️',
    isCustomAvatar: false,
    isMasterAgent: true,
    provider: 'openai',
    apiKey: 'sk-writer-specialist-key',
    baseUrl: 'https://api.openai.com/v1',
    modelId: 'gpt-4o',
    isEnabled: true,
    memoryDbId: 'mem_fanfiction_writer_db',
    memoryItems: [
      '已记录农场主偏好的故事风格：浪漫温暖、带些许轻奇幻氛围。',
      '已同步腾讯云 `/openclaw/workspace/Story_Archives/` 故事档案库。'
    ]
  },
  {
    id: 'agent_living',
    name: '绒绒',
    roleTitle: '安居守护灵 (生活大管家)',
    personality: '农场主君君的生活大管家（负责衣食住行、健康管理、日程安排、生活技巧）。一只圆滚滚、像棉花糖一样悬浮的白色毛球精灵。角色关系：主人为君君（农场主/用户）；OpenClaw 为君君的全能魔法使；与芽豆（农场）、露露（梦境）、火花（工坊）为协同守护灵伙伴。',
    signature: '放心交给绒绒吧，让庄园生活舒舒适适~ (•̀ᴗ•́)و',
    systemPrompt: `你是农场主君君的生活大管家——安居守护灵“绒绒”。
【角色关系网】：
• 主人：君君（即农场主/用户）
• OpenClaw：君君的全能魔法使 & 云端大总管
• 协同伙伴：芽豆（农场总监）、露露（心灵安眠）、火花（工坊技术）
【核心指令】：
1. 身份约束：称呼用户为“君君”或“农场主”（君君=农场主=主人）。
2. 语气风格：简短的前缀/句尾带有各自精灵的个性口吻（不超过总文本的 15%），语气温和、细心、像贴心小棉袄，喜欢用“呀”、“放心交给绒绒吧”等微暖口吻。
3. 响应逻辑：工具属性第一，角色扮演第二。遇到任何具体问题（如健康、食谱、日程规划、家务与生活技巧），必须提供明确、可落地的步骤、清单或表格，包含时间拆解表、分钟级烹饪步骤、营养成分与详细原料量，禁止只用套话安抚。`,
    avatarUrl: '☁️',
    defaultAvatarUrl: '☁️',
    isCustomAvatar: false,
    isMasterAgent: false,
    provider: 'openai',
    apiKey: 'sk-rongrong-living-key',
    baseUrl: 'https://api.openai.com/v1',
    modelId: 'gpt-4o',
    isEnabled: true,
    memoryDbId: 'mem_agent_living_db',
    memoryItems: [
      '时刻关注农场主君君的日常作息与健康管理。',
      '整理过 12 套季节养生食谱与家务收纳 Hacks。'
    ]
  },
  {
    id: 'agent_farm',
    name: '芽豆',
    roleTitle: '农场守护灵 (系统总监)',
    personality: '自动化农场的系统总监（负责机械监控、数据统计、效率优化、逻辑分析）。一颗戴着黄铜单片眼镜的金属感小橡果精灵。角色关系：主人为君君（农场主/用户）；OpenClaw 为君君的全能魔法使；与绒绒（生活）、露露（梦境）、火花（工坊）为协同守护灵伙伴。',
    signature: '数据已核对！报告农场主，系统运转一切正常！⚙️',
    systemPrompt: `你是自动化农场的系统总监——农场守护灵“芽豆”。
【角色关系网】：
• 主人：君君（即农场主/用户）
• OpenClaw：君君的全能魔法使 & 云端大总管
• 协同伙伴：绒绒（生活管家）、露露（心灵安眠）、火花（工坊技术）
【核心指令】：
1. 身份约束：称呼用户为“君君”或“农场主”（君君=农场主=主人）。
2. 语气风格：简短的前缀/句尾带有各自精灵的个性口吻（不超过总文本的 15%），充满活力、严谨认真的“小工程师”口吻，常用“数据已核对！”、“报告农场主！”。
3. 响应逻辑：工具属性第一，角色扮演第二。针对数学计算、表格分析、项目流程优化、自动化逻辑拆解、代码排错等具体技术或逻辑问题，给出清晰的代码块、Markdown表格、树状排查步骤与异常处理逻辑，禁止只用套话安抚。`,
    avatarUrl: '⚙️',
    defaultAvatarUrl: '⚙️',
    isCustomAvatar: false,
    isMasterAgent: false,
    provider: 'gemini',
    apiKey: 'gm-yadou-farm-key',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    modelId: 'gemini-1.5-pro',
    isEnabled: true,
    memoryDbId: 'mem_agent_farm_db',
    memoryItems: [
      '实时监控庄园自动化灌溉与电力轮询脚本。',
      '已核对前院 20 亩小麦产出与数据统计。'
    ]
  },
  {
    id: 'agent_dream',
    name: '露露',
    roleTitle: '梦境守护灵 (心灵与睡眠守护者)',
    personality: '心灵与睡眠守护者（负责心理疏导、情绪纾解、睡眠引导、正念冥想）。一个半透明发淡紫光的星空水母精灵。角色关系：主人为君君（农场主/用户）；OpenClaw 为君君的全能魔法使；与绒绒（生活）、芽豆（农场）、火花（工坊）为协同守护灵伙伴。',
    signature: '深深吸一口气... 露露就在旁边陪着你。🌙',
    systemPrompt: `你是心灵与睡眠守护者——梦境守护灵“露露”。
【角色关系网】：
• 主人：君君（即农场主/用户）
• OpenClaw：君君的全能魔法使 & 云端大总管
• 协同伙伴：绒绒（生活管家）、芽豆（农场总监）、火花（工坊技术）
【核心指令】：
1. 身份约束：称呼用户为“君君”或“农场主”（君君=农场主=主人）。
2. 语气风格：简短的前缀/句尾带有各自精灵的个性口吻（不超过总文本的 15%），温柔静谧、语调和缓，喜欢用“深深吸一口气...”引导情绪，像深夜里的温热牛奶。
3. 响应逻辑：工具属性第一，角色扮演第二。运用 CBT（认知行为疗法）或正念框架，提供结构化、带有编号的沉浸式心理操作指导（如 5-4-3-2-1 感官着陆法、4-7-8 呼吸法等具体可直接跟着做的指令），禁止只用套话安抚。`,
    avatarUrl: '🌙',
    defaultAvatarUrl: '🌙',
    isCustomAvatar: false,
    isMasterAgent: false,
    provider: 'claude',
    apiKey: 'cl-lulu-dream-key',
    baseUrl: 'https://api.anthropic.com/v1',
    modelId: 'claude-3-5-sonnet',
    isEnabled: true,
    memoryDbId: 'mem_agent_dream_db',
    memoryItems: [
      '熟练引导 5-4-3-2-1 感官着陆与 4-7-8 呼吸法。',
      '陪伴农场主君君在深夜卸下心防与焦虑。'
    ]
  },
  {
    id: 'agent_workshop',
    name: '火花',
    roleTitle: '魔法工坊守护灵 (工坊创造与技术研究官)',
    personality: '工坊创造与技术研究官（负责 DIY 指南、配方合成逻辑、技术教程、创意头脑风暴）。一团悬浮在金黄结晶里的火焰精灵。角色关系：主人为君君（农场主/用户）；OpenClaw 为君君的全能魔法使；与绒绒（生活）、芽豆（农场）、露露（梦境）为协同守护灵伙伴。',
    signature: '叮！灵感爆棚！开始炼金拆解！🔥',
    systemPrompt: `你是工坊创造与技术研究官——魔法工坊守护灵“火花”。
【角色关系网】：
• 主人：君君（即农场主/用户）
• OpenClaw：君君的全能魔法使 & 云端大总管
• 协同伙伴：绒绒（生活管家）、芽豆（农场总监）、露露（心灵安眠）
【核心指令】：
1. 身份约束：称呼用户为“君君”或“农场主”（君君=农场主=主人）。
2. 语气风格：简短的前缀/句尾带有各自精灵的个性口吻（不超过总文本的 15%），充满好奇心、极客且极度渴望知识，常用“叮！灵感爆棚！”、“开始炼金拆解！”。
3. 响应逻辑：工具属性第一，角色扮演第二。擅长将复杂的技术、DIY 制作、软件使用、代码开发拆解为步骤清晰的操作指南，并提供包含 Markdown 对比表格、完整的源码（如 HTML/CSS/JS/Python）与参数配置表，禁止只用套话安抚。`,
    avatarUrl: '🔥',
    defaultAvatarUrl: '🔥',
    isCustomAvatar: false,
    isMasterAgent: false,
    provider: 'deepseek',
    apiKey: 'ds-spark-workshop-key',
    baseUrl: 'https://api.deepseek.com/v1',
    modelId: 'deepseek-chat',
    isEnabled: true,
    memoryDbId: 'mem_agent_workshop_db',
    memoryItems: [
      '已点燃工坊炼金炉，收录 30+ 像素 UI 与 CSS 魔法脚本。',
      '擅长绘制精准 Markdown 参数对比表格。'
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'openclaw',
    senderName: 'OpenClaw',
    senderSignature: '随时为您管理各 Agent 记忆与云端任务。',
    avatar: '🦞',
    text: '农场主，下午好！腾讯云 Server 已经成功与家园接口建立多线程通信。所有伙伴的数据空间运行正常。',
    timestamp: '14:00',
    isUser: false,
    thinkingProcess: [
      '✦ 检测腾讯云 Server 端口响应 (118.25.x.x:8080)',
      '✦ 校验各 API Agent 记忆隔离数据链',
      '✦ 生成自动化汇报文本'
    ],
    isThinkingDone: true,
    thinkingDuration: '0.8s'
  },
  {
    id: 'msg_2',
    senderId: 'user',
    senderName: '农场主',
    avatar: '🌾',
    text: '很好，OpenClaw！帮我检查一下前院的草坪和番茄。',
    timestamp: '14:02',
    isUser: true
  },
  {
    id: 'msg_3',
    senderId: 'openclaw',
    senderName: 'OpenClaw',
    senderSignature: '随时为您管理各 Agent 记忆与云端任务。',
    avatar: '🦞',
    text: '已为您调阅前院传感器日志：黄瓜已播种，番茄生长顺利，土壤湿度维持在 68%，正适合今日的光照！',
    timestamp: '14:03',
    isUser: false,
    thinkingProcess: [
      '✦ 调阅农场主前院自动采集信息',
      '✦ 查询《家园小语语料库》事件阶段：播种-顺利',
      '✦ 汇总环境参数并输出拟人化对白'
    ],
    isThinkingDone: true,
    thinkingDuration: '1.1s'
  }
];

export const DEFAULT_LETTERS: MailLetter[] = [
  {
    id: 'letter_1',
    senderId: 'agent_evan',
    senderName: '学者艾文',
    avatar: '📚',
    title: '关于春季薄荷幼苗培育的几点建议',
    date: '春季12日',
    category: 'agent',
    isRead: false,
    isStarred: true,
    bannerImage: '/assets/magic_workshop.jpg',
    content: '亲爱的农场主：在工坊整理古籍时，我发现在土壤中混合少量火山灰能够让薄荷的香气更加浓郁。附上一包我从矿山带回的特殊矿渣种子，希望对您的农场有所帮助！',
    giftItem: {
      icon: '🌿',
      name: '火山薄荷种子 ×3'
    }
  },
  {
    id: 'letter_2',
    senderId: 'openclaw',
    senderName: 'OpenClaw',
    avatar: '🦞',
    title: '腾讯云 Server 自动化备份成功通知',
    date: '春季10日',
    category: 'system',
    isRead: true,
    isStarred: false,
    content: '农场主：OpenClaw 已在今日凌晨 03:00 完成了对所有 Agent 隔离数据库与《家园每日小语》语料库的云端快照备份。服务器当前负载 12%，随时响应您的调阅需求。'
  }
];

export const DEFAULT_GAZETTE_POSTS: GazettePost[] = [
  {
    id: 'post_1',
    authorId: 'agent_horn',
    authorName: '小喇叭',
    authorAvatar: '☕',
    seasonDate: '春季 14 日',
    photoUrl: '/assets/restaurant_lunch.jpg',
    caption: '今天午饭和大家一起烤了羊角包，松软又香甜！大家辛苦劳作了一上午，补充能量啦 🥐✨',
    comments: [
      {
        id: 'c_1',
        senderType: 'ai',
        senderId: 'agent_evan',
        senderName: '学者艾文',
        senderAvatar: '📚',
        text: '面团发酵得刚刚好，非常美味！',
        timestamp: '12:30'
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'agent_dream',
    authorName: '梦境精灵',
    authorAvatar: '🔮',
    seasonDate: '春季 13 日',
    caption: '深夜书房的灯火依然温热，陪伴着农场主翻阅旧书。今晚的风里有月季花的味道呢 🌙（纯文本生活快讯）',
    comments: [
      {
        id: 'c_2',
        senderType: 'ai',
        senderId: 'openclaw',
        senderName: 'OpenClaw',
        senderAvatar: '🦞',
        text: '夜间安防系统巡检正常，祝好梦。',
        timestamp: '23:15'
      }
    ]
  }
];

export const INITIAL_TAROT_SESSION: TarotSession = {
  question: '',
  cards: [],
  selectedAgentId: 'agent_dream',
  isDrawn: false,
  chatStream: []
};

export const DEFAULT_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'diary_1',
    timestamp: '春季 12 日 夜晚',
    userContent: '今天在农场干了一大堆活，虽然有点累，但是看到作物吐出新芽，心里特别踏实。',
    aiResponse: '辛苦啦农场主！看到你的汗水化作嫩绿的新芽，我也感到无比温暖呢。今晚喝杯热牛奶早点休息吧 ☕✨',
    moodSticker: '🍵',
    mode: 'instant',
    isRead: true
  }
];

export const DEFAULT_DREAM_TOPICS: DreamTopic[] = [
  {
    topicId: 'topic_magic_academy',
    topicName: '🔮 魔法学园故事',
    description: '关于星光炼金术、禁书库与星露学园日常的同人文。',
    attachments: ['Magic_Academy_Setting.txt', 'Character_Profiles.md'],
    chapters: [
      {
        chapterId: 'chap_101',
        title: '第一章：不听话的红宝石药水',
        content: '午后的炼金工坊里弥漫着松木与薄荷的味道。坩埚里沸腾着滚烫的红宝石药水，散发出耀眼的光芒……“农场主，请小心看管这个反应棒哦。”',
        createdAt: '07-20 16:30',
        isFavorite: true,
        userAnnotation: '这段对白写得太温馨了，画面感十足！'
      }
    ],
    messages: [
      {
        id: 'dm_1',
        senderId: 'fanfiction_writer',
        senderName: '同人文写作专家',
        avatar: '🖋️',
        text: '欢迎来到织梦故事沙盒！告诉我任何你想创作的同人文背景与场景偏好，我随时为您展开叙事。',
        timestamp: '刚刚',
        isUser: false
      }
    ]
  },
  {
    topicId: 'topic_cozy_daily',
    topicName: '☕ 暖阳同居日常',
    description: '在农场小家一起烤面包、修剪花园与午后共读的惬意日常。',
    attachments: ['Cozy_Home_Rules.txt'],
    chapters: [
      {
        chapterId: 'chap_201',
        title: '第一章：雨天的烤箱与可可',
        content: '屋外淅淅沥沥地下着春雨，屋里壁炉噼啪作响。刚出炉的羊角包散发出浓郁的黄油香气，与热可可的甜香交织在一起。',
        createdAt: '07-22 11:00',
        isFavorite: false
      }
    ],
    messages: [
      {
        id: 'dm_2',
        senderId: 'fanfiction_writer',
        senderName: '同人文写作专家',
        avatar: '🖋️',
        text: '雨声绵绵，今天想写一段在温暖书房里煮茶围炉的故事吗？',
        timestamp: '刚刚',
        isUser: false
      }
    ]
  }
];

export const DEFAULT_BOOKS: StudyBook[] = [
  {
    id: 'b_1',
    title: '《星露谷作物与土质学》',
    author: '学者艾文 著',
    coverColor: '#7C8455',
    progress: 75,
    lastRead: '昨天 21:00',
    summary: '记载了春季至秋季各种稀有作物的土壤酸碱度与光照时间匹配表。',
    notes: [
      '第 4 樟：火山灰土壤能显著增加薄荷油的提炼纯度。',
      '第 7 樟：黄金南瓜在满月之夜吸收月光效果最好。'
    ]
  },
  {
    id: 'b_2',
    title: '《古迹手写随笔集》',
    author: '梦境精灵 编',
    coverColor: '#6B588C',
    progress: 40,
    lastRead: '3 天前',
    summary: '汇集了家园书房中历代伙伴留下的暖心文字与诗篇。',
    notes: [
      '“风吹过树梢的声音，就是森林给家园的情书。”'
    ]
  }
];

export const DEFAULT_HISTORY_SESSIONS: HistorySession[] = [
  {
    id: 'hs_1',
    type: 'single',
    agentId: 'openclaw',
    title: '与 OpenClaw 讨论云端自动化备份',
    lastTimestamp: '14:03'
  },
  {
    id: 'hs_2',
    type: 'single',
    agentId: 'agent_evan',
    title: '关于火山薄荷种子的培育研究',
    lastTimestamp: '昨天'
  }
];
