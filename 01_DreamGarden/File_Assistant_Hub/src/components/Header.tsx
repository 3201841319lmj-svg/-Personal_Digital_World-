import React from 'react';
import { Search, Sparkles, Plus, ArrowLeft } from 'lucide-react';
import type { Topic } from '../types';

interface HeaderProps {
  currentTopic?: Topic | null;
  onOpenSearch: () => void;
  onSummonAgent: () => void;
  onNewTopic: () => void;
  onBackToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTopic,
  onOpenSearch,
  onSummonAgent,
  onNewTopic,
  onBackToHome
}) => {
  return (
    <header className="header-bar">
      <div className="header-left">
        {/* Minimal Icon-only Back Button */}
        <button className="icon-only-btn" onClick={onBackToHome} title="返回首页">
          <ArrowLeft size={18} />
        </button>

        <div className="header-title-container">
          <h2 className="header-title font-serif">{currentTopic ? currentTopic.title : '客户方案'}</h2>
          {currentTopic?.parentCategory && (
            <span className="header-category-tag">
              {currentTopic.parentCategory} »
            </span>
          )}
        </div>
      </div>

      {/* Pure Icon-only Action Buttons */}
      <div className="header-actions">
        <button className="icon-only-btn" onClick={onOpenSearch} title="搜索">
          <Search size={18} />
        </button>

        <button className="icon-only-btn agent-btn" onClick={onSummonAgent} title="召唤 OpenClaw Agent">
          <Sparkles size={18} className="sparkle-icon" />
        </button>

        <button className="icon-only-btn" onClick={onNewTopic} title="新建话题">
          <Plus size={18} />
        </button>
      </div>

      <style>{`
        .header-bar {
          height: 56px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color-light);
          background: rgba(245, 241, 233, 0.85);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-only-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .icon-only-btn:hover {
          background: var(--bg-card-subtle);
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          transform: translateY(-1px);
        }

        .header-title-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-title {
          font-size: 17px;
          font-weight: 600;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .header-category-tag {
          font-size: 11px;
          color: var(--text-muted);
          background: var(--bg-card-subtle);
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .agent-btn {
          color: var(--primary-blue);
        }

        .sparkle-icon {
          color: var(--primary-blue);
        }
      `}</style>
    </header>
  );
};
