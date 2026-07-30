import React, { useState } from 'react';
import { Sparkles, X, Check, Image, FileText, Video, Music, Link as LinkIcon, Calendar } from 'lucide-react';
import type { Topic, FavoriteFolder } from '../types';

interface AgentScopeModalProps {
  topics: Topic[];
  favoriteFolders: FavoriteFolder[];
  isGlobal?: boolean;
  onClose: () => void;
  onConfirmSummon: (scope: { topicIds: string[]; dateRange: string; fileTypes: string[] }) => void;
}

export const AgentScopeModal: React.FC<AgentScopeModalProps> = ({
  topics,
  favoriteFolders,
  isGlobal = true,
  onClose,
  onConfirmSummon
}) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(
    topics.length > 0 ? [topics[0].id] : []
  );
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['pdf', 'image', 'text', 'doc', 'link']);

  const toggleTopic = (id: string) => {
    if (selectedTopicIds.includes(id)) {
      setSelectedTopicIds(selectedTopicIds.filter(i => i !== id));
    } else {
      setSelectedTopicIds([...selectedTopicIds, id]);
    }
  };

  const toggleFileType = (type: string) => {
    if (selectedFileTypes.includes(type)) {
      setSelectedFileTypes(selectedFileTypes.filter(t => t !== type));
    } else {
      setSelectedFileTypes([...selectedFileTypes, type]);
    }
  };

  const handleConfirm = () => {
    onConfirmSummon({
      topicIds: selectedTopicIds,
      dateRange: selectedDateRange,
      fileTypes: selectedFileTypes,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="agent-scope-modal card-paper animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-title-group font-serif">
            <Sparkles size={18} className="icon-blue" />
            <h3>OpenClaw · 读取范围精准配置</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body-content">
          <p className="notice-text">
            💡 遵循零浪费原则：平时不读取任何聊天。请选择 AI 允许读取并分析的指定数据范围：
          </p>

          {/* Topics & Folders Selector (if Global) */}
          {isGlobal && (
            <div className="scope-section">
              <h4 className="section-subtitle font-serif">1. 选择参与分析的话题 / 收藏空间 (可多选)</h4>
              <div className="topics-chip-grid">
                {topics.map(t => {
                  const isChecked = selectedTopicIds.includes(t.id);
                  return (
                    <div 
                      key={t.id} 
                      className={`topic-chip ${isChecked ? 'active' : ''}`}
                      onClick={() => toggleTopic(t.id)}
                    >
                      <span className={`chip-check ${isChecked ? 'checked' : ''}`}>
                        {isChecked && <Check size={10} color="#FFF" />}
                      </span>
                      <span>{t.parentCategory ? `${t.parentCategory} · ` : ''}{t.title}</span>
                    </div>
                  );
                })}
              </div>

              <h4 className="section-subtitle font-serif margin-top">收藏夹参与空间</h4>
              <div className="topics-chip-grid">
                {favoriteFolders.map(fav => (
                  <div key={fav.id} className="topic-chip favorite-chip">
                    <span>📂 收藏 · {fav.name} ({fav.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date Filter */}
          <div className="scope-section">
            <h4 className="section-subtitle font-serif">2. 按日期范围筛选</h4>
            <div className="date-filter-row font-serif">
              {[
                { key: 'all', label: '全部历史日期' },
                { key: 'today', label: '近 24 小时 (今天)' },
                { key: '7days', label: '近 7 天' },
                { key: '30days', label: '近 30 天' }
              ].map(d => (
                <button
                  key={d.key}
                  className={`date-btn ${selectedDateRange === d.key ? 'active' : ''}`}
                  onClick={() => setSelectedDateRange(d.key)}
                >
                  <Calendar size={13} />
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Types Selector */}
          <div className="scope-section">
            <h4 className="section-subtitle font-serif">3. 检索格式多选 (包含文件形式)</h4>
            <div className="file-types-grid">
              {[
                { type: 'pdf', label: '文档 / PDF', icon: FileText },
                { type: 'image', label: '图片 / Preview', icon: Image },
                { type: 'video', label: '视频文件', icon: Video },
                { type: 'audio', label: '音频 / 录音', icon: Music },
                { type: 'link', label: '网页链接', icon: LinkIcon }
              ].map(f => {
                const isSelected = selectedFileTypes.includes(f.type);
                const IconComp = f.icon;
                return (
                  <div 
                    key={f.type} 
                    className={`file-type-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleFileType(f.type)}
                  >
                    <IconComp size={16} />
                    <span>{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            <Sparkles size={16} />
            <span>唤醒 AI 读取并提炼</span>
          </button>
        </div>
      </div>

      <style>{`
        .agent-scope-modal {
          width: 620px;
          max-width: 90vw;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        .modal-body-content {
          padding: 20px 24px;
          max-height: 420px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .notice-text {
          font-size: 12px;
          color: var(--text-muted);
          background: var(--bg-agent-light);
          padding: 10px 14px;
          border-radius: var(--radius-md);
        }

        .section-subtitle {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .margin-top { margin-top: 10px; }

        .topics-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .topic-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-warm-paper);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 4px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .topic-chip.active {
          background: var(--primary-blue-light);
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          font-weight: 500;
        }

        .chip-check {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chip-check.checked {
          background: var(--primary-blue);
          border-color: var(--primary-blue);
        }

        .date-filter-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .date-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 4px 12px;
          font-size: 12px;
          cursor: pointer;
        }

        .date-btn.active {
          background: var(--primary-blue);
          color: #FFF;
          border-color: var(--primary-blue);
        }

        .file-types-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .file-type-card {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FAFAFA;
          border: 1px solid var(--border-color-light);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
        }

        .file-type-card.selected {
          border-color: var(--primary-blue);
          background: var(--primary-blue-light);
          color: var(--primary-blue);
          font-weight: 500;
        }

        .modal-footer {
          padding: 14px 24px;
          border-top: 1px solid var(--border-color-light);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: var(--bg-warm-paper);
        }
      `}</style>
    </div>
  );
};
