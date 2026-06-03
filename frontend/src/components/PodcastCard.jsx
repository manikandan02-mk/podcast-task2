// src/components/PodcastCard.jsx
import React from 'react';
import editIcon from '../assets/edit_icon.png';
import deleteIcon from '../assets/delete_icon.png';
import './PodcastCard.css';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : '/podcast-admin/backend';

export default function PodcastCard({ podcast, onEdit, onDelete, onPlay }) {
  const thumbUrl = `${API_BASE}/${podcast.thumbnail}`;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  };

  return (
    <div className="podcast-card">
      <div className="card-thumbnail">
        <img src={thumbUrl} alt={podcast.title} loading="lazy" />
        <div className="card-actions">
          <button className="card-action-btn" onClick={() => onEdit(podcast)}>
            <img src={editIcon} alt="" /> Edit
          </button>
          <div className="card-action-divider" />
          <button className="card-action-btn" onClick={() => onDelete(podcast)}>
            <img src={deleteIcon} alt="" /> Delete
          </button>
        </div>
      </div>
      <div className="card-body">
        <p className="card-date">{formatDate(podcast.created_at)}</p>
        <h3 className="card-title">{podcast.title}</h3>
        <p className="card-description">{podcast.description}</p>
        <button className="btn-play-now" onClick={() => onPlay(podcast)}>
          ▶ Play Now
        </button>
      </div>
    </div>
  );
}
