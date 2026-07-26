import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { X, User, Users, Brain, Cpu, Palette } from 'lucide-react';
import { UserProfileTab } from '../Settings/UserProfileTab';
import { AgentManagementTab } from '../Settings/AgentManagementTab';
import { MemoryManagementTab } from '../Settings/MemoryManagementTab';
import { ModelConfigTab } from '../Settings/ModelConfigTab';
import { ThemeConfigTab } from '../Settings/ThemeConfigTab';
import styles from './Modal.module.css';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen } = useHomeStore();
  const [activeTab, setActiveTab] = useState<'user' | 'agents' | 'memory' | 'model' | 'theme'>('user');

  if (!isSettingsOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setIsSettingsOpen(false)}>
      <div className={styles.settingsModalCard} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <h2 className={styles.modalTitle}>家园与 Agent 配置中心</h2>
          </div>
          <button 
            className={styles.closeBtn}
            onClick={() => setIsSettingsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Left Category Tabs & Right Content */}
        <div className={styles.modalBody}>
          {/* Left Category Navigation (Simplified 2-char labels for mobile single row) */}
          <div className={styles.categorySidebar}>
            <button 
              className={`${styles.catBtn} ${activeTab === 'user' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('user')}
            >
              <User size={15} />
              <span>用户</span>
            </button>

            <button 
              className={`${styles.catBtn} ${activeTab === 'agents' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('agents')}
            >
              <Users size={15} />
              <span>伙伴</span>
            </button>

            <button 
              className={`${styles.catBtn} ${activeTab === 'memory' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('memory')}
            >
              <Brain size={15} />
              <span>记忆</span>
            </button>

            <button 
              className={`${styles.catBtn} ${activeTab === 'model' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('model')}
            >
              <Cpu size={15} />
              <span>模型</span>
            </button>

            <button 
              className={`${styles.catBtn} ${activeTab === 'theme' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              <Palette size={15} />
              <span>外观</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className={styles.contentArea}>
            {activeTab === 'user' && <UserProfileTab />}
            {activeTab === 'agents' && <AgentManagementTab />}
            {activeTab === 'memory' && <MemoryManagementTab />}
            {activeTab === 'model' && <ModelConfigTab />}
            {activeTab === 'theme' && <ThemeConfigTab />}
          </div>
        </div>
      </div>
    </div>
  );
};
