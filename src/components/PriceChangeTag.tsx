import React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

interface Props {
  value: number;
  percent?: boolean;
}

const PriceChangeTag: React.FC<Props> = ({ value, percent = false }) => {
  const isUp = value > 0;
  const color = isUp ? '#f5222d' : '#52c41a';
  const Icon = isUp ? CaretUpOutlined : CaretDownOutlined;
  const display = percent
    ? `${isUp ? '+' : ''}${value.toFixed(2)}%`
    : `${isUp ? '+' : ''}${value.toLocaleString()}`;

  return (
    <span style={{ color, fontWeight: 600, fontSize: 13 }}>
      <Icon /> {display}
    </span>
  );
};

export default PriceChangeTag;
