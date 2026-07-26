import React, { useState, useRef, useEffect } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { PixelIcon } from '../Common/PixelIcon';
import { ThinkingDepthMenu } from './ThinkingDepthMenu';
import styles from './Composer.module.css';

export const FarmChatComposer: React.FC = () => {
  const { 
    sendMessage, 
    thinkingDepth, 
    setThinkingDepth,
    setIsAgentModalOpen,
    agents,
    setActiveTab
  } = useHomeStore();

  const composerRef = useRef<HTMLDivElement | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string }>>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showThinkingMenu, setShowThinkingMenu] = useState(false);

  // Click outside to close attachment & thinking menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
        setShowAttachmentMenu(false);
        setShowThinkingMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAgents = agents.filter(a => a.isEnabled && a.id !== 'fanfiction_writer');

  const handleSend = () => {
    if (!inputVal.trim() && attachments.length === 0) return;
    sendMessage(inputVal, attachments);
    setInputVal('');
    setAttachments([]);
    setActiveTab('livingroom');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSimulateUpload = (type: string) => {
    const fileName = type === 'image' ? '农场草纸草图.png' : '农作物计划.pdf';
    setAttachments(prev => [...prev, { name: fileName, type }]);
    setShowAttachmentMenu(false);
  };

  const isThinkingActive = thinkingDepth !== 'off';

  return (
    <div ref={composerRef} className={styles.composerWrapper}>
      {/* Plant Accent Placed ABOVE the input card on top left */}
      <div className={styles.plantAboveDecor} title="小青植盆栽">
        <PixelIcon name="potted_plant" size={28} animate="sway" />
      </div>

      <div className={`${styles.composerCardBox} ${isThinkingActive ? styles.deepThinkingMode : ''}`}>
        {/* Expanded 2-Line Height Text Area */}
        <textarea
          className={styles.expandedParchmentInput}
          placeholder="听候农场主的指示……"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className={styles.attachmentStrip}>
            {attachments.map((att, idx) => (
              <div key={idx} className={styles.attachmentTag}>
                <PixelIcon name={att.type === 'image' ? 'crops' : 'scroll'} size={14} />
                <span>{att.name}</span>
                <button 
                  className={styles.removeAttBtn}
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inside Bottom Action Toolbar */}
        <div className={styles.insideBottomRow}>
          <div className={styles.leftToolsGroup}>
            {/* Attachment Clip Button */}
            <div className={styles.popoverWrapper}>
              <button 
                className={styles.iconActionBtn}
                onClick={() => {
                  setShowAttachmentMenu(prev => !prev);
                  setShowThinkingMenu(false);
                }}
                title="添加附件 / 图片 / 文档"
              >
                <PixelIcon name="attachment" size={18} />
              </button>
              {showAttachmentMenu && (
                <div className={styles.attachmentMenu}>
                  <button onClick={() => handleSimulateUpload('image')}>
                    <PixelIcon name="crops" size={16} /> 上传家园图片
                  </button>
                  <button onClick={() => handleSimulateUpload('document')}>
                    <PixelIcon name="scroll" size={16} /> 添加手账文档
                  </button>
                </div>
              )}
            </div>

            {/* Agent Selection Button */}
            <button 
              className={`${styles.iconActionBtn} ${activeAgents.length > 0 ? styles.activeAgentsBtn : ''}`}
              onClick={() => setIsAgentModalOpen(true)}
              title="选择在场的 AI 伙伴"
            >
              <PixelIcon name="agent" size={18} />
              <span className={styles.agentCountBadge}>{activeAgents.length}</span>
            </button>

            {/* Deep Thinking Starburst Button */}
            <div className={styles.popoverWrapper}>
              <button 
                className={`${styles.iconActionBtn} ${isThinkingActive ? styles.starburstActive : ''}`}
                onClick={() => {
                  setShowThinkingMenu(prev => !prev);
                  setShowAttachmentMenu(false);
                }}
                title={`思考深度: ${thinkingDepth}`}
              >
                <PixelIcon name="thinking" size={18} animate={isThinkingActive ? "sparkle" : "none"} />
              </button>

              {showThinkingMenu && (
                <ThinkingDepthMenu 
                  currentLevel={thinkingDepth}
                  onSelectLevel={(lvl) => setThinkingDepth(lvl)}
                  onClose={() => setShowThinkingMenu(false)}
                />
              )}
            </div>
          </div>

          {/* Right Send Button */}
          <button 
            className={styles.primarySendBtn}
            onClick={handleSend}
            title="发送指令 (Enter)"
          >
            <PixelIcon name="send" size={16} />
            <span>发送</span>
          </button>
        </div>
      </div>
    </div>
  );
};
