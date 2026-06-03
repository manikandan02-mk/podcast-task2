// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';

import Header from '../components/Header';
import PodcastForm from '../components/PodcastForm';
import StatsCard from '../components/StatsCard';
import PodcastCard from '../components/PodcastCard';
import ConfirmDialog from '../components/ConfirmDialog';
import AudioPlayer from '../components/AudioPlayer';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';

import { getPodcasts, createPodcast, updatePodcast, deletePodcast } from '../utils/api';

const PAGE_LIMIT = 9;

export default function AdminDashboard() {
  const { toasts, addToast, removeToast } = useToast();

  const [podcasts, setPodcasts]       = useState([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  const [loadingList, setLoadingList] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [editPodcast, setEditPodcast] = useState(null);  // null = add mode
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [playerPodcast, setPlayerPodcast] = useState(null);

  // ── Fetch podcasts ────────────────────────────────────────────────────────
  const fetchPodcasts = useCallback(async (pg = 1) => {
    setLoadingList(true);
    try {
      const res = await getPodcasts(pg, PAGE_LIMIT);
      const data = res.data;
      setPodcasts(data.podcasts);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      addToast('Failed to fetch podcasts. Check API connection.', 'error');
    } finally {
      setLoadingList(false);
    }
  }, [addToast]);

  useEffect(() => { fetchPodcasts(1); }, [fetchPodcasts]);

  // ── Add / Edit ────────────────────────────────────────────────────────────
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editPodcast) {
        await updatePodcast(editPodcast.id, formData);
        addToast('Podcast updated successfully!', 'success');
      } else {
        await createPodcast(formData);
        addToast('Podcast added successfully!', 'success');
      }
      setEditPodcast(null);
      fetchPodcasts(editPodcast ? page : 1);
    } catch (err) {
      const msg = err.response?.data?.error || 'An error occurred. Please try again.';
      addToast(msg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePodcast(deleteTarget.id);
      addToast('Podcast deleted successfully!', 'success');
      setDeleteTarget(null);
      // If last item on last page, go to previous page
      const newTotal = total - 1;
      const newPages = Math.max(1, Math.ceil(newTotal / PAGE_LIMIT));
      const goPage   = page > newPages ? newPages : page;
      fetchPodcasts(goPage);
    } catch (err) {
      addToast('Failed to delete podcast.', 'error');
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Header />

      <main className="dashboard-container">

        {/* Top section: Form + Stats */}
        <div className="top-section">
          <PodcastForm
            editPodcast={editPodcast}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditPodcast(null)}
            loading={formLoading}
          />
          <StatsCard total={total} />
        </div>

        {/* Podcast List */}
        <div className="list-section">
          <div className="list-header">
            <h2>List of Podcasts</h2>
          </div>

          {loadingList ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Spinner size="lg" />
            </div>
          ) : podcasts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎙️</div>
              <h3>No Podcasts Yet</h3>
              <p>Add your first podcast using the form above.</p>
            </div>
          ) : (
            <>
              <div className="podcast-grid">
                {podcasts.map((p) => (
                  <PodcastCard
                    key={p.id}
                    podcast={p}
                    onEdit={(pod) => { setEditPodcast(pod); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    onDelete={setDeleteTarget}
                    onPlay={setPlayerPodcast}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <Pagination page={page} totalPages={totalPages} onPageChange={fetchPodcasts} />
              ) : (
                <div className="view-all-row">
                  <button className="btn-view-all" onClick={() => fetchPodcasts(1)}>
                    View All
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </main>

      {/* Confirm Delete */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Audio Player */}
      {playerPodcast && (
        <AudioPlayer podcast={playerPodcast} onClose={() => setPlayerPodcast(null)} />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
