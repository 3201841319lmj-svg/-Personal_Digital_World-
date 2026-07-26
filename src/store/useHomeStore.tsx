import React, { createContext, useContext, useState } from 'react';
import { 
  DEFAULT_ARCHIVES, 
  DEFAULT_AGENTS, 
  INITIAL_CHAT_MESSAGES, 
  DEFAULT_LETTERS, 
  DEFAULT_BOOKS, 
  DEFAULT_USER_PROFILE,
  DEFAULT_HISTORY_SESSIONS,
  DEFAULT_GAZETTE_POSTS,
  INITIAL_TAROT_SESSION,
  DEFAULT_DIARY_ENTRIES,
  DEFAULT_DREAM_TOPICS
} from '../data/defaultData';
import { 
  HomeArchive, 
  AgentConfig, 
  ChatMessage, 
  MailLetter, 
  StudyBook, 
  UserProfile, 
  ThinkingDepthLevel,
  HistorySession,
  ArchivedAgent,
  GazettePost,
  GazetteComment,
  GazetteVisibilityMode,
  TarotSession,
  TarotCardItem,
  DiaryEntry,
  DreamTopic,
  DreamFolder,
  DreamFolder as DreamFolderType,
  DreamFavoriteFolder,
  DreamFavoriteItem,
  DreamChapter
} from '../types';
import { createAgentProvider } from '../services/agentProvider';
import { syncStoriesToTencentOpenClaw, OpenClawSyncResult } from '../services/openClawService';
import { drawThreeCards, buildTarotPureTextPrompt } from '../services/tarotService';

export type TabType = 'farm' | 'livingroom' | 'study' | 'bedroom';
export type ThemeType = 'parchment' | 'moss' | 'starry';

interface HomeContextType {
  // Theme Setup
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;

  // Navigation & Drawers
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  toggleHistory: () => void;
  historySessions: HistorySession[];

  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  isAgentModalOpen: boolean;
  setIsAgentModalOpen: (open: boolean) => void;

  // Living Room Search & Topic Drawer
  isLivingSearchOpen: boolean;
  setIsLivingSearchOpen: (open: boolean) => void;
  toggleLivingSearch: () => void;

  isLivingTopicDrawerOpen: boolean;
  setIsLivingTopicDrawerOpen: (open: boolean) => void;
  toggleLivingTopicDrawer: () => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;

  // Home Showcase Archive
  currentArchiveKey: string;
  setArchiveKey: (key: string) => void;
  currentArchive: HomeArchive;

  // Agent Management & Add/Delete/Restore
  agents: AgentConfig[];
  archivedAgents: ArchivedAgent[];
  addAgent: (newAgent: Omit<AgentConfig, 'id' | 'memoryDbId' | 'memoryItems'>) => void;
  deleteAgent: (agentId: string) => void;
  restoreAgent: (archivedId: string) => void;
  toggleAgentEnabled: (agentId: string) => void;
  updateAgentConfig: (agentId: string, updates: Partial<AgentConfig>) => void;
  resetAgentAvatar: (agentId: string) => void;

  // Chat & Thinking Depth
  chatMessages: ChatMessage[];
  sendMessage: (text: string, attachments?: any[]) => void;
  startNewChat: () => void;
  deleteChatMessage: (messageId: string) => void;
  editChatMessage: (messageId: string, newText: string) => void;
  regenerateChatMessage: (messageId: string) => void;
  clearLivingRoomChat: () => void;
  
  thinkingDepth: ThinkingDepthLevel;
  setThinkingDepth: (level: ThinkingDepthLevel) => void;

  // Mail (Study Tab 3: 信件)
  letters: MailLetter[];
  activeLetterId: string | null;
  setActiveLetterId: (id: string | null) => void;
  activeLetter: MailLetter | null;
  toggleStarLetter: (id: string) => void;
  markLetterRead: (id: string) => void;
  sendLetter: (title: string, content: string) => void;
  receiveRealtimeMail: () => void;
  replyMailWithNextDayDelay: (letterId: string, replyText: string) => void;
  deleteLetter: (letterId: string) => void;

  books: StudyBook[];

  // Gazette Posts (Study Tab 1: 剪报 / 朋友圈)
  gazettePosts: GazettePost[];
  refreshTodayGazette: () => void;
  createGazettePost: (caption: string, photoUrl?: string, visibility?: GazetteVisibilityMode, visibleAgentIds?: string[]) => void;
  replyGazetteComment: (postId: string, text: string, targetCommentId?: string, targetName?: string) => void;
  deleteGazetteComment: (postId: string, commentId: string) => void;
  deleteGazettePost: (postId: string) => void;

  // Oracle Tarot (Study Tab 2: 传讯 - 塔罗无限追问)
  tarotSession: TarotSession;
  startTarotDraw: (questionText: string) => void;
  interpretTarot: (selectedAgentId: string) => void;
  askTarotFollowup: (followupText: string) => void;
  clearTarotSession: () => void;

  // Bedside Diary (Study Tab 4: 心事)
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (userText: string, mode: 'instant' | 'overnight') => void;
  deleteDiaryEntry: (entryId: string) => void;

  // Dream Memory Pillow (Bedroom 直连织梦)
  dreamTopics: DreamTopic[];
  dreamFolders: DreamFolder[];
  activeTopicId: string;
  setActiveTopicId: (topicId: string) => void;
  createDreamTopic: (name: string, desc: string, folderId?: string) => void;
  sendDreamMessage: (topicId: string, text: string) => void;
  generateDreamChapter: (topicId: string, promptText: string) => Promise<void>;
  toggleFavoriteChapter: (topicId: string, chapterId: string) => void;
  updateChapterAnnotation: (topicId: string, chapterId: string, annotation: string) => void;
  createDreamFolder: (name: string) => void;
  deleteDreamFolder: (folderId: string) => void;
  moveTopicToFolder: (topicId: string, folderId?: string) => void;
  deleteDreamTopic: (topicId: string) => void;
  deleteDreamMessage: (topicId: string, messageId: string) => void;
  editDreamMessage: (topicId: string, messageId: string, newText: string) => void;
  regenerateDreamMessage: (topicId: string, messageId: string) => void;
  
  // 🌟 Favorite Message Collection System
  favoriteItems: DreamFavoriteItem[];
  favoriteFolders: DreamFavoriteFolder[];
  addFavoriteItem: (topicId: string, topicName: string, message: ChatMessage, favoriteFolderId?: string) => void;
  addBatchFavoriteItems: (topicId: string, topicName: string, messages: ChatMessage[], favoriteFolderId?: string) => void;
  deleteFavoriteItem: (id: string) => void;
  createFavoriteFolder: (name: string, parentId?: string) => void;
  deleteFavoriteFolder: (folderId: string) => void;
  moveFavoriteItemToFolder: (itemId: string, folderId?: string) => void;

  // OpenClaw Cloud Sync
  isSyncingOpenClaw: boolean;
  lastSyncResult: OpenClawSyncResult | null;
  syncStoriesToOpenClaw: () => Promise<OpenClawSyncResult>;
  syncSingleFolderToCloud: (folderId: string) => Promise<OpenClawSyncResult>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setTheme] = useState<ThemeType>('parchment');
  const [activeTab, setActiveTab] = useState<TabType>('farm');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const [isLivingSearchOpen, setIsLivingSearchOpen] = useState(false);
  const [isLivingTopicDrawerOpen, setIsLivingTopicDrawerOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [archives] = useState<Record<string, HomeArchive>>(DEFAULT_ARCHIVES);
  const [currentArchiveKey, setCurrentArchiveKey] = useState<string>('farm');

  const [agents, setAgents] = useState<AgentConfig[]>(DEFAULT_AGENTS);
  const [archivedAgents, setArchivedAgents] = useState<ArchivedAgent[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [thinkingDepth, setThinkingDepth] = useState<ThinkingDepthLevel>('normal');

  const [letters, setLetters] = useState<MailLetter[]>(DEFAULT_LETTERS);
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);

  const [books] = useState<StudyBook[]>(DEFAULT_BOOKS);
  const [historySessions] = useState<HistorySession[]>(DEFAULT_HISTORY_SESSIONS);

  // Study Gazette, Tarot & Diary State
  const [gazettePosts, setGazettePosts] = useState<GazettePost[]>(DEFAULT_GAZETTE_POSTS);
  const [tarotSession, setTarotSession] = useState<TarotSession>(INITIAL_TAROT_SESSION);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(DEFAULT_DIARY_ENTRIES);

  // Bedroom Dream Pillow State
  const [dreamTopics, setDreamTopics] = useState<DreamTopic[]>(DEFAULT_DREAM_TOPICS);
  const [dreamFolders, setDreamFolders] = useState<DreamFolder[]>([
    { id: 'folder_favorites', name: '⭐ 收藏故事集', createdAt: '2026-07-20' },
    { id: 'folder_daily', name: '🌿 日常随想录', createdAt: '2026-07-22' }
  ]);
  const [activeTopicId, setActiveTopicId] = useState<string>(DEFAULT_DREAM_TOPICS[0]?.topicId || 'topic_magic_academy');

  const createDreamFolder = (name: string) => {
    if (!name.trim()) return;
    const newFolder: DreamFolder = {
      id: `folder_${Date.now()}`,
      name: name.trim(),
      createdAt: new Date().toLocaleDateString()
    };
    setDreamFolders(prev => [...prev, newFolder]);
  };

  const deleteDreamFolder = (folderId: string) => {
    setDreamFolders(prev => prev.filter(f => f.id !== folderId));
    setDreamTopics(prev => prev.map(t => t.folderId === folderId ? { ...t, folderId: undefined } : t));
  };

  const moveTopicToFolder = (topicId: string, folderId?: string) => {
    setDreamTopics(prev => prev.map(t => t.topicId === topicId ? { ...t, folderId: folderId || undefined } : t));
  };

  const [isSyncingOpenClaw, setIsSyncingOpenClaw] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<OpenClawSyncResult | null>(null);

  const currentArchive = archives[currentArchiveKey] || archives.farm;
  const activeLetter = letters.find(l => l.id === activeLetterId) || null;

  const toggleHistory = () => setIsHistoryOpen(prev => !prev);
  const toggleLivingSearch = () => {
    setIsLivingSearchOpen(prev => !prev);
    setIsLivingTopicDrawerOpen(false);
  };
  const toggleLivingTopicDrawer = () => {
    setIsLivingTopicDrawerOpen(prev => !prev);
    setIsLivingSearchOpen(false);
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };

  const setArchiveKey = (key: string) => {
    if (archives[key]) {
      setCurrentArchiveKey(key);
    }
  };

  // Agent Management Logic
  const addAgent = (newAgentData: Omit<AgentConfig, 'id' | 'memoryDbId' | 'memoryItems'>) => {
    const newId = `agent_${Date.now()}`;
    const fullAgent: AgentConfig = {
      ...newAgentData,
      id: newId,
      memoryDbId: `mem_${newId}_db`,
      memoryItems: [`初始记忆库已在 OpenClaw 主控节点中建档生成。`]
    };
    setAgents(prev => [...prev, fullAgent]);
  };

  const deleteAgent = (agentId: string) => {
    const targetAgent = agents.find(a => a.id === agentId);
    if (!targetAgent) return;
    if (targetAgent.isMasterAgent) {
      alert(`${targetAgent.name} 为系统内置核心 Agent，受保护不可移除！`);
      return;
    }

    const archiveRecord: ArchivedAgent = {
      id: `archive_${Date.now()}`,
      agentConfig: { ...targetAgent, isEnabled: false },
      archivedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      archivedReason: '由农场主从管理列表中移除，记忆完整封存在腾讯云服务器。'
    };

    setArchivedAgents(prev => [archiveRecord, ...prev]);
    setAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const restoreAgent = (archivedId: string) => {
    const record = archivedAgents.find(a => a.id === archivedId);
    if (!record) return;

    setAgents(prev => [...prev, { ...record.agentConfig, isEnabled: true }]);
    setArchivedAgents(prev => prev.filter(a => a.id !== archivedId));
  };

  const toggleAgentEnabled = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, isEnabled: !a.isEnabled } : a));
  };

  const updateAgentConfig = (agentId: string, updates: Partial<AgentConfig>) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updates } : a));
  };

  const resetAgentAvatar = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? {
      ...a,
      avatarUrl: a.defaultAvatarUrl,
      isCustomAvatar: false
    } : a));
  };

  const startNewChat = () => {
    setChatMessages([
      {
        id: `m_${Date.now()}`,
        senderId: 'openclaw',
        senderName: 'OpenClaw',
        avatar: '🦞',
        text: '新话题已开启。请问农场主今天有什么指示？',
        timestamp: '刚刚',
        isUser: false
      }
    ]);
  };

  const sendMessage = (text: string, attachments: any[] = []) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'user',
      senderName: userProfile.name,
      senderSignature: userProfile.enableSignature ? userProfile.signature : undefined,
      avatar: userProfile.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      attachments,
      thinkingDepth
    };

    setChatMessages(prev => [...prev, userMsg]);

    const enabledAgents = agents.filter(a => a.isEnabled);
    if (enabledAgents.length > 0) {
      const activeAgent = enabledAgents[0];
      const provider = createAgentProvider(activeAgent.provider);
      const replyId = `reply_${Date.now()}`;

      const sampleThinkingSteps = [
        `✦ 解析农场主指令："${text.slice(0, 15)}..."`,
        `✦ 调阅 OpenClaw 云端记忆与《家园小语语料库》`,
        `✦ 关联历史上下文与多 Agent 协同思考`
      ];

      const initialAgentReply: ChatMessage = {
        id: replyId,
        senderId: activeAgent.id,
        senderName: activeAgent.name,
        senderSignature: activeAgent.signature,
        avatar: activeAgent.avatarUrl,
        text: '...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        thinkingProcess: sampleThinkingSteps,
        isThinkingDone: false,
        thinkingDuration: '计算中...'
      };

      setChatMessages(prev => [...prev, initialAgentReply]);

      setTimeout(async () => {
        try {
          const responseText = await provider.sendMessage(activeAgent, text, chatMessages);
          setChatMessages(prev => prev.map(m => m.id === replyId ? {
            ...m,
            text: responseText,
            isThinkingDone: true,
            thinkingDuration: '1.2s'
          } : m));
        } catch (e) {
          console.error(e);
        }
      }, 1200);
    }
  };

  // Study Tab 3: Mail Actions
  const toggleStarLetter = (id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, isStarred: !l.isStarred } : l));
  };

  const markLetterRead = (id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l));
  };

  const sendLetter = (title: string, content: string) => {
    const newLetter: MailLetter = {
      id: `sent_${Date.now()}`,
      senderId: 'user',
      senderName: userProfile.name,
      avatar: userProfile.avatar,
      title: title || '寄给庄园伙伴的心意信件',
      date: '今日',
      category: 'farm',
      isRead: true,
      isStarred: false,
      content
    };
    setLetters(prev => [newLetter, ...prev]);
  };

  const receiveRealtimeMail = () => {
    const randomAgents = agents.filter(a => !a.isMasterAgent || a.id === 'openclaw');
    const author = randomAgents[Math.floor(Math.random() * randomAgents.length)] || agents[0];
    
    const mailTemplates = [
      '今天在湖边采到了野生的甜瓜，听说您最喜欢做水果甜点，特意为您留了一份！',
      '昨晚在书房整理古籍，发现了关于黄金南瓜的有趣记载，随信附上摘要。',
      '庄园的前院风很暖，作物长势非常好，祝您今天心情愉快！'
    ];
    const template = mailTemplates[Math.floor(Math.random() * mailTemplates.length)];

    const newRealtimeMail: MailLetter = {
      id: `realmail_${Date.now()}`,
      senderId: author.id,
      senderName: author.name,
      avatar: author.avatarUrl,
      title: `来自 ${author.name} 的问候信件`,
      date: '刚刚',
      category: 'agent',
      isRead: false,
      isStarred: false,
      bannerImage: '/assets/cozy_study.jpg',
      content: template
    };
    setLetters(prev => [newRealtimeMail, ...prev]);
  };

  const replyMailWithNextDayDelay = (letterId: string, replyText: string) => {
    if (!replyText.trim()) return;

    // Add immediate user reply note into mail content
    setLetters(prev => prev.map(l => {
      if (l.id === letterId) {
        return {
          ...l,
          content: `${l.content}\n\n[农场主回信 (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})]: ${replyText}`
        };
      }
      return l;
    }));

    // Generate AI secondary reply marked with next-day unlock mechanism
    setTimeout(() => {
      const lockedMail: MailLetter = {
        id: `locked_reply_${Date.now()}`,
        senderId: 'agent_evan',
        senderName: '学者艾文',
        avatar: '📚',
        title: '回复：农场主的心意信件 (邮寄中)',
        date: '次日解封',
        category: 'agent',
        isRead: false,
        isStarred: false,
        content: '（信件正在跨越夜色邮寄中，将于明日自然日清晨拆封呈现给农场主...）',
        availableAt: '明日清晨 06:00',
        isLockedUntilNextDay: true
      };
      setLetters(prev => [lockedMail, ...prev]);
    }, 1000);
  };

  // Study Tab 1: Gazette Actions (Infinite Reply Loop)
  const refreshTodayGazette = () => {
    const randomAgents = agents.filter(a => a.isEnabled);
    const author = randomAgents[Math.floor(Math.random() * randomAgents.length)] || agents[0];
    const commenter = randomAgents.find(a => a.id !== author.id) || agents[1] || agents[0];

    const sampleCaptions = [
      '今天早晨在前院帮忙清理杂草，阳光洒在麦田上特别金黄！🌾',
      '试着用新发酵的面团烤了羊角面包，微风吹过来都是黄油的香气！🥐',
      '在书房里熬夜整理古籍，读到了关于星露谷四季传说的古老故事 📖✨',
      '刚刚在餐厅煮了一壶特调洋甘菊茶，等待农场主干完活一起来喝茶！☕'
    ];

    const newPost1: GazettePost = {
      id: `post_ref_${Date.now()}_1`,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatarUrl,
      seasonDate: '今日快讯',
      photoUrl: '/assets/farm_spring.jpg',
      caption: sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)],
      comments: [
        {
          id: `c_init_1`,
          senderType: 'ai',
          senderId: commenter.id,
          senderName: commenter.name,
          senderAvatar: commenter.avatarUrl,
          text: '今天辛苦啦！等会我也要过去尝尝~',
          timestamp: '刚刚'
        }
      ]
    };

    const newPost2: GazettePost = {
      id: `post_ref_${Date.now()}_2`,
      authorId: commenter.id,
      authorName: commenter.name,
      authorAvatar: commenter.avatarUrl,
      seasonDate: '今日快讯',
      caption: '夜色渐深，庄园里的空气带着泥土与微风的清香。愿大家今晚都有一个好梦 🌙（纯文本生活动态）',
      comments: [
        {
          id: `c_init_2`,
          senderType: 'ai',
          senderId: author.id,
          senderName: author.name,
          senderAvatar: author.avatarUrl,
          text: '晚安！明天早上记得一起去采蔬菜。',
          timestamp: '刚刚'
        }
      ]
    };

    setGazettePosts([newPost1, newPost2, ...gazettePosts]);
  };

  const createGazettePost = (
    caption: string, 
    photoUrl?: string, 
    visibility: GazetteVisibilityMode = 'public', 
    visibleAgentIds: string[] = []
  ) => {
    if (!caption.trim() && !photoUrl) return;

    const newPostId = `post_${Date.now()}`;
    const newPost: GazettePost = {
      id: newPostId,
      authorId: userProfile.id,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      seasonDate: `${new Date().toLocaleDateString()} 朋友圈`,
      photoUrl,
      caption,
      visibility,
      visibleAgentIds,
      comments: []
    };

    setGazettePosts(prev => [newPost, ...prev]);

    // Private posts receive no AI replies
    if (visibility === 'private') return;

    // Filter available agents according to visibility
    const candidateAgents = agents.filter(a => {
      if (!a.isEnabled) return false;
      if (visibility === 'selected') {
        return visibleAgentIds.includes(a.id);
      }
      return true;
    });

    if (candidateAgents.length === 0) return;

    // Pick 3 random agents (or all if < 3)
    const shuffled = [...candidateAgents].sort(() => 0.5 - Math.random());
    const selectedThree = shuffled.slice(0, 3);

    selectedThree.forEach((agent, idx) => {
      setTimeout(() => {
        const commentOptions = [
          `哇！太棒啦！看农场主发朋友圈真治愈～ "${caption.slice(0, 10)}..."`,
          `前排留个爪印 🐾 庄园生活越来越有仪式感了！`,
          `赞！期待下次和你一起在庄园散步聚会！`,
          `写得真好！看记录觉得今天也是充实美好的阳光日☀️`
        ];
        const text = commentOptions[Math.floor(Math.random() * commentOptions.length)];

        const aiComment: GazetteComment = {
          id: `ai_init_${Date.now()}_${agent.id}`,
          senderType: 'ai',
          senderId: agent.id,
          senderName: agent.name,
          senderAvatar: agent.avatarUrl,
          text,
          timestamp: '刚刚'
        };

        setGazettePosts(prev => prev.map(p => {
          if (p.id === newPostId) {
            return {
              ...p,
              comments: [...p.comments, aiComment]
            };
          }
          return p;
        }));
      }, (idx + 1) * 700);
    });
  };

  const deleteGazettePost = (postId: string) => {
    setGazettePosts(prev => prev.filter(p => p.id !== postId));
  };

  const replyGazetteComment = (postId: string, userText: string, targetCommentId?: string, targetName?: string) => {
    if (!userText.trim()) return;

    const userCommentId = `uc_${Date.now()}`;
    const userComment: GazetteComment = {
      id: userCommentId,
      senderType: 'user',
      senderId: userProfile.id,
      senderName: userProfile.name,
      senderAvatar: userProfile.avatar,
      replyToCommentId: targetCommentId,
      replyToName: targetName,
      text: userText,
      timestamp: '刚刚'
    };

    setGazettePosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, userComment]
        };
      }
      return p;
    }));

    // Trigger AI response loop: 1) Target comment author (or post author) replies to user + 2) random other agent replies to primary agent
    setTimeout(() => {
      setGazettePosts(prev => {
        const currentPost = prev.find(p => p.id === postId);
        if (!currentPost || currentPost.visibility === 'private') return prev;

        const candidateAgents = agents.filter(a => {
          if (!a.isEnabled) return false;
          if (currentPost.visibility === 'selected') {
            return (currentPost.visibleAgentIds || []).includes(a.id);
          }
          return true;
        });

        if (candidateAgents.length === 0) return prev;

        let primaryAgent = candidateAgents[0];
        if (targetCommentId) {
          const targetComment = currentPost.comments.find(c => c.id === targetCommentId);
          if (targetComment && targetComment.senderType === 'ai') {
            const found = candidateAgents.find(a => a.id === targetComment.senderId);
            if (found) primaryAgent = found;
          }
        } else if (currentPost.authorId !== 'user') {
          const found = candidateAgents.find(a => a.id === currentPost.authorId);
          if (found) primaryAgent = found;
        }

        const otherCandidates = candidateAgents.filter(a => a.id !== primaryAgent.id);
        const secondaryAgent = otherCandidates.length > 0
          ? otherCandidates[Math.floor(Math.random() * otherCandidates.length)]
          : primaryAgent;

        const primaryReplyId = `ai_r1_${Date.now()}`;
        const primaryReply: GazetteComment = {
          id: primaryReplyId,
          senderType: 'ai',
          senderId: primaryAgent.id,
          senderName: primaryAgent.name,
          senderAvatar: primaryAgent.avatarUrl,
          replyToCommentId: userCommentId,
          replyToName: userProfile.name,
          text: `对“${userText.slice(0, 10)}…”很同感呢！你说的每一个细节我都记下了 ✨`,
          timestamp: '刚刚'
        };

        const updatedComments = [...currentPost.comments, primaryReply];

        if (secondaryAgent && secondaryAgent.id !== primaryAgent.id) {
          const secondaryReply: GazetteComment = {
            id: `ai_r2_${Date.now() + 1}`,
            senderType: 'ai',
            senderId: secondaryAgent.id,
            senderName: secondaryAgent.name,
            senderAvatar: secondaryAgent.avatarUrl,
            replyToCommentId: primaryReplyId,
            replyToName: primaryAgent.name,
            text: `我也赞同 ${primaryAgent.name} 的看法！看你们聊得好热闹，忍不住也插一句 🌿`,
            timestamp: '刚刚'
          };
          updatedComments.push(secondaryReply);
        }

        return prev.map(p => p.id === postId ? { ...p, comments: updatedComments } : p);
      });
    }, 1000);
  };

  // Study Tab 2: Oracle Tarot Actions
  const startTarotDraw = (questionText: string) => {
    if (!questionText.trim()) {
      alert('请先在输入框中写下您想向塔罗牌咨询的问题！');
      return;
    }

    const pickedCards = drawThreeCards();

    setTarotSession({
      question: questionText,
      cards: pickedCards,
      selectedAgentId: 'agent_dream',
      isDrawn: true,
      chatStream: []
    });
  };

  const interpretTarot = async (selectedAgentId: string) => {
    if (!tarotSession.isDrawn || tarotSession.cards.length === 0) return;
    const targetAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

    // ⚡ Reset previous stream state to prevent token bleed across AI partners
    setTarotSession(prev => ({ ...prev, selectedAgentId, chatStream: [] }));

    // Pure text Prompt (No image URLs or Base64 sent to AI)
    const pureTextPrompt = buildTarotPureTextPrompt(tarotSession.question, tarotSession.cards, targetAgent.name);

    const cardSummary = tarotSession.cards.map(c => `${c.positionName} ${c.name} (${c.isReversed ? '逆位' : '正位'})`).join('\n');
    const interpretationText = `【${targetAgent.name} 魔法牌面解读】\n` +
      `农场主的问题：“${tarotSession.question}”\n\n` +
      `🔮 抽中的三张像素伟特塔罗牌：\n${cardSummary}\n\n` +
      `✨ 解读建议：\n` +
      `“第一张 ${tarotSession.cards[0]?.name || ''} 提示您当前的能量在于积蓄与扎根；第二张 ${tarotSession.cards[1]?.name || ''} （${tarotSession.cards[1]?.isReversed ? '逆位' : '正位'}）象征着内心的审视；而第三张 ${tarotSession.cards[2]?.name || ''} 则带来温暖的希望。顺应庄园自然的节奏，万物都在静静萌芽！”`;

    const aiMsg: ChatMessage = {
      id: `tarot_interpret_${Date.now()}`,
      senderId: targetAgent.id,
      senderName: targetAgent.name,
      avatar: targetAgent.avatarUrl,
      text: interpretationText,
      timestamp: '刚刚',
      isUser: false
    };

    setTarotSession(prev => ({
      ...prev,
      selectedAgentId,
      chatStream: [aiMsg]
    }));
  };

  const askTarotFollowup = (followupText: string) => {
    if (!followupText.trim()) return;

    const userMsg: ChatMessage = {
      id: `tf_user_${Date.now()}`,
      senderId: 'user',
      senderName: userProfile.name,
      avatar: userProfile.avatar,
      text: followupText,
      timestamp: '刚刚',
      isUser: true
    };

    setTarotSession(prev => ({
      ...prev,
      chatStream: [...prev.chatStream, userMsg]
    }));

    // AI Infinite Followup Response
    setTimeout(() => {
      const targetAgent = agents.find(a => a.id === tarotSession.selectedAgentId) || agents[0];
      const aiReply: ChatMessage = {
        id: `tf_ai_${Date.now()}`,
        senderId: targetAgent.id,
        senderName: targetAgent.name,
        avatar: targetAgent.avatarUrl,
        text: `关于追问“${followupText}”，结合 ${tarotSession.cards[0]?.name || '牌面'} 的能量看，这代表着内在信念的升华。农场主大可勇敢前行！`,
        timestamp: '刚刚',
        isUser: false
      };

      setTarotSession(prev => ({
        ...prev,
        chatStream: [...prev.chatStream, aiReply]
      }));
    }, 1000);
  };

  const clearTarotSession = () => {
    setTarotSession(INITIAL_TAROT_SESSION);
  };

  // Study Tab 4: Bedside Diary Actions
  const addDiaryEntry = (userText: string, mode: 'instant' | 'overnight') => {
    if (!userText.trim()) return;

    const stickers = ['🍵', '🩹', '✨', '☕', '🥐', '🧸', '🌸'];
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];

    const replies = [
      '辛苦啦农场主！看到你吐露心事，我也感觉心头一暖呢。今晚喝杯温暖的花草茶，好好睡一觉吧 ☕✨',
      '今天发生的一切都不是你的错哦，抱抱你！明天又是充满希望与阳光的一天 🌸',
      '在小家里的每一刻都有伙伴们陪伴着你，好好照顾自己，晚安小词章 🧸'
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const newEntry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      timestamp: `${new Date().toLocaleDateString()} 夜晚`,
      userContent: userText,
      aiResponse: mode === 'instant' ? randomReply : '（正在为你预留隔夜倾听，明早打开书本即可看到回复...）',
      moodSticker: randomSticker,
      mode,
      isRead: mode === 'instant'
    };

    setDiaryEntries(prev => [newEntry, ...prev]);
  };

  // Bedroom Dream Pillow Stream Actions
  const createDreamTopic = (name: string, desc: string) => {
    if (!name.trim()) return;
    const newTopicId = `topic_${Date.now()}`;
    const newTopic: DreamTopic = {
      topicId: newTopicId,
      topicName: name,
      description: desc || '自定义同人文同居与冒险话题线。',
      attachments: ['User_Custom_Rules.txt'],
      chapters: [],
      messages: [
        {
          id: `dm_${Date.now()}`,
          senderId: 'fanfiction_writer',
          senderName: '同人文写作专家',
          avatar: '🖋️',
          text: `开启新话题《${name}》！随时向我输入创作提示与对话走向。`,
          timestamp: '刚刚',
          isUser: false
        }
      ]
    };
    setDreamTopics(prev => [...prev, newTopic]);
    setActiveTopicId(newTopicId);
  };

  const sendDreamMessage = (topicId: string, text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `dm_u_${Date.now()}`,
      senderId: 'user',
      senderName: userProfile.name,
      avatar: userProfile.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        return {
          ...t,
          messages: [...(t.messages || []), userMsg]
        };
      }
      return t;
    }));

    // AI Stream reply simulation
    setTimeout(() => {
      const aiReplyText = `“${text}”在你的叙述中徐徐展开。伴随着午后的缕缕阳光，窗外的桦树叶在微风中轻轻摇曳。这一段美妙的情节已经被记录在了织梦工坊的草稿库中……`;

      const aiMsg: ChatMessage = {
        id: `dm_ai_${Date.now()}`,
        senderId: 'fanfiction_writer',
        senderName: '同人文写作专家',
        avatar: '🖋️',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };

      setDreamTopics(prev => prev.map(t => {
        if (t.topicId === topicId) {
          return {
            ...t,
            messages: [...(t.messages || []), aiMsg]
          };
        }
        return t;
      }));
    }, 1000);
  };

  const generateDreamChapter = async (topicId: string, promptText: string) => {
    const simulatedStoryContent = `午后的阳光落入书桌，茶杯泛起微热的气泡。“${promptText || '关于这个午后的故事'}”在笔尖渐渐清晰……两个人并肩坐在长椅上，听着微风吹过桦树叶的沙沙声。这不仅是一场偶然的邂逅，更是家园岁月里最温柔的留白。`;

    const newChapter: DreamChapter = {
      chapterId: `chap_${Date.now()}`,
      title: `第 ${Date.now().toString().slice(-4)} 章：${promptText.slice(0, 10) || '绮丽梦境'}`,
      content: simulatedStoryContent,
      createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFavorite: false
    };

    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        return {
          ...t,
          chapters: [newChapter, ...t.chapters]
        };
      }
      return t;
    }));
  };

  const toggleFavoriteChapter = (topicId: string, chapterId: string) => {
    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        return {
          ...t,
          chapters: t.chapters.map(c => c.chapterId === chapterId ? { ...c, isFavorite: !c.isFavorite } : c)
        };
      }
      return t;
    }));
  };

  const updateChapterAnnotation = (topicId: string, chapterId: string, annotation: string) => {
    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        return {
          ...t,
          chapters: t.chapters.map(c => c.chapterId === chapterId ? { ...c, userAnnotation: annotation } : c)
        };
      }
      return t;
    }));
  };

  const deleteChatMessage = (messageId: string) => {
    setChatMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const clearLivingRoomChat = () => {
    setChatMessages([]);
  };

  const deleteLetter = (letterId: string) => {
    setLetters(prev => prev.filter(l => l.id !== letterId));
    if (activeLetterId === letterId) {
      setActiveLetterId(null);
    }
  };

  const deleteDiaryEntry = (entryId: string) => {
    setDiaryEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const deleteGazetteComment = (postId: string, commentId: string) => {
    setGazettePosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.filter(c => c.id !== commentId)
        };
      }
      return p;
    }));
  };

  const deleteDreamTopic = (topicId: string) => {
    setDreamTopics(prev => {
      const filtered = prev.filter(t => t.topicId !== topicId);
      if (activeTopicId === topicId && filtered.length > 0) {
        setActiveTopicId(filtered[0].topicId);
      }
      return filtered;
    });
  };

  const deleteDreamMessage = (topicId: string, messageId: string) => {
    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        return {
          ...t,
          messages: (t.messages || []).filter(m => m.id !== messageId)
        };
      }
      return t;
    }));
  };

  const editChatMessage = (messageId: string, newText: string) => {
    setChatMessages(prev => prev.map(m => m.id === messageId ? { ...m, text: newText } : m));
  };

  const regenerateChatMessage = (messageId: string) => {
    const targetIndex = chatMessages.findIndex(m => m.id === messageId);
    if (targetIndex === -1) return;
    const targetMsg = chatMessages[targetIndex];

    let promptText = targetMsg.text;
    if (!targetMsg.isUser && targetIndex > 0) {
      const prevUserMsg = chatMessages.slice(0, targetIndex).reverse().find(m => m.isUser);
      if (prevUserMsg) promptText = prevUserMsg.text;
    }

    const activeAgents = agents.filter(a => a.isEnabled && a.id !== 'fanfiction_writer');
    if (activeAgents.length === 0) return;
    const targetAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];

    const aiMsgId = !targetMsg.isUser ? targetMsg.id : `msg_regen_${Date.now()}`;
    const newAiMsg: ChatMessage = {
      id: aiMsgId,
      senderId: targetAgent.id,
      senderName: targetAgent.name,
      avatar: targetAgent.avatarUrl,
      text: `重新为您构思关于“${promptText.slice(0, 15)}…”的回复：庄园的清风送来花香，伙伴们正围坐在篝火旁，倾听着您的新想法 ✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false,
      thinkingProcess: [
        '✦ 重新解析农场主指令脉络',
        '✦ 重塑 Agent 角色口吻与语调',
        '✦ 结合最新上下文生成新回复'
      ]
    };

    if (!targetMsg.isUser) {
      setChatMessages(prev => prev.map(m => m.id === messageId ? newAiMsg : m));
    } else {
      setChatMessages(prev => [...prev.slice(0, targetIndex + 1), newAiMsg, ...prev.slice(targetIndex + 1)]);
    }
  };

  const editDreamMessage = (topicId: string, messageId: string, newText: string) => {
    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        return {
          ...t,
          messages: (t.messages || []).map(m => m.id === messageId ? { ...m, text: newText } : m)
        };
      }
      return t;
    }));
  };

  const regenerateDreamMessage = (topicId: string, messageId: string) => {
    const topic = dreamTopics.find(t => t.topicId === topicId);
    if (!topic) return;
    const msgs = topic.messages || [];
    const targetIndex = msgs.findIndex(m => m.id === messageId);
    if (targetIndex === -1) return;
    const targetMsg = msgs[targetIndex];

    let promptText = targetMsg.text;
    if (!targetMsg.isUser && targetIndex > 0) {
      const prevUserMsg = msgs.slice(0, targetIndex).reverse().find(m => m.isUser);
      if (prevUserMsg) promptText = prevUserMsg.text;
    }

    const newReplyText = `“${promptText}”在灵感交织中被重新叙述。风过树梢，桦叶沙沙做响。这一段美妙的情节已被重新更新至织梦故事流中……`;
    const aiMsgId = !targetMsg.isUser ? targetMsg.id : `dm_ai_regen_${Date.now()}`;

    const newAiMsg: ChatMessage = {
      id: aiMsgId,
      senderId: 'fanfiction_writer',
      senderName: '同人文写作专家',
      avatar: '🖋️',
      text: newReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false
    };

    setDreamTopics(prev => prev.map(t => {
      if (t.topicId === topicId) {
        const curMsgs = t.messages || [];
        if (!targetMsg.isUser) {
          return {
            ...t,
            messages: curMsgs.map(m => m.id === messageId ? newAiMsg : m)
          };
        } else {
          return {
            ...t,
            messages: [...curMsgs.slice(0, targetIndex + 1), newAiMsg, ...curMsgs.slice(targetIndex + 1)]
          };
        }
      }
      return t;
    }));
  };

  const [favoriteItems, setFavoriteItems] = useState<DreamFavoriteItem[]>([]);
  const [favoriteFolders, setFavoriteFolders] = useState<DreamFavoriteFolder[]>([
    { id: 'fav_f_1', name: '⭐ 绝妙金句与经典对话', createdAt: '2026-07-26' },
    { id: 'fav_f_2', name: '浪漫名场面', parentId: 'fav_f_1', createdAt: '2026-07-26' }
  ]);

  const addFavoriteItem = (topicId: string, topicName: string, message: ChatMessage, favoriteFolderId?: string) => {
    const newItem: DreamFavoriteItem = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      topicId,
      topicName,
      messageId: message.id,
      text: message.text,
      senderName: message.senderName,
      avatar: message.avatar || '🖋️',
      timestamp: message.timestamp,
      favoriteFolderId,
      createdAt: new Date().toLocaleDateString()
    };
    setFavoriteItems(prev => [newItem, ...prev]);
  };

  const addBatchFavoriteItems = (topicId: string, topicName: string, messages: ChatMessage[], favoriteFolderId?: string) => {
    const newItems: DreamFavoriteItem[] = messages.map((msg, idx) => ({
      id: `fav_batch_${Date.now()}_${idx}`,
      topicId,
      topicName,
      messageId: msg.id,
      text: msg.text,
      senderName: msg.senderName,
      avatar: msg.avatar || '🖋️',
      timestamp: msg.timestamp,
      favoriteFolderId,
      createdAt: new Date().toLocaleDateString()
    }));
    setFavoriteItems(prev => [...newItems, ...prev]);
  };

  const deleteFavoriteItem = (id: string) => {
    setFavoriteItems(prev => prev.filter(item => item.id !== id));
  };

  const createFavoriteFolder = (name: string, parentId?: string) => {
    const newFolder: DreamFavoriteFolder = {
      id: `fav_folder_${Date.now()}`,
      name,
      parentId,
      createdAt: new Date().toLocaleDateString()
    };
    setFavoriteFolders(prev => [...prev, newFolder]);
  };

  const deleteFavoriteFolder = (folderId: string) => {
    setFavoriteFolders(prev => prev.filter(f => f.id !== folderId && f.parentId !== folderId));
    setFavoriteItems(prev => prev.map(item => item.favoriteFolderId === folderId ? { ...item, favoriteFolderId: undefined } : item));
  };

  const moveFavoriteItemToFolder = (itemId: string, folderId?: string) => {
    setFavoriteItems(prev => prev.map(item => item.id === itemId ? { ...item, favoriteFolderId: folderId } : item));
  };

  const syncStoriesToOpenClaw = async (): Promise<OpenClawSyncResult> => {
    setIsSyncingOpenClaw(true);
    try {
      const res = await syncStoriesToTencentOpenClaw(dreamTopics);
      setLastSyncResult(res);
      setIsSyncingOpenClaw(false);
      return res;
    } catch (e) {
      setIsSyncingOpenClaw(false);
      throw e;
    }
  };

  const syncSingleFolderToCloud = async (folderId: string): Promise<OpenClawSyncResult> => {
    setIsSyncingOpenClaw(true);
    try {
      const folderTopics = dreamTopics.filter(t => t.folderId === folderId);
      const res = await syncStoriesToTencentOpenClaw(folderTopics.length > 0 ? folderTopics : dreamTopics);
      setLastSyncResult(res);
      setIsSyncingOpenClaw(false);
      return res;
    } catch (e) {
      setIsSyncingOpenClaw(false);
      throw e;
    }
  };

  return (
    <HomeContext.Provider value={{
      currentTheme,
      setTheme,
      activeTab,
      setActiveTab,
      isHistoryOpen,
      setIsHistoryOpen,
      toggleHistory,
      historySessions,
      isSettingsOpen,
      setIsSettingsOpen,
      isAgentModalOpen,
      setIsAgentModalOpen,
      isLivingSearchOpen,
      setIsLivingSearchOpen,
      toggleLivingSearch,
      isLivingTopicDrawerOpen,
      setIsLivingTopicDrawerOpen,
      toggleLivingTopicDrawer,
      userProfile,
      updateUserProfile,
      currentArchiveKey,
      setArchiveKey,
      currentArchive,
      agents,
      archivedAgents,
      addAgent,
      deleteAgent,
      restoreAgent,
      toggleAgentEnabled,
      updateAgentConfig,
      resetAgentAvatar,
      chatMessages,
      sendMessage,
      startNewChat,
      deleteChatMessage,
      editChatMessage,
      regenerateChatMessage,
      clearLivingRoomChat,
      thinkingDepth,
      setThinkingDepth,
      letters,
      activeLetterId,
      setActiveLetterId,
      activeLetter,
      toggleStarLetter,
      markLetterRead,
      sendLetter,
      receiveRealtimeMail,
      replyMailWithNextDayDelay,
      deleteLetter,
      books,
      gazettePosts,
      refreshTodayGazette,
      createGazettePost,
      replyGazetteComment,
      deleteGazetteComment,
      deleteGazettePost,
      tarotSession,
      startTarotDraw,
      interpretTarot,
      askTarotFollowup,
      clearTarotSession,
      diaryEntries,
      addDiaryEntry,
      deleteDiaryEntry,
      dreamTopics,
      dreamFolders,
      activeTopicId,
      setActiveTopicId,
      createDreamTopic,
      sendDreamMessage,
      generateDreamChapter,
      toggleFavoriteChapter,
      updateChapterAnnotation,
      createDreamFolder,
      deleteDreamFolder,
      moveTopicToFolder,
      deleteDreamTopic,
      deleteDreamMessage,
      editDreamMessage,
      regenerateDreamMessage,
      favoriteItems,
      favoriteFolders,
      addFavoriteItem,
      addBatchFavoriteItems,
      deleteFavoriteItem,
      createFavoriteFolder,
      deleteFavoriteFolder,
      moveFavoriteItemToFolder,
      isSyncingOpenClaw,
      lastSyncResult,
      syncStoriesToOpenClaw,
      syncSingleFolderToCloud
    }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeStore = () => {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHomeStore must be used within HomeProvider');
  return ctx;
};
