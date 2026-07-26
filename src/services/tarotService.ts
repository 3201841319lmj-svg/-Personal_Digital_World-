import tarotManifestData from '../assets/tarot/tarot_manifest.json';
import { TarotCardItem } from '../types';
import { getTarotImageUrl } from './tarotAssets';

export interface ManifestCard {
  id: number;
  name: string;
  file_name: string;
  image_path: string;
  data_url?: string;
}

export function drawThreeCards(): TarotCardItem[] {
  const positions = ["【过去/现状】", "【面临挑战】", "【未来启示】"];
  const manifest: ManifestCard[] = tarotManifestData;

  // Fisher-Yates random shuffle
  const shuffled = [...manifest].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map((card, index) => ({
    id: card.id,
    name: card.name,
    positionName: positions[index],
    imagePath: card.data_url || getTarotImageUrl(card.file_name),
    isReversed: Math.random() < 0.5
  }));
}

/**
 * ⚡ Token 极致优化：给 AI 发送纯文本 Prompt，严禁带图片 URL 或 Base64！
 */
export function buildTarotPureTextPrompt(
  question: string, 
  cards: TarotCardItem[], 
  agentName: string
): string {
  const cardsText = cards.map((c, i) => 
    `${i + 1}. 位置：${c.positionName} - 牌名：${c.name} (${c.isReversed ? '逆位' : '正位'})`
  ).join('\n');

  return `[System Prompt]: 你现在是【${agentName}】，一位精通占卜与魔法的庄园伙伴。请用符合你性格语气的方式，为农场主解读这次 78 张标准伟特像素塔罗牌占卜。

[User Question]: "${question}"

[Drawn Cards Data]:
${cardsText}

[Task]: 请结合农场主的问题以及抽到的三张卡牌及其正逆位含义，为农场主做出生动、治愈且富有哲理的解答。`;
}
