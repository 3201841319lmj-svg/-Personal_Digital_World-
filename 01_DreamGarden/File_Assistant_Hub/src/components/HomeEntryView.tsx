import React, { useState } from 'react';
import { Paperclip, Send, Sparkles, Plus, Image, FileText, Video, Music, Link as LinkIcon, Edit3, Calendar, FolderArchive, PanelLeft, Search } from 'lucide-react';

interface HomeEntryViewProps {
  onSendMessage: (text: string, type: any, extra?: any) => void;
  onNavigateTab: (tab: 'home' | 'target' | 'archive' | 'feed') => void;
  activeTab: 'home' | 'target' | 'archive' | 'feed';
  onSummonAgent: () => void;
  onNewTopic: () => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export const HomeEntryView: React.FC<HomeEntryViewProps> = ({
  onSendMessage,
  onNavigateTab,
  activeTab,
  onSummonAgent,
  onNewTopic,
  onToggleSidebar,
  onOpenSearch
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, 'text');
    setInputText('');
    onNavigateTab('feed');
  };

  const handleQuickAttach = (type: string, name: string) => {
    onSendMessage(name, type as any);
    setShowAttachMenu(false);
    onNavigateTab('feed');
  };

  return (
    <div className="home-container">
      {/* Home Top Bar - ICON ONLY, MUJI MINIMALIST */}
      <div className="home-top-bar">
        <button className="icon-circle-btn" onClick={onToggleSidebar} title="展开历史对话与收藏">
          <PanelLeft size={18} />
        </button>

        <div className="top-right-group">
          <button className="icon-circle-btn" onClick={onOpenSearch} title="全域搜索">
            <Search size={18} />
          </button>
          <button className="icon-circle-btn agent-btn" onClick={onSummonAgent} title="配置范围并召唤 OpenClaw Agent">
            <Sparkles size={18} className="sparkle-blue" />
          </button>
          <button className="icon-circle-btn" onClick={onNewTopic} title="新建话题">
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="home-center-content animate-fade-in">
        <div className="brand-logo-circle">
          <span className="brand-logo-text font-serif">在</span>
        </div>

        <h1 className="brand-title font-serif">文件传输助手们</h1>
        <p className="brand-subtitle font-serif">你的消息中转助理，何必只有一个。</p>
      </div>

      {/* Bottom Drop Zone / Input Section */}
      <div className="home-input-section">
        {/* Attachment Menu Popup */}
        {showAttachMenu && (
          <div className="attach-menu-popup card-paper animate-fade-in">
            <div className="menu-item" onClick={() => handleQuickAttach('image', '已投递图片.png')}>
              <Image size={16} /> <span>图片</span>
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

        <div className="input-pill home-input-pill">
          <button 
            className="attach-icon-btn" 
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            title="添加附件"
          >
            <Paperclip size={18} />
          </button>
          
          <input
            type="text"
            className="input-field"
            placeholder="写点什么，或者投递文件..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />

          <button className="send-btn" onClick={handleSend} title="投递信息">
            <Send size={15} />
          </button>
        </div>

        {/* Bottom Three Primary Nav Tabs */}
        <div className="home-bottom-nav font-serif">
          <button 
            className={`nav-tab-btn ${activeTab === 'home' || activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => onNavigateTab('feed')}
          >
            <Edit3 size={18} />
            <span>快记</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'target' ? 'active' : ''}`}
            onClick={() => onNavigateTab('target')}
          >
            <Calendar size={18} />
            <span>目标</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => onNavigateTab('archive')}
          >
            <FolderArchive size={18} />
            <span>档案</span>
          </button>
        </div>
      </div>

      <style>{`
        .home-container {
          flex: 1;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px 36px 32px;
          background-color: var(--bg-warm-paper);
          position: relative;
        }

        .home-top-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-right-group {
          display: flex;
          gap: 10px;
        }

        .icon-circle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .icon-circle-btn:hover {
          background: var(--bg-card-subtle);
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          transform: translateY(-1px);
        }

        .sparkle-blue { color: var(--primary-blue); }

        .home-center-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: -40px;
        }

        .brand-logo-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background-color: #71859A;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(113, 133, 154, 0.25);
          margin-bottom: 32px;
        }

        .brand-logo-text {
          font-size: 58px;
          color: #FFFFFF;
          font-weight: 400;
          line-height: 1;
          margin-top: -4px;
        }

        .brand-title {
          font-size: 32px;
          font-weight: 600;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .brand-subtitle {
          font-size: 15px;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }

        .home-input-section {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          position: relative;
        }

        .home-input-pill {
          width: 100%;
          padding: 8px 12px 8px 14px;
        }

        .attach-icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .attach-icon-btn:hover {
          color: var(--primary-blue);
        }

        .send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--primary-blue);
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .send-btn:hover {
          background-color: var(--primary-blue-hover);
          transform: scale(1.05);
        }

        .attach-menu-popup {
          position: absolute;
          bottom: 110px;
          left: 16px;
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 10;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 13px;
          color: var(--text-main);
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .menu-item:hover {
          background: var(--bg-warm-paper);
          color: var(--primary-blue);
        }

        .home-bottom-nav {
          display: flex;
          align-items: center;
          gap: 48px;
        }

        .nav-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-tab-btn:hover, .nav-tab-btn.active {
          color: var(--text-main);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
