import React from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './HeaderSection.module.css';

export const HeaderSection: React.FC = () => {
  const { 
    isHistoryOpen, 
    toggleHistory, 
    setIsSettingsOpen, 
    startNewChat, 
    activeTab,
    isLivingSearchOpen,
    toggleLivingSearch,
    isLivingTopicDrawerOpen,
    toggleLivingTopicDrawer
  } = useHomeStore();

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'farm':
        return '欢迎回来，农场主';
      case 'livingroom':
        return '客厅对谈';
      case 'study':
        return '星空书房';
      case 'bedroom':
        return '星夜卧室';
    }
  };

  return (
    <header className={styles.headerContainer}>
      {/* Left Bookmark Drawer Toggle */}
      <div className={styles.leftGroup}>
        <button 
          className={`${styles.drawerToggle} ${isHistoryOpen ? styles.active : ''}`}
          onClick={toggleHistory}
          title={isHistoryOpen ? "关闭历史聊天" : "展开历史聊天"}
        >
          <PixelIcon name="menu" size={18} />
        </button>
        <h1 className={styles.mainTitle}>{getHeaderTitle()}</h1>
      </div>

      {/* Right Action Buttons with Pixel Glyphs (设置在左，新建在右) */}
      <div className={styles.rightActions}>
        {activeTab === 'livingroom' ? (
          <>
            {/* 🔍 Search Chat */}
            <button 
              className={`${styles.iconOnlyBtn} ${isLivingSearchOpen ? styles.activeIcon : ''}`}
              onClick={toggleLivingSearch}
              title="搜索聊天记录"
            >
              <PixelIcon name="search" size={18} />
            </button>

            {/* 📑 Topic Directory */}
            <button 
              className={`${styles.iconOnlyBtn} ${isLivingTopicDrawerOpen ? styles.activeIcon : ''}`}
              onClick={toggleLivingTopicDrawer}
              title="话题目录"
            >
              <PixelIcon name="gazette" size={18} />
            </button>

            {/* ⚙️ Settings (Left) */}
            <button 
              className={styles.iconOnlyBtn}
              onClick={() => setIsSettingsOpen(true)}
              title="设置"
            >
              <PixelIcon name="settings" size={18} />
            </button>

            {/* ✍️ New Topic (Right) */}
            <button 
              className={styles.iconOnlyBtn}
              onClick={startNewChat}
              title="新建话题"
            >
              <PixelIcon name="edit" size={18} />
            </button>
          </>
        ) : (
          <>
            {/* ⚙️ Settings (Left) */}
            <button 
              className={styles.iconOnlyBtn} 
              onClick={() => setIsSettingsOpen(true)}
              title="设置"
            >
              <PixelIcon name="settings" size={18} />
            </button>

            {/* ✍️ New Chat (Right) */}
            <button 
              className={styles.iconOnlyBtn} 
              onClick={startNewChat}
              title="新建对话"
            >
              <PixelIcon name="edit" size={18} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
