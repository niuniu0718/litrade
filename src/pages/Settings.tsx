import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Upload,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Divider,
  Tag,
  Row,
  Col,
  Radio,
  Alert,
} from 'antd';
import { UploadOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PRODUCT_MAP } from '../data/products';
import type { PricePoint, ProductCode } from '../types';

// 原型阶段使用 localStorage 存储手动录入的数据
const STORAGE_KEY = 'litrade_manual_prices';

const getManualPrices = (): PricePoint[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveManualPrices = (prices: PricePoint[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
};

// ============ SMM 数据导入 ============

const SMM_PRODUCTS: { code: ProductCode; label: string }[] = [
  { code: 'li2co3_battery', label: '电池级碳酸锂' },
  { code: 'lioh', label: '氢氧化锂' },
];

const getSMMStorageKey = (code: string) => `litrade_smm_${code}`;

const getSMMPrices = (code: string): PricePoint[] => {
  try {
    const raw = localStorage.getItem(getSMMStorageKey(code));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveSMMPrices = (code: string, prices: PricePoint[]) => {
  localStorage.setItem(getSMMStorageKey(code), JSON.stringify(prices));
};

interface SMMParsedRow {
  date: string;
  low: number;
  high: number;
  close: number;
  change: number;
}

const parseSMMCSV = (text: string): { rows: SMMParsedRow[]; errors: string[] } => {
  const lines = text.split('\n').filter((l) => l.trim());
  const errors: string[] = [];
  const rows: SMMParsedRow[] = [];

  // 跳过表头
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((s) => s.trim());
    if (parts.length < 4) continue;

    const [dateRaw, lowRaw, highRaw, avgRaw, changeRaw] = parts;
    if (!dateRaw) continue;

    const date = dateRaw.replace(/\//g, '-');
    const low = parseFloat(lowRaw);
    const high = parseFloat(highRaw);
    const close = parseFloat(avgRaw);
    const change = parseFloat(changeRaw ?? '0');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`第 ${i + 1} 行日期格式无效: ${dateRaw}`);
      continue;
    }
    if (isNaN(close)) {
      errors.push(`第 ${i + 1} 行均价无效: ${avgRaw}`);
      continue;
    }

    rows.push({ date, low: isNaN(low) ? close : low, high: isNaN(high) ? close : high, close, change: isNaN(change) ? 0 : change });
  }

  // 按日期降序排列
  rows.sort((a, b) => b.date.localeCompare(a.date));

  return { rows, errors };
};

const Settings: React.FC = () => {
  const [manualPrices, setManualPrices] = useState<PricePoint[]>(getManualPrices());
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // SMM 导入状态
  const [smmProduct, setSmmProduct] = useState<ProductCode>('li2co3_battery');
  const [smmPreview, setSmmPreview] = useState<SMMParsedRow[] | null>(null);
  const [smmParseErrors, setSmmParseErrors] = useState<string[]>([]);
  const [smmImported, setSmmImported] = useState<Record<string, PricePoint[]>>({});
  const [smmFileName, setSmmFileName] = useState<string>('');

  // 加载已导入的 SMM 数据摘要
  useEffect(() => {
    const summary: Record<string, PricePoint[]> = {};
    for (const p of SMM_PRODUCTS) {
      const data = getSMMPrices(p.code);
      if (data.length > 0) summary[p.code] = data;
    }
    setSmmImported(summary);
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const point: PricePoint = {
        date: values.date,
        open: values.open ?? values.close,
        close: values.close,
        high: values.high ?? values.close,
        low: values.low ?? values.close,
      };
      const updated = [point, ...manualPrices];
      saveManualPrices(updated);
      setManualPrices(updated);
      message.success('价格数据已添加');
      setModalOpen(false);
      form.resetFields();
    });
  };

  // SMM CSV 文件上传处理（仅解析预览，不直接导入）
  const handleSMMFileUpload = (file: File) => {
    setSmmPreview(null);
    setSmmParseErrors([]);
    setSmmFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { rows, errors } = parseSMMCSV(text);
        setSmmPreview(rows);
        setSmmParseErrors(errors);
        if (rows.length === 0 && errors.length > 0) {
          message.error('CSV 解析失败，请检查文件格式');
        }
      } catch {
        message.error('CSV 解析失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传
  };

  // 确认导入 SMM 数据
  const handleSMMConfirmImport = () => {
    if (!smmPreview || smmPreview.length === 0) return;
    const pricePoints: PricePoint[] = smmPreview.map((row) => ({
      date: row.date,
      open: row.close, // SMM 无开盘价，用均价填充
      close: row.close,
      high: row.high,
      low: row.low,
    }));
    saveSMMPrices(smmProduct, pricePoints);
    // 更新已导入摘要
    setSmmImported((prev) => ({ ...prev, [smmProduct]: pricePoints }));
    message.success(`成功导入 ${pricePoints.length} 条 ${PRODUCT_MAP[smmProduct]?.name ?? smmProduct} 数据`);
    // 清除预览
    setSmmPreview(null);
    setSmmParseErrors([]);
    setSmmFileName('');
  };

  // 删除已导入的 SMM 数据
  const handleSMMDelete = (code: string) => {
    const name = PRODUCT_MAP[code]?.name ?? code;
    Modal.confirm({
      title: '确认删除',
      content: `将删除已导入的 ${name} SMM 数据，此操作不可恢复。`,
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.removeItem(getSMMStorageKey(code));
        setSmmImported((prev) => {
          const next = { ...prev };
          delete next[code];
          return next;
        });
        message.success('已删除');
      },
    });
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim());
        // CSV 格式: date,open,close,high,low
        const imported: PricePoint[] = lines.slice(1).map((line) => {
          const [date, open, close, high, low] = line.split(',');
          return {
            date: date.trim(),
            open: parseFloat(open),
            close: parseFloat(close),
            high: parseFloat(high),
            low: parseFloat(low),
          };
        }).filter((p) => p.date && !isNaN(p.close));

        const updated = [...imported, ...manualPrices];
        saveManualPrices(updated);
        setManualPrices(updated);
        message.success(`成功导入 ${imported.length} 条数据`);
      } catch {
        message.error('导入失败，请检查 CSV 格式');
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传
  };

  const handleExportCSV = () => {
    const header = 'date,product,open,close,high,low\n';
    const rows = manualPrices.map((p) => `${p.date},,${p.open},${p.close},${p.high},${p.low}`).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prices_manual_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('导出成功');
  };

  const handleDelete = (index: number) => {
    const updated = manualPrices.filter((_, i) => i !== index);
    saveManualPrices(updated);
    setManualPrices(updated);
    message.success('已删除');
  };

  const handleClearAll = () => {
    Modal.confirm({
      title: '确认清空',
      content: '将清空所有手动录入的价格数据，此操作不可恢复。',
      okText: '确认清空',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        saveManualPrices([]);
        setManualPrices([]);
        message.success('已清空');
      },
    });
  };

  const columns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '开盘价', dataIndex: 'open', render: (v: number) => v.toLocaleString() },
    { title: '收盘价', dataIndex: 'close', render: (v: number) => v.toLocaleString() },
    { title: '最高', dataIndex: 'high', render: (v: number) => v.toLocaleString() },
    { title: '最低', dataIndex: 'low', render: (v: number) => v.toLocaleString() },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, __: unknown, index: number) => (
        <Button type="link" danger size="small" onClick={() => handleDelete(index)}>
          删除
        </Button>
      ),
    },
  ];

  const downloadTemplate = () => {
    const content = 'date,open,close,high,low\n2025-01-15,75000,75200,75500,74800\n';
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* SMM 数据导入 */}
      <Card title="SMM 数据导入">
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>选择品种</div>
          <Radio.Group
            value={smmProduct}
            onChange={(e) => {
              setSmmProduct(e.target.value);
              setSmmPreview(null);
              setSmmParseErrors([]);
              setSmmFileName('');
            }}
          >
            {SMM_PRODUCTS.map((p) => (
              <Radio.Button key={p.code} value={p.code}>{p.label}</Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Upload
            accept=".csv"
            showUploadList={false}
            beforeUpload={handleSMMFileUpload}
          >
            <Button icon={<UploadOutlined />}>选择 SMM CSV 文件</Button>
          </Upload>
          {smmFileName && <span style={{ marginLeft: 12, color: '#666' }}>{smmFileName}</span>}
        </div>

        {smmParseErrors.length > 0 && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message={`解析时有 ${smmParseErrors.length} 个警告`}
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {smmParseErrors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                {smmParseErrors.length > 5 && <li>...共 {smmParseErrors.length} 条</li>}
              </ul>
            }
          />
        )}

        {smmPreview && smmPreview.length > 0 && (
          <>
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message={`共解析 ${smmPreview.length} 条数据，日期范围 ${smmPreview[smmPreview.length - 1]?.date} ~ ${smmPreview[0]?.date}`}
            />
            <Table
              size="small"
              pagination={false}
              columns={[
                { title: '日期', dataIndex: 'date', key: 'date' },
                { title: '最低价', dataIndex: 'low', render: (v: number) => v.toLocaleString() },
                { title: '最高价', dataIndex: 'high', render: (v: number) => v.toLocaleString() },
                { title: '日均价', dataIndex: 'close', render: (v: number) => v.toLocaleString() },
                { title: '涨跌', dataIndex: 'change', render: (v: number) => (
                  <span style={{ color: v > 0 ? '#cf1322' : v < 0 ? '#3f8600' : '#999' }}>
                    {v > 0 ? '+' : ''}{v.toLocaleString()}
                  </span>
                )},
              ]}
              dataSource={smmPreview.slice(0, 5).map((r, i) => ({ ...r, key: i }))}
            />
            {smmPreview.length > 5 && (
              <div style={{ textAlign: 'center', color: '#999', padding: '8px 0' }}>
                ...仅展示前 5 条，共 {smmPreview.length} 条
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={handleSMMConfirmImport}>
                确认导入 {PRODUCT_MAP[smmProduct]?.name ?? smmProduct} 数据（{smmPreview.length} 条）
              </Button>
            </div>
          </>
        )}

        {/* 已导入的 SMM 数据摘要 */}
        {Object.keys(smmImported).length > 0 && (
          <>
            <Divider orientation="left">已导入的 SMM 数据</Divider>
            <Table
              size="small"
              pagination={false}
              columns={[
                { title: '品种', dataIndex: 'name', key: 'name' },
                { title: '数据条数', dataIndex: 'count', key: 'count' },
                { title: '日期范围', dataIndex: 'range', key: 'range' },
                {
                  title: '操作',
                  key: 'action',
                  render: (_: unknown, record: { code: string }) => (
                    <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => handleSMMDelete(record.code)}>
                      删除
                    </Button>
                  ),
                },
              ]}
              dataSource={Object.entries(smmImported).map(([code, prices]) => {
                const sorted = [...prices].sort((a, b) => a.date.localeCompare(b.date));
                return {
                  key: code,
                  code,
                  name: PRODUCT_MAP[code]?.name ?? code,
                  count: prices.length,
                  range: sorted.length > 0 ? `${sorted[0].date} ~ ${sorted[sorted.length - 1].date}` : '-',
                };
              })}
            />
          </>
        )}
      </Card>

      {/* 数据管理 */}
      <Card title="价格数据管理">
        <Space wrap>
          <Upload
            accept=".csv"
            showUploadList={false}
            beforeUpload={handleImportCSV}
          >
            <Button icon={<UploadOutlined />}>导入 CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
            下载导入模板
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExportCSV} disabled={manualPrices.length === 0}>
            导出数据
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            手动录入
          </Button>
          <Button danger onClick={handleClearAll} disabled={manualPrices.length === 0}>
            清空数据
          </Button>
        </Space>
        <Divider />
        <Table
          columns={columns}
          dataSource={manualPrices.map((p, i) => ({ ...p, key: i }))}
          size="small"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: '暂无手动录入数据' }}
        />
      </Card>

      {/* 品种信息 */}
      <Card title="品种配置" style={{ marginTop: 16 }}>
        <Table
          columns={[
            { title: '品种代码', dataIndex: 'code' },
            { title: '品种名称', dataIndex: 'name' },
            { title: '计价单位', dataIndex: 'unit' },
            { title: '类别', dataIndex: 'category', render: (v: string) => (
              <Tag color={v === 'salt' ? '#0064ff' : '#7c3aed'}>{v === 'salt' ? '锂盐' : '矿石'}</Tag>
            )},
          ]}
          dataSource={Object.values(PRODUCT_MAP).map((p) => ({ ...p, key: p.code }))}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 录入弹窗 */}
      <Modal
        title="手动录入价格"
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        width={480}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="close" label="收盘价" rules={[{ required: true, message: '请输入收盘价' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="open" label="开盘价">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="high" label="最高价">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="low" label="最低价">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
