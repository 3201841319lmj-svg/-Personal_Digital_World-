import React, { useMemo } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { getCurrentTimePeriod } from '../../utils/timeUtils';
import { getRandomLivingStatus } from '../../data/livingStatusData';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Showcase.module.css';

export const HomeShowcaseCard: React.FC = () => {
  const { currentArchive, currentArchiveKey, setArchiveKey } = useHomeStore();
  const timePeriod = getCurrentTimePeriod();

  // Dynamic Scene Image based on TimePeriod (morning / afternoon / night)
  const currentSceneImage = currentArchive.timeImages[timePeriod] || currentArchive.timeImages.morning;

  // Random Living Status (Action + Item)
  const livingStatus = useMemo(() => {
    return getRandomLivingStatus(currentArchive.sceneType);
  }, [currentArchiveKey, timePeriod]);

  return (
    <section className={styles.showcaseCard}>
      {/* 4 Space Showcase Selector Bar */}
      <div className={styles.sceneSelectorRow}>
        <button 
          className={`${styles.sceneBtn} ${currentArchiveKey === 'farm' ? styles.activeScene : ''}`}
          onClick={() => setArchiveKey('farm')}
        >
          <PixelIcon name="farm_house" size={20} />
          <span>农场</span>
        </button>
        <button 
          className={`${styles.sceneBtn} ${currentArchiveKey === 'magic' ? styles.activeScene : ''}`}
          onClick={() => setArchiveKey('magic')}
        >
          <PixelIcon name="workshop" size={20} />
          <span>工坊</span>
        </button>
        <button 
          className={`${styles.sceneBtn} ${currentArchiveKey === 'study' ? styles.activeScene : ''}`}
          onClick={() => setArchiveKey('study')}
        >
          <PixelIcon name="feather_ink" size={20} />
          <span>书房</span>
        </button>
        <button 
          className={`${styles.sceneBtn} ${currentArchiveKey === 'restaurant' ? styles.activeScene : ''}`}
          onClick={() => setArchiveKey('restaurant')}
        >
          <PixelIcon name="tea_bread" size={20} />
          <span>餐厅</span>
        </button>
      </div>

      {/* Main Image Banner Slot - NO titles inside picture frame */}
      <div className={styles.imageSlotContainer}>
        <div className={styles.imageFrame}>
          <img 
            src={currentSceneImage} 
            alt={currentArchive.displayName} 
            className={styles.sceneImage} 
          />
          <div className={`${styles.timePeriodOverlay} ${styles[timePeriod]}`}></div>
        </div>

        {/* Stardew Valley Style Pixel Chicken Badge */}
        <div className={styles.pixelChickenBadge}>
          🐔
        </div>
      </div>

      {/* Single Row with Two Parallel Side-by-Side Boxes */}
      <div className={styles.sideBySideRow}>
        {/* Left Box: Dynamic Living Status Display (例 🌱 播种 🍅 番茄) */}
        <div className={styles.livingStatusBox}>
          <span className={styles.statusActionGroup}>
            <span className={styles.statusIcon}>{livingStatus.actionIcon}</span>
            <span className={styles.statusText}>{livingStatus.actionText}</span>
          </span>
          <span className={styles.statusItemGroup}>
            <span className={styles.statusIcon}>{livingStatus.itemIcon}</span>
            <span className={styles.statusText}>{livingStatus.itemText}</span>
          </span>
        </div>

        {/* Right Box: Compact Resource Stats Display */}
        <div className={styles.compactStatsBox}>
          {currentArchive.compactStats.slice(0, 2).map(item => (
            <div key={item.id} className={styles.compactItem}>
              <span className={styles.compactIcon}>{item.icon}</span>
              <span className={styles.compactName}>{item.name}</span>
              <span className={styles.compactCount}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
