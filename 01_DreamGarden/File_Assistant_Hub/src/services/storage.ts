import type { Topic, FeedItem, FavoriteFolder, TargetTask, ArchiveSection, AppSettings, SyncLog, ContentType, ArchiveRecentUpdate, StorageStats, TaskCategoryConfig } from '../types';
import { 
  INITIAL_TOPICS, 
  INITIAL_FEED_ITEMS, 
  INITIAL_FAVORITE_FOLDERS, 
  INITIAL_TARGETS, 
  INITIAL_ARCHIVES, 
  INITIAL_SYNC_LOGS, 
  INITIAL_SETTINGS,
  INITIAL_RECENT_UPDATES,
  INITIAL_STORAGE_STATS,
  DEFAULT_TASK_CATEGORIES
} from './mockData';

const KEYS = {
  TOPICS: 'fah_topics',
  FEEDS: 'fah_feeds',
  FAVORITES: 'fah_favorites',
  TARGETS: 'fah_targets',
  ARCHIVES: 'fah_archives',
  SYNC_LOGS: 'fah_sync_logs',
  SETTINGS: 'fah_settings',
  RECENT_UPDATES: 'fah_recent_updates',
  STORAGE_STATS: 'fah_storage_stats',
  TASK_CATEGORIES: 'fah_task_categories',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to store data', e);
  }
}

export class StorageService {
  static getTopics(): Topic[] {
    return getStored<Topic[]>(KEYS.TOPICS, INITIAL_TOPICS);
  }

  static saveTopics(topics: Topic[]) {
    setStored(KEYS.TOPICS, topics);
  }

  static getFeedItems(): FeedItem[] {
    return getStored<FeedItem[]>(KEYS.FEEDS, INITIAL_FEED_ITEMS);
  }

  static saveFeedItems(items: FeedItem[]) {
    setStored(KEYS.FEEDS, items);
  }

  static getFavoriteFolders(): FavoriteFolder[] {
    return getStored<FavoriteFolder[]>(KEYS.FAVORITES, INITIAL_FAVORITE_FOLDERS);
  }

  static saveFavoriteFolders(folders: FavoriteFolder[]) {
    setStored(KEYS.FAVORITES, folders);
  }

  static getTaskCategories(): TaskCategoryConfig[] {
    return getStored<TaskCategoryConfig[]>(KEYS.TASK_CATEGORIES, DEFAULT_TASK_CATEGORIES);
  }

  static saveTaskCategories(categories: TaskCategoryConfig[]) {
    setStored(KEYS.TASK_CATEGORIES, categories);
  }

  static getTargets(): TargetTask[] {
    return getStored<TargetTask[]>(KEYS.TARGETS, INITIAL_TARGETS);
  }

  static saveTargets(targets: TargetTask[]) {
    setStored(KEYS.TARGETS, targets);
  }

  static getArchives(): ArchiveSection[] {
    return getStored<ArchiveSection[]>(KEYS.ARCHIVES, INITIAL_ARCHIVES);
  }

  static saveArchives(archives: ArchiveSection[]) {
    setStored(KEYS.ARCHIVES, archives);
  }

  static getRecentUpdates(): ArchiveRecentUpdate[] {
    return getStored<ArchiveRecentUpdate[]>(KEYS.RECENT_UPDATES, INITIAL_RECENT_UPDATES);
  }

  static getStorageStats(): StorageStats {
    return getStored<StorageStats>(KEYS.STORAGE_STATS, INITIAL_STORAGE_STATS);
  }

  static getSyncLogs(): SyncLog[] {
    return getStored<SyncLog[]>(KEYS.SYNC_LOGS, INITIAL_SYNC_LOGS);
  }

  static saveSyncLogs(logs: SyncLog[]) {
    setStored(KEYS.SYNC_LOGS, logs);
  }

  static getSettings(): AppSettings {
    return getStored<AppSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: AppSettings) {
    setStored(KEYS.SETTINGS, settings);
  }

  // Topic management
  static deleteTopic(topicId: string) {
    const topics = this.getTopics().filter(t => t.id !== topicId);
    this.saveTopics(topics);
  }

  static favoriteTopic(topicId: string) {
    const topics = this.getTopics().map(t => t.id === topicId ? { ...t, isFavorited: true } : t);
    this.saveTopics(topics);
  }

  // V1.1 Action: Protect & Save to Longterm Storage
  static saveToLongterm(itemId: string, destination: 'favorites' | 'archive'): FeedItem | null {
    const items = this.getFeedItems();
    let targetItem: FeedItem | null = null;

    const updated = items.map(item => {
      if (item.id === itemId) {
        targetItem = {
          ...item,
          location: destination,
          isProtected: true,
          expireDays: undefined,
        };
        return targetItem;
      }
      return item;
    });

    if (targetItem) {
      this.saveFeedItems(updated);

      const logs = this.getSyncLogs();
      const newLog: SyncLog = {
        id: `sync-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: 'SAVE_TO_LONGTERM',
        source: 'workspace',
        destination: `${destination}/`,
        path: `File_Assistant_Hub/${destination}/${(targetItem as FeedItem).fileName || (targetItem as FeedItem).id}.json`,
        status: 'success'
      };
      this.saveSyncLogs([newLog, ...logs]);
    }

    return targetItem;
  }

  static addFeedItem(topicId: string, type: ContentType, textOrName: string, extra?: { fileSize?: string; url?: string; quotedContent?: string; quotedTargetId?: string; replyToAgentId?: string }): FeedItem {
    const items = this.getFeedItems();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}`;
    
    let newItem: FeedItem = {
      id: `feed-${Date.now()}`,
      topicId,
      type,
      timestamp,
      dateGroup: '今天',
      location: 'workspace',
      expireDays: 14,
      quotedContent: extra?.quotedContent,
      quotedTargetId: extra?.quotedTargetId,
      replyToAgentId: extra?.replyToAgentId,
    };

    if (type === 'text') {
      newItem.content = textOrName;
    } else if (type === 'link') {
      newItem.title = textOrName || '参考网页链接';
      newItem.linkUrl = extra?.url || textOrName;
    } else if (type === 'image') {
      newItem.fileName = textOrName || '已上传图片.png';
      newItem.fileSize = extra?.fileSize || '1.2 MB';
      newItem.imageUrl = extra?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
    } else {
      newItem.fileName = textOrName;
      newItem.fileSize = extra?.fileSize || '2.0 MB';
    }

    const updated = [...items, newItem];
    this.saveFeedItems(updated);
    return newItem;
  }

  static summonOpenClaw(topicId: string, selectedItemIds?: string[]): FeedItem {
    const items = this.getFeedItems();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}`;

    const currentTopicItems = items.filter(i => i.topicId === topicId);
    
    const itemsToRead = selectedItemIds && selectedItemIds.length > 0
      ? currentTopicItems.filter(i => selectedItemIds.includes(i.id))
      : currentTopicItems;

    const readText = itemsToRead
      .map(i => i.content || i.fileName || i.title)
      .filter(Boolean)
      .join('；');

    const agentItem: FeedItem = {
      id: `feed-agent-${Date.now()}`,
      topicId,
      type: 'agent',
      isAgent: true,
      agentName: 'OpenClaw',
      location: 'archive',
      isProtected: true,
      summaryBullets: [
        `按需召唤：已针对用户选中的 ${itemsToRead.length} 条有效信息精准解读 (${readText.slice(0, 15)}...)`,
        `遵循【数据生命周期原则】：Workspace 临时区保存14天，已选要点自动提炼沉淀`,
        `云端结构对应：已就绪保存至 /cloud_archive/ 长期存储体系`
      ],
      suggestedAction: selectedItemIds && selectedItemIds.length > 0 
        ? `基于所选的 ${selectedItemIds.length} 项具体数据，已提炼核心决策要点。` 
        : '需要我为您生成具体的结构草案或方案提炼吗？',
      timestamp,
      dateGroup: '今天'
    };

    const updated = [...items, agentItem];
    this.saveFeedItems(updated);
    return agentItem;
  }
}
