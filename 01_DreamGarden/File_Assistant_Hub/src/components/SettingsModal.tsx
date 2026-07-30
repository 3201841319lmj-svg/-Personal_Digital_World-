import React, { useState } from 'react';
import type { AppSettings, SyncLog, StorageStats } from '../types';
import { X, Sparkles, Cloud, Palette, Check, Copy, HardDrive, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  syncLogs: SyncLog[];
  storageStats: StorageStats;
  onClose: () => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  syncLogs,
  storageStats,
  onClose,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'agent' | 'sync' | 'theme'>('sync');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-modal card-paper animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title font-serif">⚙ 设置中心</h3>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body-container">
          {/* Tabs Sidebar */}
          <div className="settings-tabs font-serif">
            <button 
              className={`tab-btn ${activeTab === 'agent' ? 'active' : ''}`}
              onClick={() => setActiveTab('agent')}
            >
              <Sparkles size={16} /> <span>1. Agent 设置</span>
            </button>

            <button 
              className={`tab-btn ${activeTab === 'sync' ? 'active' : ''}`}
              onClick={() => setActiveTab('sync')}
            >
              <Cloud size={16} /> <span>2. 同步中心</span>
            </button>

            <button 
              className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              <Palette size={16} /> <span>3. 主题设置</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="settings-panel">
            {activeTab === 'agent' && (
              <div className="panel-content">
                <h4 className="panel-title font-serif">OpenClaw 智能体配置</h4>
                <p className="panel-desc">遵循“数据生命周期原则”，OpenClaw 仅被召唤，不替用户保存未筛选的垃圾。</p>

                <div className="setting-row">
                  <div className="row-info">
                    <span className="row-title">OpenClaw 保持在线</span>
                    <span className="row-desc">允许 OpenClaw 在幕后分析话题并自动提炼长期记忆</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.openClawConnected}
                    onChange={e => onUpdateSettings({ ...settings, openClawConnected: e.target.checked })}
                    className="toggle-checkbox"
                  />
                </div>

                <div className="agent-info-card">
                  <h5>🤖 唯一 Agent 算力按需调用说明</h5>
                  <p>OpenClaw 平时<strong>完全不读取</strong>任何消息（避免算力浪费）。只有当您在界面中选中特定消息区域并点击 [Agent] 召唤时，才去读取所选内容进行精准总结，生成浅蓝灰卡片插入底部。</p>
                </div>
              </div>
            )}

            {activeTab === 'sync' && (
              <div className="panel-content">
                <h4 className="panel-title font-serif">腾讯云 存储与生命周期中心 (V1.1)</h4>
                
                {/* Storage Level Overview Cards */}
                <div className="storage-overview-grid">
                  <div className="overview-card temp-space">
                    <div className="card-head">
                      <AlertTriangle size={14} className="icon-warning" />
                      <span>Workspace 临时空间</span>
                    </div>
                    <div className="card-metrics">
                      <span className="size-metric">{storageStats.workspaceSize}</span>
                      <span className="clean-metric">预计清理: {storageStats.pendingCleanFiles} 个文件</span>
                    </div>
                    <span className="lifecycle-tag">14天暂存 ➔ 7天回收站</span>
                  </div>

                  <div className="overview-card longterm-space">
                    <div className="card-head">
                      <ShieldCheck size={14} className="icon-protected" />
                      <span>长期保存空间 (☁ 已保护)</span>
                    </div>
                    <div className="card-metrics-grid">
                      <div>收藏: <strong>{storageStats.favoritesCount}</strong> 条</div>
                      <div>档案: <strong>{storageStats.archiveCount}</strong> 条</div>
                      <div>OpenClaw 记忆: <strong>{storageStats.memoryCount}</strong> 条</div>
                    </div>
                    <span className="lifecycle-tag protected">用户筛选 · 永久留存</span>
                  </div>
                </div>

                {/* V1.1 Sync Logs with Source Tracking */}
                <h5 className="sub-section-title font-serif">📜 最近保存与同步日志 (带来源追踪)</h5>
                <div className="sync-logs-v11">
                  {syncLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="log-card-row">
                      <div className="log-top">
                        <span className="action-tag">[{log.action}]</span>
                        <span className="source-flow">来源: {log.source || 'workspace'} ➔ 目标: {log.destination || 'archive/'}</span>
                      </div>
                      <span className="path-text">{log.path}</span>
                      <span className="log-time">{log.timestamp}</span>
                    </div>
                  ))}
                </div>

                <h5 className="sub-section-title font-serif">☁️ 腾讯云标准 V1.1 目录结构</h5>
                <div className="cloud-paths-list">
                  {[
                    'File_Assistant_Hub/workspace/ (临时传输空间)',
                    'File_Assistant_Hub/favorites/ (永久收藏)',
                    'File_Assistant_Hub/archive/ (AI 档案库)',
                    'File_Assistant_Hub/openclaw_memory/ (长期记忆链)'
                  ].map((path, idx) => (
                    <div key={idx} className="path-item">
                      <HardDrive size={14} className="icon-blue" />
                      <span className="path-text">{path}</span>
                      <button className="copy-btn" onClick={() => handleCopyPath(path.split(' ')[0])}>
                        {copiedPath === path.split(' ')[0] ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedPath === path.split(' ')[0] ? '已复制' : '复制'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="panel-content">
                <h4 className="panel-title font-serif">外观与日式美学体系</h4>

                <div className="setting-row">
                  <div className="row-info">
                    <span className="row-title">字体选型</span>
                    <span className="row-desc">默认使用思源宋体与 HarmonyOS Sans 组合</span>
                  </div>
                  <select 
                    value={settings.fontFamily}
                    onChange={e => onUpdateSettings({ ...settings, fontFamily: e.target.value as any })}
                    className="select-input"
                  >
                    <option value="serif">思源宋体 (Noto Serif SC)</option>
                    <option value="sans">HarmonyOS Sans / 思源黑体</option>
                  </select>
                </div>

                <div className="setting-row">
                  <div className="row-info">
                    <span className="row-title">主题氛围</span>
                    <span className="row-desc">暖米白 `#F5F1E9` 渲染沉浸式纸张质感</span>
                  </div>
                  <select 
                    value={settings.themeMode}
                    onChange={e => onUpdateSettings({ ...settings, themeMode: e.target.value as any })}
                    className="select-input"
                  >
                    <option value="warm-paper">MUJI 暖米白纸张感</option>
                    <option value="clean-white">极简极白 Mode</option>
                    <option value="dark-wabi">日式侘寂夜间</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }

        .settings-modal {
          width: 720px;
          max-width: 90vw;
          height: 520px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color-light);
          display: flex; align-items: center; justify-content: space-between;
        }

        .modal-title { font-size: 16px; font-weight: 600; }

        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }

        .modal-body-container { flex: 1; display: flex; }

        .settings-tabs {
          width: 190px;
          background: var(--bg-warm-paper);
          border-right: 1px solid var(--border-color);
          padding: 16px 10px;
          display: flex; flex-direction: column; gap: 6px;
        }

        .tab-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: none; background: none;
          font-size: 13px; color: var(--text-main);
          cursor: pointer; text-align: left;
          transition: background 0.15s;
        }

        .tab-btn:hover, .tab-btn.active {
          background: rgba(255, 255, 255, 0.8);
          color: var(--primary-blue);
          font-weight: 600;
        }

        .settings-panel { flex: 1; padding: 24px; overflow-y: auto; }

        .panel-title { font-size: 16px; font-weight: 600; margin-bottom: 6px; }

        .panel-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }

        .storage-overview-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;
        }

        .overview-card {
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex; flex-direction: column; gap: 6px;
        }

        .overview-card.temp-space { background: #FDF6EE; border: 1px solid #F2D5B5; }
        .overview-card.longterm-space { background: #EFF6F0; border: 1px solid #C5E2C9; }

        .card-head { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }

        .icon-warning { color: #D98236; }
        .icon-protected { color: #385E3E; }

        .card-metrics { display: flex; flex-direction: column; }
        .size-metric { font-size: 18px; font-weight: bold; color: var(--text-main); }
        .clean-metric { font-size: 11px; color: var(--text-muted); }

        .card-metrics-grid { font-size: 11px; color: var(--text-main); display: flex; flex-direction: column; gap: 2px; }

        .lifecycle-tag {
          font-size: 10px; color: var(--text-muted);
          background: rgba(0, 0, 0, 0.04);
          padding: 2px 6px; border-radius: 4px; align-self: flex-start; margin-top: 4px;
        }

        .lifecycle-tag.protected { color: #27AE60; background: #DDF2E3; }

        .sub-section-title { font-size: 13px; font-weight: 600; margin: 16px 0 8px 0; }

        .sync-logs-v11 { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }

        .log-card-row {
          background: #FAFAFA; border: 1px solid var(--border-color-light);
          padding: 8px 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 2px;
        }

        .log-top { display: flex; justify-content: space-between; font-size: 11px; }

        .action-tag { font-weight: bold; color: var(--primary-blue); }

        .source-flow { color: var(--text-muted); }

        .path-text { font-family: monospace; font-size: 11px; color: var(--text-main); }

        .log-time { font-size: 10px; color: var(--text-light); align-self: flex-end; }

        .cloud-paths-list { display: flex; flex-direction: column; gap: 6px; }

        .path-item {
          display: flex; align-items: center; justify-content: space-between;
          background: #FAFAFA; border: 1px solid var(--border-color-light);
          padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 11px;
        }

        .copy-btn {
          display: flex; align-items: center; gap: 4px;
          background: #FFF; border: 1px solid var(--border-color);
          border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer;
        }
      `}</style>
    </div>
  );
};
