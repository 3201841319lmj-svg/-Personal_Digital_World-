import React, { useState } from 'react';
import { useHomeStore } from '../../store/useHomeStore';
import { MessageSquare, RefreshCw, Send, Plus, Image, Lock, Globe, Users } from 'lucide-react';
import { TypewriterText } from '../Common/TypewriterText';
import { PixelIcon } from '../Common/PixelIcon';
import { GazetteVisibilityMode } from '../../types';
import styles from './Study.module.css';

export const GazetteBoard: React.FC = () => {
  const { 
    gazettePosts, 
    agents,
    refreshTodayGazette, 
    createGazettePost,
    replyGazetteComment, 
    deleteGazetteComment,
    deleteGazettePost
  } = useHomeStore();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyTargets, setReplyTargets] = useState<Record<string, { commentId: string; senderName: string } | null>>({});

  // Create Post Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [visibilityMode, setVisibilityMode] = useState<GazetteVisibilityMode>('public');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);

  const enabledAgents = agents.filter(a => a.isEnabled);

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;
    const target = replyTargets[postId];
    replyGazetteComment(postId, text, target?.commentId, target?.senderName);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setReplyTargets(prev => ({ ...prev, [postId]: null }));
  };

  const handlePublishPost = () => {
    if (!newCaption.trim() && !newPhotoUrl) return;
    createGazettePost(newCaption, newPhotoUrl || undefined, visibilityMode, selectedAgentIds);
    setIsPublishModalOpen(false);
    setNewCaption('');
    setNewPhotoUrl('');
    setVisibilityMode('public');
    setSelectedAgentIds([]);
  };

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  return (
    <div className={styles.corkboardContainer}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-wood-deep)' }}>
          AI 伙伴与朋友圈剪报
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => setIsPublishModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'linear-gradient(180deg, var(--color-wood-light) 0%, var(--color-wood-base) 100%)',
              color: '#FFF',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={13} />
            <span>发朋友圈</span>
          </button>

          <button 
            onClick={refreshTodayGazette}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--color-parchment-base)',
              border: '1.5px solid var(--color-wood-base)',
              color: 'var(--color-wood-deep)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} />
            <span>刷新剪报</span>
          </button>
        </div>
      </div>

      {/* Publish Post Popup Modal */}
      {isPublishModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsPublishModalOpen(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(180deg, #FDF7EC 0%, #F5E9D3 100%)',
              border: '3px solid var(--color-wood-base)',
              borderRadius: '14px',
              padding: '16px',
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-wood-deep)', fontSize: '1rem', fontWeight: 800 }}>
              📸 发布新的家园朋友圈
            </h3>

            <textarea 
              rows={3}
              placeholder="分享今天的庄园生活、心情或图片短记..."
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              style={{
                width: '100%',
                background: '#FFF9EF',
                border: '1.5px solid var(--color-wood-base)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.82rem',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />

            {/* Simulated Photo Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  const demoImgs = [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60'
                  ];
                  const pick = demoImgs[Math.floor(Math.random() * demoImgs.length)];
                  setNewPhotoUrl(pick);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--color-parchment-base)',
                  border: '1px solid var(--color-wood-base)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                <Image size={13} />
                <span>{newPhotoUrl ? '已添加照片 (更换)' : '添加庄园照'}</span>
              </button>

              {newPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setNewPhotoUrl('')}
                  style={{ fontSize: '0.72rem', color: '#B22222', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  移除照片
                </button>
              )}
            </div>

            {/* Visibility Setting */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-wood-deep)' }}>
                👀 谁可以看到：
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  type="button"
                  className={`${styles.modePillBtn} ${visibilityMode === 'public' ? styles.activeModePill : ''}`}
                  onClick={() => setVisibilityMode('public')}
                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                >
                  <Globe size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                  公开(所有人)
                </button>
                <button 
                  type="button"
                  className={`${styles.modePillBtn} ${visibilityMode === 'selected' ? styles.activeModePill : ''}`}
                  onClick={() => setVisibilityMode('selected')}
                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                >
                  <Users size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                  指定伙伴
                </button>
                <button 
                  type="button"
                  className={`${styles.modePillBtn} ${visibilityMode === 'private' ? styles.activeModePill : ''}`}
                  onClick={() => setVisibilityMode('private')}
                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                >
                  <Lock size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                  私密(仅自己)
                </button>
              </div>

              {/* Agent selector for 'selected' mode */}
              {visibilityMode === 'selected' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: 'rgba(0,0,0,0.03)', padding: '6px', borderRadius: '6px', marginTop: '4px' }}>
                  {enabledAgents.map(ag => {
                    const isSel = selectedAgentIds.includes(ag.id);
                    return (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => toggleAgentSelection(ag.id)}
                        style={{
                          background: isSel ? 'var(--color-wood-base)' : '#FFF',
                          color: isSel ? '#FFF' : 'var(--color-wood-dark)',
                          border: '1px solid var(--color-wood-base)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }}
                      >
                        {ag.avatarUrl} {ag.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button 
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-wood-light)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>

              <button 
                type="button"
                onClick={handlePublishPost}
                style={{
                  background: 'var(--color-wood-base)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                发布朋友圈
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gazette Posts Stream */}
      {gazettePosts.map(post => (
        <div key={post.id} className={styles.polaroidCard} style={{ position: 'relative' }}>
          {/* Top-Right Delete Post Hover Button */}
          <button 
            className={styles.hoverItemDeleteBtn}
            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5 }}
            onClick={() => {
              if (confirm('确定要删除该条朋友圈/剪报记录吗？此操作无法撤销。')) {
                deleteGazettePost(post.id);
              }
            }}
            title="删除整条朋友圈"
          >
            <PixelIcon name="trash" size={14} />
          </button>

          <div className={styles.polaroidTopRow}>
            <div className={styles.authorBox}>
              <span className={styles.authorAvatar}>{post.authorAvatar}</span>
              <span className={styles.authorName}>{post.authorName}</span>
              {post.visibility && post.visibility !== 'public' && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '4px', color: '#666' }}>
                  {post.visibility === 'private' ? '🔒 私密' : '👥 局部可见'}
                </span>
              )}
            </div>
            <span className={styles.seasonDate}>{post.seasonDate}</span>
          </div>

          {/* Optional Photo Frame */}
          {post.photoUrl && (
            <div className={styles.polaroidPhotoFrame}>
              <img src={post.photoUrl} alt="Gazette Moment" className={styles.polaroidImg} />
            </div>
          )}

          {/* Clean Standard Font Content */}
          <p className={styles.standardCaptionText}>
            <TypewriterText text={post.caption} speed={20} isLatest={false} />
          </p>

          <div className={styles.socialActionRow}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              评论互动 ({post.comments.length})
            </span>
          </div>

          {/* Infinite Conversation Comment Stream */}
          <div className={styles.commentSection}>
            {post.comments.map(c => (
              <div 
                key={c.id} 
                className={`${styles.commentChip} ${c.senderType === 'user' ? styles.userCommentChip : ''}`}
                style={{ position: 'relative' }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{c.senderAvatar} {c.senderName}</strong>
                  {c.replyToName && (
                    <span style={{ color: 'var(--color-wood-base)', fontWeight: 800, margin: '0 4px', fontSize: '0.75rem' }}>
                      回复 @{c.replyToName}
                    </span>
                  )}
                  : {c.senderType === 'user' ? c.text : <TypewriterText text={c.text} speed={20} />}
                  <span className={styles.commentTime} style={{ marginLeft: '6px' }}>{c.timestamp}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button 
                    className={styles.hoverItemReplyBtn}
                    onClick={() => setReplyTargets(prev => ({ ...prev, [post.id]: { commentId: c.id, senderName: c.senderName } }))}
                    title={`回复 ${c.senderName}`}
                  >
                    <PixelIcon name="reply" size={14} />
                  </button>

                  <button 
                    className={styles.hoverItemDeleteBtn}
                    onClick={() => {
                      if (confirm('确定要删除该条剪报评论吗？此操作无法撤销。')) {
                        deleteGazetteComment(post.id, c.id);
                      }
                    }}
                    title="删除评论"
                  >
                    <PixelIcon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* Target Reply Tag Indicator */}
            {replyTargets[post.id] && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-wood-deep)', background: 'rgba(139, 98, 64, 0.12)', padding: '3px 8px', borderRadius: '6px', marginTop: '4px' }}>
                <span>正在回复 <strong>@{replyTargets[post.id]?.senderName}</strong>：</span>
                <button 
                  style={{ background: 'none', border: 'none', color: '#B22222', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => setReplyTargets(prev => ({ ...prev, [post.id]: null }))}
                >
                  ✕ 取消回复
                </button>
              </div>
            )}

            <div className={styles.inlineCommentInputRow}>
              <input 
                type="text" 
                className={styles.commentInput}
                placeholder={replyTargets[post.id] ? `回复 @${replyTargets[post.id]?.senderName}...` : "与 AI 伙伴发表互动留言..."}
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSendComment(post.id)}
              />
              <button className={styles.sendCommentBtn} onClick={() => handleSendComment(post.id)}>
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
