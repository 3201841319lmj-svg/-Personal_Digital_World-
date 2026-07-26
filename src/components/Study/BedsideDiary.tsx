import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { Sun, Moon, Calendar, BookOpen } from 'lucide-react';
import { TypewriterText } from '../Common/TypewriterText';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Study.module.css';

export const BedsideDiary: React.FC = () => {
  const { diaryEntries, addDiaryEntry, deleteDiaryEntry } = useHomeStore();

  const [userInput, setUserInput] = useState('');
  const [mode, setMode] = useState<'instant' | 'overnight'>('instant');
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');

  const latestEntry = diaryEntries[0];

  const handleSaveDiary = () => {
    if (!userInput.trim()) return;
    addDiaryEntry(userInput, mode);
    setUserInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-wood-deep)' }}>
          心事日记本
        </span>

        {/* View Switcher: Current Spread vs History Browsing */}
        <button 
          onClick={() => setViewMode(prev => prev === 'current' ? 'history' : 'current')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--color-wood-base)',
            color: '#FFF',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <PixelIcon name={viewMode === 'current' ? 'gazette' : 'scroll'} size={14} />
          <span>{viewMode === 'current' ? '历史心事 (' + diaryEntries.length + ')' : '今日对开撰写'}</span>
        </button>
      </div>

      {viewMode === 'current' ? (
        /* Book Spread Card */
        <div className={styles.bookSpreadCard}>
          <div className={styles.bookSpineDivider} />

          {/* Left Page: User Input (Enlarged Area & Removed Header Title) */}
          <div className={styles.bookLeftPage}>
            <textarea 
              className={styles.diaryInputArea}
              placeholder="在风轻云淡的夜色中，写下今天遇到的琐事、挫折或心情倾诉..."
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              style={{ height: '240px' }} // Greatly enlarged input area
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span className={styles.pageHeaderTitle}>✨ AI 悄悄话与暖心贴纸</span>
              {latestEntry && (
                <button 
                  className={styles.hoverItemDeleteBtn}
                  onClick={() => {
                    if (confirm('确定要擦除该条心事日记吗？此操作无法撤销。')) {
                      deleteDiaryEntry(latestEntry.id);
                    }
                  }}
                  title="擦除日记"
                >
                  <PixelIcon name="trash" size={14} />
                </button>
              )}
            </div>

            {latestEntry ? (
              <div className={styles.aiReplyPaper} style={{ minHeight: '240px' }}>
                <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '4px' }}>
                  {latestEntry.timestamp}
                </div>
                <p><TypewriterText text={latestEntry.aiResponse} speed={20} isLatest={false} /></p>

                {/* Pixel Mood Sticker */}
                <div className={styles.pixelStickerBadge} title="基于情绪匹配的像素贴纸">
                  {latestEntry.moodSticker}
                </div>
              </div>
            ) : (
              <div className={styles.aiReplyPaper} style={{ color: '#888', fontStyle: 'italic', minHeight: '240px' }}>
                在左页写下您的第一篇心事，右页将为您留下一枚温暖的像素贴纸与悄悄话...
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Diary Page List View (Torn Pages) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '440px', overflowY: 'auto' }} className="custom-scroll">
          {diaryEntries.map(entry => (
            <div 
              key={entry.id}
              className={styles.diaryHistoryCard}
              style={{
                background: '#FFF9EF',
                border: '1.5px solid var(--color-wood-base)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
                boxShadow: 'var(--shadow-parchment)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed #CFC0A0', paddingBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-wood-deep)' }}>🗓️ {entry.timestamp}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{entry.moodSticker}</span>
                  <button 
                    className={styles.hoverItemDeleteBtn}
                    onClick={() => {
                      if (confirm('确定要擦除该条心事日记吗？此操作无法撤销。')) {
                        deleteDiaryEntry(entry.id);
                      }
                    }}
                    title="擦除日记"
                  >
                    <PixelIcon name="trash" size={14} />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--color-wood-deep)', fontStyle: 'italic', background: 'rgba(0,0,0,0.03)', padding: '6px', borderRadius: '6px' }}>
                ✍️ 倾诉：“{entry.userContent}”
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--color-wood-deep)', fontFamily: 'var(--font-serif)', lineHeight: 1.4 }}>
                ✨ 悄悄话：{entry.aiResponse}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
