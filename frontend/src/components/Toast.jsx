// src/components/Toast.jsx
import React from 'react';
import './Toast.css';

function Toast({ toast, onRemove }) {
  const icons = { success: '✓', error: '✕', warning: '⚠' };
  return (
    <div className={`toast ${toast.type}`}>
      <span className="toast-icon">{icons[toast.type] || '✓'}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
