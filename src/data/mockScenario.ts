import type {
  HistoricalEvent,
  CyclePhase,
  CycleAnalysis,
  DimensionScore,
  SimilarEvent,
} from '../types/scenario';
import type { SignalDirection } from '../types/dashboard';

// ═══ 历史事件 ═══

export function generateHistoricalEvents(): HistoricalEvent[] {
  return [
    { id: 'ev-01', date: '2000-01', price: 50000, title: '传统需求主导期', description: '碳酸锂主要用于陶瓷、玻璃等传统行业，需求稳定，价格平稳运行。', category: 'demand' },
    { id: 'ev-02', date: '2010-01', price: 50000, title: '新能源产业起步', description: '全球新能源汽车产业开始萌芽，锂电需求初现增长苗头，但对碳酸锂价格影响有限。', category: 'demand' },
    { id: 'ev-03', date: '2019-12', price: 48000, title: '锂电池列入鼓励类', description: '国家发改委发布产业结构调整指导目录，锂电池相关产业被列入鼓励类，提振市场信心。', category: 'policy' },
    { id: 'ev-04', date: '2020-02', price: 50000, title: '疫情冲击新能源', description: '新冠疫情爆发，全球供应链中断，新能源汽车产销大幅下滑，短期需求承压。', category: 'macro' },
    { id: 'ev-05', date: '2020-04', price: 45000, title: '补贴政策延续', description: '国家将新能源汽车补贴政策延长至2022年底，缓解了市场焦虑，为需求复苏奠定基础。', category: 'policy' },
    { id: 'ev-06', date: '2020-11', price: 45000, title: '新能源规划+触底反弹', description: '国务院发布新能源汽车产业发展规划（2021-2035），明确长期发展方向，需求预期改善，价格触底反弹。', category: 'policy' },
    { id: 'ev-07', date: '2021-02', price: 75000, title: '检修+需求爆发', description: '春节后部分锂盐厂检修，叠加新能源汽车销量爆发式增长，供需紧张推动价格快速上行。', category: 'supply' },
    { id: 'ev-08', date: '2021-03', price: 80000, title: '十四五规划出台', description: '十四五规划明确碳中和目标，新能源产业链迎来政策利好，市场对锂资源需求预期大幅提升。', category: 'policy' },
    { id: 'ev-09', date: '2021-06', price: 88000, title: '价格涨势放缓', description: '下游电池厂开始接受高价，但终端传导压力增大，价格涨势阶段性放缓。', category: 'demand' },
    { id: 'ev-10', date: '2021-07', price: 90000, title: '储能指导意见发布', description: '国家发改委、能源局发布加快新型储能发展的指导意见，储能成为锂电需求新增量。', category: 'policy' },
    { id: 'ev-11', date: '2021-08', price: 100000, title: '磷酸铁锂产能集中投放', description: '磷酸铁锂正极材料产能集中释放，对碳酸锂需求激增，价格突破10万元/吨关口。', category: 'demand' },
    { id: 'ev-12', date: '2021-10', price: 195000, title: '能耗双控影响加大', description: '全国能耗双控政策趋严，部分锂盐生产企业限产限电，供给收缩推动价格加速上涨。', category: 'policy' },
    { id: 'ev-13', date: '2021-11', price: 199000, title: '供给缺口扩大', description: '锂精矿供应持续紧张，盐湖提锂产能不足，供需缺口进一步扩大，价格逼近20万元/吨。', category: 'supply' },
    { id: 'ev-14', date: '2022-01', price: 340000, title: '检修+盐湖产量下降', description: '冬季盐湖提锂产量下降，叠加春节前集中备货，价格跳涨至34万元/吨。', category: 'supply' },
    { id: 'ev-15', date: '2022-03', price: 500000, title: '行业座谈会引导理性回归', description: '工信部召开锂行业座谈会，引导价格理性回归，但短期供需矛盾仍未缓解，价格冲高至50万元/吨。', category: 'policy' },
    { id: 'ev-16', date: '2022-04', price: 480000, title: '产能恢复', description: '前期检修产能逐步恢复，新增产能开始释放，供给端压力有所缓解，价格小幅回落。', category: 'supply' },
    { id: 'ev-17', date: '2022-09', price: 560000, title: '历史最高点', description: '下游备货旺季叠加供给弹性不足，碳酸锂价格创下56万元/吨的历史最高纪录。', category: 'milestone' },
    { id: 'ev-18', date: '2023-01', price: 250000, title: '国补退坡，价格急跌', description: '新能源汽车国补正式退坡，终端需求短期受挫，叠加产业链去库存，价格从高位急跌至25万元/吨。', category: 'demand' },
    { id: 'ev-19', date: '2023-04', price: 250000, title: '充电设施指导意见', description: '国务院办公厅印发充电基础设施指导意见，完善充换电网络建设，对长期需求形成支撑。', category: 'policy' },
    { id: 'ev-20', date: '2023-06', price: 310000, title: '阶段性反弹', description: '下游补库存需求释放，叠加盐湖产量季节性下降，价格出现阶段性反弹至31万元/吨。', category: 'demand' },
    { id: 'ev-21', date: '2023-07', price: 240000, title: '碳酸锂期货上市', description: '广期所碳酸锂期货正式上市交易，价格发现功能逐步发挥作用，市场定价机制更加透明。', category: 'milestone' },
    { id: 'ev-22', date: '2023-09', price: 200000, title: '供给宽松预期', description: '全球锂矿产能集中释放，供给宽松预期增强，叠加下游需求不及预期，价格持续下行。', category: 'supply' },
    { id: 'ev-23', date: '2023-12', price: 120000, title: '下游库存高企', description: '电池厂和正极材料厂库存处于高位，采购意愿低迷，价格跌破15万元/吨关口。', category: 'demand' },
    { id: 'ev-24', date: '2024-01', price: 100000, title: '锂矿减停产', description: '部分高成本锂矿企业宣布减产停产，供给端开始出现收缩信号，但需求仍未见明显好转。', category: 'supply' },
    { id: 'ev-25', date: '2024-03', price: 115000, title: '以旧换新+环保检查', description: '国务院推动大规模设备更新和消费品以旧换新，叠加环保检查趋严，价格小幅反弹。', category: 'policy' },
    { id: 'ev-26', date: '2024-06', price: 90000, title: '供过于求格局确立', description: '全球锂资源供给过剩格局确立，价格跌破10万元/吨，行业进入深度调整期。', category: 'supply' },
    { id: 'ev-27', date: '2024-10', price: 75000, title: '澳矿停产出清信号', description: '澳洲多家锂矿企业宣布停产或延缓扩产计划，供给端出清信号明确，市场预期改善。', category: 'supply' },
    { id: 'ev-28', date: '2025-03', price: 70000, title: '低位波动，产能出清', description: '碳酸锂价格在7-8万元/吨区间低位波动，行业产能持续出清，部分中小企业退出市场。', category: 'supply' },
    { id: 'ev-29', date: '2025-09', price: 75000, title: '新型储能专项行动', description: '国家能源局发布新型储能发展专项行动计划，推动储能装机规模化增长，对锂需求形成长期支撑。', category: 'policy' },
  ];
}

// ═══ 价格时间线 ═══

export function generatePriceTimeline(): { date: string; price: number }[] {
  const events = generateHistoricalEvents();
  const result: { date: string; price: number }[] = [];

  for (let i = 0; i < events.length - 1; i++) {
    const curr = events[i];
    const next = events[i + 1];
    const [cy, cm] = curr.date.split('-').map(Number);
    const [ny, nm] = next.date.split('-').map(Number);
    const totalMonths = (ny - cy) * 12 + (nm - cm);
    const steps = Math.max(totalMonths, 1);

    for (let m = 0; m < steps; m++) {
      const year = cy + Math.floor((cm - 1 + m) / 12);
      const month = ((cm - 1 + m) % 12) + 1;
      const t = m / steps;
      const price = Math.round(curr.price + (next.price - curr.price) * t);
      result.push({
        date: `${year}-${String(month).padStart(2, '0')}`,
        price,
      });
    }
  }

  // Add the last event point
  const last = events[events.length - 1];
  result.push({ date: last.date, price: last.price });

  return result;
}

// ═══ AI 周期研判 ═══

function scoreToPhase(score: number): CyclePhase {
  if (score >= 70) return '顶部过热';
  if (score >= 58) return '上行加速';
  if (score >= 50) return '上行启动';
  if (score >= 42) return '下行启动';
  if (score >= 25) return '下行加速';
  return '底部筑底';
}

function scoreToDirection(score: number): SignalDirection {
  if (score > 58) return 'bullish';
  if (score < 42) return 'bearish';
  return 'neutral';
}

const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  '顶部过热': '市场情绪极度乐观，价格远超成本线，供给端产能全面释放，需警惕政策调控和需求拐点',
  '上行加速': '需求持续超预期增长，供给端短期无法匹配，价格快速上行，库存持续去化',
  '上行启动': '需求端出现边际改善信号，供给端产能利用率逐步提升，价格开始温和上行',
  '下行启动': '供给端产能释放加速，需求增速放缓，库存开始累积，价格从高位回落',
  '下行加速': '供过于求格局确立，库存快速累积，价格持续下行，企业盈利承压',
  '底部筑底': '价格跌破部分企业成本线，产能出清加速，需求端出现企稳信号，等待反转契机',
};

const PHASE_SUMMARIES: Record<CyclePhase, string> = {
  '顶部过热': '当前行业处于周期顶部过热阶段，市场风险积聚，建议谨慎操作，关注政策调控和需求拐点信号。',
  '上行加速': '当前行业处于上行加速阶段，需求端强劲驱动，价格仍有上行空间，但需关注供给端响应速度。',
  '上行启动': '当前行业处于上行启动阶段，需求端边际改善明显，供给端尚未完全跟进，可适度看多。',
  '下行启动': '当前行业处于下行初期，供需格局边际转弱，建议降低敞口，关注成本支撑位。',
  '下行加速': '当前行业处于下行加速阶段，供过于求格局明显，价格仍有下行压力，建议观望为主。',
  '底部筑底': '当前行业处于底部筑底阶段，产能出清信号增多，需求端有企稳迹象，可关注反转机会。',
};

export function generateCycleAnalysis(events: HistoricalEvent[]): CycleAnalysis {
  // 四维评分（模拟当前市场状态）
  const demandScore = 70;
  const supplyScore = 45;
  const inventoryScore = 38;
  const macroScore = 60;

  const dimensions: DimensionScore[] = [
    {
      label: '需求',
      score: demandScore,
      direction: scoreToDirection(demandScore),
      detail: 'EV销量维持高增速，储能需求持续放量，但下游去库存抑制短期采购意愿',
    },
    {
      label: '供给',
      score: supplyScore,
      direction: scoreToDirection(supplyScore),
      detail: '澳矿停产信号增多，国内盐湖产能平稳，整体供给端出现边际收缩',
    },
    {
      label: '库存',
      score: inventoryScore,
      direction: scoreToDirection(inventoryScore),
      detail: '产业链库存持续去化，但绝对水平仍高于健康线，去库速度放缓',
    },
    {
      label: '宏观',
      score: macroScore,
      direction: scoreToDirection(macroScore),
      detail: '国内政策偏宽松，新能源政策持续加码，海外利率环境边际改善',
    },
  ];

  // 综合评分（加权平均）
  const overallScore = Math.round(
    demandScore * 0.3 + supplyScore * 0.25 + inventoryScore * 0.25 + macroScore * 0.2
  );

  const overallDirection = scoreToDirection(overallScore);
  const currentPhase = scoreToPhase(overallScore);
  const phaseDescription = PHASE_DESCRIPTIONS[currentPhase];

  // 历史相似事件：基于当前周期特征匹配
  const similarEvents: SimilarEvent[] = [
    {
      eventId: 'ev-05',
      similarity: 82,
      reason: '当前处于底部区间，政策端持续加码刺激需求，与2020年补贴延续时期供需格局相似',
    },
    {
      eventId: 'ev-03',
      similarity: 78,
      reason: '政策鼓励新能源产业发展的背景相似，锂电池产业链获得长期政策支撑',
    },
    {
      eventId: 'ev-27',
      similarity: 75,
      reason: '供给端出清信号明确，澳矿减停产格局与当前产能收缩特征一致',
    },
  ];

  // AI 研判摘要
  const summary = PHASE_SUMMARIES[currentPhase];

  // 详细推理
  const reasoning = `【需求端】EV销量增速保持在30%以上，储能装机增速超过40%，需求端保持强劲增长。但短期受产业链去库存影响，实际采购需求有所抑制。综合评分${demandScore}/100。\n\n【供给端】澳洲多家锂矿企业停产或延缓扩产，国内锂盐产能增速放缓，供给端出现边际收缩信号。但前期累积的过剩产能仍需时间消化。综合评分${supplyScore}/100。\n\n【库存端】产业链库存处于去化通道，电池厂和正极材料厂库存天数持续下降，但绝对水平仍高于历史中枢。去库速度放缓，需关注下游补库节奏。综合评分${inventoryScore}/100。\n\n【宏观端】国内新能源政策持续加码，新型储能专项行动计划推动长期需求增长。海外利率环境边际改善，有利于风险资产估值修复。综合评分${macroScore}/100。\n\n【综合研判】四维加权综合评分${overallScore}/100，当前处于「${currentPhase}」阶段。${phaseDescription}。历史相似情景中，2020年4月补贴政策延续时期的市场格局与当前最为接近（相似度82%），随后价格在6个月内触底反弹超过60%。当前市场具备筑底条件，但反转时点仍需等待需求端实质性改善信号。`;

  return {
    dimensions,
    overallScore,
    overallDirection,
    currentPhase,
    phaseDescription,
    similarEvents,
    summary,
    reasoning,
  };
}
