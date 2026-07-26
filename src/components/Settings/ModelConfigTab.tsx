import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { ProviderType } from '../../types';
import { Cpu, Server, Key, Eye, EyeOff } from 'lucide-react';
import styles from '../Modal/Modal.module.css';

export const ModelConfigTab: React.FC = () => {
  const { agents, updateAgentConfig, thinkingDepth, setThinkingDepth } = useHomeStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'openclaw');
  const [showApiKey, setShowApiKey] = useState(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const providerOptions: Array<{ type: ProviderType; label: string }> = [
    { type: 'openclaw', label: 'OpenClaw (云端原生主控)' },
    { type: 'openai', label: 'OpenAI API 接口' },
    { type: 'gemini', label: 'Gemini API 接口' },
    { type: 'claude', label: 'Claude API 接口' },
    { type: 'deepseek', label: 'DeepSeek API 接口' },
    { type: 'custom', label: '自定义 OpenAI 兼容接口' }
  ];

  return (
    <div className={styles.tabPanelContent}>
      <div className={styles.panelTopRow}>
        <div>
          <h3 className={styles.panelTitle}>模型配置与 API Provider 部署</h3>
          <p className={styles.panelDesc}>为每个 Agent 独立设定 API Key、Base URL 与 LLM 模型</p>
        </div>
      </div>

      <div className={styles.agentMgmtContainer}>
        {/* Left Agent Picker */}
        <div className={styles.agentSubList}>
          {agents.map(agent => (
            <button 
              key={agent.id}
              className={`${styles.agentSubBtn} ${selectedAgentId === agent.id ? styles.activeSubBtn : ''}`}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              <span className={styles.subAvatar}>{agent.avatarUrl}</span>
              <div className={styles.subMeta}>
                <span className={styles.subName}>{agent.name}</span>
                <span className={styles.subProvider}>{agent.provider.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right API Provider Form */}
        <div className={styles.agentEditorForm}>
          {selectedAgent && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>API Provider 接口类型</label>
                <select 
                  className={styles.selectInput}
                  value={selectedAgent.provider}
                  onChange={e => updateAgentConfig(selectedAgent.id, { provider: e.target.value as ProviderType })}
                >
                  {providerOptions.map(opt => (
                    <option key={opt.type} value={opt.type}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>API Key 密钥</label>
                <div className={styles.passwordInputWrapper}>
                  <Key size={16} className={styles.inputIcon} />
                  <input 
                    type={showApiKey ? 'text' : 'password'}
                    className={styles.textInputWithIcon}
                    value={selectedAgent.apiKey}
                    onChange={e => updateAgentConfig(selectedAgent.id, { apiKey: e.target.value })}
                  />
                  <button 
                    className={styles.eyeBtn}
                    onClick={() => setShowApiKey(prev => !prev)}
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Base URL 服务地址</label>
                <div className={styles.passwordInputWrapper}>
                  <Server size={16} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.textInputWithIcon}
                    value={selectedAgent.baseUrl}
                    onChange={e => updateAgentConfig(selectedAgent.id, { baseUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Agent 思考深度调节</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    type="button"
                    className={`${styles.thinkingBtn || ''}`}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1.5px solid var(--color-wood-base)',
                      background: thinkingDepth === 'normal' ? 'var(--color-wood-base)' : 'var(--color-parchment-base)',
                      color: thinkingDepth === 'normal' ? '#FFF' : 'var(--color-wood-deep)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    onClick={() => setThinkingDepth('normal')}
                  >
                    🌱 随性灵感
                  </button>

                  <button 
                    type="button"
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1.5px solid var(--color-wood-base)',
                      background: thinkingDepth === 'deep' ? 'var(--color-wood-base)' : 'var(--color-parchment-base)',
                      color: thinkingDepth === 'deep' ? '#FFF' : 'var(--color-wood-deep)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    onClick={() => setThinkingDepth('deep')}
                  >
                    📜 严谨沉浸
                  </button>

                  <button 
                    type="button"
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1.5px solid var(--color-wood-base)',
                      background: thinkingDepth === 'ultra' ? 'var(--color-wood-base)' : 'var(--color-parchment-base)',
                      color: thinkingDepth === 'ultra' ? '#FFF' : 'var(--color-wood-deep)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    onClick={() => setThinkingDepth('ultra')}
                  >
                    🔮 深度织梦
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
