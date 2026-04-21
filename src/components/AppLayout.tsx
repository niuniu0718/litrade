import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  BarChartOutlined,
  DollarOutlined,
  SwapOutlined,
  TeamOutlined,
  FundOutlined,
  GlobalOutlined,
  BulbOutlined,
  SettingOutlined,
} from '@ant-design/icons';
const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { type: 'divider' },
  {
    key: 'group-market',
    label: '行情中心',
    type: 'group',
    children: [
      { key: '/price', icon: <DollarOutlined />, label: '价格管理' },
      { key: '/chart', icon: <BarChartOutlined />, label: 'K线详情' },
    ],
  },
  {
    key: 'group-industry',
    label: '产业数据',
    type: 'group',
    children: [
      { key: '/supply-demand', icon: <SwapOutlined />, label: '供需管理' },
      { key: '/company', icon: <TeamOutlined />, label: '企业分析' },
      { key: '/cost', icon: <FundOutlined />, label: '成本分析' },
      { key: '/trade', icon: <GlobalOutlined />, label: '进出口数据' },
    ],
  },
  {
    key: 'group-intel',
    label: '情报中心',
    type: 'group',
    children: [
      { key: '/intelligence', icon: <BulbOutlined />, label: '市场情报' },
    ],
  },
  { type: 'divider' },
  {
    key: 'group-system',
    label: '系统',
    type: 'group',
    children: [
      { key: '/settings', icon: <SettingOutlined />, label: '数据管理' },
    ],
  },
];

const allKeys = [
  '/dashboard', '/price', '/chart', '/supply-demand', '/company',
  '/cost', '/trade', '/intelligence', '/settings',
];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = allKeys.reduce((matched, key) => {
    if (location.pathname === key || (key !== '/' && location.pathname.startsWith(key))) {
      return key;
    }
    return matched;
  }, '/dashboard');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#0064ff',
              letterSpacing: 1,
            }}
          >
            LiTrade
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 4 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            height: 56,
            lineHeight: '56px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 15, color: '#1a1a2e', fontWeight: 500 }}>
            锂行情交易管理系统
          </span>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </Header>
        <Content
          style={{
            margin: 20,
            padding: 20,
            background: '#f5f7fa',
            borderRadius: 8,
            overflowY: 'auto',
            minHeight: 'calc(100vh - 96px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
