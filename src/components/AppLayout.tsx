import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';

const { Sider, Header, Content } = Layout;

// ─── 内联 SVG 图标 ───
const IconDashboard = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>;
const IconDollar = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 4v8M6 6.5c0-1 1-1.5 2-1.5s2 .5 2 1.5-1 1.5-2 1.5-2 .5-2 1.5 1 1.5 2 1.5 2-.5 2-1.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const IconTeam = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 14c0-2.5 2-4 4.5-4M11 10c2.5 0 4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3"/></svg>;
const IconFund = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14V6l4-2 4 2 4-2v8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M2 10l4-2 4 2 4-2" stroke="currentColor" strokeWidth="1.3"/></svg>;
const IconGlobal = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><ellipse cx="8" cy="8" rx="3" ry="6" stroke="currentColor" strokeWidth="1.1"/><path d="M2 8h12" stroke="currentColor" strokeWidth="1.1"/></svg>;
const IconThunderbolt = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1L4 9h4l-1 6 5-8H8l1-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
const IconSetting = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;

// ─── 折叠按钮 SVG ───
const IconCollapse = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconExpand = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: '/dashboard', icon: <IconDashboard />, label: '工作台' },
  { type: 'divider' },
  {
    key: 'group-market',
    label: '行情中心',
    type: 'group',
    children: [
      { key: '/price', icon: <IconDollar />, label: '价格中心' },
    ],
  },
  {
    key: 'group-industry',
    label: '产业数据',
    type: 'group',
    children: [
      { key: '/company', icon: <IconTeam />, label: '企业分析' },
      { key: '/cost', icon: <IconFund />, label: '成本分析' },
      { key: '/trade', icon: <IconGlobal />, label: '进出口数据' },
    ],
  },
  {
    key: 'group-intel',
    label: '情报中心',
    type: 'group',
    children: [
      { key: '/scenario', icon: <IconThunderbolt />, label: '情境模拟' },
    ],
  },
  { type: 'divider' },
  {
    key: 'group-system',
    label: '系统',
    type: 'group',
    children: [
      { key: '/settings', icon: <IconSetting />, label: '数据管理' },
    ],
  },
];

const allKeys = [
  '/dashboard',
  '/price', '/company', '/cost', '/trade',
  '/scenario', '/settings',
];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = allKeys.reduce((matched, key) => {
    if (location.pathname === key || (key !== '/' && location.pathname.startsWith(key))) {
      return key;
    }
    return matched;
  }, '/dashboard');

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <Sider
        width={260}
        collapsedWidth={60}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid #E8E8E8',
          overflow: 'auto',
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            background: '#0064FF',
            gap: 10,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.2"/>
            <text x="4" y="17" fill="white" fontSize="14" fontWeight="700">Li</text>
          </svg>
          {!collapsed && (
            <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: 1 }}>
              LiTrade
            </span>
          )}
        </div>

        {/* 折叠按钮 */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 16px',
            cursor: 'pointer',
            color: '#8C8C8C',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          {collapsed ? <IconExpand /> : <IconCollapse />}
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
            background: '#FFFFFF',
            padding: '0 24px',
            height: 48,
            lineHeight: '48px',
            borderBottom: '1px solid #E8E8E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 14, color: '#1F1F1F', fontWeight: 500 }}>
            锂行情交易管理系统
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#00C86E',
            }} />
            <span style={{ fontSize: 12, color: '#8C8C8C' }}>
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
            background: '#F5F7FA',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
