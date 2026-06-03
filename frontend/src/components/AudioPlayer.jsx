// src/components/AudioPlayer.jsx
import React, { useRef, useEffect, useState } from 'react';
import './AudioPlayer.css';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : '/podcast-admin/backend';

export default function AudioPlayer({ podcast, onClose }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrent] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else         { audioRef.current.play();  setPlaying(true);  }
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur  = audioRef.current.currentTime;
    const dur  = audioRef.current.duration || 0;
    setCurrent(cur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  };

  const onLoaded = () => {
    if (audioRef.current) setDuration(audioRef.current.duration || 0);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
    }
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const audioUrl = `${API_BASE}/${podcast.audio_file}`;
  const thumbUrl = `${API_BASE}/${podcast.thumbnail}`;

  return (
    <div className="player-backdrop" onClick={onClose}>
      <div className="player-box" onClick={(e) => e.stopPropagation()}>
        <button className="player-close" onClick={onClose}>×</button>
        <div className="player-thumb">
          <img src={thumbUrl} alt={podcast.title} />
        </div>
        <div className="player-meta">
          <p className="player-date">{new Date(podcast.created_at).toLocaleDateString('en-GB')}</p>
          <h2 className="player-title">{podcast.title}</h2>
          <p className="player-desc">{podcast.description}</p>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoaded}
          onEnded={() => setPlaying(false)}
        />
        <div className="player-progress-bar" onClick={seek}>
          <div className="player-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="player-times">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
        <div className="player-controls">
          <button className="player-play-btn" onClick={toggle}>
            {playing ? '⏸' : '▶'}
          </button>
        </div>
      </div>
    </div>
  );
}
