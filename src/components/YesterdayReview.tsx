import React from 'react';
import { Tag } from 'antd';
import { TEXT } from '../utils/styles';
import type { ReviewRecord } from '../types/analysis';

interface Props {
  review: ReviewRecord;
}

const deviationColor = (level: 'normal' | 'medium' | 'heavy') => {
  if (level === 'normal') return '#10b981';
  if (level === 'medium') return '#f59e0b';
  return '#ef4444';
};

const deviationLabel = (level: 'normal' | 'medium' | 'heavy') => {
  if (level === 'normal') return '正常';
  if (level === 'medium') return '中等';
  return '较大';
};

const YesterdayReview: React.FC<Props> = ({ review }) => {
  const dc = deviationColor(review.deviationLevel);

  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT.secondary }}>昨日复盘</span>
        <span style={{ fontSize: 11, color: TEXT.muted }}>{review.date}</span>
        <Tag style={{
          margin: 0, fontSize: 10, background: `${dc}15`, color: dc, borderRadius: 4,
        }}>
          偏差{deviationLabel(review.deviationLevel)}
        </Tag>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* 预测 vs 实际 */}
        <div>
          <div style={{ fontSize: 10, color: TEXT.muted, marginBottom: 4 }}>预测价格</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEXT.secondary }}>
            {review.predictedPrice.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: TEXT.muted, marginBottom: 4 }}>实际价格</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEXT.primary }}>
            {review.actualPrice.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: TEXT.muted, marginBottom: 4 }}>偏差</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: dc }}>
            {review.deviationPercent > 0 ? '+' : ''}{review.deviationPercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, fontSize: 12, color: TEXT.secondary }}>
        <span>区间命中：{review.priceHit ? '✓' : '✗'}</span>
        <span>方向判断：{review.directionHit ? '✓ 正确' : '✗ 偏离'}</span>
      </div>
      {review.deviationLevel !== 'normal' && (
        <div style={{ marginTop: 8, fontSize: 11, color: TEXT.secondary, lineHeight: 1.6 }}>
          {review.deviationReason}
          {review.correctedFactors.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {review.correctedFactors.map(f => (
                <Tag key={f} style={{ margin: 0, fontSize: 10, background: 'rgba(79,140,255,0.1)', color: '#4f8cff', borderRadius: 4 }}>
                  {f}
                </Tag>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YesterdayReview;
