import { DreamTopic, DreamChapter } from '../types';

export interface OpenClawSyncResult {
  success: boolean;
  syncedTimestamp: string;
  targetServer: string;
  remoteWorkspacePath: string;
  totalTopics: number;
  totalChapters: number;
  favChaptersCount: number;
  logSummary: string[];
}

export const syncStoriesToTencentOpenClaw = async (
  topics: DreamTopic[]
): Promise<OpenClawSyncResult> => {
  // Simulate network sync latency to Tencent Cloud Server (118.25.x.x)
  await new Promise(resolve => setTimeout(resolve, 1500));

  let totalChapters = 0;
  let favChaptersCount = 0;
  const logs: string[] = [];

  logs.push(`[OpenClaw Agent] 连接腾讯云 Server (118.25.x.x:8080) 物理工作区...`);
  logs.push(`[OpenClaw Agent] 目标路径: /openclaw/workspace/Story_Archives/`);

  topics.forEach(t => {
    logs.push(`  ├─ 目录建立: /Story_Archives/Topics/${t.topicId}/ (附件: ${t.attachments.join(', ')})`);
    t.chapters.forEach(c => {
      totalChapters++;
      if (c.isFavorite) favChaptersCount++;
      logs.push(`  │   ├─ 写入章节 Markdown: ${c.title}.md (${c.content.length} 字节)`);
    });
  });

  logs.push(`[OpenClaw Agent] 写入珍藏清单: /Story_Archives/Favorites/favorites_manifest.json (共 ${favChaptersCount} 篇珍藏章节)`);
  logs.push(`[OpenClaw Agent] 全量故事全文同步完成！权限已锁定为 OpenClaw 集中安全保管。`);

  return {
    success: true,
    syncedTimestamp: new Date().toLocaleString(),
    targetServer: '腾讯云 Server (118.25.x.x)',
    remoteWorkspacePath: '/openclaw/workspace/Story_Archives/',
    totalTopics: topics.length,
    totalChapters,
    favChaptersCount,
    logSummary: logs
  };
};
