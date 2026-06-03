// src/components/StatsCard.jsx
import React from 'react';
import './StatsCard.css';

export default function StatsCard({ total }) {
  return (
    <div className="stats-card">
      <h3 className="stats-label">Total Podcasts</h3>
      <div className="stats-number">{total ?? '—'}</div>
    </div>
  );
}
