import React from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Modal.module.css';

export const AgentSelectorModal: React.FC = () => {
  const { isAgentModalOpen, setIsAgentModalOpen, agents, toggleAgentEnabled } = useHomeStore();

  if (!isAgentModalOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setIsAgentModalOpen(false)}>
      <div className={styles.agentSelectorCard} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <PixelIcon name="agent" size={20} />
            <h3 className={styles.modalTitle}>选择在场的 AI 伙伴</h3>
          </div>
          <button 
            className={styles.closeBtn}
            onClick={() => setIsAgentModalOpen(false)}
            title="关闭窗口"
          >
            <PixelIcon name="close" size={16} />
          </button>
        </div>

        <p className={styles.modalTip}>勾选参与当前家园对话的伙伴，支持多 Agent 组合对谈！</p>

        <div className={styles.agentGrid}>
          {agents.filter(a => a.id !== 'fanfiction_writer').map(agent => {
            const isSelected = agent.isEnabled;
            return (
              <div 
                key={agent.id}
                className={`${styles.agentGridCard} ${isSelected ? styles.selectedAgent : ''}`}
                onClick={() => toggleAgentEnabled(agent.id)}
              >
                <div className={styles.checkIndicator}>
                  {isSelected && <PixelIcon name="sparkle" size={12} />}
                </div>
                <div className={styles.agentAvatarLarge}>{agent.avatarUrl}</div>
                <h4 className={styles.agentName}>{agent.name}</h4>
                <span className={styles.agentRole}>{agent.roleTitle}</span>
                <p className={styles.agentPersonality}>{agent.personality}</p>
              </div>
            );
          })}
        </div>

        <button 
          className={styles.confirmBtn}
          onClick={() => setIsAgentModalOpen(false)}
        >
          确定选择
        </button>
      </div>
    </div>
  );
};
