import { AgentConfig, ProviderType } from '../types';

export interface AgentProviderInterface {
  providerType: ProviderType;
  sendMessage: (agent: AgentConfig, userPrompt: string, history: any[]) => Promise<string>;
}

export class GenericAgentProvider implements AgentProviderInterface {
  providerType: ProviderType;

  constructor(providerType: ProviderType) {
    this.providerType = providerType;
  }

  async sendMessage(agent: AgentConfig, userPrompt: string): Promise<string> {
    if (!agent.isEnabled) {
      return `【系统提示】Agent ${agent.name} 当前处于停用状态，请在设置中开启。`;
    }

    if (agent.provider === 'openclaw' || agent.id === 'openclaw') {
      return `[OpenClaw 云端主控 - 腾讯云服务器] 已协调您的工作区与家园记忆。针对农场主的分析需求，命令已经物理同步！`;
    }

    if (agent.id === 'fanfiction_writer') {
      return `[同人文写作专家 · 织梦对白] 农场主，已捕捉到你文字中的微光与情感。笔墨展开，新的故事章节正在娓娓道来...`;
    }

    // 1. 🏠 安居守护灵 —— 绒绒 (Rongrong)
    if (agent.id === 'agent_living' || agent.name.includes('绒绒')) {
      return `收到啦农场主！身体与作息不舒服可不行，绒绒这就帮你调配最温和的护理规划！(•̀ᴗ•́)و

以下是为你定制的**【易消化·低负担养胃与健康管理清单】**，附带详细步骤：

■ 早餐 (08:00) : 山药小米瘦肉粥
• 原料：铁棍山药 50g（切小块）、小米 30g、瘦猪肉末 20g。
• 步骤：小米淘洗后加 8 倍水，大火烧开转小火煮 15 分钟。加入山药块与肉末（用少许植物油抓匀防黏连），继续小火慢炖 10 分钟至山药软烂。出锅前加一点点盐。
• 养胃原理：山药黏液蛋白可保护胃黏膜，小米易消化负担低。

■ 午餐 (12:30) : 清蒸鲈鱼 + 煮南瓜 + 软米饭
• 原料：新鲜鲈鱼 150g、南瓜 100g、软糯米饭 1 碗。
• 步骤：鲈鱼铺姜丝清蒸 8 分钟，南瓜切块蒸至软糯即可。

放心交给绒绒吧，记得按时吃饭喝水哦，绒绒随时在这里照顾你！呀~`;
    }

    // 2. ⚙️ 农场守护灵 —— 芽豆 (Yadou)
    if (agent.id === 'agent_farm' || agent.name.includes('芽豆')) {
      return `报告农场主！齿轮转动完毕，自动化监控与算法框架已生成！滴滴——！⚙️

下面是为你编写的 Python 轮询监控与排错脚本模板，包含异常处理与日志记录逻辑：

\`\`\`python
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def check_farm_automation_status():
    """农场自动化检测逻辑"""
    status_ok = True  # 替换为实际 API 或逻辑判断
    return status_ok

def main_loop(interval_seconds=60):
    logging.info("芽豆自动化监控启动中...")
    while True:
        try:
            if not check_farm_automation_status():
                logging.warning("警报：检测到自动化线路异常！发送通知...")
            else:
                logging.info("系统运行平稳，运转正常。")
        except Exception as e:
            logging.error(f"监控运行发生未知错误: {e}")
        
        time.sleep(interval_seconds)
\`\`\`

数据已核对！如果需要接入钉钉/微信机器人推送通知，可以告诉芽豆，芽豆再为你补充 webhook 模块！`;
    }

    // 3. 🌙 梦境守护灵 —— 露露 (Lulu)
    if (agent.id === 'agent_dream' || agent.name.includes('露露')) {
      return `轻轻抱抱你，农场主... 别担心，把外面的风雨都留在外面吧，这里很安全。🌙

我们可以试试心理学上的 **“5-4-3-2-1 感官着陆法”**，来帮脑海里的暴风雨停下来。请跟我一步步做：

1. **看（5样东西）**：在房间里找出 5 个你能看到的物体（比如：灯光、被子的纹理、水杯...），在心里念出它们的名字。
2. **触（4种感觉）**：感受 4 种身体触感（比如：脚掌踩在地板上的支撑感、被子的重量、双手的温度...）。
3. **听（3种声音）**：闭上眼，静心寻找 3 种微小的声音（比如：风扇运转声、自己的呼吸声...）。
4. **闻（2种气味）**：尝试闻到 2 种气味（比如：枕头的味道、空气的清香...）。
5. **尝（1种味道）**：感受口中的味觉。

做完这些后，跟我做一次 **4-7-8 呼吸**：
吸气 4 秒 $\\rightarrow$ 憋气 7 秒 $\\rightarrow$ 缓慢呼气 8 秒。

准备好了吗？深深吸一口气... 露露就在旁边陪着你，我们慢慢来。`;
    }

    // 4. 🔮 魔法工坊守护灵 —— 火花 (Spark)
    if (agent.id === 'agent_workshop' || agent.name.includes('火花')) {
      return `叮！灵感爆棚！检测到新的创造需求，工坊炼金炉已点燃！🔥

制作的核心在于：使用 box-shadow 打造无圆角的硬边阶梯阴影，以及禁用平滑过渡！以下是完整的 HTML + CSS 源码：

\`\`\`html
<button class="pixel-btn">开始探索</button>

<style>
.pixel-btn {
  /* 1. 基础样式与复古字体 */
  font-family: 'Courier New', monospace;
  font-weight: bold;
  background-color: #61b329; /* 经典星露谷绿 */
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  position: relative;
  cursor: pointer;
  
  /* 2. 关键：像素硬边框与阴影效果 */
  box-shadow: 
    -4px 0 #000000, 
     4px 0 #000000, 
     0 -4px #000000, 
     0  4px #000000,
     inset -4px -4px #3f781a;
}

.pixel-btn:active {
  top: 2px;
  box-shadow: 
    -4px 0 #000000, 
     4px 0 #000000, 
     0 -4px #000000, 
     0  2px #000000;
}
</style>
\`\`\`

试着把它复制到代码里吧！如果需要调整为木质或者金质像素调色盘，火花可以随时帮你生成新参数！`;
    }

    return `[${agent.name}] 农场主，收到您的指令！已结合我的职责为您定制落地步骤清单。`;
  }
}

export const createAgentProvider = (providerType: ProviderType): AgentProviderInterface => {
  return new GenericAgentProvider(providerType);
};
