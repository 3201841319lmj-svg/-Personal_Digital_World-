import React, { useState } from 'react';
import { Search, ChevronDown, Folder, Plus, X, PanelLeft, Trash2, Bookmark, CheckSquare, Check, AlertCircle } from 'lucide-react';
import type { Topic, FavoriteFolder } from '../types';

interface SidebarProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  favoriteFolders: FavoriteFolder[];
  onNewTopic: () => void;
  activeView: 'feed' | 'home' | 'target' | 'archive';
  onCloseSidebar?: () => void;
  onDeleteTopic: (topicId: string) => void;
  onFavoriteTopic: (topicId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
  favoriteFolders,
  onNewTopic,
  activeView,
  onCloseSidebar,
  onDeleteTopic,
  onFavoriteTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [favOpen, setFavOpen] = useState(true);

  // Multi-select history state
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Modals for confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmFavoriteId, setConfirmFavoriteId] = useState<string | null>(null);
  const [isBatchDelete, setIsBatchDelete] = useState(false);
  const [isBatchFavorite, setIsBatchFavorite] = useState(false);

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayTopics = filteredTopics.filter(t => t.category === 'today');
  const yesterdayTopics = filteredTopics.filter(t => t.category === 'yesterday');
  const earlierTopics = filteredTopics.filter(t => t.category === 'earlier');

  const toggleSelectTopic = (id: string) => {
    if (selectedTopicIds.includes(id)) {
      setSelectedTopicIds(selectedTopicIds.filter(i => i !== id));
    } else {
      setSelectedTopicIds([...selectedTopicIds, id]);
    }
  };

  const handleExecuteDelete = () => {
    if (isBatchDelete) {
      selectedTopicIds.forEach(id => onDeleteTopic(id));
      setSelectedTopicIds([]);
      setIsMultiSelect(false);
      setIsBatchDelete(false);
    } else if (confirmDeleteId) {
      onDeleteTopic(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleExecuteFavorite = () => {
    if (isBatchFavorite) {
      selectedTopicIds.forEach(id => onFavoriteTopic(id));
      setSelectedTopicIds([]);
      setIsMultiSelect(false);
      setIsBatchFavorite(false);
    } else if (confirmFavoriteId) {
      onFavoriteTopic(confirmFavoriteId);
      setConfirmFavoriteId(null);
    }
  };

  return (
    <aside className="sidebar-container animate-fade-in">
      {/* Sidebar Top Bar */}
      <div className="sidebar-top-bar">
        <div className="top-brand">
          <PanelLeft size={18} className="icon-blue" />
          <span className="sidebar-brand-text font-serif">历史与收藏</span>
        </div>
        <div className="top-right-actions">
          <button 
            className={`sidebar-icon-btn ${isMultiSelect ? 'active' : ''}`} 
            onClick={() => setIsMultiSelect(!isMultiSelect)} 
            title="开启/关闭历史多选模式"
          >
            <CheckSquare size={16} />
          </button>
          <button className="sidebar-icon-btn" onClick={onNewTopic} title="新建话题">
            <Plus size={16} />
          </button>
          {onCloseSidebar && (
            <button className="sidebar-icon-btn" onClick={onCloseSidebar} title="收起">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Multi-select Header Toolbar for Topics */}
      {isMultiSelect && (
        <div className="topic-multi-toolbar animate-fade-in font-serif">
          <span>已选 <strong>{selectedTopicIds.length}</strong> 个话题</span>
          <div className="toolbar-btns">
            <button className="tool-btn" onClick={() => setIsBatchFavorite(true)} title="批量收藏">
              <Bookmark size={12} />
            </button>
            <button className="tool-btn danger" onClick={() => setIsBatchDelete(true)} title="批量删除">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}

      {/* History Section Header */}
      <div className="sidebar-section-header" onClick={() => setHistoryOpen(!historyOpen)}>
        <span className="section-title font-serif">历史话题</span>
        <ChevronDown size={14} className={`chevron-icon ${historyOpen ? 'open' : ''}`} />
      </div>

      {historyOpen && (
        <>
          {/* Search Box */}
          <div className="sidebar-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="搜索历史话题..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="sidebar-search-input"
            />
          </div>

          {/* Topics List Container */}
          <div className="topics-scroll-area">
            {[{ label: '今天', list: todayTopics }, { label: '昨天', list: yesterdayTopics }, { label: '更早', list: earlierTopics }].map(group => (
              group.list.length > 0 && (
                <div key={group.label} className="topic-group">
                  <div className="group-label">{group.label}</div>
                  {group.list.map(t => {
                    const isSelected = selectedTopicIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`topic-item ${activeView === 'feed' && activeTopicId === t.id ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (isMultiSelect) {
                            toggleSelectTopic(t.id);
                          } else {
                            onSelectTopic(t.id);
                            if (onCloseSidebar) onCloseSidebar();
                          }
                        }}
                      >
                        {isMultiSelect && (
                          <span className={`topic-check-box ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={10} color="#FFF" />}
                          </span>
                        )}
                        <span className="topic-title">{t.title}</span>
                        <span className="topic-time">{t.time}</span>

                        {/* Hover Action Icons */}
                        {!isMultiSelect && (
                          <div className="topic-hover-actions">
                            <button 
                              className="topic-action-btn" 
                              onClick={(e) => { e.stopPropagation(); setConfirmFavoriteId(t.id); }} 
                              title="收藏话题"
                            >
                              <Bookmark size={12} className={t.isFavorited ? 'icon-protected' : ''} />
                            </button>
                            <button 
                              className="topic-action-btn danger" 
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(t.id); }} 
                              title="删除话题"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ))}
          </div>
        </>
      )}

      {/* Favorites Section */}
      <div className="sidebar-section-header" onClick={() => setFavOpen(!favOpen)}>
        <span className="section-title font-serif">收藏夹</span>
        <ChevronDown size={14} className={`chevron-icon ${favOpen ? 'open' : ''}`} />
      </div>

      {favOpen && (
        <div className="favorites-list">
          {favoriteFolders.map(fav => (
            <div key={fav.id} className="fav-item">
              <Folder size={15} className="fav-icon" />
              <span className="fav-name">{fav.name} ({fav.count})</span>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialogs for Topic Operations */}
      {(confirmDeleteId || isBatchDelete) && (
        <div className="modal-backdrop">
          <div className="confirm-dialog card-paper">
            <div className="dialog-head font-serif">
              <AlertCircle size={18} className="icon-danger" />
              <h4>二次确认删除历史话题</h4>
            </div>
            <p>确定要删除 {isBatchDelete ? `选中的 ${selectedTopicIds.length} 个` : '该'} 历史话题吗？相关聊天记录也会被删除。</p>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={() => { setConfirmDeleteId(null); setIsBatchDelete(false); }}>取消</button>
              <button className="btn btn-primary danger" onClick={handleExecuteDelete}>确定删除</button>
            </div>
          </div>
        </div>
      )}

      {(confirmFavoriteId || isBatchFavorite) && (
        <div className="modal-backdrop">
          <div className="confirm-dialog card-paper">
            <div className="dialog-head font-serif">
              <Bookmark size={18} className="icon-protected" />
              <h4>二次确认收藏历史话题</h4>
            </div>
            <p>确定要将 {isBatchFavorite ? `选中的 ${selectedTopicIds.length} 个` : '该'} 话题加入长期收藏档案吗？</p>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={() => { setConfirmFavoriteId(null); setIsBatchFavorite(false); }}>取消</button>
              <button className="btn btn-primary" onClick={handleExecuteFavorite}>确定收藏</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sidebar-container {
          width: 270px; min-width: 270px; height: 100vh; background-color: #FFFFFF;
          border-right: 1px solid var(--border-color); display: flex; flex-direction: column;
          padding: 16px 14px; box-shadow: 4px 0 16px rgba(0, 0, 0, 0.04); z-index: 100;
        }

        .sidebar-top-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color-light);
        }

        .top-brand { display: flex; align-items: center; gap: 8px; }
        .icon-blue { color: var(--primary-blue); }
        .icon-protected { color: #27AE60; }
        .icon-danger { color: #E74C3C; }

        .sidebar-brand-text { font-size: 14px; font-weight: 600; color: var(--text-main); }
        .top-right-actions { display: flex; gap: 4px; }

        .sidebar-icon-btn {
          background: none; border: none; color: var(--text-muted);
          padding: 4px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s;
        }

        .sidebar-icon-btn.active { color: var(--primary-blue); background: var(--primary-blue-light); }
        .sidebar-icon-btn:hover { color: var(--text-main); background: rgba(0, 0, 0, 0.05); }

        .topic-multi-toolbar {
          background: var(--bg-warm-paper); border: 1px solid var(--border-color);
          border-radius: var(--radius-md); padding: 6px 10px; display: flex;
          align-items: center; justify-content: space-between; font-size: 11px; margin-bottom: 8px;
        }

        .toolbar-btns { display: flex; gap: 4px; }
        .tool-btn {
          background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 4px;
          padding: 3px 6px; cursor: pointer; color: var(--text-main);
        }
        .tool-btn.danger { color: #E74C3C; }

        .sidebar-section-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 4px; cursor: pointer; margin-top: 4px;
        }

        .section-title { font-size: 13px; font-weight: 600; color: var(--text-main); }

        .chevron-icon { color: var(--text-light); transition: transform 0.2s; }
        .chevron-icon.open { transform: rotate(0deg); }
        .chevron-icon:not(.open) { transform: rotate(-90deg); }

        .sidebar-search-box { position: relative; margin: 4px 0 10px 0; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-light); }
        .sidebar-search-input {
          width: 100%; background: #FAF8F5; border: 1px solid var(--border-color-light);
          border-radius: var(--radius-full); padding: 6px 12px 6px 32px; font-size: 12px;
          color: var(--text-main); outline: none;
        }

        .topics-scroll-area { flex: 1; overflow-y: auto; margin-bottom: 12px; }
        .topic-group { margin-bottom: 12px; }
        .group-label { font-size: 11px; color: var(--text-light); margin-bottom: 4px; padding-left: 6px; }

        .topic-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 10px; border-radius: 8px; cursor: pointer;
          font-size: 13px; color: var(--text-main); transition: all 0.15s ease;
          margin-bottom: 2px; position: relative;
        }

        .topic-item:hover { background: var(--bg-warm-paper); }
        .topic-item.active { background: #EAE3D5; font-weight: 500; }

        .topic-check-box {
          width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: center; margin-right: 6px; flex-shrink: 0;
        }
        .topic-check-box.checked { background: var(--primary-blue); border-color: var(--primary-blue); }

        .topic-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
        .topic-time { font-size: 11px; color: var(--text-light); margin-left: 6px; }

        .topic-hover-actions {
          display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s;
        }

        .topic-item:hover .topic-hover-actions { opacity: 1; }
        .topic-action-btn { background: none; border: none; padding: 2px; color: var(--text-muted); cursor: pointer; }
        .topic-action-btn.danger:hover { color: #E74C3C; }

        .favorites-list { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; margin-bottom: 16px; }
        .fav-item { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 6px; font-size: 13px; color: var(--text-muted); cursor: pointer; }
        .fav-item:hover { color: var(--accent-brown); background: var(--accent-brown-light); }
        .fav-icon { color: var(--accent-brown); }
      `}</style>
    </aside>
  );
};
