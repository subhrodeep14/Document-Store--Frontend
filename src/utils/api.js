// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'||import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Redirect to login on auth failure (except for /auth/me calls)
      if (!err.config.url.includes('/auth/')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── Memos ────────────────────────────────────────────────────────────────────
export const memoApi = {
  getByDate: (date) => api.get('/memos', { params: { date } }),
  getById: (id) => api.get(`/memos/${id}`),
  search: (params) => api.get('/memos/search', { params }),
  create: (data) => api.post('/memos', data),
  update: (id, data) => api.patch(`/memos/${id}`, data),
  delete: (id) => api.delete(`/memos/${id}`),
};

// ─── Activities ───────────────────────────────────────────────────────────────
export const activityApi = {
  getByDate: (date) => api.get('/activities', { params: { date } }),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.patch(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
};

// ─── Files ────────────────────────────────────────────────────────────────────
export const fileApi = {
  getByDate: (date) => api.get('/files', { params: { date } }),
  upload: (formData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getUrl: (id) => `/api/files/${id}`,
  delete: (id) => api.delete(`/files/${id}`),
};

// ─── Calendar ─────────────────────────────────────────────────────────────────
export const calendarApi = {
  getSummary: (year, month) => api.get('/calendar/summary', { params: { year, month } }),
  getStats: () => api.get('/calendar/stats'),
};

export const entryApi = {
  getSlOptions: () => api.get('/entry/sl-options'),
  getByDate: (date) => api.get('/entry/by-date', { params: { date } }),
  search: (params) => api.get('/entry', { params }),
  create: (formData) =>
    api.post('/entry/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getFileUrl: (filename) => `/api/entry/file/${filename}`,
};


export default api;
