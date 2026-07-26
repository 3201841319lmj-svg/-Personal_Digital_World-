import React, { useState, useEffect } from 'react';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Chat.module.css';

interface Props {
  thinkingText?: string | string[];
  thinkingProcess?: string[];
  isThinkingDone?: boolean;
  thinkingDuration?: string;
}

export const ThinkingProcessAccordion: React.FC<Props> = ({
  thinkingText,
  thinkingProcess = [],
  isThinkingDone = true,
  thinkingDuration = '1.2s'
}) => {
  const [isExpanded, setIsExpanded] = useState(!isThinkingDone);

  useEffect(() => {
    if (isThinkingDone) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [isThinkingDone]);

  // Normalize thinking steps array
  let steps: string[] = [];
  if (Array.isArray(thinkingProcess) && thinkingProcess.length > 0) {
    steps = thinkingProcess;
  } else if (Array.isArray(thinkingText) && thinkingText.length > 0) {
    steps = thinkingText;
  } else if (typeof thinkingText === 'string' && thinkingText.trim()) {
    steps = [thinkingText];
  }

  if (steps.length === 0) return null;

  return (
    <div className={styles.thinkingAccordionWrapper}>
      {/* Collapsible Header Button */}
      <button 
        className={`${styles.thinkingHeaderBtn} ${isExpanded ? styles.expandedHeader : ''}`}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <div className={styles.headerLeft}>
          <PixelIcon name="thinking" size={14} animate={!isThinkingDone ? "sparkle" : "none"} />
          <span className={styles.thinkingLabelText}>
            {isThinkingDone ? `已深度思考 (耗时 ${thinkingDuration})` : 'AI 思考推演中……'}
          </span>
        </div>
        
        <div className={styles.headerRight}>
          <span className={styles.toggleHintText}>{isExpanded ? '收起思考' : '展开思考'}</span>
          <PixelIcon name={isExpanded ? 'back' : 'scroll'} size={12} />
        </div>
      </button>

      {/* Expanded Thinking Log Steps */}
      {isExpanded && (
        <div className={styles.thinkingLogContent}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.thinkingStepItem}>
              <span className={styles.stepDot}>•</span>
              <span className={styles.stepText}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
