import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { AgentConfig, ProviderType } from '../../types';
import { RotateCcw, Upload, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import styles from '../Modal/Modal.module.css';

export const AgentManagementTab: React.FC = () => {
  const { agents, toggleAgentEnabled, updateAgentConfig, resetAgentAvatar, addAgent, deleteAgent } = useHomeStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'openclaw');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Agent Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newPersonality, setNewPersonality] = useState('');
  const [newProvider, setNewProvider] = useState<ProviderType>('openai');
  const [newAvatar, setNewAvatar] = useState('🤖');

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleSimulateCustomAvatar = (agentId: string) => {
    const customAvatars = ['🌟', '🦉', '🎨', '🤖', '🦊', '🐱', '🐶'];
    const randomAvatar = customAvatars[Math.floor(Math.random() * customAvatars.length)];
    updateAgentConfig(agentId, { avatarUrl: randomAvatar, isCustomAvatar: true });
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim()) return;
    addAgent({
      name: newAgentName,
      roleTitle: newRoleTitle || 'AI 伙伴',
      personality: newPersonality || '温和友善的 AI 助手',
      signature: '很高兴来到农场主的小家 ☀️',
      avatarUrl: newAvatar,
      defaultAvatarUrl: newAvatar,
      isCustomAvatar: false,
      isMasterAgent: false,
      provider: newProvider,
      apiKey: 'sk-sample-new-key',
      baseUrl: 'https://api.openai.com/v1',
      modelId: 'gpt-4o-mini',
      isEnabled: true
    });
    setIsAddModalOpen(false);
    setNewAgentName('');
    setNewRoleTitle('');
    setNewPersonality('');
  };

  const handleDeleteCurrentAgent = () => {
    if (!selectedAgent) return;
    if (selectedAgent.isMasterAgent) {
      alert('OpenClaw 为系统核心主控 Agent，不可移除！');
      return;
    }
    if (confirm(`确定要移除伙伴“${selectedAgent.name}”吗？\n注意：伙伴从服务列表移除后，记忆仍将保存在 OpenClaw 腾讯云服务器，有需要随时可恢复！`)) {
      deleteAgent(selectedAgent.id);
      setSelectedAgentId(agents[0]?.id || 'openclaw');
    }
  };

  return (
    <div className={styles.tabPanelContent}>
      <div className={styles.panelTopRow}>
        <div>
          <h3 className={styles.panelTitle}>Agent 智能体管理中心</h3>
          <p className={styles.panelDesc}>配置各 AI 伙伴的人设、头像，可随时新增或移除（记忆完整保留）</p>
        </div>

        <button 
          className={styles.addAgentMainBtn}
          onClick={() => setIsAddModalOpen(prev => !prev)}
        >
          <Plus size={16} />
          <span>新增 AI 伙伴</span>
        </button>
      </div>

      {/* Add New Agent Form Modal / Card */}
      {isAddModalOpen && (
        <div className={styles.addAgentCardBox}>
          <h4 className={styles.addAgentTitle}>➕ 欢迎新伙伴加入家园</h4>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>伙伴昵称</label>
              <input 
                type="text" 
                className={styles.textInput}
                placeholder="例如: 烘焙管家小熊"
                value={newAgentName}
                onChange={e => setNewAgentName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>身份头衔</label>
              <input 
                type="text" 
                className={styles.textInput}
                placeholder="例如: 甜点师"
                value={newRoleTitle}
                onChange={e => setNewRoleTitle(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>选择 Provider 接口</label>
              <select 
                className={styles.selectInput}
                value={newProvider}
                onChange={e => setNewProvider(e.target.value as ProviderType)}
              >
                <option value="openai">OpenAI API</option>
                <option value="gemini">Google Gemini API</option>
                <option value="claude">Anthropic Claude API</option>
                <option value="deepseek">DeepSeek API</option>
                <option value="custom">Custom 自定义 API</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>选择图标标识</label>
              <select 
                className={styles.selectInput}
                value={newAvatar}
                onChange={e => setNewAvatar(e.target.value)}
              >
                <option value="🤖">🤖 机器人</option>
                <option value="🐻">🐻 烘焙熊</option>
                <option value="🦊">🦊 狐狸吉</option>
                <option value="🎨">🎨 艺术家</option>
                <option value="🔮">🔮 占星师</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>人设描述</label>
            <input 
              type="text" 
              className={styles.textInput}
              placeholder="简述伙伴的人设与专长..."
              value={newPersonality}
              onChange={e => setNewPersonality(e.target.value)}
            />
          </div>
          <div className={styles.addAgentActionsRow}>
            <button className={styles.smallOutlineBtn} onClick={() => setIsAddModalOpen(false)}>取消</button>
            <button className={styles.saveAgentBtn} onClick={handleCreateAgent}>完成创建</button>
          </div>
        </div>
      )}

      <div className={styles.agentMgmtContainer}>
        {/* Left/Top Agent Selector Horizontal Pill Bar */}
        <div className={styles.agentSubList}>
          {agents.map(agent => (
            <button 
              key={agent.id}
              className={`${styles.agentSubBtn} ${selectedAgentId === agent.id ? styles.activeSubBtn : ''}`}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              <span className={styles.subName}>{agent.name}</span>
              {agent.isMasterAgent && <span className={styles.masterTag}>Master</span>}
            </button>
          ))}
        </div>

        {/* Right Detail Editor Form */}
        <div className={styles.agentEditorForm}>
          {selectedAgent && (
            <>
              {selectedAgent.isMasterAgent && (
                <div className={styles.masterBanner}>
                  <ShieldCheck size={18} className={styles.shieldIcon} />
                  <div>
                    <strong>OpenClaw 主控 Agent (管理员级)</strong>
                    <p>已连接腾讯云 Server (118.25.x.x)，具备全局伙伴记忆归档与恢复能力。</p>
                  </div>
                </div>
              )}

              {/* Avatar Rules Section */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Agent 头像管理</label>
                <div className={styles.avatarRow}>
                  <div className={styles.largeAvatarBox}>{selectedAgent.avatarUrl}</div>
                  <div className={styles.avatarActionsCol}>
                    <div className={styles.avatarStatusText}>
                      {selectedAgent.isCustomAvatar ? '当前使用: 自定义头像' : '当前使用: AI 默认头像'}
                    </div>
                    <div className={styles.avatarBtnGroup}>
                      <button 
                        className={styles.smallOutlineBtn}
                        onClick={() => handleSimulateCustomAvatar(selectedAgent.id)}
                      >
                        <Upload size={14} />
                        <span>上传自定义头像</span>
                      </button>

                      {selectedAgent.isCustomAvatar && (
                        <button 
                          className={styles.smallOutlineBtn}
                          onClick={() => resetAgentAvatar(selectedAgent.id)}
                        >
                          <RotateCcw size={14} />
                          <span>恢复默认头像</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Agent 昵称</label>
                  <input 
                    type="text" 
                    className={styles.textInput}
                    value={selectedAgent.name}
                    onChange={e => updateAgentConfig(selectedAgent.id, { name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>身份头衔</label>
                  <input 
                    type="text" 
                    className={styles.textInput}
                    value={selectedAgent.roleTitle}
                    onChange={e => updateAgentConfig(selectedAgent.id, { roleTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>人设描述</label>
                <textarea 
                  className={styles.textareaInput}
                  value={selectedAgent.personality}
                  onChange={e => updateAgentConfig(selectedAgent.id, { personality: e.target.value })}
                  rows={2}
                />
              </div>

              {/* System Prompt / Directives Section (Excluding OpenClaw) */}
              {selectedAgent.id !== 'openclaw' ? (
                <div className={styles.formGroup} style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className={styles.formLabel} style={{ fontWeight: 800, color: 'var(--color-wood-deep)' }}>
                      📜 系统指示词 (System Directive / System Prompt)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-wood-dark)', opacity: 0.85 }}>
                      自由查看与编辑装载给该 Agent 的核心指令词
                    </span>
                  </div>
                  <textarea 
                    className={styles.textareaInput}
                    style={{
                      minHeight: '130px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.82rem',
                      lineHeight: '1.6',
                      background: 'var(--color-parchment-base)',
                      border: '1.5px solid var(--color-wood-base)',
                      borderRadius: '8px',
                      padding: '10px',
                      color: 'var(--color-wood-deep)'
                    }}
                    value={selectedAgent.systemPrompt || ''}
                    onChange={e => updateAgentConfig(selectedAgent.id, { systemPrompt: e.target.value })}
                    placeholder="输入该 Agent 装载的核心 System Directive 指令词..."
                  />
                </div>
              ) : (
                <div className={styles.formGroup} style={{ marginTop: '12px' }}>
                  <label className={styles.formLabel} style={{ fontWeight: 800, color: 'var(--color-wood-deep)' }}>
                    📜 系统指示词 (System Directive)
                  </label>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-wood-dark)',
                    background: 'var(--color-parchment-base)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px dashed var(--color-wood-light)'
                  }}>
                    🛡️ OpenClaw 为腾讯云原生主控 Agent，指示词由云端基础设施指令自动统筹与托管。
                  </div>
                </div>
              )}

              <div className={styles.switchRow}>
                <label className={styles.formLabel}>启用该 Agent</label>
                <label className={styles.toggleSwitch}>
                  <input 
                    type="checkbox" 
                    checked={selectedAgent.isEnabled}
                    onChange={() => toggleAgentEnabled(selectedAgent.id)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              {/* Delete Agent Action (Preserves Memory in OpenClaw Cloud Server) */}
              {!selectedAgent.isMasterAgent && (
                <div className={styles.deleteAgentRow}>
                  <button 
                    className={styles.deleteAgentBtn}
                    onClick={handleDeleteCurrentAgent}
                  >
                    <Trash2 size={15} />
                    <span>移除伙伴 (云端保留记忆)</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
