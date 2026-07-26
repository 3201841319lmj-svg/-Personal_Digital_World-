import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { Search, X, ChevronDown } from 'lucide-react';
import styles from './Drawer.module.css';

export const HistoryDrawer: React.FC = () => {
  const { isHistoryOpen, setIsHistoryOpen, setActiveTab, historySessions } = useHomeStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isHistoryOpen) return null;

  const filtered = historySessions.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.overlayMask} onClick={() => setIsHistoryOpen(false)}>
      <aside className={styles.historyDrawerOverlay} onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.decorSymbol}>≫</span>
            <h2 className={styles.drawerTitle}>历史聊天</h2>
            <span className={styles.decorSymbol}>≪</span>
          </div>
          <button 
            className={styles.closeBtn}
            onClick={() => setIsHistoryOpen(false)}
            title="关闭抽屉"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="搜索聊天记录"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* History Items List (NO AVATARS, formatted as 【Agent名字】标题) */}
        <div className={styles.historyList}>
          {filtered.map(item => (
            <div 
              key={item.id} 
              className={styles.historyItemCard}
              onClick={() => {
                setActiveTab('livingroom');
                setIsHistoryOpen(false);
              }}
            >
              <div className={styles.itemMeta}>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <span className={styles.itemTime}>{item.lastTimestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expand More Button */}
        <button className={styles.expandMoreBtn}>
          <span>展开更多记录</span>
          <ChevronDown size={16} />
        </button>
      </aside>
    </div>
  );
};
