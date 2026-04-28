import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import PriceManagement from './pages/PriceManagement';
import CompanyAnalysis from './pages/CompanyAnalysis';
import CostAnalysis from './pages/CostAnalysis';
import TradeData from './pages/TradeData';
import Settings from './pages/Settings';
import ScenarioAnalysis from './pages/ScenarioAnalysis';

const catlTheme = {
  token: {
    colorPrimary: '#0064FF',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F5F7FA',
    colorText: '#1F1F1F',
    colorTextSecondary: '#8C8C8C',
    colorBorder: '#E8E8E8',
    colorBorderSecondary: '#F0F0F0',
    colorSuccess: '#00C86E',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',
    colorInfo: '#0064FF',
    borderRadius: 8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
};

function App() {
  return (
    <ConfigProvider theme={catlTheme} locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/price" element={<PriceManagement />} />
            <Route path="/chart" element={<Navigate to="/price" replace />} />
            <Route path="/company" element={<CompanyAnalysis />} />
            <Route path="/cost" element={<CostAnalysis />} />
            <Route path="/trade" element={<TradeData />} />
            <Route path="/scenario" element={<ScenarioAnalysis />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
