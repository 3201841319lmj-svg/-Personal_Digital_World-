import React from 'react';
import { ThinkingDepthLevel } from '../../types';
import { Sparkles, Check } from 'lucide-react';
import styles from './Composer.module.css';

interface Props {
  currentLevel: ThinkingDepthLevel;
  onSelectLevel: (level: ThinkingDepthLevel) => void;
  onClose: () => void;
}

export const ThinkingDepthMenu: React.FC<Props> = ({ currentLevel, onSelectLevel, onClose }) => {
  const levels: Array<{ id: ThinkingDepthLevel; name: string; desc: string; icon: string }> = [
    { id: 'off', name: '关闭思考', desc: '标准极速响应模式', icon: '⚪' },
    { id: 'normal', name: '普通思考', desc: '轻度推演与情境关联', icon: '✦' },
    { id: 'deep', name: '深度思考', desc: '深度逻辑分析与多步决策', icon: '✨' },
    { id: 'ultra', name: '极深思考', desc: '最大化启发推理与全向反思', icon: '🌟' }
  ];

  return (
    <div className={styles.thinkingDepthMenuPopover} onClick={e => e.stopPropagation()}>
      <div className={styles.menuHeader}>
        <Sparkles size={16} className={styles.starIcon} />
        <span>思考深度设置</span>
      </div>

      <div className={styles.levelList}>
        {levels.map(lvl => {
          const isSelected = currentLevel === lvl.id;
          return (
            <button 
              key={lvl.id}
              className={`${styles.levelItemBtn} ${isSelected ? styles.levelSelected : ''}`}
              onClick={() => {
                onSelectLevel(lvl.id);
                onClose();
              }}
            >
              <span className={styles.levelSymbol}>{lvl.icon}</span>
              <div className={styles.levelMeta}>
                <span className={styles.levelName}>{lvl.name}</span>
                <span className={styles.levelDesc}>{lvl.desc}</span>
              </div>
              {isSelected && <Check size={16} className={styles.checkMark} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
