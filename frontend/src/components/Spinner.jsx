// src/components/Spinner.jsx
import React from 'react';
import './Spinner.css';

export default function Spinner({ size = 'md', overlay = false }) {
  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className={`spinner spinner-${size}`} />
      </div>
    );
  }
  return <div className={`spinner spinner-${size}`} />;
}
