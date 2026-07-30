import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeEntryView } from './components/HomeEntryView';
import { FeedView } from './components/FeedView';
import { TargetView } from './components/TargetView';
import { ArchiveView } from './components/ArchiveView';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { AgentScopeModal } from './components/AgentScopeModal';
import { StorageService } from './services/storage';
import type { Topic, FeedItem, FavoriteFolder, TargetTask, ArchiveSection, AppSettings, SyncLog, ContentType, ArchiveRecentUpdate, StorageStats, TaskCategoryConfig } from './types';

export function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>('topic-1');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [favoriteFolders, setFavoriteFolders] = useState<FavoriteFolder[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategoryConfig[]>([]);
  const [targets, setTargets] = useState<TargetTask[]>([]);
  const [archives, setArchives] = useState<ArchiveSection[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<ArchiveRecentUpdate[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>(StorageService.getStorageStats());
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());

  const [activeView, setActiveView] = useState<'home' | 'feed' | 'target' | 'archive'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAgentScopeOpen, setIsAgentScopeOpen] = useState(false);

  // Initialize Data
  useEffect(() => {
    setTopics(StorageService.getTopics());
    setFeedItems(StorageService.getFeedItems());
    setFavoriteFolders(StorageService.getFavoriteFolders());
    setTaskCategories(StorageService.getTaskCategories());
    setTargets(StorageService.getTargets());
    setArchives(StorageService.getArchives());
    setRecentUpdates(StorageService.getRecentUpdates());
    setStorageStats(StorageService.getStorageStats());
    setSyncLogs(StorageService.getSyncLogs());
  }, []);

  const currentTopic = topics.find(t => t.id === activeTopicId) || topics[0] || null;
  const currentFeedItems = feedItems.filter(item => item.topicId === activeTopicId);

  // Topic Handlers
  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setActiveView('feed');
  };

  const handleDeleteTopic = (topicId: string) => {
    StorageService.deleteTopic(topicId);
    setTopics(StorageService.getTopics());
    if (activeTopicId === topicId) {
      setActiveTopicId(topics[0]?.id || 'topic-1');
    }
  };

  const handleFavoriteTopic = (topicId: string) => {
    StorageService.favoriteTopic(topicId);
    setTopics(StorageService.getTopics());
  };

  const handleSendMessage = (text: string, type: ContentType, extra?: any) => {
    const targetTopicId = activeTopicId || 'topic-1';
    const newItem = StorageService.addFeedItem(targetTopicId, type, text, extra);
    setFeedItems(prev => [...prev, newItem]);
  };

  // V1.3 Agent Scope Summon handler
  const handleConfirmSummonAgent = () => {
    const targetTopicId = activeTopicId || 'topic-1';
    const agentItem = StorageService.summonOpenClaw(targetTopicId);
    setFeedItems(prev => [...prev, agentItem]);
    setActiveView('feed');
  };

  const handleNewTopic = () => {
    const newId = `topic-${Date.now()}`;
    const newTopic: Topic = {
      id: newId,
      title: '新话题收集箱',
      time: '刚刚',
      category: 'today',
      parentCategory: '工作',
      subCategory: '新投递'
    };
    const updated = [newTopic, ...topics];
    setTopics(updated);
    StorageService.saveTopics(updated);
    setActiveTopicId(newId);
    setActiveView('feed');
  };

  const handleDeleteFeedItem = (id: string) => {
    const updated = feedItems.filter(item => item.id !== id);
    setFeedItems(updated);
    StorageService.saveFeedItems(updated);
  };

  const handleSaveToLongterm = (id: string, destination: 'favorites' | 'archive') => {
    StorageService.saveToLongterm(id, destination);
    setFeedItems(StorageService.getFeedItems());
    setSyncLogs(StorageService.getSyncLogs());
  };

  // Target handlers
  const handleToggleTask = (id: string) => {
    const updated = targets.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = targets.map(t => {
      if (t.id === taskId && t.subtasks) {
        const newSubs = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        return { ...t, subtasks: newSubs };
      }
      return t;
    });
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleToggleTaskFlag = (id: string) => {
    const updated = targets.map(t => t.id === id ? { ...t, flagged: !t.flagged } : t);
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleToggleSubtaskFlag = (taskId: string, subtaskId: string) => {
    const updated = targets.map(t => {
      if (t.id === taskId && t.subtasks) {
        const newSubs = t.subtasks.map(s => s.id === subtaskId ? { ...s, flagged: !s.flagged } : s);
        return { ...t, subtasks: newSubs };
      }
      return t;
    });
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleAddTask = (title: string, categoryName: string, color: string) => {
    const finalTitle = title.trim() || '新目标任务';
    const newTask: TargetTask = {
      id: `target-${Date.now()}`,
      title: finalTitle,
      category: categoryName,
      color,
      completed: false,
      flagged: false,
      date: new Date().toISOString().split('T')[0],
      timeRange: '10:00 - 12:00',
      durationHours: 2.0
    };
    const updated = [newTask, ...targets];
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    const updated = targets.map(t => {
      if (t.id === taskId) {
        const subs = t.subtasks || [];
        const newSub = { id: `sub-${Date.now()}`, title: title.trim() || '新子任务', completed: false, flagged: false, time: '10:00' };
        return { ...t, subtasks: [...subs, newSub] };
      }
      return t;
    });
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = targets.filter(t => t.id !== id);
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  const handleAddCategory = (name: string, color: string) => {
    const newCat: TaskCategoryConfig = { id: `cat-${Date.now()}`, name, color };
    const updated = [...taskCategories, newCat];
    setTaskCategories(updated);
    StorageService.saveTaskCategories(updated);
  };

  const handleReorderTasks = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= targets.length) return;
    const updated = [...targets];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setTargets(updated);
    StorageService.saveTargets(updated);
  };

  // Archive highlight editor
  const handleSaveArchiveHighlights = (archiveId: string, newHighlights: string[]) => {
    const updated = archives.map(a => a.id === archiveId ? { ...a, highlights: newHighlights } : a);
    setArchives(updated);
    StorageService.saveArchives(updated);
  };

  // Cloud Sync
  const handleSyncCloud = () => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSettings = { ...settings, lastSyncTime: timeStr };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    setSyncLogs(StorageService.getSyncLogs());
  };

  return (
    <div className="app-container">
      {/* Drawer Sidebar */}
      {isSidebarOpen && (
        <div className="sidebar-drawer-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Sidebar
              topics={topics}
              activeTopicId={activeTopicId}
              onSelectTopic={handleSelectTopic}
              favoriteFolders={favoriteFolders}
              onNewTopic={handleNewTopic}
              activeView={activeView}
              onCloseSidebar={() => setIsSidebarOpen(false)}
              onDeleteTopic={handleDeleteTopic}
              onFavoriteTopic={handleFavoriteTopic}
            />
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="main-content-area">
        {activeView === 'home' && (
          <HomeEntryView
            onSendMessage={handleSendMessage}
            onNavigateTab={tab => setActiveView(tab)}
            activeTab={activeView}
            onSummonAgent={() => setIsAgentScopeOpen(true)}
            onNewTopic={handleNewTopic}
            onToggleSidebar={() => setIsSidebarOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {activeView === 'feed' && (
          <FeedView
            currentTopic={currentTopic}
            feedItems={currentFeedItems}
            onSendMessage={handleSendMessage}
            onSummonAgent={() => setIsAgentScopeOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNewTopic={handleNewTopic}
            onBackToHome={() => setActiveView('home')}
            onDeleteFeedItem={handleDeleteFeedItem}
            onSaveToLongterm={handleSaveToLongterm}
          />
        )}

        {activeView === 'target' && (
          <TargetView
            targets={targets}
            categories={taskCategories}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            onToggleTaskFlag={handleToggleTaskFlag}
            onToggleSubtaskFlag={handleToggleSubtaskFlag}
            onAddTask={handleAddTask}
            onAddSubtask={handleAddSubtask}
            onDeleteTask={handleDeleteTask}
            onAddCategory={handleAddCategory}
            onReorderTasks={handleReorderTasks}
            onSummonAgent={() => setIsAgentScopeOpen(true)}
            onNewTopic={handleNewTopic}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'archive' && (
          <ArchiveView
            archives={archives}
            recentUpdates={recentUpdates}
            onSummonAgent={() => setIsAgentScopeOpen(true)}
            onUpdateArchives={() => setActiveView('feed')}
            onSyncCloud={handleSyncCloud}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onBackToHome={() => setActiveView('home')}
            onSaveArchiveHighlights={handleSaveArchiveHighlights}
            lastSyncTime={settings.lastSyncTime}
          />
        )}
      </main>

      {/* Modals */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          syncLogs={syncLogs}
          storageStats={storageStats}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={newS => {
            setSettings(newS);
            StorageService.saveSettings(newS);
          }}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          feedItems={feedItems}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={item => {
            setActiveTopicId(item.topicId);
            setActiveView('feed');
          }}
        />
      )}

      {isAgentScopeOpen && (
        <AgentScopeModal
          topics={topics}
          favoriteFolders={favoriteFolders}
          isGlobal={activeView === 'home'}
          onClose={() => setIsAgentScopeOpen(false)}
          onConfirmSummon={handleConfirmSummonAgent}
        />
      )}

      <style>{`
        .sidebar-drawer-overlay {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(4px);
          z-index: 99; display: flex;
        }

        .main-content-area {
          flex: 1; height: 100vh; overflow: hidden; position: relative;
        }
      `}</style>
    </div>
  );
}

export default App;
