import React from 'react';
import { useHomeStore, TabType } from '../../store/useHomeStore';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Navigation.module.css';

export const HomeNavigation: React.FC = () => {
  const { activeTab, setActiveTab, letters } = useHomeStore();

  const unreadCount = letters.filter(l => !l.isRead).length;

  const navItems: Array<{ id: TabType; title: string; icon: string; anim?: any }> = [
    { id: 'farm', title: '农场', icon: 'sprout_field', anim: 'sway' },
    { id: 'livingroom', title: '客厅', icon: 'sofa', anim: 'pulse' },
    { id: 'study', title: '书房', icon: 'ancient_tome' },
    { id: 'bedroom', title: '卧室', icon: 'diary', anim: 'pulse' }
  ];

  return (
    <nav className={styles.singleLineNavDesk}>
      <div className={styles.singleLineRow}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`${styles.navInlineBtn} ${isActive ? styles.activeInlineBtn : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {/* Pixel Cozy Icon and Title on the same single line */}
              <PixelIcon name={item.icon} size={20} animate={isActive ? (item.anim || 'bounce') : 'none'} />
              <span className={styles.inlineTitle}>{item.title}</span>

              {/* Unread mail badge mounted on Study */}
              {item.id === 'study' && unreadCount > 0 && (
                <span className={styles.inlineBadge}>{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
