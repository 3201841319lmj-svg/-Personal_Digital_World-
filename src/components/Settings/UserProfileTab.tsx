import React from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import styles from '../Modal/Modal.module.css';

export const UserProfileTab: React.FC = () => {
  const { userProfile, updateUserProfile } = useHomeStore();

  return (
    <div className={styles.tabPanelContent}>
      <div className={styles.panelTopRow}>
        <div>
          <h3 className={styles.panelTitle}>农场主个人资料</h3>
          <p className={styles.panelDesc}>设置您在 AI 家园中的个人身份与个性签名</p>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>农场主头像</label>
        <div className={styles.avatarRow}>
          <div className={styles.largeAvatarBox}>{userProfile.avatar}</div>
          <div className={styles.avatarPresets}>
            {['🤠', '🌾', '👨‍🌾', '👩‍🌾', '👑', '🧙‍♂️'].map(emoji => (
              <button 
                key={emoji} 
                className={`${styles.presetBtn} ${userProfile.avatar === emoji ? styles.presetActive : ''}`}
                onClick={() => updateUserProfile({ avatar: emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>昵称</label>
          <input 
            type="text" 
            className={styles.textInput}
            value={userProfile.name}
            onChange={e => updateUserProfile({ name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>身份头衔</label>
          <input 
            type="text" 
            className={styles.textInput}
            value={userProfile.roleTitle}
            onChange={e => updateUserProfile({ roleTitle: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>个人简介 / 人设</label>
        <textarea 
          className={styles.textareaInput}
          value={userProfile.bio}
          onChange={e => updateUserProfile({ bio: e.target.value })}
          rows={2}
        />
      </div>

      {/* Signature & Toggle System */}
      <div className={styles.formGroup}>
        <div className={styles.switchRow}>
          <div>
            <label className={styles.formLabel}>个性签名</label>
            <p className={styles.fieldDesc}>开启后在单聊顶栏与群聊昵称旁显示您的签名</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={userProfile.enableSignature}
              onChange={e => updateUserProfile({ enableSignature: e.target.checked })}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <input 
          type="text" 
          className={styles.textInput}
          placeholder="写下您的个性签名..."
          value={userProfile.signature}
          onChange={e => updateUserProfile({ signature: e.target.value })}
          disabled={!userProfile.enableSignature}
        />
      </div>
    </div>
  );
};
