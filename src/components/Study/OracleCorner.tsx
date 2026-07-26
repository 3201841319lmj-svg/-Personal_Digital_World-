import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { Trash2, Send } from 'lucide-react';
import { TypewriterText } from '../Common/TypewriterText';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Study.module.css';

export const OracleCorner: React.FC = () => {
  const { 
    agents,
    tarotSession, 
    startTarotDraw, 
    interpretTarot, 
    askTarotFollowup,
    clearTarotSession
  } = useHomeStore();

  const [userQuestion, setUserQuestion] = useState('');
  const [followupInput, setFollowupInput] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'openclaw');

  const handleDraw = () => {
    if (!userQuestion.trim()) return;
    startTarotDraw(userQuestion);
  };

  const handleGenerateInterpretation = () => {
    interpretTarot(selectedAgentId);
  };

  const handleSendFollowup = () => {
    if (!followupInput.trim()) return;
    askTarotFollowup(followupInput);
    setFollowupInput('');
  };

  return (
    <div className={styles.oracleContainer}>
      <div className={styles.crystalBallCard}>
        {/* Top Header Row */}
        <div className={styles.oracleHeaderRow}>
          <span className={styles.oracleTitle}>今日像素塔罗</span>
          {tarotSession.isDrawn && (
            <button 
              className={styles.resetTarotBtn}
              onClick={() => {
                if (confirm('确定要重新占卜并清空当前塔罗牌面与解读记录吗？')) {
                  clearTarotSession();
                }
              }}
              title="重新占卜"
            >
              <PixelIcon name="trash" size={16} />
            </button>
          )}
        </div>

        {/* 3 Standard Tarot Card Columns (Position Title Above -> Card Slot -> Card Name Below) */}
        <div className={styles.tarotCardSlotsRow}>
          {[0, 1, 2].map(idx => {
            const card = tarotSession.cards[idx];
            const defaultPos = idx === 0 ? '【过去/现状】' : idx === 1 ? '【面临挑战】' : '【未来启示】';
            
            return (
              <div key={idx} className={styles.tarotCardColumn}>
                {/* 1. Position Title (Outside Top, High-contrast Dark Wood Text) */}
                <span className={styles.cardPositionTitle}>
                  {card ? card.positionName : defaultPos}
                </span>

                {/* 2. Slot Box (Card Image Fills Box Almost 100%) */}
                <div className={`${styles.tarotSlotCard} ${card ? styles.flippedCard : ''}`}>
                  {card ? (
                    <img 
                      src={card.imagePath} 
                      alt={card.name} 
                      className={`${styles.tarotCardImg} ${card.isReversed ? styles.reversedCardImage : ''}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          const cardNum = (tarotSession.cards[idx]?.id ?? 0).toString().padStart(2, '0');
                          target.src = `/assets/tarot/tarot_${cardNum}.png`;
                        }
                      }}
                    />
                  ) : (
                    <span className={styles.cardBackSymbol}>🃏</span>
                  )}
                </div>

                {/* 3. Card Name Tag (Outside Bottom, 100% "两位数编号_卡牌名字" Format) */}
                <span className={styles.cardNameTag}>
                  {card ? `${card.name} ${card.isReversed ? '(逆位)' : '(正位)'}` : '待抽取'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Question Input & Start Draw Area */}
        {!tarotSession.isDrawn ? (
          <div className={styles.questionInputBoxGroup}>
            <input 
              type="text" 
              className={styles.oracleQuestionInput}
              placeholder="请输入您心中的困惑或今日运势提问..."
              value={userQuestion}
              onChange={e => setUserQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDraw()}
            />
            <button className={styles.drawTarotBtn} onClick={handleDraw}>
              🔮 抽三张伟特牌 (Token 纯文本灵感)
            </button>
          </div>
        ) : (
          /* Drawn State: Control Bar + Follow-up Chat Stream */
          <div className={styles.drawnSessionPanel}>
            <div className={styles.currentQuestionText}>
              <strong>当前提问：</strong>"{tarotSession.question}"
            </div>

            {/* AI Selector Control Bar */}
            <div className={styles.aiSelectorControlBar}>
              <span className={styles.selectorLabelText}>选择解读伙伴：</span>
              <div className={styles.selectorControlGroup}>
                <select 
                  className={styles.agentSelectDropdown}
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                >
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.avatarUrl} {agent.name} ({agent.provider.toUpperCase()})
                    </option>
                  ))}
                </select>

                <button 
                  className={styles.generateInterpretBtn}
                  onClick={handleGenerateInterpretation}
                >
                  生成解读
                </button>
              </div>
            </div>

            {/* Continuous Dialogue Stream Box */}
            {tarotSession.chatStream.length > 0 && (
              <div className={`${styles.tarotChatStreamBox} custom-scroll`}>
                {tarotSession.chatStream.map((msg, index) => {
                  const isLatest = index === tarotSession.chatStream.length - 1;
                  return (
                    <div 
                      key={msg.id}
                      style={{
                        background: msg.isUser ? 'var(--color-parchment-light)' : '#FFF9EF',
                        border: '1px solid var(--color-wood-base)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        color: 'var(--color-wood-deep)',
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        fontFamily: 'var(--font-serif)'
                      }}
                    >
                      <strong>{msg.senderName}：</strong>
                      <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                        {msg.isUser ? msg.text : <TypewriterText text={msg.text} speed={20} isLatest={isLatest} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Follow-up Question Bar */}
            {tarotSession.chatStream.length > 0 && (
              <div className={styles.followupInputRow}>
                <input 
                  type="text" 
                  className={styles.followupTextInput}
                  placeholder="针对牌面继续追问 AI 伙伴..."
                  value={followupInput}
                  onChange={e => setFollowupInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendFollowup()}
                />
                <button className={styles.sendFollowupBtn} onClick={handleSendFollowup}>
                  <Send size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
