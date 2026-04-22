import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import ChartDetail from './pages/ChartDetail';
import PriceManagement from './pages/PriceManagement';
import SupplyDemand from './pages/SupplyDemand';
import CompanyAnalysis from './pages/CompanyAnalysis';
import MarketIntelligence from './pages/MarketIntelligence';
import CostAnalysis from './pages/CostAnalysis';
import TradeData from './pages/TradeData';
import Settings from './pages/Settings';
import DemandAnalysis from './pages/DemandAnalysis';
import InventoryAnalysis from './pages/InventoryAnalysis';
import MacroFactors from './pages/MacroFactors';
import ScenarioAnalysis from './pages/ScenarioAnalysis';

const darkTheme = {
  token: {
    colorPrimary: '#4f8cff',
    colorBgContainer: 'transparent',
    colorBgElevated: 'rgba(10,14,39,0.95)',
    colorBgLayout: '#0a0e27',
    colorText: '#f0f0f0',
    colorTextSecondary: '#8892b0',
    colorBorder: 'rgba(255,255,255,0.08)',
    colorBorderSecondary: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  algorithm: theme.darkAlgorithm,
};

function App() {
  return (
    <ConfigProvider theme={darkTheme} locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demand" element={<DemandAnalysis />} />
            <Route path="/supply-demand" element={<SupplyDemand />} />
            <Route path="/inventory" element={<InventoryAnalysis />} />
            <Route path="/macro" element={<MacroFactors />} />
            <Route path="/price" element={<PriceManagement />} />
            <Route path="/chart" element={<ChartDetail />} />
            <Route path="/company" element={<CompanyAnalysis />} />
            <Route path="/cost" element={<CostAnalysis />} />
            <Route path="/trade" element={<TradeData />} />
            <Route path="/intelligence" element={<MarketIntelligence />} />
            <Route path="/scenario" element={<ScenarioAnalysis />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
