import React, { useState, useRef, useEffect } from 'react';
import { Copy, Edit3, RefreshCw } from 'lucide-react';
import { useHomeStore } from '../store/useHomeStore';
import { FarmChatComposer } from '../components/Composer/FarmChatComposer';
import { ThinkingProcessAccordion } from '../components/Chat/ThinkingProcessAccordion';
import { PixelIcon } from '../components/Common/PixelIcon';
import { TypewriterText } from '../components/Common/TypewriterText';
import styles from './Pages.module.css';

export const LivingRoomPage: React.FC = () => {
  const { 
    chatMessages, 
    isLivingSearchOpen, 
    setIsLivingSearchOpen,
    isLivingTopicDrawerOpen,
    setIsLivingTopicDrawerOpen,
    deleteChatMessage,
    editChatMessage,
    regenerateChatMessage,
    clearLivingRoomChat
  } = useHomeStore();

  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const topicDropdownRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const chatStreamEndRef = useRef<HTMLDivElement | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingMsgId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    editChatMessage(id, editingText);
    setEditingMsgId(null);
  };

  // Click outside listener for search & topic drawers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchBarRef.current && !searchBarRef.current.contains(target)) {
        setIsLivingSearchOpen(false);
      }
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(target)) {
        setIsLivingTopicDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter messages by search query
  const displayedMessages = chatMessages.filter(msg => {
    if (!searchQuery.trim()) return true;
    return msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
           msg.senderName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Extract User Prompts / Topic History for quick jumping
  const userTopics = chatMessages
    .filter(m => m.isUser)
    .map(m => ({
      id: m.id,
      topicText: m.text.length > 18 ? m.text.slice(0, 18) + '...' : m.text,
      timestamp: m.timestamp
    }));

  const handleScrollToTopic = (id: string) => {
    setIsLivingTopicDrawerOpen(false);
    const elem = messageRefs.current[id];
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatStreamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  return (
    <div className={styles.livingRoomPageWrapper}>
      {/* Inline Search Bar Popup */}
      {isLivingSearchOpen && (
        <div ref={searchBarRef} className={styles.inlineSearchBar}>
          <PixelIcon name="search" size={14} />
          <input 
            type="text" 
            className={styles.inlineSearchInput}
            placeholder="在当前聊天记录中搜索……"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button className={styles.closeSearchBtn} onClick={() => setSearchQuery('')}>
            <PixelIcon name="close" size={12} />
          </button>
        </div>
      )}

      {/* User Topic Directory Dropdown Drawer */}
      {isLivingTopicDrawerOpen && (
        <div ref={topicDropdownRef} className={styles.topicHistoryDropdown}>
          <div className={styles.topicHeader} style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PixelIcon name="gazette" size={16} />
              <span>话题目录 ({userTopics.length})</span>
            </div>
            {chatMessages.length > 0 && (
              <button 
                style={{
                  background: 'rgba(200,50,50,0.1)',
                  border: '1px solid rgba(200,50,50,0.3)',
                  color: '#B22222',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.68rem',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (confirm('确定要清空所有客厅聊天记录吗？此操作无法撤销。')) {
                    clearLivingRoomChat();
                    setIsLivingTopicDrawerOpen(false);
                  }
                }}
              >
                🗑️ 清空对白
              </button>
            )}
          </div>
          <div className={styles.topicList}>
            {userTopics.map(t => (
              <button 
                key={t.id} 
                className={styles.topicItemBtn}
                onClick={() => handleScrollToTopic(t.id)}
              >
                <PixelIcon name="leaf" size={12} />
                <span className={styles.topicText}>{t.topicText}</span>
                <span className={styles.topicTime}>{t.timestamp}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Chat Stream Container */}
      <div className={styles.scrollableChatStreamContainer}>
        {displayedMessages.map((msg, index) => {
          const isLatest = index === displayedMessages.length - 1;
          return (
            <div 
              key={msg.id} 
              ref={el => messageRefs.current[msg.id] = el}
              className={`${styles.chatMessageRow} ${msg.isUser ? styles.userRow : styles.agentRow}`}
            >
              {/* Agent Avatar Box */}
              {!msg.isUser && (
                <div className={styles.msgAvatarBox}>
                  <span>{msg.avatar || '🦞'}</span>
                </div>
              )}

              {/* Bubble Container & Content */}
              <div className={styles.msgBubbleWrapper}>
                <div className={styles.msgSenderHeader} style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={styles.msgSenderName}>{msg.senderName}</span>
                    <span className={styles.msgTimestamp}>{msg.timestamp}</span>
                  </div>
                </div>

                {/* AI Thinking Process Accordion */}
                {!msg.isUser && msg.thinkingProcess && (
                  <ThinkingProcessAccordion thinkingText={msg.thinkingProcess} />
                )}

                {/* Speech Bubble Container */}
                <div className={`${styles.msgBubble} ${msg.isUser ? styles.userBubble : styles.agentBubble}`}>
                  <div className={styles.msgText}>
                    {editingMsgId === msg.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                        <textarea 
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          className={styles.msgEditTextarea}
                          rows={3}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button 
                            className={styles.msgActionButton}
                            onClick={() => setEditingMsgId(null)}
                          >
                            取消
                          </button>
                          <button 
                            className={`${styles.msgActionButton} ${styles.primaryActionBtn}`}
                            onClick={() => handleSaveEdit(msg.id)}
                          >
                            保存修改
                          </button>
                        </div>
                      </div>
                    ) : msg.isUser ? (
                      msg.text
                    ) : (
                      <TypewriterText text={msg.text} speed={20} isLatest={isLatest} />
                    )}
                  </div>
                </div>

                {/* Message Action Toolbar (Below Speech Bubble, Hover-Only, Pure Pixel Icons) */}
                <div className={styles.msgBottomRightActions}>
                  {copiedMsgId === msg.id && (
                    <span className={styles.copyToast}>✓ 已复制</span>
                  )}

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => handleCopy(msg.id, msg.text)}
                    title="复制文本"
                  >
                    <PixelIcon name="copy" size={14} />
                  </button>

                  {msg.isUser && (
                    <button 
                      className={styles.msgActionIconBtn}
                      onClick={() => handleStartEdit(msg.id, msg.text)}
                      title="重新编辑内容"
                    >
                      <PixelIcon name="edit" size={14} />
                    </button>
                  )}

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => {
                      if (confirm('确定要重新生成当前 AI 的回复吗？')) {
                        regenerateChatMessage(msg.id);
                      }
                    }}
                    title="重新生成 AI 回复"
                  >
                    <PixelIcon name="refresh" size={14} />
                  </button>

                  <button 
                    className={styles.msgActionIconBtn}
                    onClick={() => {
                      if (confirm('确定要删除该条对话记录吗？此操作无法撤销。')) {
                        deleteChatMessage(msg.id);
                      }
                    }}
                    title="删除消息"
                  >
                    <PixelIcon name="trash" size={14} />
                  </button>
                </div>
              </div>

              {/* User Avatar Box */}
              {msg.isUser && (
                <div className={styles.msgAvatarBox}>
                  <PixelIcon name="agent" size={24} />
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatStreamEndRef} />
      </div>

      {/* Fixed Bottom Input Composer */}
      <div className={styles.fixedComposerContainer}>
        <FarmChatComposer />
      </div>
    </div>
  );
};
