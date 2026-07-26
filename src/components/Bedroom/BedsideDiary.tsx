import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { Heart, Moon, Sun, Send } from 'lucide-react';
import styles from './Bedroom.module.css';

export const BedsideDiary: React.FC = () => {
  const { diaryEntries, addDiaryEntry } = useHomeStore();

  const [userInput, setUserInput] = useState('');
  const [mode, setMode] = useState<'instant' | 'overnight'>('instant');

  const latestEntry = diaryEntries[0];

  const handleSaveDiary = () => {
    if (!userInput.trim()) return;
    addDiaryEntry(userInput, mode);
    setUserInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 800, color: '#E3CEFF' }}>
        📖 床头心事日记本（倾诉与情绪陪伴）
      </div>

      {/* Book Spread Card */}
      <div className={styles.bookSpreadCard}>
        <div className={styles.bookSpineDivider} />

        {/* Left Page: User Input */}
        <div className={styles.bookLeftPage}>
          <span className={styles.pageHeaderTitle}>✍️ 农场主的心事倾诉页</span>

          <textarea 
            className={styles.diaryInputArea}
            placeholder="在夜光下写下今天遇到的琐事、挫折或心情..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
          />

          <div className={styles.modeToggleRow}>
            <button 
              className={`${styles.modePillBtn} ${mode === 'instant' ? styles.activeModePill : ''}`}
              onClick={() => setMode('instant')}
            >
              <Sun size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
              即时模式
            </button>

            <button 
              className={`${styles.modePillBtn} ${mode === 'overnight' ? styles.activeModePill : ''}`}
              onClick={() => setMode('overnight')}
            >
              <Moon size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
              过夜/睡觉模式
            </button>
          </div>

          <button className={styles.sealDiaryBtn} onClick={handleSaveDiary}>
            💌 封存心事 · 听候悄悄话
          </button>
        </div>

        {/* Right Page: AI Response + Mood Sticker */}
        <div className={styles.bookRightPage}>
          <span className={styles.pageHeaderTitle}>✨ AI 悄悄话与暖心贴纸</span>

          {latestEntry ? (
            <div className={styles.aiReplyPaper}>
              <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '4px' }}>
                {latestEntry.timestamp}
              </div>
              <p>{latestEntry.aiResponse}</p>

              {/* Pixel Mood Sticker */}
              <div className={styles.pixelStickerBadge} title="基于情绪匹配的像素贴纸">
                {latestEntry.moodSticker}
              </div>
            </div>
          ) : (
            <div className={styles.aiReplyPaper} style={{ color: '#888', fontStyle: 'italic' }}>
              在左页写下您的第一篇心事，右页将为您留下一枚温暖的像素贴纸与悄悄话...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
