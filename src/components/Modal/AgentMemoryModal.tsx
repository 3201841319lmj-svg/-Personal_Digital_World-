import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { X, Brain, User, Sparkles, BookOpen, Search, Plus, Trash2, Calendar, Tag, Check, RefreshCw } from 'lucide-react';
import { buildSystemPromptWithMemory, searchDailyLogs, createDefaultMemoryStore } from '../../utils/memoryEngine';
import { UserPreferenceItem, DailyLogEntry, UserBasicMemoryInfo } from '../../types';
import styles from './Modal.module.css';

export const AgentMemoryModal: React.FC = () => {
  const { 
    isAgentMemoryModalOpen, 
    setIsAgentMemoryModalOpen, 
    selectedMemoryAgentId, 
    agents, 
    userProfile,
    updateAgentConfig 
  } = useHomeStore();

  const [activeTab, setActiveTab] = useState<'core' | 'preferences' | 'logs'>('core');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Editing state for User Basic Info in Core Memory
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [editingUserInfo, setEditingUserInfo] = useState<UserBasicMemoryInfo>({
    userName: '',
    userRoleTitle: '',
    genderOrTitle: '',
    bioSignature: '',
    birthdayOrSign: ''
  });

  // Adding new preference state
  const [newPrefContent, setNewPrefContent] = useState('');
  const [newPrefCategory, setNewPrefCategory] = useState<'preference' | 'habit' | 'taboo' | 'emotion'>('preference');

  const currentAgent = agents.find(a => a.id === selectedMemoryAgentId) || agents[0];

  if (!isAgentMemoryModalOpen || !currentAgent) return null;

  const memoryStore = currentAgent.memoryStore || createDefaultMemoryStore(currentAgent, userProfile);

  // Initialize edit fields
  const handleStartEditUserInfo = () => {
    setEditingUserInfo({ ...memoryStore.coreMemory.userInfo });
    setIsEditingUserInfo(true);
  };

  const handleSaveUserInfo = () => {
    const updatedStore = {
      ...memoryStore,
      coreMemory: {
        ...memoryStore.coreMemory,
        userInfo: { ...editingUserInfo }
      }
    };
    updateAgentConfig(currentAgent.id, { memoryStore: updatedStore });
    setIsEditingUserInfo(false);
  };

  const handleAddPreference = () => {
    if (!newPrefContent.trim()) return;

    const newPrefItem: UserPreferenceItem = {
      id: `pref_${Date.now()}`,
      category: newPrefCategory,
      content: newPrefContent.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
      importanceLevel: 'high'
    };

    const updatedStore = {
      ...memoryStore,
      userPreferences: [newPrefItem, ...memoryStore.userPreferences]
    };

    updateAgentConfig(currentAgent.id, { memoryStore: updatedStore });
    setNewPrefContent('');
  };

  const handleDeletePreference = (prefId: string) => {
    const updatedStore = {
      ...memoryStore,
      userPreferences: memoryStore.userPreferences.filter(p => p.id !== prefId)
    };
    updateAgentConfig(currentAgent.id, { memoryStore: updatedStore });
  };

  const filteredLogs = searchDailyLogs(memoryStore.dailyLogs || [], searchQuery, dateFilter);

  const previewSystemPrompt = buildSystemPromptWithMemory(currentAgent, userProfile);

  return (
    <div className={styles.modalOverlay} onClick={() => setIsAgentMemoryModalOpen(false)}>
      <div className={styles.settingsModalCard} onClick={e => e.stopPropagation()} style={{ maxWidth: '850px', width: '92vw' }}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>{currentAgent.avatarUrl}</span>
            <div>
              <h2 className={styles.modalTitle}>【{currentAgent.name}】的三层记忆大脑</h2>
              <p className={styles.panelDesc} style={{ margin: 0 }}>
                {currentAgent.roleTitle} · DB: {currentAgent.memoryDbId}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsAgentMemoryModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={styles.modalBody} style={{ flexDirection: 'column' }}>
          <div className={styles.categorySidebar} style={{ width: '100%', flexDirection: 'row', borderRight: 'none', borderBottom: '2px solid #8b5a2b', paddingBottom: '8px' }}>
            <button
              className={`${styles.catBtn} ${activeTab === 'core' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('core')}
            >
              <User size={16} />
              <span>1. 核心记忆与农场主资料</span>
            </button>

            <button
              className={`${styles.catBtn} ${activeTab === 'preferences' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Sparkles size={16} />
              <span>2. 农场主偏好库 ({memoryStore.userPreferences.length})</span>
            </button>

            <button
              className={`${styles.catBtn} ${activeTab === 'logs' ? styles.activeCat : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <BookOpen size={16} />
              <span>3. 每日日志归档与搜索 ({memoryStore.dailyLogs.length})</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className={styles.contentArea} style={{ padding: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
            {/* TAB 1: Core Memory & User Profile */}
            {activeTab === 'core' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className={styles.masterBanner} style={{ backgroundColor: '#fff8eb', border: '2px solid #d4a359' }}>
                  <Brain size={24} color="#8b5a2b" />
                  <div>
                    <strong style={{ color: '#5c3a1e' }}>每次对话自动前置注入的 System Prompt</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6e4726' }}>
                      包含了农场主的基本信息（姓名/头衔/签名）、{currentAgent.name}的角色人设与行为准则。注入轻量（约400 Token），绝不卡顿！
                    </p>
                  </div>
                </div>

                {/* User Basic Info Section */}
                <div style={{ background: '#fcf6eb', border: '2px solid #c8a268', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, color: '#4a2c11', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={18} color="#8b5a2b" />
                      核心记忆注入项：农场主基本信息
                    </h4>
                    {!isEditingUserInfo ? (
                      <button 
                        onClick={handleStartEditUserInfo}
                        style={{ background: '#8b5a2b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        编辑基本资料
                      </button>
                    ) : (
                      <button 
                        onClick={handleSaveUserInfo}
                        style={{ background: '#3b7a20', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={14} /> 保存
                      </button>
                    )}
                  </div>

                  {!isEditingUserInfo ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#5c3d20' }}>
                      <div><strong>农场主姓名：</strong> {memoryStore.coreMemory.userInfo.userName || userProfile.name}</div>
                      <div><strong>角色头衔：</strong> {memoryStore.coreMemory.userInfo.userRoleTitle || userProfile.roleTitle}</div>
                      <div><strong>称呼偏好：</strong> {memoryStore.coreMemory.userInfo.genderOrTitle || '农场主/宝宝'}</div>
                      <div><strong>个人签名：</strong> {memoryStore.coreMemory.userInfo.bioSignature || userProfile.signature}</div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#6e4726' }}>农场主姓名</label>
                        <input
                          type="text"
                          value={editingUserInfo.userName}
                          onChange={e => setEditingUserInfo({ ...editingUserInfo, userName: e.target.value })}
                          style={{ width: '100%', padding: '6px', border: '1px solid #c8a268', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#6e4726' }}>角色头衔</label>
                        <input
                          type="text"
                          value={editingUserInfo.userRoleTitle}
                          onChange={e => setEditingUserInfo({ ...editingUserInfo, userRoleTitle: e.target.value })}
                          style={{ width: '100%', padding: '6px', border: '1px solid #c8a268', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#6e4726' }}>称呼偏好</label>
                        <input
                          type="text"
                          value={editingUserInfo.genderOrTitle}
                          onChange={e => setEditingUserInfo({ ...editingUserInfo, genderOrTitle: e.target.value })}
                          style={{ width: '100%', padding: '6px', border: '1px solid #c8a268', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#6e4726' }}>个人签名</label>
                        <input
                          type="text"
                          value={editingUserInfo.bioSignature || ''}
                          onChange={e => setEditingUserInfo({ ...editingUserInfo, bioSignature: e.target.value })}
                          style={{ width: '100%', padding: '6px', border: '1px solid #c8a268', borderRadius: '4px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* System Prompt Live Preview Box */}
                <div>
                  <h4 style={{ margin: '0 0 8px', color: '#4a2c11', fontSize: '14px' }}>实时注入 System Prompt 预览</h4>
                  <pre style={{
                    background: '#2b2118',
                    color: '#e6c594',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    border: '1px solid #8b5a2b',
                    margin: 0
                  }}>
                    {previewSystemPrompt}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 2: User Preferences */}
            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Add New Preference Box */}
                <div style={{ background: '#fbf3e4', border: '1px dashed #b8860b', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={newPrefCategory}
                    onChange={e => setNewPrefCategory(e.target.value as any)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #c8a268', background: '#fff' }}
                  >
                    <option value="preference">喜好 💖</option>
                    <option value="habit">习惯 ☕</option>
                    <option value="taboo">避讳 🛑</option>
                    <option value="emotion">情绪 🌙</option>
                  </select>
                  <input
                    type="text"
                    placeholder="输入要为农场主添加的个人偏好内容..."
                    value={newPrefContent}
                    onChange={e => setNewPrefContent(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', border: '1px solid #c8a268', borderRadius: '4px' }}
                    onKeyDown={e => e.key === 'Enter' && handleAddPreference()}
                  />
                  <button
                    onClick={handleAddPreference}
                    style={{ background: '#3b7a20', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={16} /> 添加偏好
                  </button>
                </div>

                {/* Preference List Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {memoryStore.userPreferences.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#8b6b47', padding: '20px' }}>尚无单独记录的个人偏好。</p>
                  ) : (
                    memoryStore.userPreferences.map(pref => (
                      <div
                        key={pref.id}
                        style={{
                          background: '#fffcf7',
                          border: '1px solid #e0c8a0',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: pref.category === 'preference' ? '#ffe4e6' : pref.category === 'habit' ? '#e0f2fe' : pref.category === 'taboo' ? '#fee2e2' : '#fef3c7',
                            color: pref.category === 'preference' ? '#be123c' : pref.category === 'habit' ? '#0369a1' : pref.category === 'taboo' ? '#b91c1c' : '#b45309'
                          }}>
                            {pref.category === 'preference' ? '喜好' : pref.category === 'habit' ? '习惯' : pref.category === 'taboo' ? '避讳' : '情绪'}
                          </span>
                          <span style={{ fontSize: '13px', color: '#4a2c11' }}>{pref.content}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '11px', color: '#a08060' }}>{pref.updatedAt}</span>
                          <button
                            onClick={() => handleDeletePreference(pref.id)}
                            style={{ background: 'transparent', border: 'none', color: '#cb4b4b', cursor: 'pointer', padding: '4px' }}
                            title="删除此条偏好"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Daily Logs Archive & Search */}
            {activeTab === 'logs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Search and Date Filter Bar */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #c8a268', borderRadius: '4px', padding: '0 8px' }}>
                    <Search size={16} color="#8b5a2b" />
                    <input
                      type="text"
                      placeholder="搜索历史聊天回忆关键词..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ width: '100%', border: 'none', padding: '8px', outline: 'none', fontSize: '13px' }}
                    />
                  </div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    style={{ padding: '6px', border: '1px solid #c8a268', borderRadius: '4px', background: '#fff' }}
                  />
                </div>

                {/* Filtered Logs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredLogs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#8b6b47', padding: '20px' }}>没有匹配的每日对白归档数据。</p>
                  ) : (
                    filteredLogs.map(log => (
                      <div
                        key={log.id}
                        style={{
                          background: '#fff8ed',
                          border: '1px solid #d4a359',
                          borderRadius: '8px',
                          padding: '12px 16px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e0c8a0', paddingBottom: '6px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold', color: '#8b5a2b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                            <Calendar size={14} /> {log.date} 聊天日记归档 ({log.messagesCount} 条对白)
                          </span>
                          <span style={{ fontSize: '11px', color: '#a08060' }}>已按日索引</span>
                        </div>

                        <p style={{ margin: '4px 0 8px', fontSize: '13px', color: '#5c3d20' }}>{log.summary}</p>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {log.keywords.map((kw, idx) => (
                            <span key={idx} style={{ background: '#edd6b1', color: '#6e4726', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
