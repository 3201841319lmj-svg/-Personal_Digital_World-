import React from 'react';
import { HomeShowcaseCard } from '../components/Showcase/HomeShowcaseCard';
import { ProverbBanner } from '../components/Proverb/ProverbBanner';
import { FarmChatComposer } from '../components/Composer/FarmChatComposer';
import { useHomeStore } from '../store/useHomeStore';
import { Sparkles, Users } from 'lucide-react';
import styles from './Pages.module.css';

export const HomePage: React.FC = () => {
  const { agents, setActiveTab } = useHomeStore();
  const enabledAgents = agents.filter(a => a.isEnabled);

  return (
    <div className={styles.homePageWrapper}>
      {/* Desktop 2-Column Responsive Grid */}
      <div className={styles.homeDesktopGrid}>
        {/* Left Column: Showcase Card + Daily Proverb */}
        <div className={styles.homeLeftCol}>
          <HomeShowcaseCard />
          <ProverbBanner />
        </div>

        {/* Right Column: Chat Composer + Active Companions Panel */}
        <div className={styles.homeRightCol}>
          <div className={styles.companionDesktopPanel}>
            <div className={styles.panelHeaderRow}>
              <Users size={16} />
              <span>在场的 AI 伙伴 ({enabledAgents.length})</span>
            </div>

            <div className={styles.companionChipsRow}>
              {enabledAgents.map(agent => (
                <div key={agent.id} className={styles.companionChipCard} onClick={() => setActiveTab('livingroom')}>
                  <span className={styles.chipAvatar}>{agent.avatarUrl}</span>
                  <div className={styles.chipMeta}>
                    <span className={styles.chipName}>{agent.name}</span>
                    <span className={styles.chipTitle}>{agent.roleTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FarmChatComposer />
        </div>
      </div>
    </div>
  );
};
