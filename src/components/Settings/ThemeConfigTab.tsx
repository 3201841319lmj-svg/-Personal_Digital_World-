import React from 'react';
import { useHomeStore, ThemeType } from '../../store/useHomeStore';
import { Check } from 'lucide-react';
import styles from '../Modal/Modal.module.css';

export const ThemeConfigTab: React.FC = () => {
  const { currentTheme, setTheme } = useHomeStore();

  const themes: Array<{ id: ThemeType; name: string; desc: string; bg: string; border: string; text: string }> = [
    {
      id: 'parchment',
      name: '🌾 经典羊皮纸 (默认)',
      desc: '温暖木质棕 + 手写感羊皮纸',
      bg: '#F4EBD7',
      border: '#8B6240',
      text: '#4A3525'
    },
    {
      id: 'moss',
      name: '🌿 青苔自然风',
      desc: '橄榄农场绿 + 树荫晨露纹理',
      bg: '#E4EDD6',
      border: '#647B46',
      text: '#253313'
    },
    {
      id: 'starry',
      name: '🔮 梦境星空夜',
      desc: '深紫银月光 + 星辉柔暖手绘',
      bg: '#E6D9F5',
      border: '#6B4C9A',
      text: '#271447'
    }
  ];

  return (
    <div className={styles.tabPanelContent}>
      <div className={styles.panelTopRow}>
        <div>
          <h3 className={styles.panelTitle}>外观与手账主题</h3>
          <p className={styles.panelDesc}>个性化您的 AI 家园界面色彩与古朴纹理（点击卡片即可实时切换应用主题）</p>
        </div>
      </div>

      <div className={styles.themeGrid}>
        {themes.map(t => {
          const isSelected = currentTheme === t.id;
          return (
            <div 
              key={t.id}
              className={`${styles.themeCard} ${isSelected ? styles.themeActive : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <div className={styles.themePreviewHeader} style={{ background: t.bg, borderColor: t.border }}>
                <span style={{ color: t.text }}>{t.name}</span>
              </div>
              <div className={styles.themeMeta}>
                <span>{t.desc}</span>
                {isSelected && <Check size={16} className={styles.themeCheck} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
