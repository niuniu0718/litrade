import React from 'react';

const PageLoading: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
    <div style={{ textAlign: 'center', color: '#8C8C8C' }}>
      <div style={{
        width: 32, height: 32, margin: '0 auto 12px',
        border: '2px solid rgba(0,100,255,0.15)',
        borderTopColor: '#0064FF',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ fontSize: 13, letterSpacing: 0.5 }}>加载中...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

export default PageLoading;
