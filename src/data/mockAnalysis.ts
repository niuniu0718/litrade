import dayjs from 'dayjs';
import type { FrameworkIndicators, SignalDirection } from '../types/dashboard';
import type {
  DailyAnalysis,
  AnalysisStep,
  AnalysisScenario,
  StrategyRecommendation,
  ReviewRecord,
  ScoreTrendPoint,
  AnalysisHistory,
} from '../types/analysis';

// ── 日期种子随机数生成器 ──
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateToSeed(date: string): number {
  const d = dayjs(date);
  return d.year() * 10000 + (d.month() + 1) * 100 + d.date();
}

function seededBetween(rng: () => number, min: number, max: number): number {
  return Math.round((rng() * (max - min) + min) * 100) / 100;
}

function seededInt(rng: () => number, min: number, max: number): number {
  return Math.round(rng() * (max - min) + min);
}

function pickDirection(rng: () => number, bullishProb: number, bearishProb: number): SignalDirection {
  const r = rng();
  if (r < bullishProb) return 'bullish';
  if (r < bullishProb + bearishProb) return 'bearish';
  return 'neutral';
}

const directionLabel: Record<SignalDirection, string> = {
  bullish: '偏多',
  bearish: '偏空',
  neutral: '中性',
};

const stepTitles = [
  { title: '拆下游', icon: '1️⃣' },
  { title: '看供给', icon: '2️⃣' },
  { title: '看库存', icon: '3️⃣' },
  { title: '加宏观', icon: '4️⃣' },
];

/** 生成某天的框架指标（基于日期种子） */
function generateSeededIndicators(rng: () => number): FrameworkIndicators {
  const demandGrowth = seededInt(rng, 12, 32);
  const evSalesGrowth = seededInt(rng, 20, 38);
  const storageGrowth = seededInt(rng, 30, 55);
  const demandForecast = seededBetween(rng, 100, 120);
  const demandActual = seededBetween(rng, 100, 120);
  const demandGap = seededBetween(rng, -3, 5);
  const capacityUtilization = seededInt(rng, 72, 92);
  const supplyDemandGap = seededBetween(rng, -8, 12);
  const costCurvePosition = seededInt(rng, 55, 85);
  const inventoryDays = seededInt(rng, 18, 42);
  const inventoryMomChange = seededBetween(rng, -8, 6);
  const macroScore = seededInt(rng, 35, 70);
  const dollarIndex = seededBetween(rng, 100, 108);
  const chinaPMI = seededBetween(rng, 48.5, 52);

  return {
    demandGrowth,
    evSalesGrowth,
    storageGrowth,
    demandForecast,
    demandActual,
    demandGap,
    capacityUtilization,
    supplyDemandGap,
    costCurvePosition,
    inventoryDays,
    inventoryMomChange,
    inventoryCyclePhase: inventoryMomChange < -2 ? '被动去库存'
      : inventoryMomChange < 0 ? '主动去库存'
      : inventoryMomChange < 3 ? '被动补库存'
      : '主动补库存',
    macroScore,
    dollarIndex,
    chinaPMI,
  };
}

/** 计算综合评分（四维框架） */
function computeScore(indicators: FrameworkIndicators): { score: number; overall: SignalDirection } {
  const signals: { direction: SignalDirection; strength: number }[] = [];

  // Step1: 需求（合并拆下游 + 建需求公式）
  const demandScore = (indicators.demandGrowth - 15) * 2 + (indicators.demandGap < 0 ? -indicators.demandGap * 3 : -indicators.demandGap * 2);
  const d1: SignalDirection = demandScore > 8 ? 'bullish' : demandScore < -5 ? 'bearish' : 'neutral';
  signals.push({ direction: d1, strength: Math.min(Math.abs(demandScore) * 5, 90) });

  // Step2: 供给
  const d2 = indicators.supplyDemandGap < -3 ? 'bullish' : indicators.supplyDemandGap > 5 ? 'bearish' : 'neutral';
  signals.push({ direction: d2, strength: Math.min(Math.abs(indicators.supplyDemandGap) * 8, 90) });

  // Step3: 库存
  const d3 = indicators.inventoryMomChange < -3 ? 'bullish' : indicators.inventoryMomChange > 3 ? 'bearish' : 'neutral';
  signals.push({ direction: d3, strength: Math.min(Math.abs(indicators.inventoryMomChange) * 10, 85) });

  // Step4: 宏观
  const d4 = indicators.macroScore > 55 ? 'bullish' : indicators.macroScore < 45 ? 'bearish' : 'neutral';
  signals.push({ direction: d4, strength: Math.min(Math.abs(indicators.macroScore - 50) * 2, 80) });

  const weights = [0.35, 0.25, 0.22, 0.18];
  let score = 50;
  signals.forEach((s, i) => {
    const delta = s.direction === 'bullish' ? s.strength * 0.3 : s.direction === 'bearish' ? -s.strength * 0.3 : 0;
    score += delta * weights[i];
  });
  score = Math.round(Math.max(10, Math.min(90, score)));
  const overall: SignalDirection = score > 58 ? 'bullish' : score < 42 ? 'bearish' : 'neutral';

  return { score, overall };
}

/** 基于前一天评分做随机游走 */
function walkScore(prevScore: number, rng: () => number): number {
  const delta = seededBetween(rng, -6, 6);
  return Math.round(Math.max(15, Math.min(85, prevScore + delta)));
}

/** 生成推理步骤（四步） */
function buildReasoningSteps(indicators: FrameworkIndicators): AnalysisStep[] {
  const steps: AnalysisStep[] = [];

  // Step 1: 拆下游（合并需求增速 + 需求公式偏差）
  const demandScore = (indicators.demandGrowth - 15) * 2 + (indicators.demandGap < 0 ? -indicators.demandGap * 3 : -indicators.demandGap * 2);
  const d1: SignalDirection = demandScore > 8 ? 'bullish' : demandScore < -5 ? 'bearish' : 'neutral';
  steps.push({
    stepNumber: 1,
    title: '拆下游',
    icon: '1️⃣',
    conclusion: `需求增速${indicators.demandGrowth}%，实际${indicators.demandGap < 0 ? '超' : '低于'}预期${Math.abs(indicators.demandGap)}%`,
    reasoning: `锂需求同比增速${indicators.demandGrowth}%，EV增速${indicators.evSalesGrowth}%，储能增速${indicators.storageGrowth}%。需求预测偏差${indicators.demandGap}%，${indicators.demandGap < 0 ? '下游需求好于预期。' : indicators.demandGap > 2 ? '需求不及预期。' : '需求基本符合预期。'}`,
    direction: d1,
    confidence: Math.min(Math.abs(demandScore) * 4 + 40, 92),
  });

  // Step 2: 看供给
  const d2: SignalDirection = indicators.supplyDemandGap < -3 ? 'bullish' : indicators.supplyDemandGap > 5 ? 'bearish' : 'neutral';
  steps.push({
    stepNumber: 2,
    title: '看供给',
    icon: '2️⃣',
    conclusion: `供需缺口${indicators.supplyDemandGap > 0 ? '收窄' : '扩大'}至${indicators.supplyDemandGap > 0 ? '+' : ''}${indicators.supplyDemandGap}万吨`,
    reasoning: `产能利用率${indicators.capacityUtilization}%，供需缺口${indicators.supplyDemandGap}万吨。${indicators.supplyDemandGap < 0 ? '供给偏紧格局延续，高成本产能出清。' : indicators.supplyDemandGap > 5 ? '供给过剩压力较大，产能持续释放。' : '供需基本平衡。'}`,
    direction: d2,
    confidence: Math.min(55 + Math.abs(indicators.supplyDemandGap) * 4, 90),
  });

  // Step 3: 看库存
  const d3: SignalDirection = indicators.inventoryMomChange < -3 ? 'bullish' : indicators.inventoryMomChange > 3 ? 'bearish' : 'neutral';
  steps.push({
    stepNumber: 3,
    title: '看库存',
    icon: '3️⃣',
    conclusion: `${indicators.inventoryMomChange < 0 ? '去库存延续' : '库存小幅累积'}，环比${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%`,
    reasoning: `库存${indicators.inventoryDays}天，环比${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%，处于${indicators.inventoryCyclePhase}阶段。${indicators.inventoryMomChange < -2 ? '去库存趋势明确，价格底部支撑增强。' : indicators.inventoryMomChange > 3 ? '库存累积加速，下游采购偏谨慎。' : '库存水平健康。'}`,
    direction: d3,
    confidence: Math.min(50 + Math.abs(indicators.inventoryMomChange) * 5, 88),
  });

  // Step 4: 加宏观
  const d4: SignalDirection = indicators.macroScore > 55 ? 'bullish' : indicators.macroScore < 45 ? 'bearish' : 'neutral';
  steps.push({
    stepNumber: 4,
    title: '加宏观',
    icon: '4️⃣',
    conclusion: `PMI ${indicators.chinaPMI}，宏观${indicators.macroScore > 55 ? '中性偏暖' : indicators.macroScore < 45 ? '偏冷' : '中性'}`,
    reasoning: `宏观综合评分${indicators.macroScore}，美元指数${indicators.dollarIndex}，中国PMI ${indicators.chinaPMI}。${indicators.macroScore > 55 ? '宏观环境偏暖，流动性支撑大宗商品。' : indicators.macroScore < 45 ? '宏观环境偏冷，风险偏好下降。' : '宏观因素对价格影响中性。'}`,
    direction: d4,
    confidence: Math.min(50 + Math.abs(indicators.macroScore - 50) * 1.5, 82),
  });

  return steps;
}

/** 生成价格情景 */
function buildScenarios(basePrice: number, rng: () => number): AnalysisScenario[] {
  const optimisticPct = seededBetween(rng, 1.5, 4);
  const basePct = seededBetween(rng, -0.5, 1.5);
  const pessimisticPct = seededBetween(rng, -4, -1);
  return [
    {
      label: '乐观',
      probability: seededInt(rng, 15, 30),
      priceRange: [
        Math.round(basePrice * (1 + optimisticPct / 100 - 0.005)),
        Math.round(basePrice * (1 + optimisticPct / 100 + 0.005)),
      ],
      description: `需求端超预期增长，供给端出现意外中断，推动价格上行${optimisticPct.toFixed(1)}%`,
    },
    {
      label: '基准',
      probability: seededInt(rng, 45, 65),
      priceRange: [
        Math.round(basePrice * (1 + basePct / 100 - 0.008)),
        Math.round(basePrice * (1 + basePct / 100 + 0.008)),
      ],
      description: `供需基本平衡，价格在当前水平窄幅波动，变动${basePct.toFixed(1)}%`,
    },
    {
      label: '悲观',
      probability: seededInt(rng, 15, 30),
      priceRange: [
        Math.round(basePrice * (1 + pessimisticPct / 100 - 0.005)),
        Math.round(basePrice * (1 + pessimisticPct / 100 + 0.005)),
      ],
      description: `需求不及预期，库存持续累积，价格下行${Math.abs(pessimisticPct).toFixed(1)}%`,
    },
  ];
}

/** 生成策略建议 */
function buildStrategies(overall: SignalDirection, rng: () => number): StrategyRecommendation[] {
  const hedgeActions: Record<SignalDirection, string> = {
    bullish: '暂缓套保',
    bearish: '增加空头套保比例',
    neutral: '维持现有套保比例',
  };
  const procurementActions: Record<SignalDirection, string> = {
    bullish: '适度提前采购',
    bearish: '延迟采购，按需补库',
    neutral: '按计划采购',
  };
  const speculationActions: Record<SignalDirection, string> = {
    bullish: '可考虑轻仓试多',
    bearish: '可考虑轻仓试空',
    neutral: '观望为主',
  };
  const hedgeDetails: Record<SignalDirection, string> = {
    bullish: '价格上涨概率较大，建议降低套保比例至20-30%，保留价格上行空间',
    bearish: '价格下行风险较高，建议提高套保比例至50-60%，锁定利润',
    neutral: '价格方向不明，维持30-40%套保比例，等待信号明朗',
  };
  const procurementDetails: Record<SignalDirection, string> = {
    bullish: '建议在当前价位附近提前锁定1-2周用量，分批建仓',
    bearish: '建议延迟采购，按需少量补库，等待价格企稳',
    neutral: '按正常计划采购，关注库存水位变化',
  };
  const speculationDetails: Record<SignalDirection, string> = {
    bullish: '可在支撑位附近轻仓建立多头头寸，止损设在关键支撑下方2%',
    bearish: '可在阻力位附近轻仓建立空头头寸，止损设在关键阻力上方2%',
    neutral: '当前方向不明，建议观望为主，等待突破信号',
  };

  return [
    { type: 'hedge', action: hedgeActions[overall], detail: hedgeDetails[overall] },
    { type: 'procurement', action: procurementActions[overall], detail: procurementDetails[overall] },
    { type: 'speculation', action: speculationActions[overall], detail: speculationDetails[overall] },
  ];
}

/** 生成关键驱动和风险 */
function buildKeyFactors(indicators: FrameworkIndicators, rng: () => number): { keyDriver: string; keyRisk: string } {
  const drivers = [
    `EV需求持续高增长（+${indicators.evSalesGrowth}%），锂消费量预期上修`,
    `产能利用率维持${indicators.capacityUtilization}%高位，供给弹性有限`,
    `储能装机增速${indicators.storageGrowth}%超预期，成为第二增长极`,
    `库存去化至${indicators.inventoryDays}天，接近历史低位`,
    `下游补库需求启动，现货市场成交活跃`,
  ];
  const risks = [
    '南美盐湖产能释放加速，供给端压力增大',
    `美元指数${indicators.dollarIndex}走强，大宗商品承压`,
    '国内新能源汽车补贴退坡，终端需求可能放缓',
    `PMI ${indicators.chinaPMI} ${indicators.chinaPMI < 50 ? '处于荣枯线下方' : ''}，宏观环境不确定`,
    '澳洲锂矿扩产项目进展超预期，长期供给宽松',
  ];
  return {
    keyDriver: drivers[seededInt(rng, 0, drivers.length - 1)],
    keyRisk: risks[seededInt(rng, 0, risks.length - 1)],
  };
}

/** 生成供需逻辑描述 */
function buildSupplyDemandLogic(indicators: FrameworkIndicators): string {
  const demandPart = `需求端增速${indicators.demandGrowth}%，EV端贡献${indicators.evSalesGrowth}%，储能端贡献${indicators.storageGrowth}%`;
  const supplyPart = `供给端产能利用率${indicators.capacityUtilization}%，供需缺口${indicators.supplyDemandGap > 0 ? '+' : ''}${indicators.supplyDemandGap}万吨`;
  const inventoryPart = `库存${indicators.inventoryDays}天，环比${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%，处于${indicators.inventoryCyclePhase}阶段`;
  return `${demandPart}。${supplyPart}。${inventoryPart}。`;
}

/** 生成完整报告文本 */
function buildFullReport(
  date: string,
  score: number,
  overall: SignalDirection,
  indicators: FrameworkIndicators,
  predictedRange: [number, number],
  confidence: number,
  keyDriver: string,
  keyRisk: string,
  strategies: StrategyRecommendation[],
  supplyDemandLogic: string,
): string {
  const directionText = directionLabel[overall];
  return `## 碳酸锂智能研判 - ${date}

### 综合判断
四维框架评分 ${score}/100，方向${directionText}，置信度${confidence}%。
预测明日运行区间 ${predictedRange[0].toLocaleString()}-${predictedRange[1].toLocaleString()} 元/吨。

### 核心逻辑
${supplyDemandLogic}

**需求端**：增速 ${indicators.demandGrowth}%，EV ${indicators.evSalesGrowth}%，储能 ${indicators.storageGrowth}%。
**供给端**：产能利用率 ${indicators.capacityUtilization}%，供需缺口 ${indicators.supplyDemandGap > 0 ? '+' : ''}${indicators.supplyDemandGap}万吨。
**库存端**：环比${indicators.inventoryMomChange > 0 ? '增' : '降'}${Math.abs(indicators.inventoryMomChange)}%，${indicators.inventoryCyclePhase}阶段。
**宏观面**：综合评分 ${indicators.macroScore}，DXY ${indicators.dollarIndex}，PMI ${indicators.chinaPMI}。

### 关键驱动
${keyDriver}

### 风险提示
${keyRisk}

### 策略建议
- 套保：${strategies[0].action} — ${strategies[0].detail}
- 采购：${strategies[1].action} — ${strategies[1].detail}
- 投机：${strategies[2].action} — ${strategies[2].detail}`;
}

// ── 公开 API ──

/** 生成某天的分析报告 */
export function generateDailyAnalysis(
  date: string,
  basePrice: number,
  prevScore?: number,
): DailyAnalysis {
  const seed = dateToSeed(date);
  const rng = seededRandom(seed);
  const indicators = generateSeededIndicators(rng);

  // 如果有前一天评分，使用随机游走；否则从指标计算
  let score: number;
  let overall: SignalDirection;
  if (prevScore !== undefined) {
    score = walkScore(prevScore, rng);
    overall = score > 58 ? 'bullish' : score < 42 ? 'bearish' : 'neutral';
  } else {
    const computed = computeScore(indicators);
    score = computed.score;
    overall = computed.overall;
  }

  const confidence = seededInt(rng, 60, 85);
  const reasoningSteps = buildReasoningSteps(indicators);

  // 价格预测
  const priceDelta = seededBetween(rng, -2, 2);
  const predictedPrice = Math.round(basePrice * (1 + priceDelta / 100));
  const rangeWidth = seededBetween(rng, 800, 2000);
  const predictedRange: [number, number] = [
    Math.round(predictedPrice - rangeWidth / 2),
    Math.round(predictedPrice + rangeWidth / 2),
  ];
  const priceChangePrediction = Math.round((predictedPrice - basePrice) / basePrice * 10000) / 100;

  const scenarios = buildScenarios(basePrice, rng);
  // Normalize scenario probabilities to sum to 100
  const totalP = scenarios.reduce((s, sc) => s + sc.probability, 0);
  scenarios.forEach(sc => { sc.probability = Math.round(sc.probability / totalP * 100); });

  const strategies = buildStrategies(overall, rng);
  const { keyDriver, keyRisk } = buildKeyFactors(indicators, rng);
  const supplyDemandLogic = buildSupplyDemandLogic(indicators);

  const summaryMap: Record<SignalDirection, string> = {
    bullish: '四维信号偏多，需求端支撑较强，建议关注价格上行风险',
    bearish: '四维信号偏空，供给端压力较大，建议警惕价格下行风险',
    neutral: '多空信号交织，供需基本平衡，建议观望等待方向明朗',
  };

  const signals = reasoningSteps.map((step, i) => ({
    step: step.stepNumber,
    source: step.title,
    direction: step.direction,
    strength: step.confidence,
    description: step.conclusion,
  }));

  const fullReport = buildFullReport(
    date, score, overall, indicators, predictedRange, confidence,
    keyDriver, keyRisk, strategies, supplyDemandLogic,
  );

  return {
    id: date,
    date,
    generatedAt: dayjs(date).endOf('day').toISOString(),
    overall,
    score,
    confidence,
    summarySentence: summaryMap[overall],
    predictedPrice,
    predictedRange,
    priceChangePrediction,
    priceScenarios: scenarios,
    reasoningSteps,
    signals,
    supplyDemandLogic,
    keyDriver,
    keyRisk,
    strategies,
    fullReport,
  };
}

/** 生成复盘记录 */
export function generateReviewRecord(
  yesterdayAnalysis: DailyAnalysis,
  todayPrice: number,
): ReviewRecord {
  const predicted = yesterdayAnalysis.predictedPrice;
  const deviation = todayPrice - predicted;
  const deviationPercent = Math.round(deviation / predicted * 10000) / 100;
  const actualChange = yesterdayAnalysis.predictedPrice > 0
    ? Math.round((todayPrice - yesterdayAnalysis.predictedPrice) / yesterdayAnalysis.predictedPrice * 10000) / 100
    : 0;

  const priceHit = todayPrice >= yesterdayAnalysis.predictedRange[0]
    && todayPrice <= yesterdayAnalysis.predictedRange[1];

  const actualDirection: SignalDirection = deviation > 100 ? 'bullish' : deviation < -100 ? 'bearish' : 'neutral';
  const directionHit = actualDirection === yesterdayAnalysis.overall;

  const deviationLevel: 'normal' | 'medium' | 'heavy' =
    Math.abs(deviationPercent) < 1 ? 'normal'
    : Math.abs(deviationPercent) < 2.5 ? 'medium'
    : 'heavy';

  const reasonTemplates: Record<string, string[]> = {
    normal: ['预测模型运行正常，各维度信号基本兑现'],
    medium: ['库存去化速度略快于预期', '下游采购节奏略有变化', '宏观环境出现小幅波动'],
    heavy: ['突发供给端事件（矿难/停产）', '宏观政策超预期调整', '大额期货持仓集中平仓'],
  };
  const reasons = reasonTemplates[deviationLevel];
  const deviationReason = reasons[Math.min(
    Math.abs(Math.round(deviationPercent)) % reasons.length,
    reasons.length - 1,
  )];

  const correctedFactors = deviationLevel !== 'normal'
    ? ['供给端弹性系数', '库存周期阶段判定', '宏观情绪因子'].slice(0, deviationLevel === 'heavy' ? 3 : 2)
    : [];

  return {
    analysisId: yesterdayAnalysis.id,
    date: yesterdayAnalysis.date,
    predictedPrice: predicted,
    predictedDirection: yesterdayAnalysis.overall,
    predictedRange: yesterdayAnalysis.predictedRange,
    actualPrice: todayPrice,
    actualChange,
    priceHit,
    directionHit,
    deviation,
    deviationPercent,
    deviationLevel,
    deviationReason,
    correctedFactors,
  };
}

/** 回填30天历史数据 */
export function generateInitialHistory(basePrice: number): AnalysisHistory {
  const analyses: DailyAnalysis[] = [];
  const reviews: ReviewRecord[] = [];
  const scoreTrend: ScoreTrendPoint[] = [];

  const today = dayjs();
  let prevScore: number | undefined;
  let prevPrice = basePrice;

  for (let i = 29; i >= 0; i--) {
    const date = today.subtract(i, 'day').format('YYYY-MM-DD');
    const analysis = generateDailyAnalysis(date, prevPrice, prevScore);

    // 模拟价格随机游走
    const rng = seededRandom(dateToSeed(date) + 9999);
    const priceChange = prevPrice * seededBetween(rng, -0.015, 0.015) / 100;
    const dayPrice = i === 0 ? basePrice : Math.round(prevPrice + priceChange);

    analyses.push(analysis);
    scoreTrend.push({
      date,
      score: analysis.score,
      actualPrice: dayPrice,
      direction: analysis.overall,
    });

    // 生成复盘（从第二天开始）
    if (i < 29) {
      const review = generateReviewRecord(analyses[analyses.length - 2], dayPrice);
      reviews.push(review);
    }

    prevScore = analysis.score;
    prevPrice = dayPrice;
  }

  return {
    analyses,
    reviews,
    scoreTrend,
    lastGeneratedDate: today.format('YYYY-MM-DD'),
  };
}
