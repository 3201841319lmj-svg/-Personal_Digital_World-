export type ContentType = 'text' | 'pdf' | 'image' | 'doc' | 'link' | 'video' | 'audio' | 'agent';

export interface FeedItem {
  id: string;
  topicId: string;
  type: ContentType;
  title?: string;
  content?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  linkUrl?: string;
  imageUrl?: string;
  timestamp: string; // e.g. "10:30" or "16:21"
  dateGroup: string; // e.g. "7月25日", "7月24日"
  isAgent?: boolean;
  agentName?: string;
  summaryBullets?: string[];
  suggestedAction?: string;
  isFavorited?: boolean;
  selected?: boolean; // V1.2 Multi-select mode
  
  // V1.3 & V1.5 Quote & AI Threading
  quotedContent?: string;
  quotedTargetId?: string; // Target original message ID to scroll to
  replyToAgentId?: string;
  threadReplies?: FeedItem[]; // Infinite conversation with Agent

  // V1.1 Data Lifecycle
  location?: 'workspace' | 'favorites' | 'archive';
  isProtected?: boolean; // ☁ 已保护
  expireDays?: number; // default 14 days for workspace
}

export interface Topic {
  id: string;
  title: string;
  time: string;
  category: 'today' | 'yesterday' | 'earlier';
  parentCategory?: string; // e.g. "工作", "AI", "生活"
  subCategory?: string; // e.g. "客户资料", "OpenClaw"
  isFavorited?: boolean;
}

export interface FavoriteFolder {
  id: string;
  name: string;
  count: number;
}

export interface FavoriteItem {
  id: string;
  folderId: string;
  folderName: string;
  title: string;
  type: ContentType;
  snippet: string;
  date: string;
}

export interface TaskCategoryConfig {
  id: string;
  name: string;
  color: string;
}

export interface TargetTask {
  id: string;
  title: string;
  category: string; // e.g. 'work' | 'study' | 'life' | 'health' | 'medical' | custom
  color: string; // hex or CSS variable
  completed: boolean;
  flagged?: boolean; // V1.2 小红旗 🚩
  date: string; // YYYY-MM-DD
  timeRange?: string; // e.g. "10:00 - 14:00"
  durationHours?: number; // e.g. 4.0
  subtasks?: { id: string; title: string; completed: boolean; flagged?: boolean; time?: string }[];
}

export interface ArchiveSection {
  id: string;
  title: string;
  category: 'profile' | 'work' | 'life' | 'health' | 'tools' | 'inspiration' | 'trash';
  itemCount: number;
  updatedAt: string;
  summary: string;
  highlights: string[];
}

export interface ArchiveRecentUpdate {
  id: string;
  categoryTitle: string;
  categoryKey: string;
  updatedAt: string;
  count: number;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  action: 'ADD' | 'UPDATE' | 'DELETE' | 'SAVE_TO_LONGTERM';
  source?: string; // e.g. "workspace"
  destination?: string; // e.g. "favorites/travel/"
  path: string;
  status: 'success' | 'pending';
}

export interface StorageStats {
  workspaceSize: string;
  pendingCleanFiles: number;
  favoritesCount: number;
  archiveCount: number;
  memoryCount: number;
}

export interface AppSettings {
  openClawConnected: boolean;
  cloudSyncEnabled: boolean;
  lastSyncTime: string;
  themeMode: 'warm-paper' | 'clean-white' | 'dark-wabi';
  fontFamily: 'serif' | 'sans';
  fontSize: 'normal' | 'large';
}
