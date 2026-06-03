// src/components/ConfirmDialog.jsx
import React from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog-box">
        <div className="dialog-icon">🗑</div>
        <h3 className="dialog-title">Delete Podcast</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn-cancel-dialog" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-dialog" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
