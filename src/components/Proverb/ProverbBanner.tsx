import React, { useMemo } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { getCurrentTimePeriod } from '../../utils/timeUtils';
import { getDailyQuote } from '../../data/homeDailyQuotesData';
import styles from './Proverb.module.css';

export const ProverbBanner: React.FC = () => {
  const { currentArchiveKey } = useHomeStore();
  const timePeriod = getCurrentTimePeriod();

  // Randomly select quote based on scene & time period
  const dailyQuote = useMemo(() => {
    return getDailyQuote(currentArchiveKey, timePeriod);
  }, [currentArchiveKey, timePeriod]);

  return (
    <div className={styles.proverbContainer}>
      <span className={styles.quoteText}>{dailyQuote}</span>
    </div>
  );
};
