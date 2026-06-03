// src/utils/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/podcast-admin/backend/api';

const api = axios.create({ baseURL: API_BASE });

export const getPodcasts = (page = 1, limit = 9) =>
  api.get(`/podcasts?page=${page}&limit=${limit}`);

export const getPodcast = (id) =>
  api.get(`/podcasts/${id}`);

export const createPodcast = (formData) =>
  api.post('/podcasts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePodcast = (id, formData) =>
  api.post(`/podcasts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePodcast = (id) =>
  api.delete(`/podcasts/${id}`);

export default api;
