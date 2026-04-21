import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
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

const theme = {
  token: {
    colorPrimary: '#0064ff',
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
};

function App() {
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/price" element={<PriceManagement />} />
            <Route path="/chart" element={<ChartDetail />} />
            <Route path="/supply-demand" element={<SupplyDemand />} />
            <Route path="/company" element={<CompanyAnalysis />} />
            <Route path="/cost" element={<CostAnalysis />} />
            <Route path="/trade" element={<TradeData />} />
            <Route path="/intelligence" element={<MarketIntelligence />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
