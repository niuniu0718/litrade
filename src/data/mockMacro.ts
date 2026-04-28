import dayjs from 'dayjs';
import type {
  MacroRadarData,
  MacroIndicator,
  MacroPriceCorrelation,
  MacroCalendarEvent,
  MarketReport,
  CapitalFlow,
  QualitativeIndicator,
  MarketSentiment,
  BreakingNews,
} from '../types/macro';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMacroRadar(): MacroRadarData[] {
  return [
    { dimension: '利率环境', score: Math.round(randomBetween(30, 70)), label: '中性偏紧' },
    { dimension: '汇率趋势', score: Math.round(randomBetween(35, 65)), label: '美元偏强' },
    { dimension: '流动性', score: Math.round(randomBetween(40, 75)), label: '适度宽松' },
    { dimension: '经济周期', score: Math.round(randomBetween(30, 60)), label: '温和复苏' },
  ];
}

export function generateMacroIndicators(): MacroIndicator[] {
  return [
    {
      key: 'fedRate',
      name: '联邦基金利率',
      value: 5.25,
      unit: '%',
      change: 0,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(4.75, 5.5) * 100) / 100),
      impact: 'negative',
    },
    {
      key: 'dollarIndex',
      name: '美元指数',
      value: Math.round(randomBetween(100, 108) * 10) / 10,
      unit: '',
      change: Math.round(randomBetween(-2, 3) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(98, 110) * 10) / 10),
      impact: 'negative',
    },
    {
      key: 'chinaPMI',
      name: '中国制造业PMI',
      value: Math.round(randomBetween(48.5, 52) * 10) / 10,
      unit: '',
      change: Math.round(randomBetween(-1.5, 1.5) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(48, 52.5) * 10) / 10),
      impact: 'positive',
    },
    {
      key: 'm2Growth',
      name: '中国M2增速',
      value: Math.round(randomBetween(8, 12) * 10) / 10,
      unit: '%',
      change: Math.round(randomBetween(-0.5, 0.8) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(8, 12.5) * 10) / 10),
      impact: 'positive',
    },
    {
      key: 'cpi',
      name: '美国CPI同比',
      value: Math.round(randomBetween(2.8, 4.0) * 10) / 10,
      unit: '%',
      change: Math.round(randomBetween(-0.5, 0.3) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(2.5, 4.5) * 10) / 10),
      impact: 'negative',
    },
    {
      key: 'chinaGDP',
      name: '中国GDP增速',
      value: Math.round(randomBetween(4.5, 5.5) * 10) / 10,
      unit: '%',
      change: Math.round(randomBetween(-0.3, 0.5) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(4, 6) * 10) / 10),
      impact: 'positive',
    },
  ];
}

export function generateMacroPriceCorrelation(): MacroPriceCorrelation[] {
  const data: MacroPriceCorrelation[] = [];
  let liPrice = 174000;
  let macroBase = 103;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    liPrice = Math.round(liPrice + randomBetween(-5000, 4000));
    macroBase = Math.round((macroBase + randomBetween(-2, 2)) * 10) / 10;

    data.push({
      month: label,
      liPrice,
      macroValue: macroBase,
    });
  }

  return data;
}

export function generateMacroCalendar(): MacroCalendarEvent[] {
  const events: Omit<MacroCalendarEvent, 'id'>[] = [
    { date: '2025-02-01', event: '美国非农就业数据', importance: 'high', previousValue: '21.6万', forecast: '18万', impact: '就业强则加息预期升，利空金属' },
    { date: '2025-02-05', event: '中国财新制造业PMI', importance: 'high', previousValue: '50.8', forecast: '50.5', impact: 'PMI超预期利多锂价' },
    { date: '2025-02-10', event: '中国CPI/PPI', importance: 'medium', previousValue: '-0.3%', forecast: '-0.2%', impact: '通缩压力缓解利好大宗' },
    { date: '2025-02-14', event: '美国CPI数据', importance: 'high', previousValue: '3.4%', forecast: '3.2%', impact: 'CPI回落利好金属价格' },
    { date: '2025-02-20', event: 'FOMC会议纪要', importance: 'high', previousValue: '-', forecast: '-', impact: '关注降息信号' },
    { date: '2025-02-28', event: '中国官方PMI', importance: 'high', previousValue: '49.0', forecast: '49.5', impact: '制造业景气度直接影响需求预期' },
    { date: '2025-03-05', event: '中国两会/政府工作报告', importance: 'high', previousValue: '-', forecast: '-', impact: 'GDP目标和财政政策影响全局' },
    { date: '2025-03-10', event: '美国非农就业数据', importance: 'high', previousValue: '22.3万', forecast: '20万', impact: '就业数据影响美联储决策' },
  ];

  return events.map((e, i) => ({ ...e, id: `macro-event-${i}` }));
}

// ─── 以下函数原属 mockIntelligence.ts ───

export function generateMarketReports(): MarketReport[] {
  const reports: Omit<MarketReport, 'id'>[] = [
    { title: '2025年锂市场中期展望：供需拐点何时到来？', source: '中信证券', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), summary: '预计2025年H2锂价有望企稳反弹，供需平衡将在Q4改善，建议关注低成本矿企', importance: 'high', category: '市场研究' },
    { title: '全球锂资源供给专题：非洲锂矿开发进度追踪', source: '华泰证券', date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'), summary: '非洲锂矿项目进展低于预期，实际投产时间可能推迟1-2年，对供给端形成支撑', importance: 'medium', category: '供给分析' },
    { title: '储能行业深度：锂电储能经济性拐点已至', source: '中金公司', date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), summary: '碳酸锂价格下行推动储能度电成本下降至0.15元/kWh，储能需求有望加速释放', importance: 'high', category: '需求分析' },
    { title: '锂电回收产业报告：2030年回收锂占比将达15%', source: '高工锂电', date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'), summary: '电池回收技术进步和规模效应推动成本下降，回收锂将成为重要供给补充', importance: 'medium', category: '回收市场' },
    { title: '南美盐湖提锂技术进展：DLE技术商业化加速', source: 'Benchmark Mineral', date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'), summary: '直接提锂技术(DLE)在多个盐湖项目中完成中试，预计2026年实现商业化', importance: 'high', category: '技术前沿' },
    { title: '固态电池产业化进度更新', source: '东吴证券', date: dayjs().subtract(6, 'day').format('YYYY-MM-DD'), summary: '半固态电池已在高端车型装车，全固态电池量产仍需3-5年，锂需求结构将发生变化', importance: 'medium', category: '技术前沿' },
    { title: '中国锂盐月度进出口数据分析', source: '海关总署', date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'), summary: '6月碳酸锂进口量环比增长15%，主要来源国为智利和阿根廷', importance: 'low', category: '进出口' },
    { title: '锂矿企业Q2业绩前瞻', source: '国泰君安', date: dayjs().subtract(8, 'day').format('YYYY-MM-DD'), summary: '锂价低迷环境下，预计大多数矿企Q2利润环比下降，低成本企业优势凸显', importance: 'medium', category: '企业研究' },
  ];

  return reports.map((r, i) => ({ ...r, id: `report-${i}` }));
}

export function generateCapitalFlows(): CapitalFlow[] {
  return [
    {
      sector: '锂矿开采',
      netInflow: -2.5,
      change: -15.3,
      topStocks: [
        { name: '天齐锂业', code: '002466', change: -3.2 },
        { name: '赣锋锂业', code: '002460', change: -2.8 },
        { name: '融捷股份', code: '002192', change: -4.1 },
      ],
    },
    {
      sector: '锂盐加工',
      netInflow: -1.2,
      change: -8.5,
      topStocks: [
        { name: '盛新锂能', code: '002240', change: -2.1 },
        { name: '雅化集团', code: '002497', change: -1.5 },
      ],
    },
    {
      sector: '正极材料',
      netInflow: 1.8,
      change: 5.2,
      topStocks: [
        { name: '容百科技', code: '688005', change: 3.5 },
        { name: '德方纳米', code: '300769', change: 2.1 },
      ],
    },
    {
      sector: '动力电池',
      netInflow: 8.5,
      change: 12.3,
      topStocks: [
        { name: '宁德时代', code: '300750', change: 2.5 },
        { name: '比亚迪', code: '002594', change: 3.1 },
        { name: '亿纬锂能', code: '300014', change: 4.2 },
      ],
    },
    {
      sector: '储能',
      netInflow: 5.2,
      change: 18.6,
      topStocks: [
        { name: '阳光电源', code: '300274', change: 5.8 },
        { name: '派能科技', code: '688063', change: 3.2 },
      ],
    },
  ];
}

export function generateQualitativeIndicators(): QualitativeIndicator[] {
  return [
    { name: '美联储利率政策', category: 'currency', value: '5.25-5.50%', trend: 'neutral', impact: 'high', description: '美联储维持利率不变，年内降息预期减弱' },
    { name: '人民币汇率', category: 'currency', value: '7.25', trend: 'negative', impact: 'medium', description: '人民币对美元贬值，影响进口锂矿成本' },
    { name: '中美贸易关系', category: 'trade', value: '紧张', trend: 'negative', impact: 'high', description: '贸易摩擦升级，锂产品关税政策不确定性增加' },
    { name: '欧盟电池法规', category: 'politics', value: '实施中', trend: 'neutral', impact: 'medium', description: '欧盟新电池法规要求碳足迹披露，影响出口' },
    { name: '智利国有化政策', category: 'geopolitics', value: '推进中', trend: 'negative', impact: 'high', description: '智利推动锂资源国有化，可能影响长期供给' },
    { name: '印尼出口政策', category: 'trade', value: '宽松', trend: 'positive', impact: 'medium', description: '印尼镍矿出口正常，对锂的间接影响有限' },
    { name: '中国新能源汽车政策', category: 'politics', value: '支持', trend: 'positive', impact: 'high', description: '购置税减免延续，下乡补贴力度加大' },
    { name: '全球ESG政策', category: 'politics', value: '趋严', trend: 'neutral', impact: 'medium', description: '环保要求趋严，推高合规成本但利好龙头' },
  ];
}

export function generateMarketSentiment(): MarketSentiment {
  return {
    heatIndex: 42,
    bullBearRatio: 0.85,
    hotWords: ['碳酸锂', '减产', '库存', '储能', '固态电池', '盐湖提锂', '动力电池', '回收', '期货贴水', '新能源车'],
    newsCount24h: 156,
    sentimentScore: -15,
  };
}

export function generateBreakingNews(): BreakingNews[] {
  const now = dayjs();
  const news: Omit<BreakingNews, 'id'>[] = [
    {
      title: '红海航运中断加剧，锂盐运输成本攀升',
      source: '路透社',
      time: now.subtract(2, 'hour').toISOString(),
      summary: '胡塞武装持续袭击红海商船，导致亚欧航线运费上涨40%以上。锂盐从亚洲出口至欧洲的运输周期延长2-3周，短期推升欧洲锂盐现货溢价。',
      impact: 'high',
      direction: 'bullish',
      tags: ['地缘政治', '航运', '成本'],
      region: '中东',
    },
    {
      title: '津巴布韦宣布锂精矿出口禁令，即刻生效',
      source: '彭博社',
      time: now.subtract(5, 'hour').toISOString(),
      summary: '津巴布韦政府宣布即日起禁止未加工锂精矿出口，要求矿企在当地建设加工厂。该国锂矿产量占全球供应约3%，短期内将收紧锂精矿供给。',
      impact: 'high',
      direction: 'bullish',
      tags: ['非洲', '出口禁令', '锂精矿'],
      region: '非洲',
    },
    {
      title: '智利国有化锂资源战略持续推进，新法案提交国会',
      source: 'Financial Times',
      time: now.subtract(8, 'hour').toISOString(),
      summary: '智利政府向国会提交锂资源国家战略法案，要求未来所有新锂矿项目必须由国家控股51%以上。现有项目将在许可证到期后重新谈判。市场担忧全球最大锂生产国供给收紧。',
      impact: 'high',
      direction: 'bullish',
      tags: ['南美', '国有化', '锂资源'],
      region: '南美',
    },
    {
      title: '印尼调整镍锂出口关税，锂产品关税上调5%',
      source: '亚洲金属网',
      time: now.subtract(12, 'hour').toISOString(),
      summary: '印尼财政部宣布上调锂相关产品出口关税5个百分点，涉及氢氧化锂、碳酸锂等深加工产品。印尼作为全球镍资源大国，其政策调整将间接影响锂电池供应链成本。',
      impact: 'medium',
      direction: 'bearish',
      tags: ['东南亚', '关税', '出口政策'],
      region: '东南亚',
    },
    {
      title: '中国新能源下乡补贴加码，储能配储要求提至20%',
      source: '中国证券报',
      time: now.subtract(16, 'hour').toISOString(),
      summary: '国务院常务会议决定加大新能源汽车下乡补贴力度，同时将新能源电站储能配储比例要求从15%提升至20%。预计拉动储能装机需求约25GWh/年，利好锂电需求。',
      impact: 'high',
      direction: 'bullish',
      tags: ['中国政策', '储能', '补贴'],
      region: '中国',
    },
    {
      title: 'Core Lithium暂停澳洲Finniss锂矿项目运营',
      source: '澳大利亚矿业评论',
      time: now.subtract(20, 'hour').toISOString(),
      summary: '澳洲矿企Core Lithium宣布暂停Finniss锂矿项目开采作业，因锂精矿价格持续低于运营成本。这是继Pilbara减产后又一澳洲矿企削减产量，全球供给端进一步收缩。',
      impact: 'medium',
      direction: 'bullish',
      tags: ['澳洲', '减产', '锂矿'],
      region: '澳洲',
    },
    {
      title: '欧洲电池法案正式实施，碳足迹披露要求收紧',
      source: 'Euractiv',
      time: now.subtract(28, 'hour').toISOString(),
      summary: '欧盟新电池法规正式进入碳足迹披露强制阶段，要求所有在欧销售的动力电池提供全生命周期碳足迹数据。中国电池企业面临额外合规成本，短期内影响出口利润率。',
      impact: 'medium',
      direction: 'bearish',
      tags: ['欧洲', '碳足迹', '合规'],
      region: '欧洲',
    },
    {
      title: '中欧电动车反补贴调查结果出炉，加征关税幅度低于预期',
      source: '新华社',
      time: now.subtract(36, 'hour').toISOString(),
      summary: '欧盟对中国电动车反补贴调查最终裁定加征关税，幅度在10%-20%之间，低于此前市场预期的25%-35%。中国电动车出口影响有限，锂电需求维持稳健增长预期。',
      impact: 'low',
      direction: 'neutral',
      tags: ['贸易摩擦', '电动车', '关税'],
      region: '全球',
    },
    {
      title: '阿根廷锂三角地区遭遇严重干旱，盐湖提锂产能受影响',
      source: 'SMM上海有色网',
      time: now.subtract(44, 'hour').toISOString(),
      summary: '阿根廷北部锂三角地区连续三个月降水量不足历史均值30%，多家盐湖提锂企业反映卤水浓度下降，产能利用率降至70%左右。预计影响锂盐产量约5000吨LCE/月。',
      impact: 'medium',
      direction: 'bullish',
      tags: ['南美', '盐湖', '气候'],
      region: '南美',
    },
    {
      title: '宁德时代发布神行超充电池，锂消耗量提升15%',
      source: '高工锂电',
      time: now.subtract(52, 'hour').toISOString(),
      summary: '宁德时代发布新一代神行超充电池，采用磷酸铁锂高锰路线，单位容量锂消耗较传统LFP电池提升约15%。若大规模量产将增加锂需求约2万吨LCE/年。',
      impact: 'medium',
      direction: 'bullish',
      tags: ['电池技术', '宁德时代', '需求'],
      region: '中国',
    },
    {
      title: '全球锂矿并购活跃，多家企业争夺非洲锂资源',
      source: '矿业周刊',
      time: now.subtract(60, 'hour').toISOString(),
      summary: '天齐锂业、赣锋锂业等多家中国锂企加速布局非洲锂矿资源，近期在马里、加纳等地签署多项收购协议。非洲锂矿开发进入加速期，但政治风险和基础设施瓶颈仍是主要挑战。',
      impact: 'low',
      direction: 'neutral',
      tags: ['非洲', '并购', '产能'],
      region: '非洲',
    },
    {
      title: '日本固态电池突破性进展，商业化时间表提前至2027年',
      source: '日经亚洲',
      time: now.subtract(68, 'hour').toISOString(),
      summary: '丰田与松下联合宣布固态电池原型通过耐久性测试，能量密度达500Wh/kg，计划2027年量产。固态电池对锂的需求结构将发生变化，但短期内对传统锂电市场影响有限。',
      impact: 'low',
      direction: 'neutral',
      tags: ['技术突破', '固态电池', '日本'],
      region: '全球',
    },
  ];

  return news.map((n, i) => ({ ...n, id: `news-${i}` }));
}
