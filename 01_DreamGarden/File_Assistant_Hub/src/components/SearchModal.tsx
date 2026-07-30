import React, { useState } from 'react';
import { Search, X, Image, FileText, Video, Music, Link as LinkIcon } from 'lucide-react';
import type { FeedItem } from '../types';

interface SearchModalProps {
  feedItems: FeedItem[];
  onClose: () => void;
  onSelectResult: (item: FeedItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  feedItems,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchScope, setSearchScope] = useState<'current' | 'global'>('global');

  const filtered = feedItems.filter(item => {
    // Type Filter
    if (filterType !== 'all' && item.type !== filterType) return false;

    // Text query
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.fileName?.toLowerCase().includes(q) ||
      item.content?.toLowerCase().includes(q) ||
      item.title?.toLowerCase().includes(q) ||
      item.summaryBullets?.some(b => b.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal card-paper animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Top Search Field */}
        <div className="search-header">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="搜索全域文件、图片、链接、短记..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="search-main-input"
          />
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Filters Toolbar */}
        <div className="search-toolbar">
          <div className="scope-toggle font-serif">
            <button 
              className={`scope-btn ${searchScope === 'global' ? 'active' : ''}`}
              onClick={() => setSearchScope('global')}
            >
              全局搜索
            </button>
            <button 
              className={`scope-btn ${searchScope === 'current' ? 'active' : ''}`}
              onClick={() => setSearchScope('current')}
            >
              当前话题空间
            </button>
          </div>

          <div className="type-filters">
            {[
              { key: 'all', label: '全部' },
              { key: 'pdf', label: '文件', icon: FileText },
              { key: 'image', label: '图片', icon: Image },
              { key: 'video', label: '视频', icon: Video },
              { key: 'audio', label: '音频', icon: Music },
              { key: 'link', label: '链接', icon: LinkIcon }
            ].map(f => (
              <button
                key={f.key}
                className={`type-btn ${filterType === f.key ? 'active' : ''}`}
                onClick={() => setFilterType(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="results-scroll-list">
          {filtered.length === 0 ? (
            <div className="no-results">未找到符合搜索条件的信息碎片</div>
          ) : (
            filtered.map(item => (
              <div 
                key={item.id} 
                className="result-item-card"
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
              >
                <div className="item-title-row">
                  <span className="item-title font-serif">
                    {item.fileName || item.title || item.content?.slice(0, 30) || '文本内容'}
                  </span>
                  <span className="item-date">{item.dateGroup} {item.timestamp}</span>
                </div>
                <p className="item-snippet">
                  {item.summaryBullets ? item.summaryBullets.join('；') : item.content || item.linkUrl}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .search-modal {
          width: 640px;
          max-width: 90vw;
          max-height: 520px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .search-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-color-light);
        }

        .search-main-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          color: var(--text-main);
        }

        .search-toolbar {
          padding: 12px 20px;
          background: var(--bg-warm-paper);
          border-bottom: 1px solid var(--border-color-light);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .scope-toggle {
          display: flex;
          gap: 12px;
        }

        .scope-btn {
          background: none;
          border: none;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px 0;
        }

        .scope-btn.active {
          color: var(--primary-blue);
          font-weight: 600;
          border-bottom: 2px solid var(--primary-blue);
        }

        .type-filters {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .type-btn {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 3px 12px;
          font-size: 12px;
          color: var(--text-main);
          cursor: pointer;
        }

        .type-btn.active {
          background: var(--primary-blue);
          color: #FFF;
          border-color: var(--primary-blue);
        }

        .results-scroll-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .result-item-card {
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color-light);
          cursor: pointer;
          transition: background 0.15s;
        }

        .result-item-card:hover {
          background: var(--bg-warm-paper);
        }

        .item-title-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .item-title {
          font-size: 14px;
          font-weight: 600;
        }

        .item-date {
          font-size: 11px;
          color: var(--text-light);
        }

        .item-snippet {
          font-size: 12px;
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .no-results {
          text-align: center;
          color: var(--text-light);
          font-size: 13px;
          padding: 40px 0;
        }
      `}</style>
    </div>
  );
};
