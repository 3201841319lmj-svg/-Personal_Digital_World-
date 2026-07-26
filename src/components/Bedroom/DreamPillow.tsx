import React, { useState, useRef, useEffect } from 'react';
import { Copy, Edit3, RefreshCw } from 'lucide-react';
import { useHomeStore } from '../../store/useHomeStore';
import { TypewriterText } from '../Common/TypewriterText';
import { PixelIcon } from '../Common/PixelIcon';
import pageStyles from '../../pages/Pages.module.css';
import styles from './Bedroom.module.css';

export const DreamPillow: React.FC = () => {
  const { 
    dreamTopics, 
    dreamFolders,
    activeTopicId, 
    setActiveTopicId, 
    createDreamTopic, 
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
    sendDreamMessage,
    isSyncingOpenClaw,
    syncStoriesToOpenClaw,
    syncSingleFolderToCloud
  } = useHomeStore();

  const toolsRef = useRef<HTMLDivElement | null>(null);
  const userTopicRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserTopicDrawerOpen, setIsUserTopicDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isNewTopicModal, setIsNewTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [storyFontSize, setStoryFontSize] = useState(16);

  // Editing & Copying State
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [favoritedMsgId, setFavoritedMsgId] = useState<string | null>(null);

  // Multi-Select Message Bookmarking State
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState<string[]>([]);

  // Favorite Sub-Folder Management State (Supports Level-2 Nesting)
  const [isNewFavFolderModalOpen, setIsNewFavFolderModalOpen] = useState(false);
  const [newFavFolderName, setNewFavFolderName] = useState('');
  const [parentFavFolderId, setParentFavFolderId] = useState<string | undefined>(undefined);
  const [movingFavItemId, setMovingFavItemId] = useState<string | null>(null);
  const [activeFavFolderId, setActiveFavFolderId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  const handleSingleFavorite = (topicId: string, topicName: string, message: any) => {
    if (!confirm('确定要将该段故事对白收藏至“⭐ 收藏灵感”吗？')) return;
    addFavoriteItem(topicId, topicName, message, activeFavFolderId || undefined);
    setFavoritedMsgId(message.id);
    setTimeout(() => setFavoritedMsgId(null), 1500);
  };

  const handleBatchFavorite = () => {
    const curTopic = dreamTopics.find(t => t.topicId === activeTopicId);
    if (!curTopic || selectedMsgIds.length === 0) return;
    if (!confirm(`确定要将选中的 ${selectedMsgIds.length} 条故事段落批量收藏至“⭐ 收藏灵感”吗？`)) return;
    const selectedMsgs = (curTopic.messages || []).filter(m => selectedMsgIds.includes(m.id));
    addBatchFavoriteItems(curTopic.topicId, curTopic.topicName, selectedMsgs, activeFavFolderId || undefined);
    alert(`已成功将 ${selectedMsgs.length} 条选中的对白片段收藏至“⭐ 收藏灵感”！`);
    setSelectedMsgIds([]);
    setIsMultiSelectMode(false);
  };

  const toggleSelectMessage = (msgId: string) => {
    setSelectedMsgIds(prev => 
      prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]
    );
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingMsgId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (topicId: string, id: string) => {
    if (!editingText.trim()) return;
    editDreamMessage(topicId, id, editingText);
    setEditingMsgId(null);
  };

  // Folder Management State
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [movingTopicId, setMovingTopicId] = useState<string | null>(null);
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<Record<string, boolean>>({});

  // Click outside to close tools, popovers & drawers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setIsToolsOpen(false);
        setIsFontSizeOpen(false);
      }
      if (userTopicRef.current && !userTopicRef.current.contains(target)) {
        setIsUserTopicDrawerOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(target)) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-collapsing Header on scroll
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentTopic = dreamTopics.find(t => t.topicId === activeTopicId) || dreamTopics[0];
  const messages = currentTopic?.messages || [];

  const displayedMessages = messages.filter(m => {
    if (!searchQuery.trim()) return true;
    return m.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Extract User Prompt Topics in active story
  const userPromptList = messages
    .filter(m => m.isUser)
    .map(m => ({
      id: m.id,
      topicText: m.text.length > 20 ? m.text.slice(0, 20) + '...' : m.text,
    }));

  const handleJumpToUserPrompt = (id: string) => {
    setIsUserTopicDrawerOpen(false);
    const elem = messageRefs.current[id];
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentTopic) return;
    sendDreamMessage(currentTopic.topicId, inputMessage);
    setInputMessage('');
  };

  const handleCreateTopic = () => {
    if (!newTopicName.trim()) return;
    createDreamTopic(newTopicName, newTopicDesc);
    setIsNewTopicModal(false);
    setNewTopicName('');
    setNewTopicDesc('');
  };

  const handleSyncCloud = async () => {
    try {
      const res = await syncStoriesToOpenClaw();
      alert(`☁️ 腾讯云 OpenClaw 物理同步成功！\n共同步 ${res.totalChapters} 篇故事文件至 /openclaw/workspace/Story_Archives/ 目录。`);
    } catch (e) {
      alert('同步失败，请检查网络。');
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    if (currentScrollTop > lastScrollTopRef.current + 15) {
      setIsHeaderVisible(false);
    } else if (currentScrollTop < lastScrollTopRef.current - 15) {
      setIsHeaderVisible(true);
    }
    lastScrollTopRef.current = currentScrollTop;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className={styles.dreamChatContainer}>
      {/* Top Header Bar & Tools Config Panel Wrapper with toolsRef */}
      <div ref={toolsRef} style={{ position: 'relative', width: '100%', zIndex: 90 }}>
        {/* Top Header Bar with Single Tools Toggle Button */}
        <div 
          className={styles.bedroomHeaderIconBar}
          style={{
            transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
            marginTop: isHeaderVisible ? '0' : '-44px',
            opacity: isHeaderVisible ? 1 : 0,
            transition: 'all 0.3s ease',
            zIndex: 80
          }}
        >
          <div className={styles.bedroomHeaderLeft}>
            <span>🌙 织梦 ({currentTopic?.topicName})</span>
          </div>

          {/* 🛠️ 工具 Toggle Button */}
          <button 
            className={`${styles.toolsToggleBtn} ${isToolsOpen ? styles.activeToolsBtn : ''}`}
            onClick={() => {
              setIsToolsOpen(prev => !prev);
              if (isToolsOpen) {
                setIsFontSizeOpen(false);
              }
            }}
            title="配置工具"
          >
            <PixelIcon name="craft" size={14} />
            <span>工具</span>
            <span style={{ fontSize: '0.65rem', marginLeft: '2px', opacity: 0.8 }}>
              {isToolsOpen ? '▲' : '▼'}
            </span>
          </button>
        </div>

        {/* 🛠️ Slide-Down Tools Config Panel */}
        {isToolsOpen && (
          <div className={styles.toolsSlidePanel}>
            <div className={styles.toolsGroup}>
              {/* 1. 🔤 字体 */}
              <button 
                className={`${styles.toolItemBtn} ${isFontSizeOpen ? styles.activeToolItemBtn : ''}`}
                onClick={() => setIsFontSizeOpen(prev => !prev)}
                title="故事阅读字号调整"
              >
                <PixelIcon name="feather_ink" size={14} />
                <span>字体 ({storyFontSize}px)</span>
              </button>

              {/* 2. 🔍 搜索对话 */}
              <button 
                className={`${styles.toolItemBtn} ${isSearchOpen ? styles.activeToolItemBtn : ''}`}
                onClick={() => {
                  setIsSearchOpen(prev => !prev);
                  setIsToolsOpen(false);
                  setIsUserTopicDrawerOpen(false);
                  setIsDrawerOpen(false);
                  setIsFontSizeOpen(false);
                }}
                title="搜索历史对话"
              >
                <PixelIcon name="search" size={14} />
                <span>搜索对话</span>
              </button>

              {/* 3. 📑 当前话题 */}
              <button 
                className={`${styles.toolItemBtn} ${isUserTopicDrawerOpen ? styles.activeToolItemBtn : ''}`}
                onClick={() => {
                  setIsUserTopicDrawerOpen(prev => !prev);
                  setIsToolsOpen(false);
                  setIsDrawerOpen(false);
                  setIsSearchOpen(false);
                  setIsFontSizeOpen(false);
                }}
                title="当前话题/倾诉目录"
              >
                <PixelIcon name="gazette" size={14} />
                <span>当前话题</span>
              </button>

              {/* 4. 📚 历史话题 */}
              <button 
                className={`${styles.toolItemBtn} ${isDrawerOpen ? styles.activeToolItemBtn : ''}`}
                onClick={() => {
                  setIsDrawerOpen(prev => !prev);
                  setIsToolsOpen(false);
                  setIsUserTopicDrawerOpen(false);
                  setIsSearchOpen(false);
                  setIsFontSizeOpen(false);
                }}
                title="历史话题抽屉"
              >
                <PixelIcon name="ancient_tome" size={14} />
                <span>历史话题</span>
              </button>

              {/* 5. ✍️ 新建话题 */}
              <button 
                className={styles.toolItemBtn}
                onClick={() => {
                  setIsNewTopicModal(true);
                  setIsToolsOpen(false);
                }}
                title="开启新话题"
              >
                <PixelIcon name="edit" size={14} />
                <span>新建话题</span>
              </button>

              {/* 6. ☁️ 数据云端同步 */}
              <button 
                className={styles.toolItemBtn}
                onClick={() => {
                  handleSyncCloud();
                  setIsToolsOpen(false);
                }}
                disabled={isSyncingOpenClaw}
                title="数据云端同步"
              >
                <PixelIcon name="craft" size={14} />
                <span>云端同步</span>
              </button>

              {/* 7. ⭐ 多选收藏 */}
              <button 
                className={`${styles.toolItemBtn} ${isMultiSelectMode ? styles.activeToolItemBtn : ''}`}
                onClick={() => {
                  setIsMultiSelectMode(prev => !prev);
                  setIsToolsOpen(false);
                }}
                title="多选批量收藏故事对白"
              >
                <PixelIcon name="star" size={14} />
                <span>多选收藏</span>
              </button>
            </div>

            {/* 🔤 字体 Popover inside Tools */}
            {isFontSizeOpen && (
              <div className={styles.fontSizePopover}>
                <div className={styles.fontSizeHeader}>
                  <span>🔤 调整故事阅读字号</span>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--color-wood-dark)' }}
                    onClick={() => setStoryFontSize(16)}
                  >
                    重置 (16px)
                  </button>
                </div>

                {/* Presets */}
                <div className={styles.fontSizePresets}>
                  {[14, 16, 18, 20, 22].map(size => (
                    <button 
                      key={size}
                      className={`${styles.fontPresetBtn} ${storyFontSize === size ? styles.activePresetBtn : ''}`}
                      onClick={() => setStoryFontSize(size)}
                    >
                      {size}px
                    </button>
                  ))}
                </div>

                {/* Stepper */}
                <div className={styles.fontSizeStepperRow}>
                  <button 
                    className={styles.fontStepBtn}
                    onClick={() => setStoryFontSize(prev => Math.max(12, prev - 1))}
                    title="减小字号"
                  >
                    -
                  </button>
                  <span className={styles.fontSizeDisplayVal}>{storyFontSize} px</span>
                  <button 
                    className={styles.fontStepBtn}
                    onClick={() => setStoryFontSize(prev => Math.min(26, prev + 1))}
                    title="增大字号"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Topic Directory Dropdown Drawer (用户发过的话题目录) */}
      {isUserTopicDrawerOpen && (
        <div ref={userTopicRef} className={styles.userTopicDropdown}>
          <div className={styles.userTopicHeader}>
            <PixelIcon name="gazette" size={16} />
            <span>当前话题倾诉目录 ({userPromptList.length})</span>
            <button className={styles.closeUserTopicBtn} onClick={() => setIsUserTopicDrawerOpen(false)}>
              <PixelIcon name="close" size={12} />
            </button>
          </div>

          {userPromptList.length === 0 ? (
            <div className={styles.emptyTopicTip}>暂无已发送的话题倾诉</div>
          ) : (
            <div className={styles.userTopicList}>
              {userPromptList.map(item => (
                <button 
                  key={item.id} 
                  className={styles.userTopicItemBtn}
                  onClick={() => handleJumpToUserPrompt(item.id)}
                >
                  <PixelIcon name="leaf" size={12} />
                  <span className={styles.userTopicItemText}>{item.topicText}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inline Search Bar Popup */}
      {isSearchOpen && (
        <div ref={searchRef} className={styles.inlineSearchDrawer}>
          <PixelIcon name="search" size={14} />
          <input 
            type="text" 
            placeholder="搜索织梦历史对白与故事情节..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.inlineSearchInput}
            autoFocus
          />
          <button className={styles.closeSearchBtn} onClick={() => setSearchQuery('')}>
            <PixelIcon name="close" size={12} />
          </button>
        </div>
      )}

      {/* Slide-out History Topics Drawer with Folders & Favorite System */}
      {isDrawerOpen && (
        <div ref={drawerRef} className={styles.historyDrawerOverlay}>
          <div className={styles.drawerTitleRow}>
            <div className={styles.drawerTitle}>
              <PixelIcon name="ancient_tome" size={16} />
              <span>历史话题与收藏</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className={styles.addFolderBtn}
                onClick={() => {
                  setParentFavFolderId(undefined);
                  setIsNewFavFolderModalOpen(true);
                }}
                title="新建收藏灵感分类"
              >
                <PixelIcon name="star" size={14} />
              </button>

              <button 
                className={styles.addFolderBtn}
                onClick={() => setIsNewFolderModalOpen(true)}
                title="新建历史话题包文件夹"
              >
                <PixelIcon name="folder" size={14} />
              </button>
            </div>
          </div>

          <div className={styles.drawerTopicList}>
            {/* 🌟 0. Special Section: ⭐ 收藏灵感 (Single & Multi Message Snippets Collection) */}
            <div className={styles.folderBlock} style={{ border: '2px solid #D4AF37', background: 'rgba(212, 175, 55, 0.05)' }}>
              <div className={styles.folderHeader} style={{ background: 'rgba(212, 175, 55, 0.15)' }}>
                <div className={styles.folderTitleGroup}>
                  <PixelIcon name="star" size={14} />
                  <strong>⭐ 收藏灵感 ({favoriteItems.length} 段)</strong>
                </div>
                <button 
                  className={styles.addFolderBtn}
                  style={{ width: '22px', height: '22px', border: 'none', background: 'rgba(212, 175, 55, 0.2)' }}
                  onClick={() => {
                    setParentFavFolderId(undefined);
                    setIsNewFavFolderModalOpen(true);
                  }}
                  title="新建收藏分类文件夹"
                >
                  <PixelIcon name="star" size={12} />
                </button>
              </div>

              <div className={styles.folderTopicGroup} style={{ padding: '6px' }}>
                {/* Level-1 & Level-2 Favorite Sub-Folders */}
                {favoriteFolders.map(favFolder => {
                  const itemsInFavFolder = favoriteItems.filter(i => i.favoriteFolderId === favFolder.id);

                  return (
                    <div key={favFolder.id} style={{ marginBottom: '6px', paddingLeft: favFolder.parentId ? '12px' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-wood-deep)', padding: '2px 0' }}>
                        <span>📂 {favFolder.name} ({itemsInFavFolder.length})</span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          {!favFolder.parentId && (
                            <button 
                              className={styles.addFolderBtn}
                              style={{ width: '20px', height: '20px', border: 'none', background: 'rgba(139, 98, 64, 0.12)' }}
                              onClick={() => {
                                setParentFavFolderId(favFolder.id);
                                setIsNewFavFolderModalOpen(true);
                              }}
                              title="新建二级分类子目录"
                            >
                              <PixelIcon name="folder" size={10} />
                            </button>
                          )}
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}
                            onClick={() => {
                              if (confirm(`确定删除收藏文件夹“${favFolder.name}”吗？`)) {
                                deleteFavoriteFolder(favFolder.id);
                              }
                            }}
                            title="删除收藏分类"
                          >
                            <PixelIcon name="trash" size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Snippets inside this Favorite folder */}
                      {itemsInFavFolder.map(item => (
                        <div key={item.id} style={{ background: '#FFF', border: '1px solid var(--color-wood-light)', borderRadius: '6px', padding: '6px', marginBottom: '4px', fontSize: '0.76rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>
                            <span>来自《{item.topicName}》· {item.senderName}</span>
                            <button 
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                              onClick={() => deleteFavoriteItem(item.id)}
                              title="取消收藏"
                            >
                              <PixelIcon name="trash" size={10} />
                            </button>
                          </div>
                          <div style={{ color: 'var(--color-wood-dark)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            “{item.text}”
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Uncategorized Favorite Items */}
                {favoriteItems.filter(i => !i.favoriteFolderId).map(item => (
                  <div key={item.id} style={{ background: '#FFF', border: '1px solid var(--color-wood-light)', borderRadius: '6px', padding: '6px', marginBottom: '4px', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>
                      <span>来自《{item.topicName}》· {item.senderName}</span>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => deleteFavoriteItem(item.id)}
                        title="取消收藏"
                      >
                        <PixelIcon name="trash" size={10} />
                      </button>
                    </div>
                    <div style={{ color: 'var(--color-wood-dark)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      “{item.text}”
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1. Normal Topic Folders Section (With Single Folder Cloud Sync Button) */}
            {dreamFolders.map(folder => {
              const folderTopics = dreamTopics.filter(t => t.folderId === folder.id);
              const isCollapsed = collapsedFolderIds[folder.id];

              return (
                <div key={folder.id} className={styles.folderBlock}>
                  <div 
                    className={styles.folderHeader}
                    onClick={() => setCollapsedFolderIds(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}
                  >
                    <div className={styles.folderTitleGroup}>
                      <span style={{ fontSize: '0.7rem' }}>{isCollapsed ? '▶' : '▼'}</span>
                      <span>📁 {folder.name} ({folderTopics.length})</span>
                    </div>
                    
                    {/* Folder Action Buttons: Single Folder Cloud Sync + Delete */}
                    <div className={styles.folderActions} onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button 
                        className={styles.folderDelBtn}
                        onClick={async () => {
                          try {
                            await syncSingleFolderToCloud(folder.id);
                            alert(`文件夹“${folder.name}”已成功单独同步至云端！`);
                          } catch(err) {
                            alert('同步失败');
                          }
                        }}
                        title="单独同步此文件夹至腾讯云端"
                      >
                        <PixelIcon name="craft" size={12} />
                      </button>

                      <button 
                        className={styles.folderDelBtn}
                        onClick={() => {
                          if (confirm(`确定删除文件夹“${folder.name}”？内部话题将自动移出至根目录。`)) {
                            deleteDreamFolder(folder.id);
                          }
                        }}
                        title="删除文件夹"
                      >
                        <PixelIcon name="trash" size={12} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className={styles.folderTopicGroup}>
                      {folderTopics.length === 0 ? (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', padding: '4px 6px' }}>
                          (文件夹为空，可将其他话题移入)
                        </div>
                      ) : (
                        folderTopics.map(t => (
                          <div 
                            key={t.topicId}
                            className={`${styles.drawerTopicItem} ${activeTopicId === t.topicId ? styles.activeDrawerTopic : ''}`}
                            onClick={() => {
                              setActiveTopicId(t.topicId);
                              setIsDrawerOpen(false);
                            }}
                          >
                            <div className={styles.topicItemContent}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span className={styles.topicItemTitle}>{t.topicName}</span>
                                <button 
                                  className={styles.topicDeleteHoverBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`确定要删除话题《${t.topicName}》及其所有记录吗？此操作无法撤销。`)) {
                                      deleteDreamTopic(t.topicId);
                                    }
                                  }}
                                  title="删除话题"
                                >
                                  <PixelIcon name="trash" size={12} />
                                </button>
                              </div>
                              <span className={styles.topicItemSub}>{t.description}</span>
                            </div>

                            <div className={styles.moveTopicRow} onClick={e => e.stopPropagation()}>
                              <button 
                                className={styles.moveTopicBtn}
                                onClick={() => setMovingTopicId(prev => prev === t.topicId ? null : t.topicId)}
                              >
                                📂 移出文件夹
                              </button>

                              {movingTopicId === t.topicId && (
                                <div className={styles.moveMenuDropdown}>
                                  <div style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 4px', borderBottom: '1px dashed var(--color-parchment-border)' }}>
                                    移动至:
                                  </div>
                                  <button 
                                    className={styles.moveMenuItem}
                                    onClick={() => {
                                      moveTopicToFolder(t.topicId, undefined);
                                      setMovingTopicId(null);
                                    }}
                                  >
                                    📤 移出到根目录
                                  </button>
                                  {dreamFolders.filter(f => f.id !== folder.id).map(f => (
                                    <button 
                                      key={f.id}
                                      className={styles.moveMenuItem}
                                      onClick={() => {
                                        moveTopicToFolder(t.topicId, f.id);
                                        setMovingTopicId(null);
                                      }}
                                    >
                                      📁 {f.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 2. Uncategorized (Root) Topics Section */}
            {dreamTopics.filter(t => !t.folderId).map(t => (
              <div 
                key={t.topicId}
                className={`${styles.drawerTopicItem} ${activeTopicId === t.topicId ? styles.activeDrawerTopic : ''}`}
                onClick={() => {
                  setActiveTopicId(t.topicId);
                  setIsDrawerOpen(false);
                }}
              >
                <div className={styles.topicItemContent}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={styles.topicItemTitle}>{t.topicName}</span>
                    <button 
                      className={styles.topicDeleteHoverBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`确定要删除话题《${t.topicName}》及其所有记录吗？此操作无法撤销。`)) {
                          deleteDreamTopic(t.topicId);
                        }
                      }}
                      title="删除话题"
                    >
                      <PixelIcon name="trash" size={12} />
                    </button>
                  </div>
                  <span className={styles.topicItemSub}>{t.description}</span>
                </div>

                <div className={styles.moveTopicRow} onClick={e => e.stopPropagation()}>
                  <button 
                    className={styles.moveTopicBtn}
                    onClick={() => setMovingTopicId(prev => prev === t.topicId ? null : t.topicId)}
                  >
                    📁 移入文件夹 ▾
                  </button>

                  {movingTopicId === t.topicId && (
                    <div className={styles.moveMenuDropdown}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 4px', borderBottom: '1px dashed var(--color-parchment-border)' }}>
                        选择目标文件夹:
                      </div>
                      {dreamFolders.length === 0 ? (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', padding: '4px' }}>
                          暂无文件夹，请先创建
                        </div>
                      ) : (
                        dreamFolders.map(f => (
                          <button 
                            key={f.id}
                            className={styles.moveMenuItem}
                            onClick={() => {
                              moveTopicToFolder(t.topicId, f.id);
                              setMovingTopicId(null);
                            }}
                          >
                            📁 {f.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Select Floating Action Header */}
      {isMultiSelectMode && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(212, 175, 55, 0.95)', color: '#FFF', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '8px', margin: '8px 16px 0 16px', zIndex: 60, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <span>已选中 {selectedMsgIds.length} 条对白段落</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleBatchFavorite}
              disabled={selectedMsgIds.length === 0}
              style={{ background: 'var(--color-wood-deep)', color: '#FFF', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
            >
              ⭐ 批量收藏至灵感库
            </button>
            <button 
              onClick={() => {
                setIsMultiSelectMode(false);
                setSelectedMsgIds([]);
              }}
              style={{ background: 'none', border: '1px solid #FFF', color: '#FFF', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              ✕ 取消
            </button>
          </div>
        </div>
      )}

      {/* Messages Stream with Scroll Listener & Custom Scrollbar */}
      <div className={`${styles.dreamMessagesStream} custom-scroll`} onScroll={handleScroll}>
        {displayedMessages.map((msg, index) => {
          const isLatest = index === displayedMessages.length - 1;
          const inputTokens = Math.round(msg.text.length * 1.5 + 280);
          const outputTokens = Math.round(msg.text.length * 1.2);
          const isSelected = selectedMsgIds.includes(msg.id);

          return msg.isUser ? (
            <div 
              key={msg.id} 
              ref={el => messageRefs.current[msg.id] = el}
              className={`${styles.dreamMsgRow} ${styles.dreamUserRow}`}
              style={{ position: 'relative' }}
            >
              {isMultiSelectMode && (
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => toggleSelectMessage(msg.id)}
                  style={{ marginRight: '8px', cursor: 'pointer', transform: 'scale(1.2)' }}
                />
              )}

              <div className={styles.dreamAvatar}>
                <PixelIcon name="agent" size={22} />
              </div>
              
              <div className={`${styles.dreamBubble} ${styles.dreamUserBubble}`} style={{ display: 'flex', flexDirection: 'column' }}>
                {editingMsgId === msg.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                    <textarea 
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      className={pageStyles.msgEditTextarea}
                      rows={3}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        className={pageStyles.msgActionButton}
                        onClick={() => setEditingMsgId(null)}
                      >
                        取消
                      </button>
                      <button 
                        className={`${pageStyles.msgActionButton} ${pageStyles.primaryActionBtn}`}
                        onClick={() => handleSaveEdit(currentTopic.topicId, msg.id)}
                      >
                        保存修改
                      </button>
                    </div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>

              {/* Message Action Toolbar (Below Speech Bubble, Hover-Only, Pure Pixel Icons) */}
              <div className={styles.msgBottomRightActions} style={{ marginTop: '4px' }}>
                {copiedMsgId === msg.id && (
                  <span className={pageStyles.copyToast}>✓ 已复制</span>
                )}
                {favoritedMsgId === msg.id && (
                  <span className={pageStyles.copyToast}>⭐ 已收藏</span>
                )}

                <button 
                  className={styles.msgActionIconBtn}
                  onClick={() => handleCopy(msg.id, msg.text)}
                  title="复制文本"
                >
                  <PixelIcon name="copy" size={14} />
                </button>

                <button 
                  className={styles.msgActionIconBtn}
                  onClick={() => handleStartEdit(msg.id, msg.text)}
                  title="重新编辑内容"
                >
                  <PixelIcon name="edit" size={14} />
                </button>

                <button 
                  className={styles.msgActionIconBtn}
                  onClick={() => {
                    if (confirm('确定要重新生成当前 AI 的回复吗？')) {
                      regenerateDreamMessage(currentTopic.topicId, msg.id);
                    }
                  }}
                  title="重新生成 AI 写作"
                >
                  <PixelIcon name="refresh" size={14} />
                </button>

                <button 
                  className={styles.msgActionIconBtn}
                  onClick={() => handleSingleFavorite(currentTopic.topicId, currentTopic.topicName, msg)}
                  title="收藏此段故事"
                >
                  <PixelIcon name="star" size={14} />
                </button>

                <button 
                  className={styles.msgActionIconBtn}
                  onClick={() => {
                    if (confirm('确定要删除该段织梦对白记录吗？此操作无法撤销。')) {
                      deleteDreamMessage(currentTopic.topicId, msg.id);
                    }
                  }}
                  title="删除消息"
                >
                  <PixelIcon name="trash" size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div key={msg.id} className={styles.dreamAiFullRow}>
              {/* 1. AI Sender Name Header */}
              <div className={styles.aiNameHeaderRow} style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isMultiSelectMode && (
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelectMessage(msg.id)}
                      style={{ marginRight: '4px', cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                  )}
                  <PixelIcon name="feather_ink" size={18} />
                  <span className={styles.aiNameTitle}>同人文写作专家 · 织梦对白</span>
                </div>
              </div>

              {/* 2. Deep Thinking Accordion */}
              <details className={styles.thinkingAccordionBox}>
                <summary className={styles.thinkingSummary}>
                  <PixelIcon name="thinking" size={14} />
                  <span>💭 AI 的思考轨迹 (推理链)...</span>
                </summary>
                <div className={styles.thinkingDetailsBody}>
                  ✦ 解析织梦情感脉络<br />
                  ✦ 关联故事人物背景与偏好设定<br />
                  ✦ 组合治愈生成对白
                </div>
              </details>

              {/* 3. Full Width Clean Story Content with Dynamic FontSize & Default Body Font */}
              <div className={styles.fullWidthStoryContent} style={{ fontSize: `${storyFontSize}px` }}>
                <TypewriterText text={msg.text} speed={20} isLatest={isLatest} />
              </div>

              {/* 4. Bottom Meta Row: Token Stats (Left) & Pure Pixel Icon Actions (Right) */}
              <div className={styles.aiBottomMetaRow}>
                <div className={styles.tokenStatsBadge}>
                  <span>📥 输入 {inputTokens} tokens</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>📤 输出 {outputTokens} tokens</span>
                </div>

                <div className={styles.msgBottomRightActions}>
                  {copiedMsgId === msg.id && (
                    <span className={pageStyles.copyToast}>✓ 已复制</span>
                  )}
                  {favoritedMsgId === msg.id && (
                    <span className={pageStyles.copyToast}>⭐ 已收藏</span>
                  )}

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => handleCopy(msg.id, msg.text)}
                    title="复制文本"
                  >
                    <PixelIcon name="copy" size={14} />
                  </button>

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => {
                      if (confirm('确定要让 AI 重新生成当前创作吗？')) {
                        regenerateDreamMessage(currentTopic.topicId, msg.id);
                      }
                    }}
                    title="重新生成 AI 写作"
                  >
                    <PixelIcon name="refresh" size={14} />
                  </button>

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => handleSingleFavorite(currentTopic.topicId, currentTopic.topicName, msg)}
                    title="收藏此段故事"
                  >
                    <PixelIcon name="star" size={14} />
                  </button>

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => {
                      if (confirm('确定要删除该段织梦对白记录吗？此操作无法撤销。')) {
                        deleteDreamMessage(currentTopic.topicId, msg.id);
                      }
                    }}
                    title="删除消息"
                  >
                    <PixelIcon name="trash" size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Fixed Bottom Input Composer */}
      <div className={styles.fixedBottomComposer}>
        <input 
          type="text"
          className={styles.dreamTextInput}
          placeholder="向同人文写作专家倾诉新的对话走向..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
        />
        <button className={styles.sendDreamBtn} onClick={handleSendMessage}>
          <PixelIcon name="send" size={16} />
        </button>
      </div>

      {/* New Topic Modal */}
      {isNewTopicModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150
        }}>
          <div style={{
            width: '320px',
            background: 'var(--color-parchment-light)',
            border: '3px solid var(--color-wood-base)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-wood-deep)' }}>➕ 开启新织梦话题</h4>
            <input 
              type="text" 
              placeholder="话题名字 (例: 魔法学园故事)"
              value={newTopicName}
              onChange={e => setNewTopicName(e.target.value)}
              style={{ padding: '6px', background: 'var(--color-parchment-base)', border: '1.5px solid var(--color-parchment-border)', borderRadius: '6px' }}
            />
            <input 
              type="text" 
              placeholder="简述故事情境..."
              value={newTopicDesc}
              onChange={e => setNewTopicDesc(e.target.value)}
              style={{ padding: '6px', background: 'var(--color-parchment-base)', border: '1.5px solid var(--color-parchment-border)', borderRadius: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button onClick={() => setIsNewTopicModal(false)} style={{ padding: '4px 10px', background: 'var(--color-parchment-dark)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>取消</button>
              <button onClick={handleCreateTopic} style={{ padding: '4px 10px', background: 'var(--color-wood-base)', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>创建</button>
            </div>
          </div>
        </div>
      )}
      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 155
        }}>
          <div style={{
            width: '300px',
            background: 'var(--color-parchment-light)',
            border: '3px solid var(--color-wood-base)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-wood-deep)' }}>📁 新建历史话题文件夹</h4>
            <input 
              type="text" 
              placeholder="文件夹名称 (如: 魔法故事、日常等)"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              style={{ padding: '8px', background: 'var(--color-parchment-base)', border: '1.5px solid var(--color-parchment-border)', borderRadius: '6px' }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button 
                onClick={() => setIsNewFolderModalOpen(false)} 
                style={{ padding: '4px 10px', background: 'var(--color-parchment-dark)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (newFolderName.trim()) {
                    createDreamFolder(newFolderName.trim());
                    setNewFolderName('');
                    setIsNewFolderModalOpen(false);
                  }
                }} 
                style={{ padding: '4px 10px', background: 'var(--color-wood-base)', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
      {/* New Favorite Sub-Folder Modal (Supports Level-2 Nesting) */}
      {isNewFavFolderModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 160
        }}>
          <div style={{
            width: '320px',
            background: 'var(--color-parchment-light)',
            border: '3px solid #D4AF37',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-wood-deep)' }}>
              ⭐ 新建收藏灵感{parentFavFolderId ? '二级' : ''}分类
            </h4>
            <input 
              type="text" 
              placeholder="分类名称 (如: 绝妙金句、经典反转等)"
              value={newFavFolderName}
              onChange={e => setNewFavFolderName(e.target.value)}
              style={{ padding: '8px', background: 'var(--color-parchment-base)', border: '1.5px solid var(--color-parchment-border)', borderRadius: '6px' }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button 
                onClick={() => {
                  setIsNewFavFolderModalOpen(false);
                  setNewFavFolderName('');
                }} 
                style={{ padding: '4px 10px', background: 'var(--color-parchment-dark)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (newFavFolderName.trim()) {
                    createFavoriteFolder(newFavFolderName.trim(), parentFavFolderId);
                    setNewFavFolderName('');
                    setParentFavFolderId(undefined);
                    setIsNewFavFolderModalOpen(false);
                  }
                }} 
                style={{ padding: '4px 10px', background: 'var(--color-wood-base)', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
