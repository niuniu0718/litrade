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
  SettingOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { type: 'divider' },
  {
    key: 'group-framework',
    label: '分析框架',
    type: 'group',
    children: [
      { key: '/demand', icon: <ShoppingOutlined />, label: '下游需求' },
      { key: '/supply-demand', icon: <SwapOutlined />, label: '供给分析' },
      { key: '/inventory', icon: <ContainerOutlined />, label: '库存分析' },
      { key: '/macro', icon: <ExperimentOutlined />, label: '宏观因子' },
    ],
  },
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
      { key: '/scenario', icon: <ThunderboltOutlined />, label: '情境模拟' },
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
  '/dashboard', '/demand', '/supply-demand', '/inventory', '/macro',
  '/price', '/chart', '/company', '/cost', '/trade',
  '/scenario', '/settings',
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
    <Layout style={{ minHeight: '100vh', background: '#0a0e27' }}>
      <Sider
        width={220}
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            Li
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4f8cff, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
          style={{ borderRight: 0, marginTop: 4, background: 'transparent' }}
        />
      </Sider>
      <Layout style={{ background: '#0a0e27' }}>
        <Header
          style={{
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            padding: '0 24px',
            height: 56,
            lineHeight: '56px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 14, color: '#8892b0', fontWeight: 500 }}>
            锂行情交易管理系统
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16,185,129,0.5)',
            }} />
            <span style={{ fontSize: 12, color: '#8892b0' }}>
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </Header>
        <Content
          style={{
            margin: 16,
            padding: 20,
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 88px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
