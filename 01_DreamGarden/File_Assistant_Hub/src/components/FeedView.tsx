import React, { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import type { FeedItem, Topic } from '../types';
import { 
  Paperclip, Send, Copy, ThumbsUp, ThumbsDown, 
  Link as LinkIcon, Check, Trash2, Bookmark, CheckSquare, 
  Share2, ShieldCheck, AlertCircle, X, Quote, MessageSquare,
  Image as ImageIcon, FileText, Video, Music, ArrowUpRight, Sparkles, CornerDownRight
} from 'lucide-react';

interface FeedViewProps {
  currentTopic: Topic | null;
  feedItems: FeedItem[];
  onSendMessage: (text: string, type: any, extra?: any) => void;
  onSummonAgent: () => void;
  onOpenSearch: () => void;
  onNewTopic: () => void;
  onBackToHome: () => void;
  onDeleteFeedItem: (id: string) => void;
  onSaveToLongterm: (id: string, destination: 'favorites' | 'archive') => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentTopic,
  feedItems,
  onSendMessage,
  onSummonAgent,
  onOpenSearch,
  onNewTopic,
  onBackToHome,
  onDeleteFeedItem,
  onSaveToLongterm
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Attachment popup
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Quote & Thread Reply state
  const [quotedSnippet, setQuotedSnippet] = useState<string | null>(null);
  const [quotedTargetId, setQuotedTargetId] = useState<string | null>(null);
  
  // AI Thread State - NO MODAL NEEDED! Direct continuous reply!
  const [replyingAgentId, setReplyingAgentId] = useState<string | null>(null);
  const [replyingAgentSnippet, setReplyingAgentSnippet] = useState<string | null>(null);

  // Scroll to original target highlight state
  const [activeScrollTargetId, setActiveScrollTargetId] = useState<string | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  // Multi-select state
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmFavoriteId, setConfirmFavoriteId] = useState<string | null>(null);
  const [showWechatShareModal, setShowWechatShareModal] = useState(false);

  const feedEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feedItems.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    let extra: any = {};
    const isAiThread = !!replyingAgentId;

    if (quotedSnippet) {
      extra.quotedContent = quotedSnippet;
      extra.quotedTargetId = quotedTargetId;
    } else if (replyingAgentSnippet) {
      extra.quotedContent = `AI 原文: ${replyingAgentSnippet}`;
      extra.quotedTargetId = replyingAgentId;
      extra.replyToAgentId = replyingAgentId;
    }

    // 1. Send User Question Message Card (With Thread Badge if AI Reply)
    onSendMessage(inputText, 'text', extra);

    const userMsgText = inputText;
    setInputText('');
    setQuotedSnippet(null);
    setQuotedTargetId(null);
    setReplyingAgentId(null);
    setReplyingAgentSnippet(null);

    // 2. IF IT WAS A REPLY TO AI: AI IMMEDIATELY REPLIES WITHOUT OPENING ANY SCOPE MODAL!
    if (isAiThread) {
      setTimeout(() => {
        onSendMessage(`已基于您的追问“${userMsgText.slice(0, 12)}...”进行了深入推导：\n1. 结合上下文进一步深化整理；\n2. 方案结构已自动重构更新；\n3. 可继续点击下方追问按钮进行无上限多轮研讨。`, 'agent', {
          isAgent: true,
          agentName: 'OpenClaw Agent',
          replyToAgentId: extra.replyToAgentId
        });
      }, 600);
    }
  };

  const handleQuickAttach = (type: string, name: string) => {
    onSendMessage(name, type as any);
    setShowAttachMenu(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    selectedIds.forEach(id => onDeleteFeedItem(id));
    setSelectedIds([]);
    setIsMultiSelect(false);
  };

  const handleBatchFavorite = () => {
    selectedIds.forEach(id => onSaveToLongterm(id, 'favorites'));
    setSelectedIds([]);
    setIsMultiSelect(false);
  };

  const scrollToOriginalLocation = (targetId: string) => {
    const target = targetId || feedItems[0]?.id || '';
    const el = document.getElementById(`feed-card-${target}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedCardId(target);
      setTimeout(() => setHighlightedCardId(null), 2500);
    }
    setActiveScrollTargetId(null);
  };

  // Group items by dateGroup
  const groups: { [key: string]: FeedItem[] } = {};
  feedItems.forEach(item => {
    const key = item.dateGroup || '最近';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return (
    <div className="feed-container">
      {/* Header */}
      <Header
        currentTopic={currentTopic}
        onOpenSearch={onOpenSearch}
        onSummonAgent={onSummonAgent}
        onNewTopic={onNewTopic}
        onBackToHome={onBackToHome}
      />

      {/* Multi-select Header Banner */}
      {isMultiSelect && (
        <div className="multi-select-banner animate-fade-in font-serif">
          <span>已选择 <strong>{selectedIds.length}</strong> 项</span>
          <div className="banner-actions">
            <button className="banner-btn" onClick={handleBatchFavorite}>
              <Bookmark size={14} /> <span>批量收藏</span>
            </button>
            <button className="banner-btn danger" onClick={handleBatchDelete}>
              <Trash2 size={14} /> <span>批量删除</span>
            </button>
            <button className="banner-btn wechat" onClick={() => setShowWechatShareModal(true)}>
              <Share2 size={14} /> <span>分享到微信</span>
            </button>
            <button className="banner-btn close" onClick={() => { setIsMultiSelect(false); setSelectedIds([]); }}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Feed Content Scroll Area */}
      <div className="feed-scroll-area">
        <div className="feed-content-wrapper">
          {Object.keys(groups).map(dateKey => (
            <div key={dateKey} className="date-group-section">
              <div className="date-divider font-serif">
                <span>{dateKey}</span>
              </div>

              <div className="items-list">
                {groups[dateKey].map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const isHighlighted = highlightedCardId === item.id;
                  const snippetText = item.content || item.fileName || item.summaryBullets?.join(' ') || '';

                  const isAiRelatedQuote = item.replyToAgentId || (item.quotedContent && item.quotedContent.includes('AI'));

                  return (
                    <div 
                      key={item.id} 
                      id={`feed-card-${item.id}`}
                      className={`feed-card-wrapper ${item.isAgent ? 'agent-wrapper' : ''} ${item.replyToAgentId ? 'ai-thread-wrapper' : ''} ${isSelected ? 'selected' : ''}`}
                    >
                      {/* Thread Connection Line */}
                      {item.replyToAgentId && (
                        <div className="thread-connection-line" title="跟进 AI 对话脉络">
                          <CornerDownRight size={14} className="icon-blue" />
                        </div>
                      )}

                      {/* Checkbox for multi-select */}
                      {isMultiSelect && (
                        <div className="multi-select-checkbox" onClick={() => toggleSelect(item.id)}>
                          <span className={`check-square ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={12} color="#FFF" />}
                          </span>
                        </div>
                      )}

                      <div className={`feed-card ${item.isAgent ? 'agent-card' : ''} ${item.replyToAgentId ? 'thread-card-style' : ''} ${item.isProtected ? 'protected-card' : ''} ${isHighlighted ? 'highlight-pulse' : ''}`}>
                        {/* Hover Floating Toolbar */}
                        {!isMultiSelect && (
                          <div className="hover-floating-toolbar">
                            <button 
                              className="hover-tool-btn" 
                              onClick={() => {
                                setQuotedSnippet(snippetText.slice(0, 40));
                                setQuotedTargetId(item.id);
                                setReplyingAgentId(null);
                              }} 
                              title="引用此消息"
                            >
                              <Quote size={13} />
                            </button>

                            {item.isAgent && (
                              <button 
                                className="hover-tool-btn agent-reply-btn" 
                                onClick={() => {
                                  setReplyingAgentId(item.id);
                                  setReplyingAgentSnippet(item.summaryBullets ? item.summaryBullets[0] : snippetText.slice(0, 30));
                                  setQuotedSnippet(null);
                                }} 
                                title="直接回复 AI (无需弹窗，无限跟进)"
                              >
                                <MessageSquare size={13} />
                              </button>
                            )}

                            <button className="hover-tool-btn" onClick={() => handleCopy(item.id, snippetText)} title="复制">
                              {copiedId === item.id ? <Check size={13} color="#71859A" /> : <Copy size={13} />}
                            </button>
                            <button className="hover-tool-btn" onClick={() => setConfirmFavoriteId(item.id)} title="收藏 (保存到长期空间)">
                              <Bookmark size={13} className={item.isProtected ? 'icon-protected' : ''} />
                            </button>
                            <button className="hover-tool-btn danger" onClick={() => setConfirmDeleteId(item.id)} title="删除">
                              <Trash2 size={13} />
                            </button>
                            <button className="hover-tool-btn" onClick={() => { setIsMultiSelect(true); setSelectedIds([item.id]); }} title="多选模式">
                              <CheckSquare size={13} />
                            </button>
                          </div>
                        )}

                        {/* Thread Tag Banner if it's a thread */}
                        {item.replyToAgentId && !item.isAgent && (
                          <div className="thread-user-badge font-serif">
                            <Sparkles size={12} className="sparkle-blue" />
                            <span>追问 OpenClaw Agent · 无限对话链</span>
                          </div>
                        )}

                        {/* Status Protected Pill */}
                        {item.isProtected && (
                          <span className="protected-pill font-serif" title="已进入长期记忆库">
                            <ShieldCheck size={12} /> ☁ 已保护
                          </span>
                        )}

                        {/* Agent Content */}
                        {item.isAgent ? (
                          <>
                            <div className="agent-header font-serif">
                              <span className="agent-tag">
                                <Sparkles size={14} className="sparkle-blue" /> {item.agentName || 'OpenClaw Agent'}
                                {item.replyToAgentId && <span className="thread-step-tag font-sans">· 连续推导答复</span>}
                              </span>
                              <span className="card-time">{item.timestamp}</span>
                            </div>

                            <div className="agent-body font-sans">
                              <p className="agent-intro">按需唤醒总结：</p>
                              {item.summaryBullets ? (
                                <ul className="bullets-list">
                                  {item.summaryBullets.map((b, idx) => (
                                    <li key={idx}>• {b}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="text-body">{item.content}</div>
                              )}
                              {item.suggestedAction && (
                                <p className="agent-prompt">{item.suggestedAction}</p>
                              )}
                            </div>

                            <div className="agent-footer">
                              <div className="agent-actions font-sans">
                                <button className="action-icon-btn" onClick={() => handleCopy(item.id, item.summaryBullets?.join('\n') || item.content || '')}>
                                  {copiedId === item.id ? <Check size={14} color="#71859A" /> : <Copy size={14} />}
                                </button>
                                <button className="action-icon-btn" onClick={() => {
                                  setReplyingAgentId(item.id);
                                  setReplyingAgentSnippet(item.summaryBullets ? item.summaryBullets[0] : snippetText.slice(0, 30));
                                }} title="继续跟进追问 AI">
                                  <MessageSquare size={14} color="#71859A" />
                                </button>
                                <button className="action-icon-btn" title="赞"><ThumbsUp size={14} /></button>
                                <button className="action-icon-btn" title="踩"><ThumbsDown size={14} /></button>
                              </div>
                              <span className="card-time-bottom">{item.timestamp}</span>
                            </div>
                          </>
                        ) : item.type === 'pdf' ? (
                          <div className="file-card-content font-sans">
                            <div className="file-icon-box pdf"><span className="file-type-badge font-serif">人</span></div>
                            <div className="file-details">
                              <div className="file-name font-serif">{item.fileName || '客户方案最终版.pdf'}</div>
                              <div className="file-meta">{item.fileSize || '2.4 MB'}</div>
                            </div>
                            <span className="card-time">{item.timestamp}</span>
                          </div>
                        ) : item.type === 'image' ? (
                          <div className="image-card-content font-sans">
                            <div className="image-preview-box">
                              {item.imageUrl ? <img src={item.imageUrl} alt="图片" /> : <div className="image-placeholder">🖼️</div>}
                            </div>
                            <div className="image-details">
                              <div className="file-name font-serif">{item.fileName || '方案封面设计.png'}</div>
                              <div className="file-meta">{item.fileSize || '1.2 MB'}</div>
                            </div>
                            <span className="card-time">{item.timestamp}</span>
                          </div>
                        ) : item.type === 'doc' ? (
                          <div className="file-card-content font-sans">
                            <div className="file-icon-box word"><span className="word-text font-serif">W</span></div>
                            <div className="file-details">
                              <div className="file-name font-serif">{item.fileName || '客户需求文档.docx'}</div>
                              <div className="file-meta">{item.fileSize || '1.6 MB'}</div>
                            </div>
                            <span className="card-time">{item.timestamp}</span>
                          </div>
                        ) : item.type === 'link' ? (
                          <div className="file-card-content font-sans">
                            <div className="file-icon-box link"><LinkIcon size={16} /></div>
                            <div className="file-details">
                              <div className="file-name font-serif">{item.title || '客户公司官网'}</div>
                              <a href={item.linkUrl || '#'} target="_blank" rel="noreferrer" className="link-url">{item.linkUrl || 'https://example.com'}</a>
                            </div>
                            <span className="card-time">{item.timestamp}</span>
                          </div>
                        ) : (
                          <div className="text-card-content font-sans">
                            <div className="text-body">
                              {item.content?.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                              ))}
                            </div>
                            <span className="card-time">{item.timestamp}</span>
                          </div>
                        )}

                        {/* SINGLE-LINE QUOTED MESSAGE AT THE BOTTOM WITH EXCLUSIVE MORANDI BLUE FOR AI */}
                        {item.quotedContent && (
                          <div className="single-line-quote-bottom font-sans">
                            <div 
                              className={`quote-content-single ${isAiRelatedQuote ? 'ai-quote-pill' : ''}`}
                              onClick={() => setActiveScrollTargetId(activeScrollTargetId === item.id ? null : item.id)}
                            >
                              {isAiRelatedQuote ? (
                                <Sparkles size={12} className="sparkle-blue" />
                              ) : (
                                <Quote size={12} className="icon-blue" />
                              )}
                              <span className="single-line-text">
                                {isAiRelatedQuote ? '跟进 AI 原文: ' : '引用原文: '}“{item.quotedContent}”
                              </span>
                            </div>

                            {/* Floating "回到原文位置" Button when clicked */}
                            {activeScrollTargetId === item.id && (
                              <button 
                                className="scroll-to-original-btn animate-fade-in font-serif"
                                onClick={() => scrollToOriginalLocation(item.quotedTargetId || feedItems[0]?.id || '')}
                              >
                                <ArrowUpRight size={12} />
                                <span>回到原文位置</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div ref={feedEndRef} />
        </div>
      </div>

      {/* Bottom Input Section */}
      <div className="feed-bottom-input-container">
        <div className="input-wrapper-inner">
          {/* Active Quoted Banner */}
          {quotedSnippet && (
            <div className="input-active-banner animate-fade-in font-serif">
              <Quote size={13} className="icon-blue" />
              <span>正在引用消息: “{quotedSnippet}...”</span>
              <button onClick={() => { setQuotedSnippet(null); setQuotedTargetId(null); }} className="clear-btn"><X size={12} /></button>
            </div>
          )}

          {/* Active Replying to AI Banner */}
          {replyingAgentId && (
            <div className="input-active-banner ai-reply animate-fade-in font-serif">
              <Sparkles size={13} className="sparkle-blue" />
              <span>与 OpenClaw 连续追问对话 (无需弹窗 · 回复后 AI 将自动回答)</span>
              <button onClick={() => { setReplyingAgentId(null); setReplyingAgentSnippet(null); }} className="clear-btn"><X size={12} /></button>
            </div>
          )}

          {/* Attachment Menu Popup */}
          {showAttachMenu && (
            <div className="feed-attach-popup card-paper animate-fade-in font-serif">
              <div className="menu-item" onClick={() => handleQuickAttach('image', '已投递图片.png')}>
                <ImageIcon size={16} /> <span>图片</span>
              </div>
              <div className="menu-item" onClick={() => handleQuickAttach('pdf', '需求文档草案.pdf')}>
                <FileText size={16} /> <span>文件</span>
              </div>
              <div className="menu-item" onClick={() => handleQuickAttach('video', '演示视频.mp4')}>
                <Video size={16} /> <span>视频</span>
              </div>
              <div className="menu-item" onClick={() => handleQuickAttach('audio', '会议录音.mp3')}>
                <Music size={16} /> <span>音频</span>
              </div>
              <div className="menu-item" onClick={() => handleQuickAttach('link', 'https://example.com')}>
                <LinkIcon size={16} /> <span>链接</span>
              </div>
            </div>
          )}

          {/* Perfectly Aligned Pill */}
          <div className="input-pill feed-input-pill">
            <button 
              className="attach-icon-btn" 
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              title="添加附件"
            >
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              className="input-field font-sans"
              placeholder={replyingAgentId ? "向 OpenClaw 追问后续更深入的问题..." : "写点什么，或者拖入文件..."}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />

            <button className="send-btn" onClick={handleSend} title="发送信息">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {confirmDeleteId && (
        <div className="modal-backdrop">
          <div className="confirm-dialog card-paper font-serif">
            <div className="dialog-head">
              <AlertCircle size={20} className="icon-danger" />
              <h4>二次确认删除</h4>
            </div>
            <p className="font-sans">确定要删除该条信息卡片吗？删除后将移至 7 天临时回收站中。</p>
            <div className="dialog-actions font-serif">
              <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(null)}>取消</button>
              <button className="btn btn-primary danger" onClick={() => { onDeleteFeedItem(confirmDeleteId); setConfirmDeleteId(null); }}>确定删除</button>
            </div>
          </div>
        </div>
      )}

      {confirmFavoriteId && (
        <div className="modal-backdrop">
          <div className="confirm-dialog card-paper font-serif">
            <div className="dialog-head">
              <Bookmark size={20} className="icon-protected" />
              <h4>二次确认收藏 (长期空间)</h4>
            </div>
            <p className="font-sans">收藏后，该条消息将升级为 <strong>☁ 已保护</strong>，脱离 14 天自动清理体系。</p>
            <div className="dialog-actions font-serif">
              <button className="btn btn-ghost" onClick={() => setConfirmFavoriteId(null)}>取消</button>
              <button className="btn btn-primary" onClick={() => { onSaveToLongterm(confirmFavoriteId, 'favorites'); setConfirmFavoriteId(null); }}>确定收藏</button>
            </div>
          </div>
        </div>
      )}

      {showWechatShareModal && (
        <div className="modal-backdrop">
          <div className="confirm-dialog card-paper font-serif">
            <div className="dialog-head">
              <Share2 size={20} className="icon-blue" />
              <h4>微信分享导出</h4>
            </div>
            <p className="font-sans">已为您将选中的 <strong>{selectedIds.length}</strong> 条消息整合成精致格式并复制至剪贴板，可直接在微信粘贴。</p>
            <div className="dialog-actions font-serif">
              <button className="btn btn-primary" onClick={() => setShowWechatShareModal(false)}>完成并关闭</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .feed-container {
          flex: 1; height: 100vh; display: flex; flex-direction: column;
          background-color: var(--bg-warm-paper); overflow: hidden; position: relative;
        }

        .multi-select-banner {
          background: #FFFFFF; border-bottom: 1px solid var(--border-color);
          padding: 8px 24px; display: flex; align-items: center; justify-content: space-between;
          font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); z-index: 10;
        }

        .banner-actions { display: flex; gap: 8px; }

        .banner-btn {
          display: flex; align-items: center; gap: 6px; background: var(--bg-warm-paper);
          border: 1px solid var(--border-color); border-radius: var(--radius-full);
          padding: 4px 12px; font-size: 12px; cursor: pointer;
        }
        .banner-btn.danger { color: #E74C3C; }
        .banner-btn.wechat { color: #27AE60; }

        .feed-scroll-area {
          flex: 1; overflow-y: auto; padding: 24px 0; display: flex; justify-content: center;
        }

        .feed-content-wrapper {
          width: 100%; max-width: 680px; padding: 0 24px; display: flex; flex-direction: column; gap: 20px;
        }

        .date-divider { display: flex; justify-content: center; margin: 16px 0 24px 0; }
        .date-divider span { font-size: 12px; color: var(--text-light); background: rgba(230, 224, 213, 0.5); padding: 2px 14px; border-radius: var(--radius-full); }

        .items-list { display: flex; flex-direction: column; gap: 16px; }

        .feed-card-wrapper { display: flex; align-items: center; gap: 12px; position: relative; }
        .feed-card-wrapper.ai-thread-wrapper { margin-left: 16px; }

        .thread-connection-line {
          position: absolute; left: -18px; top: 18px; color: var(--primary-blue);
        }

        .multi-select-checkbox { cursor: pointer; }
        .check-square { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
        .check-square.checked { background: var(--primary-blue); border-color: var(--primary-blue); }

        .feed-card {
          flex: 1; background: #FFFFFF; border: 1px solid var(--border-color-light);
          border-radius: var(--radius-md); padding: 16px 20px; position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02); transition: all 0.25s ease;
        }

        .feed-card.thread-card-style {
          border-left: 3px solid var(--primary-blue); background: #FAFDFZ;
        }

        .thread-user-badge {
          display: flex; align-items: center; gap: 6px; font-size: 11px;
          color: var(--primary-blue); background: #EBF3FA; padding: 3px 10px;
          border-radius: 4px; margin-bottom: 10px; font-weight: 600;
        }

        .thread-step-tag { font-size: 11px; color: var(--primary-blue); background: #D6E4F0; padding: 1px 6px; border-radius: 4px; margin-left: 6px; }

        .feed-card.highlight-pulse {
          border-color: var(--primary-blue) !important;
          box-shadow: 0 0 0 3px var(--primary-blue-light), 0 8px 24px rgba(113, 133, 154, 0.2) !important;
          transform: translateY(-2px);
        }

        .feed-card.protected-card { border-color: #C5E2C9; }

        /* SINGLE-LINE QUOTED MESSAGE AT BOTTOM */
        .single-line-quote-bottom {
          margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border-color-light);
          display: flex; align-items: center; justify-content: space-between; position: relative;
        }

        .quote-content-single {
          display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted);
          background: var(--bg-warm-paper); padding: 4px 10px; border-radius: 4px;
          cursor: pointer; max-width: 82%; transition: background 0.15s;
        }

        .quote-content-single:hover { background: #EAE4D6; color: var(--primary-blue); }

        /* EXCLUSIVE MORANDI BLUE STYLING FOR AI QUOTE */
        .quote-content-single.ai-quote-pill {
          background: #EBF3FA; border-left: 3px solid var(--primary-blue); color: #4B6074;
        }
        .quote-content-single.ai-quote-pill:hover { background: #DFEBF5; }

        .single-line-text {
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
        }

        .scroll-to-original-btn {
          display: flex; align-items: center; gap: 4px; background: var(--primary-blue);
          color: #FFF; border: none; border-radius: var(--radius-full); padding: 3px 10px;
          font-size: 11px; cursor: pointer; box-shadow: 0 2px 8px rgba(113, 133, 154, 0.25);
        }

        /* Hover Floating Toolbar */
        .hover-floating-toolbar {
          position: absolute; top: -14px; right: 16px; background: #FFFFFF;
          border: 1px solid var(--border-color); border-radius: var(--radius-full);
          padding: 2px 6px; display: flex; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          opacity: 0; pointer-events: none; transition: opacity 0.2s, transform 0.2s;
          transform: translateY(4px); z-index: 5;
        }

        .feed-card:hover .hover-floating-toolbar { opacity: 1; pointer-events: auto; transform: translateY(0); }

        .hover-tool-btn { background: none; border: none; padding: 4px; color: var(--text-muted); cursor: pointer; border-radius: 50%; }
        .hover-tool-btn:hover { color: var(--primary-blue); }
        .hover-tool-btn.danger:hover { color: #E74C3C; }
        .agent-reply-btn:hover { color: #27AE60; }

        .protected-pill {
          position: absolute; right: 16px; bottom: -10px; font-size: 10px; color: #27AE60;
          background: #EBF7EE; padding: 2px 8px; border-radius: 4px; border: 1px solid #C4E8CB;
        }

        .card-time { position: absolute; right: 20px; top: 16px; font-size: 11px; color: var(--text-light); }

        .file-card-content, .image-card-content { display: flex; align-items: center; gap: 16px; }

        .file-icon-box { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .file-icon-box.pdf { background-color: #E74C3C; color: #FFFFFF; }
        .file-icon-box.word { background-color: #2B579A; color: #FFFFFF; }
        .file-icon-box.link { background-color: #E6EAF0; color: var(--primary-blue); }
        .file-type-badge, .word-text { font-size: 18px; font-weight: bold; }

        .file-details { display: flex; flex-direction: column; gap: 2px; }
        .file-name { font-size: 14px; font-weight: 600; color: var(--text-main); }
        .file-meta { font-size: 12px; color: var(--text-muted); }
        .link-url { font-size: 12px; color: var(--primary-blue); text-decoration: none; }

        .image-preview-box { width: 64px; height: 64px; border-radius: var(--radius-sm); overflow: hidden; background: #F0EDE6; flex-shrink: 0; }
        .image-preview-box img { width: 100%; height: 100%; object-fit: cover; }

        .text-card-content .text-body { font-size: 14px; color: var(--text-main); line-height: 1.6; }

        /* Agent Card */
        .agent-card { background-color: var(--bg-agent-light); border-color: #D3E0EA; }
        .agent-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .agent-tag { font-size: 13px; font-weight: 600; color: var(--primary-blue); display: flex; align-items: center; gap: 6px; }
        .sparkle-blue { color: var(--primary-blue); }
        .agent-body { font-size: 13px; color: var(--text-main); margin-bottom: 12px; }
        .agent-intro { font-weight: 500; margin-bottom: 6px; }
        .bullets-list { list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
        .agent-prompt { font-size: 12px; color: var(--text-muted); margin-top: 8px; }

        .agent-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(113, 133, 154, 0.15); }
        .agent-actions { display: flex; gap: 12px; }
        .action-icon-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; }
        .card-time-bottom { font-size: 11px; color: var(--text-light); }

        /* BOTTOM INPUT CONTAINER MATCHING HOME PAGE */
        .feed-bottom-input-container {
          padding: 16px 24px 24px 24px; display: flex; justify-content: center;
          background: linear-gradient(to top, var(--bg-warm-paper) 80%, rgba(245, 241, 233, 0));
        }

        .input-wrapper-inner {
          width: 100%; max-width: 680px; display: flex; flex-direction: column; gap: 8px; position: relative;
        }

        .input-active-banner {
          display: flex; align-items: center; justify-content: space-between;
          background: #FFFFFF; border: 1px solid var(--primary-blue); border-radius: var(--radius-full);
          padding: 4px 14px; font-size: 11px; color: var(--primary-blue);
        }

        .input-active-banner.ai-reply { background: #EBF3FA; border-color: #71859A; color: #3A4E61; }
        .clear-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        /* ELEGANT INPUT PILL MATCHING HOME PAGE EXACTLY */
        .feed-input-pill {
          width: 100%; padding: 8px 12px 8px 14px; background: #FFFFFF;
          border: 1px solid var(--border-color); border-radius: var(--radius-full);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); display: flex; align-items: center; gap: 12px;
        }

        .feed-input-pill:focus-within {
          border-color: var(--primary-blue); box-shadow: 0 4px 24px rgba(113, 133, 154, 0.15);
        }

        .attach-icon-btn {
          background: none; border: none; color: var(--text-muted); cursor: pointer;
          padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .attach-icon-btn:hover { color: var(--primary-blue); }

        .feed-attach-popup {
          position: absolute; bottom: 64px; left: 16px; display: flex; gap: 8px;
          padding: 8px 12px; background: #FFFFFF; border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg); z-index: 10;
        }

        .send-btn {
          width: 38px; height: 38px; border-radius: 50%; background-color: var(--primary-blue);
          color: #FFFFFF; border: none; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.2s, background 0.2s; flex-shrink: 0;
        }
        .send-btn:hover { background-color: var(--primary-blue-hover); transform: scale(1.05); }
      `}</style>
    </div>
  );
};
