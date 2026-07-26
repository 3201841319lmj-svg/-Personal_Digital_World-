import React, { useState } from 'react';
import { GazetteBoard } from '../components/Study/GazetteBoard';
import { OracleCorner } from '../components/Study/OracleCorner';
import { WritingDesk } from '../components/Study/WritingDesk';
import { BedsideDiary } from '../components/Study/BedsideDiary';
import { PixelIcon } from '../components/Common/PixelIcon';
import styles from '../components/Study/Study.module.css';

type StudyTab = 'gazette' | 'oracle' | 'desk' | 'diary';

export const StudyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudyTab>('gazette');

  return (
    <div className={styles.studyWrapper}>
      {/* Top Sub-Navigation with Pixel Icons */}
      <div className={styles.zoneSwitcherBar}>
        <button 
          className={`${styles.zoneBtn} ${activeTab === 'gazette' ? styles.activeZoneBtn : ''}`}
          onClick={() => setActiveTab('gazette')}
        >
          <PixelIcon name="gazette" size={16} />
          <span>剪报</span>
        </button>

        <button 
          className={`${styles.zoneBtn} ${activeTab === 'oracle' ? styles.activeZoneBtn : ''}`}
          onClick={() => setActiveTab('oracle')}
        >
          <PixelIcon name="tarot" size={16} />
          <span>传讯</span>
        </button>

        <button 
          className={`${styles.zoneBtn} ${activeTab === 'desk' ? styles.activeZoneBtn : ''}`}
          onClick={() => setActiveTab('desk')}
        >
          <PixelIcon name="mail" size={16} />
          <span>信件</span>
        </button>

        <button 
          className={`${styles.zoneBtn} ${activeTab === 'diary' ? styles.activeZoneBtn : ''}`}
          onClick={() => setActiveTab('diary')}
        >
          <PixelIcon name="diary" size={16} />
          <span>日记</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className={styles.zoneContentContainer}>
        {activeTab === 'gazette' && <GazetteBoard />}
        {activeTab === 'oracle' && <OracleCorner />}
        {activeTab === 'desk' && <WritingDesk />}
        {activeTab === 'diary' && <BedsideDiary />}
      </div>
    </div>
  );
};
