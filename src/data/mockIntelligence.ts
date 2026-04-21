import dayjs from 'dayjs';
import type { MarketReport, CapitalFlow, MacroIndicator, MarketSentiment } from '../types/intelligence';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

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

export function generateMacroIndicators(): MacroIndicator[] {
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
