import React, { useState } from 'react';
import type { ArchiveSection, ArchiveRecentUpdate } from '../types';
import { 
  Sparkles, RefreshCw, Cloud, Search, Settings, 
  User, Briefcase, Home, Heart, Wrench, Lightbulb, Trash2, 
  ChevronRight, CheckCircle, ArrowLeft, Edit3, Plus, Check, X
} from 'lucide-react';

interface ArchiveViewProps {
  archives: ArchiveSection[];
  recentUpdates: ArchiveRecentUpdate[];
  onSummonAgent: () => void;
  onUpdateArchives: () => void;
  onSyncCloud: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onBackToHome: () => void;
  onSaveArchiveHighlights: (categoryId: string, newHighlights: string[]) => void;
  lastSyncTime: string;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  archives,
  recentUpdates,
  onSummonAgent,
  onUpdateArchives,
  onSyncCloud,
  onOpenSearch,
  onOpenSettings,
  onBackToHome,
  onSaveArchiveHighlights,
  lastSyncTime
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('work');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(false);

  // Edit highlight state
  const [editingHighlightIndex, setEditingHighlightIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newHighlightText, setNewHighlightText] = useState<string>('');

  const activeArchive = archives.find(a => a.category === selectedCategory) || archives[0];

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncCloud();
      setSyncSuccessMsg(true);
      setTimeout(() => setSyncSuccessMsg(false), 3000);
    }, 1000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile': return <User size={20} className="icon-blue" />;
      case 'work': return <Briefcase size={20} className="icon-brown" />;
      case 'life': return <Home size={20} className="icon-blue" />;
      case 'health': return <Heart size={20} className="icon-green" />;
      case 'tools': return <Wrench size={20} className="icon-brown" />;
      case 'inspiration': return <Lightbulb size={20} className="icon-yellow" />;
      case 'trash': return <Trash2 size={20} className="icon-muted" />;
      default: return <User size={20} />;
    }
  };

  const handleStartEdit = (index: number, text: string) => {
    setEditingHighlightIndex(index);
    setEditingText(text);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingText.trim()) return;
    const updated = [...activeArchive.highlights];
    updated[index] = editingText;
    onSaveArchiveHighlights(activeArchive.id, updated);
    setEditingHighlightIndex(null);
  };

  const handleDeleteHighlight = (index: number) => {
    const updated = activeArchive.highlights.filter((_, i) => i !== index);
    onSaveArchiveHighlights(activeArchive.id, updated);
  };

  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    const updated = [...activeArchive.highlights, newHighlightText];
    onSaveArchiveHighlights(activeArchive.id, updated);
    setNewHighlightText('');
    setIsAddingNew(false);
  };

  return (
    <div className="archive-page-container animate-fade-in">
      {/* Header Actions Bar with Back to Home Arrow */}
      <div className="archive-header-bar">
        <div className="bar-left">
          <button className="icon-only-btn" onClick={onBackToHome} title="返回首页">
            <ArrowLeft size={18} />
          </button>
          <h2 className="bar-title font-serif">档案</h2>
        </div>

        <div className="bar-actions">
          <button className="icon-only-btn" onClick={onOpenSearch} title="全域搜索">
            <Search size={18} />
          </button>
          <button className="icon-only-btn agent-btn" onClick={onSummonAgent} title="召唤 OpenClaw Agent">
            <Sparkles size={18} className="sparkle-icon" />
          </button>
          <button className="icon-only-btn" onClick={onOpenSettings} title="设置">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="archive-scroll-content">
        {/* Title Hero */}
        <div className="archive-hero-section">
          <h1 className="hero-title font-serif">我的档案</h1>
          <p className="hero-subtitle font-serif">AI 帮你整理关于你的信息，形成长期记忆。</p>

          {/* Three Core Feature Cards */}
          <div className="three-actions-row">
            <div className="action-card card-paper" onClick={onSummonAgent}>
              <div className="card-top font-serif">
                <Sparkles size={16} className="icon-brown" />
                <span className="card-action-title">召唤</span>
              </div>
              <span className="card-action-sub">与AI对话</span>
            </div>

            <div className="action-card card-paper" onClick={onUpdateArchives}>
              <div className="card-top font-serif">
                <RefreshCw size={16} className="icon-brown" />
                <span className="card-action-title">更新</span>
              </div>
              <span className="card-action-sub">更新档案内容</span>
            </div>

            <div className="action-card card-paper" onClick={triggerSync}>
              <div className="card-top font-serif">
                <Cloud size={16} className={`icon-brown ${isSyncing ? 'spin' : ''}`} />
                <span className="card-action-title">{isSyncing ? '同步中' : '同步'}</span>
              </div>
              <span className="card-action-sub">保存到云端</span>
            </div>
          </div>
        </div>

        {syncSuccessMsg && (
          <div className="sync-banner animate-fade-in font-serif">
            <CheckCircle size={16} />
            <span>结构化精华已保存到长期空间 (File_Assistant_Hub/cloud_archive/)！最近同步时间：{lastSyncTime}</span>
          </div>
        )}

        {/* 6+1 Grid Cards */}
        <div className="archive-grid">
          {archives.map(arch => {
            const isTrash = arch.category === 'trash';
            return (
              <div
                key={arch.id}
                className={`archive-box-card card-paper ${isTrash ? 'trash-card' : ''} ${selectedCategory === arch.category ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(arch.category)}
              >
                <div className="box-icon-wrapper">
                  {getCategoryIcon(arch.category)}
                </div>
                <div className="box-content">
                  <h3 className="box-title font-serif">{arch.title}</h3>
                  <p className="box-summary">{arch.summary}</p>
                  <span className="box-count">{arch.itemCount} 条记录</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recently Updated Section */}
        <div className="recent-updates-section card-paper">
          <div className="recent-header">
            <h3 className="recent-title font-serif">最近更新</h3>
            <button className="view-all-btn">查看全部 &gt;</button>
          </div>

          <div className="recent-list">
            {recentUpdates.map(update => (
              <div key={update.id} className="recent-item" onClick={() => setSelectedCategory(update.categoryKey)}>
                <div className="recent-icon-box">
                  {getCategoryIcon(update.categoryKey)}
                </div>
                <div className="recent-details">
                  <span className="recent-cat-title font-serif">{update.categoryTitle}</span>
                  <span className="recent-time">更新于 {update.updatedAt}</span>
                </div>
                <div className="recent-action-link">
                  <span>新增 {update.count} 条</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Archive Inspector Drawer with Full Editable Capabilities */}
        <div className="archive-inspector card-paper">
          <div className="inspector-header font-serif">
            <div className="header-left-title">
              <h3>{activeArchive.title} · 云端记忆明细与编辑</h3>
              <span className="cloud-tag">/cloud_archive/{activeArchive.category}/</span>
            </div>

            <button className="add-highlight-btn" onClick={() => setIsAddingNew(true)}>
              <Plus size={14} />
              <span>添加记忆条目</span>
            </button>
          </div>

          {/* Add New Highlight Form */}
          {isAddingNew && (
            <div className="add-highlight-form card-paper animate-fade-in font-serif">
              <input
                type="text"
                placeholder="输入新记忆要点..."
                value={newHighlightText}
                onChange={e => setNewHighlightText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddHighlight()}
                autoFocus
                className="highlight-input"
              />
              <button className="btn-small save" onClick={handleAddHighlight}><Check size={12} /> 保存</button>
              <button className="btn-small cancel" onClick={() => setIsAddingNew(false)}><X size={12} /> 取消</button>
            </div>
          )}

          <div className="inspector-body">
            <p className="summary font-serif"><strong>【长期总结】</strong>: {activeArchive.summary}</p>
            
            <div className="highlights-editable-list">
              {activeArchive.highlights.map((h, i) => (
                <div key={i} className="highlight-editable-item">
                  {editingHighlightIndex === i ? (
                    <div className="edit-inline-row font-serif">
                      <input
                        type="text"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit(i)}
                        autoFocus
                        className="inline-edit-input"
                      />
                      <button className="icon-save-btn" onClick={() => handleSaveEdit(i)}><Check size={14} /></button>
                      <button className="icon-cancel-btn" onClick={() => setEditingHighlightIndex(null)}><X size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <span className="bullet font-serif font-bold">❖</span>
                      <span className="text-content font-serif">{h}</span>
                      <div className="item-hover-actions">
                        <button className="action-btn" onClick={() => handleStartEdit(i, h)} title="编辑"><Edit3 size={13} /></button>
                        <button className="action-btn danger" onClick={() => handleDeleteHighlight(i)} title="删除"><Trash2 size={13} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .archive-page-container {
          flex: 1; height: 100vh; overflow-y: auto;
          background-color: var(--bg-warm-paper); display: flex; flex-direction: column;
        }

        .archive-header-bar {
          height: 56px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border-color-light); background: rgba(245, 241, 233, 0.85);
          backdrop-filter: blur(8px); position: sticky; top: 0; z-index: 20;
        }

        .bar-left { display: flex; align-items: center; gap: 12px; }

        .icon-only-btn {
          width: 36px; height: 36px; border-radius: 50%; background: #FFFFFF;
          border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;
          color: var(--text-main); cursor: pointer; transition: all 0.2s;
        }

        .icon-only-btn:hover { border-color: var(--primary-blue); color: var(--primary-blue); transform: translateY(-1px); }

        .bar-title { font-size: 18px; font-weight: 600; }
        .bar-actions { display: flex; gap: 10px; }

        .archive-scroll-content {
          max-width: 840px; margin: 0 auto; padding: 32px 24px; width: 100%;
          display: flex; flex-direction: column; gap: 28px;
        }

        .hero-title { font-size: 28px; font-weight: 600; color: var(--text-main); }
        .hero-subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }

        .three-actions-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .action-card {
          padding: 16px 20px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: all 0.2s;
        }
        .action-card:hover { transform: translateY(-2px); border-color: var(--accent-brown); }

        .card-top { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
        .card-action-sub { font-size: 12px; color: var(--text-muted); }

        .sync-banner {
          display: flex; align-items: center; gap: 10px; background: var(--accent-green-light);
          color: #385E3E; padding: 10px 16px; border-radius: var(--radius-md); font-size: 13px;
        }

        .archive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }

        .archive-box-card {
          padding: 20px; display: flex; gap: 16px; cursor: pointer; transition: all 0.2s;
        }

        .archive-box-card:hover, .archive-box-card.selected { border-color: var(--accent-brown); box-shadow: var(--shadow-md); }
        .archive-box-card.trash-card { grid-column: 1 / -1; background: #FAF7F2; }

        .box-icon-wrapper {
          width: 44px; height: 44px; border-radius: 12px; background: var(--bg-warm-paper);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .box-title { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
        .box-summary { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
        .box-count { font-size: 11px; color: var(--text-light); }

        .recent-updates-section { padding: 20px 24px; }
        .recent-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .recent-title { font-size: 16px; font-weight: 600; }
        .view-all-btn { background: none; border: none; font-size: 12px; color: var(--text-muted); cursor: pointer; }

        .recent-list { display: flex; flex-direction: column; gap: 12px; }
        .recent-item { display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; }
        .recent-item:hover { background: var(--bg-warm-paper); }

        .recent-icon-box { width: 34px; height: 34px; border-radius: 50%; background: #F0EDE6; display: flex; align-items: center; justify-content: center; }
        .recent-details { display: flex; flex-direction: column; gap: 2px; }
        .recent-cat-title { font-size: 14px; font-weight: 600; }
        .recent-time { font-size: 11px; color: var(--text-light); }
        .recent-action-link { margin-left: auto; display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); }

        /* Inspector & Inline Editing */
        .archive-inspector { padding: 20px 24px; }
        .inspector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .header-left-title { display: flex; align-items: center; gap: 10px; }
        .header-left-title h3 { font-size: 16px; font-weight: 600; }
        .cloud-tag { font-family: monospace; font-size: 11px; color: var(--primary-blue); background: var(--primary-blue-light); padding: 2px 8px; border-radius: 4px; }

        .add-highlight-btn {
          display: flex; align-items: center; gap: 4px; background: var(--primary-blue);
          color: #FFF; border: none; border-radius: var(--radius-full); padding: 4px 12px; font-size: 12px; cursor: pointer;
        }

        .add-highlight-form { display: flex; gap: 8px; padding: 10px; margin-bottom: 12px; }
        .highlight-input { flex: 1; border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; font-size: 12px; outline: none; }
        .btn-small { border: none; border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .btn-small.save { background: var(--primary-blue); color: #FFF; }
        .btn-small.cancel { background: none; color: var(--text-muted); }

        .inspector-body .summary { font-size: 13px; margin-bottom: 14px; }

        .highlights-editable-list { display: flex; flex-direction: column; gap: 8px; }

        .highlight-editable-item {
          display: flex; align-items: center; gap: 10px; font-size: 13px;
          padding: 6px 8px; border-radius: 6px; position: relative; transition: background 0.15s;
        }

        .highlight-editable-item:hover { background: var(--bg-warm-paper); }

        .item-hover-actions {
          margin-left: auto; display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s;
        }

        .highlight-editable-item:hover .item-hover-actions { opacity: 1; }

        .action-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; }
        .action-btn.danger:hover { color: #E74C3C; }

        .edit-inline-row { display: flex; align-items: center; gap: 6px; width: 100%; }
        .inline-edit-input { flex: 1; border: 1px solid var(--primary-blue); border-radius: 4px; padding: 4px 8px; font-size: 12px; outline: none; }
        .icon-save-btn { background: var(--primary-blue); color: #FFF; border: none; border-radius: 4px; padding: 4px; cursor: pointer; }
        .icon-cancel-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
      `}</style>
    </div>
  );
};
