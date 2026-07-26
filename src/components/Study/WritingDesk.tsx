import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { MailLetter } from '../../types';
import { Feather, Inbox, Send, X, Lock } from 'lucide-react';
import { TypewriterText } from '../Common/TypewriterText';
import { PixelIcon } from '../Common/PixelIcon';
import styles from './Study.module.css';

export const WritingDesk: React.FC = () => {
  const { 
    letters, 
    markLetterRead, 
    sendLetter, 
    receiveRealtimeMail,
    replyMailWithNextDayDelay,
    deleteLetter
  } = useHomeStore();

  const [selectedMail, setSelectedMail] = useState<MailLetter | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [mailTitle, setMailTitle] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [replyText, setReplyText] = useState('');

  const handleOpenMail = (mail: MailLetter) => {
    if (mail.isLockedUntilNextDay) {
      alert(`📬 该信件正处于邮寄过程中！受物理邮寄延迟机制限制，将于 [${mail.availableAt || '明日'}] 次日拆封解封。`);
      return;
    }
    setSelectedMail(mail);
    markLetterRead(mail.id);
  };

  const handleSendLetter = () => {
    if (!mailContent.trim()) return;
    sendLetter(mailTitle, mailContent);
    setIsComposing(false);
    setMailTitle('');
    setMailContent('');
  };

  const handleSendReply = () => {
    if (!selectedMail || !replyText.trim()) return;
    replyMailWithNextDayDelay(selectedMail.id, replyText);
    setReplyText('');
    setSelectedMail(null);
    alert('✉️ 回信已成功投递火漆！伙伴的二次复信受邮寄机制限制，将于明日解封查收。');
  };

  return (
    <div className={styles.deskContainer}>
      {/* Top Core Pure Text Buttons: [写信] & [收信] */}
      <div className={styles.deskHeaderRow}>
        <span className={styles.deskTitle}>今日信件整理</span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={styles.composeMailBtn} onClick={() => setIsComposing(true)}>
            写信
          </button>

          <button className={styles.receiveMailBtn} onClick={receiveRealtimeMail}>
            收信
          </button>
        </div>
      </div>

      {/* Mail List */}
      <div className={styles.mailGrid}>
        {letters.map(mail => (
          <div 
            key={mail.id} 
            className={`${styles.deskMailCard} ${!mail.isRead ? styles.unreadDeskMail : ''} ${mail.isLockedUntilNextDay ? styles.lockedMailCard : ''}`}
            onClick={() => handleOpenMail(mail)}
          >
            <div className={styles.deskAvatarBox}>
              {mail.isLockedUntilNextDay ? <Lock size={16} color="#C86D51" /> : mail.avatar}
            </div>

            <div className={styles.deskMailMeta}>
              <div className={styles.deskMailTopRow}>
                <span className={styles.deskMailTitle}>{mail.title}</span>
                <span className={styles.deskMailDate}>{mail.date}</span>
              </div>
              <p className={styles.deskMailSnippet}>{mail.content}</p>
            </div>

            <button 
              className={styles.hoverItemDeleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`确定要删除信件《${mail.title}》吗？此操作无法撤销。`)) {
                  deleteLetter(mail.id);
                }
              }}
              title="删除信件"
            >
              <PixelIcon name="trash" size={14} />
            </button>

            {mail.isLockedUntilNextDay ? (
              <span className={styles.lockBadgeTag}>邮寄封印中</span>
            ) : !mail.isRead ? (
              <span className={styles.waxSealBadge} title="未拆封火漆">印</span>
            ) : null}
          </div>
        ))}
      </div>

      {/* Mail Reader & Reply Popup */}
      {selectedMail && (
        <div className={styles.mailModalOverlay} onClick={() => setSelectedMail(null)}>
          <div className={styles.waxLetterCard} onClick={e => e.stopPropagation()}>
            <div className={styles.waxHeader}>
              <div>
                <span className={styles.waxTitle}>{selectedMail.title}</span>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>
                  发件人: {selectedMail.senderName} · {selectedMail.date}
                </div>
              </div>
              <button className={styles.closeWaxBtn} onClick={() => setSelectedMail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.waxBody}>
              <TypewriterText text={selectedMail.content} speed={20} isLatest={false} />
            </div>

            {/* Reply Input Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed #CFC0A0', paddingTop: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-wood-deep)' }}>
                ✍️ 撰写回信 (触发次日延迟邮寄)
              </span>
              <input 
                type="text" 
                placeholder="给伙伴回信..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                style={{
                  background: '#EADFC4',
                  border: '1.5px solid #CFC0A0',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button className={styles.sealSendBtn} onClick={handleSendReply}>
                <Send size={14} />
                <span>投递回信 (次日邮寄解封)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose New Mail Popup */}
      {isComposing && (
        <div className={styles.mailModalOverlay} onClick={() => setIsComposing(false)}>
          <div className={styles.waxLetterCard} onClick={e => e.stopPropagation()}>
            <div className={styles.waxHeader}>
              <span className={styles.waxTitle}>✒️ 羊皮纸心意信件</span>
              <button className={styles.closeWaxBtn} onClick={() => setIsComposing(false)}>
                <X size={18} />
              </button>
            </div>

            <input 
              type="text" 
              placeholder="信件主题..."
              value={mailTitle}
              onChange={e => setMailTitle(e.target.value)}
              style={{
                background: '#EADFC4',
                border: '1.5px solid #CFC0A0',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <textarea 
              placeholder="写下要倾诉的信件内容..."
              value={mailContent}
              onChange={e => setMailContent(e.target.value)}
              rows={5}
              style={{
                background: '#EADFC4',
                border: '1.5px solid #CFC0A0',
                borderRadius: '8px',
                padding: '10px',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none'
              }}
            />

            <button className={styles.sealSendBtn} onClick={handleSendLetter}>
              <Send size={15} />
              <span>盖上火漆 · 投递给伙伴</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
