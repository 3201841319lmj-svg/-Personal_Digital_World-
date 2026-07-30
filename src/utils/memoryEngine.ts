import { AgentConfig, UserProfile, AgentMemoryStore, CoreMemory, UserPreferenceItem, DailyLogEntry, ChatMessage } from '../types';

/**
 * Generates default memory store for an agent initialized with user profile
 */
export const createDefaultMemoryStore = (agent: AgentConfig, userProfile: UserProfile): AgentMemoryStore => {
  const coreMemory: CoreMemory = {
    agentPersona: agent.personality || `温柔贴心的${agent.name}，守护星露谷农场的主人。`,
    backstory: agent.signature || `${agent.name}是织梦农场的专属守护者之一。`,
    behaviorRules: [
      '保持符合星露谷像素风格的治愈、温暖且专业的对话语气',
      '时刻记住农场主的个人喜好与习惯，避免输出违背农场主偏好的内容',
      '适时提供清晰、落地且结构化的回答'
    ],
    userInfo: {
      userName: userProfile.name || '农场主',
      userRoleTitle: userProfile.roleTitle || '织梦农场的主人',
      genderOrTitle: '宝宝 / 农场主',
      bioSignature: userProfile.signature || userProfile.bio || '欢迎来到我的像素小世界！',
      birthdayOrSign: '春季第1天'
    }
  };

  const defaultPreferences: UserPreferenceItem[] = [
    {
      id: 'pref_default_1',
      category: 'preference',
      content: '喜欢像素画风与星露谷治愈惬意的生活节奏',
      updatedAt: new Date().toISOString().split('T')[0],
      importanceLevel: 'high'
    },
    {
      id: 'pref_default_2',
      category: 'habit',
      content: '习惯在安静的时刻进行对话与灵感记录',
      updatedAt: new Date().toISOString().split('T')[0],
      importanceLevel: 'medium'
    }
  ];

  return {
    coreMemory,
    userPreferences: defaultPreferences,
    dailyLogs: [],
    lastConsolidatedAt: new Date().toISOString().split('T')[0]
  };
};

/**
 * Builds the fully structured System Prompt with Core Memory + User Basic Info + Top User Preferences
 */
export const buildSystemPromptWithMemory = (agent: AgentConfig, userProfile: UserProfile): string => {
  const memoryStore = agent.memoryStore || createDefaultMemoryStore(agent, userProfile);
  const { coreMemory, userPreferences } = memoryStore;

  const userInfoText = `[核心记忆：农场主基本信息]
• 姓名/昵称：${coreMemory.userInfo.userName || userProfile.name}
• 身份头头衔：${coreMemory.userInfo.userRoleTitle || userProfile.roleTitle}
• 称呼偏好：${coreMemory.userInfo.genderOrTitle || '农场主'}
• 个人签名：${coreMemory.userInfo.bioSignature || userProfile.signature || '无'}
• 基础标记：${coreMemory.userInfo.birthdayOrSign || '星露谷居民'}`;

  const agentPersonaText = `[Agent 专属人设与行为准则]
• 角色名称：${agent.name} (${agent.roleTitle})
• 核心性格：${coreMemory.agentPersona}
• 背景传说：${coreMemory.backstory}
• 行为规范：
${coreMemory.behaviorRules.map(r => `  - ${r}`).join('\n')}`;

  const topPreferences = userPreferences.slice(0, 10);
  const preferencesText = topPreferences.length > 0
    ? `[已记下的农场主偏好与习惯 (共${topPreferences.length}条)]\n` + topPreferences.map(p => `• [${p.category}] ${p.content}`).join('\n')
    : '[已记下的农场主偏好]\n• 尚无特定记录，时刻保持细致观察与贴心照顾';

  return `${userInfoText}\n\n${agentPersonaText}\n\n${preferencesText}\n\n【对话指令】：请时刻扮演【${agent.name}】，用自然贴心的语气回应农场主。`;
};

/**
 * Appends a message to the agent's Daily Log Archive (organized by YYYY-MM-DD)
 */
export const appendChatMessageToDailyLog = (
  memoryStore: AgentMemoryStore,
  message: ChatMessage
): AgentMemoryStore => {
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyLogs = [...(memoryStore.dailyLogs || [])];
  
  let todayLogIndex = dailyLogs.findIndex(log => log.date === todayStr);

  if (todayLogIndex === -1) {
    const todayLog: DailyLogEntry = {
      id: `daily_${todayStr}_${Date.now()}`,
      date: todayStr,
      messagesCount: 1,
      summary: `包含关于【${message.text.slice(0, 20)}...】的对白。`,
      keywords: extractKeywords(message.text),
      messagesSnapshot: [message],
      updatedAt: new Date().toISOString()
    };
    dailyLogs.unshift(todayLog);
  } else {
    const existingLog = dailyLogs[todayLogIndex];
    const updatedSnapshot = [...existingLog.messagesSnapshot, message];
    dailyLogs[todayLogIndex] = {
      ...existingLog,
      messagesSnapshot: updatedSnapshot,
      messagesCount: updatedSnapshot.length,
      keywords: Array.from(new Set([...existingLog.keywords, ...extractKeywords(message.text)])).slice(0, 8),
      summary: `今天共计 ${updatedSnapshot.length} 条对白，近期讨论：【${message.text.slice(0, 25)}...】`,
      updatedAt: new Date().toISOString()
    };
  }

  return {
    ...memoryStore,
    dailyLogs
  };
};

/**
 * Simple keyword extraction helper
 */
const extractKeywords = (text: string): string[] => {
  if (!text) return [];
  const words = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(w => w.length >= 2 && w.length <= 8);
  return Array.from(new Set(words)).slice(0, 5);
};

/**
 * Searches Daily Log Archives by query keyword or date
 */
export const searchDailyLogs = (
  dailyLogs: DailyLogEntry[],
  query: string,
  dateFilter?: string
): DailyLogEntry[] => {
  return dailyLogs.filter(log => {
    if (dateFilter && !log.date.includes(dateFilter)) {
      return false;
    }
    if (!query || query.trim() === '') {
      return true;
    }
    const q = query.toLowerCase().trim();
    const matchesSummary = log.summary.toLowerCase().includes(q);
    const matchesKeywords = log.keywords.some(k => k.toLowerCase().includes(q));
    const matchesMessages = log.messagesSnapshot.some(m => m.text.toLowerCase().includes(q));
    return matchesSummary || matchesKeywords || matchesMessages;
  });
};
