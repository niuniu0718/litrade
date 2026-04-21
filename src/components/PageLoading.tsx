import React from 'react';

const PageLoading: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
      <div style={{ fontSize: 16, marginBottom: 8 }}>加载中...</div>
    </div>
  </div>
);

export default PageLoading;
