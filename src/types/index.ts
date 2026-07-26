export type SceneType = 'farm' | 'magic' | 'study' | 'restaurant' | 'library';
export type ProviderType = 'openclaw' | 'openai' | 'gemini' | 'claude' | 'deepseek' | 'custom';
export type ThinkingDepthLevel = 'off' | 'normal' | 'deep' | 'ultra';
export type TimePeriod = 'morning' | 'afternoon' | 'night';

export interface ActionItemStatus {
  actionIcon: string;
  actionText: string;
  itemIcon: string;
  itemText: string;
}

export interface CompactHarvestStat {
  id: string;
  icon: string;
  name: string;
  count: string;
}

export interface SceneTimeImages {
  morning: string;
  afternoon: string;
  night: string;
}

export interface HomeArchive {
  id: string;
  sceneType: SceneType;
  displayName: string;
  timeImages: SceneTimeImages;
  compactStats: CompactHarvestStat[];
  companion?: string;
  companionSpeech?: string;
  currentStatus: ActionItemStatus;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  avatar: string;
  name: string;
  roleTitle: string;
  bio: string;
  signature: string;
  enableSignature: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  roleTitle: string;
  personality: string;
  signature?: string;
  systemPrompt?: string;
  avatarUrl: string;
  defaultAvatarUrl: string;
  isCustomAvatar: boolean;
  isMasterAgent?: boolean;
  
  provider: ProviderType;
  apiKey: string;
  baseUrl: string;
  modelId: string;
  isEnabled: boolean;
  
  memoryDbId: string;
  memoryItems: string[];
}

export interface ArchivedAgent {
  id: string;
  agentConfig: AgentConfig;
  archivedAt: string;
  archivedReason: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'file';
  size?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderSignature?: string;
  avatar: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  attachments?: AttachmentItem[];
  thinkingDepth?: ThinkingDepthLevel;
  
  // AI Thinking Process Properties
  thinkingProcess?: string[];
  isThinkingDone?: boolean;
  thinkingDuration?: string;
}

export interface MailLetter {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  title: string;
  date: string;
  category: 'all' | 'agent' | 'system' | 'farm' | 'starred';
  isRead: boolean;
  isStarred: boolean;
  bannerImage?: string;
  content: string;
  giftItem?: {
    icon: string;
    name: string;
  };
  availableAt?: string;
  isLockedUntilNextDay?: boolean;
}

export interface GazetteComment {
  id: string;
  senderType: 'user' | 'ai';
  senderId: string;
  senderName: string;
  senderAvatar: string;
  replyToCommentId?: string;
  replyToName?: string;
  text: string;
  timestamp: string;
}

export type GazetteVisibilityMode = 'public' | 'selected' | 'private';

export interface GazettePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  seasonDate: string;
  photoUrl?: string; // Optional photo
  caption: string;
  visibility?: GazetteVisibilityMode;
  visibleAgentIds?: string[];
  comments: GazetteComment[];
}

export interface TarotCardItem {
  id: number;
  name: string;
  positionName: string;
  imagePath: string;
  isReversed: boolean;
}

export interface TarotSession {
  question: string;
  cards: TarotCardItem[];
  selectedAgentId: string;
  isDrawn: boolean;
  chatStream: ChatMessage[];
}

export interface DiaryEntry {
  id: string;
  timestamp: string;
  userContent: string;
  aiResponse: string;
  moodSticker: string;
  mode: 'instant' | 'overnight';
  isRead: boolean;
}

export interface DreamChapter {
  chapterId: string;
  title: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
  userAnnotation?: string;
}

export interface DreamFolder {
  id: string;
  name: string;
  createdAt: string;
}

export interface DreamFavoriteFolder {
  id: string;
  name: string;
  parentId?: string; // Supports level-2 nesting!
  createdAt: string;
}

export interface DreamFavoriteItem {
  id: string;
  topicId: string;
  topicName: string;
  messageId: string;
  text: string;
  senderName: string;
  avatar: string;
  timestamp: string;
  favoriteFolderId?: string; // Sub-folder inside Favorite system
  createdAt: string;
}

export interface DreamTopic {
  topicId: string;
  topicName: string;
  description: string;
  folderId?: string;
  attachments: string[];
  chapters: DreamChapter[];
  messages?: ChatMessage[];
}

export interface HistorySession {
  id: string;
  type: 'single' | 'group';
  agentId?: string;
  title: string;
  lastTimestamp: string;
}

export interface StudyBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  progress: number;
  lastRead: string;
  summary: string;
  notes: string[];
}
