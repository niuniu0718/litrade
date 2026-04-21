import React from 'react';

interface SectionHeaderProps {
  title: string;
  extra?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, extra }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{title}</span>
    {extra}
  </div>
);

export default SectionHeader;
