// src/components/PodcastForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import './PodcastForm.css';
import { validatePodcastForm } from '../utils/validation';
import Spinner from './Spinner';

export default function PodcastForm({ editPodcast, onSubmit, onCancel, loading }) {
  const isEdit = !!editPodcast;

  const [fields, setFields] = useState({
    title: '',
    description: '',
  });
  const [thumbFile, setThumbFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [errors, setErrors] = useState({});

  const thumbInputRef = useRef();
  const audioInputRef = useRef();

  useEffect(() => {
    if (editPodcast) {
      setFields({ title: editPodcast.title, description: editPodcast.description });
      setThumbFile(null);
      setAudioFile(null);
      setErrors({});
    } else {
      setFields({ title: '', description: '' });
      setThumbFile(null);
      setAudioFile(null);
      setErrors({});
    }
  }, [editPodcast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleThumb = (e) => {
    const file = e.target.files[0] || null;
    setThumbFile(file);
    if (errors.thumbnail) setErrors((prev) => ({ ...prev, thumbnail: '' }));
  };

  const handleAudio = (e) => {
    const file = e.target.files[0] || null;
    setAudioFile(file);
    if (errors.audio_file) setErrors((prev) => ({ ...prev, audio_file: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validatePodcastForm(
      { ...fields, thumbnail: thumbFile, audio_file: audioFile },
      isEdit
    );
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fd = new FormData();
    fd.append('title', fields.title.trim());
    fd.append('description', fields.description.trim());
    if (thumbFile) fd.append('thumbnail', thumbFile);
    if (audioFile) fd.append('audio_file', audioFile);

    onSubmit(fd);
  };

  const handleCancel = () => {
    setFields({ title: '', description: '' });
    setThumbFile(null);
    setAudioFile(null);
    setErrors({});
    onCancel();
  };

  return (
    <div className="podcast-form-card">
      <div className="form-card-header">
        <h2>{isEdit ? 'Edit Podcast' : 'Add New Podcast'}</h2>
      </div>
      <div className="form-body">
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-field">
            <label htmlFor="title">Podcast Name</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter title here."
              value={fields.title}
              onChange={handleChange}
              className={errors.title ? 'has-error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="description">Podcast Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description here."
              value={fields.description}
              onChange={handleChange}
              className={errors.description ? 'has-error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-field">
            <label>Podcast Thumbnail {isEdit && <span style={{fontWeight:400,color:'var(--gray-400)'}}>(optional – replace existing)</span>}</label>
            <div className="file-input-row">
              <div className={`file-url-input ${errors.thumbnail ? 'has-error' : ''}`}>
                {thumbFile ? thumbFile.name : (isEdit ? 'Current thumbnail kept' : 'Enter URL or browse in local computer.')}
              </div>
              <button type="button" className="btn-browse" onClick={() => thumbInputRef.current.click()}>
                Browse
              </button>
            </div>
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleThumb}
            />
            {errors.thumbnail && <span className="error-text">{errors.thumbnail}</span>}
          </div>

          <div className="form-field">
            <label>Podcast File {isEdit && <span style={{fontWeight:400,color:'var(--gray-400)'}}>(optional – replace existing)</span>}</label>
            <div className="file-input-row">
              <div className={`file-url-input ${errors.audio_file ? 'has-error' : ''}`}>
                {audioFile ? audioFile.name : (isEdit ? 'Current audio kept' : 'Enter URL or browse in local computer.')}
              </div>
              <button type="button" className="btn-browse" onClick={() => audioInputRef.current.click()}>
                Browse
              </button>
            </div>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3"
              style={{ display: 'none' }}
              onChange={handleAudio}
            />
            {errors.audio_file && <span className="error-text">{errors.audio_file}</span>}
          </div>

          <hr className="form-divider" />

          <div className="form-actions">
            <button type="submit" className={`btn-add-podcast ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
              {loading ? <Spinner size="sm" /> : (isEdit ? 'Update Podcast' : 'Add Podcast')}
            </button>
            <button type="button" className="btn-cancel-form" onClick={handleCancel}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
