import React from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { ShieldCheck, HardDrive, RefreshCw, Archive } from 'lucide-react';
import styles from '../Modal/Modal.module.css';

export const MemoryManagementTab: React.FC = () => {
  const { agents, archivedAgents, restoreAgent } = useHomeStore();

  return (
    <div className={styles.tabPanelContent}>
      <div className={styles.panelTopRow}>
        <div>
          <h3 className={styles.panelTitle}>记忆管理与数据隔离</h3>
          <p className={styles.panelDesc}>查看 Agent 独立记忆库、云端归档记录与 OpenClaw 管理员恢复功能</p>
        </div>
      </div>

      {/* OpenClaw Admin Privilege Notice */}
      <div className={styles.masterBanner}>
        <ShieldCheck size={20} className={styles.shieldIcon} />
        <div>
          <strong>OpenClaw 管理员特权与云端记忆封存机制</strong>
          <p>伙伴从农场主管理列表移除后，其记忆库绝不删除。OpenClaw 可在云端服务器永久封存，有需要时可随时一键恢复载入！</p>
        </div>
      </div>

      {/* Active Agent Memory Cards */}
      <div className={styles.memoryGrid}>
        <h4 className={styles.sectionHeaderTitle}>在线 Agent 独立记忆库</h4>
        {agents.map(agent => (
          <div key={agent.id} className={styles.memoryCard}>
            <div className={styles.memoryCardHeader}>
              <span className={styles.memoryAvatar}>{agent.avatarUrl}</span>
              <div className={styles.memoryMeta}>
                <span className={styles.memoryAgentName}>{agent.name}</span>
                <span className={styles.memoryDbId}>DB: {agent.memoryDbId}</span>
              </div>
              {agent.isMasterAgent && <span className={styles.adminTag}>全局管理</span>}
            </div>

            <div className={styles.memoryItemsList}>
              {agent.memoryItems.map((item, idx) => (
                <div key={idx} className={styles.memoryItemChip}>
                  <HardDrive size={12} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* OpenClaw Cloud Server Archived Agent Memories (Restore Feature) */}
      <div className={styles.archivedSection}>
        <div className={styles.archiveHeaderRow}>
          <Archive size={16} />
          <h4 className={styles.sectionHeaderTitle}>OpenClaw 腾讯云服务器归档库 ({archivedAgents.length})</h4>
        </div>

        {archivedAgents.length === 0 ? (
          <p className={styles.emptyArchiveText}>暂无已归档封存的伙伴记忆。</p>
        ) : (
          <div className={styles.memoryGrid}>
            {archivedAgents.map(record => (
              <div key={record.id} className={styles.archivedCard}>
                <div className={styles.archivedCardTop}>
                  <span className={styles.memoryAvatar}>{record.agentConfig.avatarUrl}</span>
                  <div className={styles.memoryMeta}>
                    <span className={styles.memoryAgentName}>{record.agentConfig.name} ({record.agentConfig.roleTitle})</span>
                    <span className={styles.memoryDbId}>封存记忆库: {record.agentConfig.memoryDbId} · {record.archivedAt}</span>
                  </div>

                  <button 
                    className={styles.restoreBtn}
                    onClick={() => restoreAgent(record.id)}
                    title="OpenClaw 从云端重新载入伙伴"
                  >
                    <RefreshCw size={14} />
                    <span>OpenClaw 恢复伙伴</span>
                  </button>
                </div>

                <div className={styles.memoryItemsList}>
                  {record.agentConfig.memoryItems.map((item, idx) => (
                    <div key={idx} className={styles.archivedItemChip}>
                      <HardDrive size={12} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
