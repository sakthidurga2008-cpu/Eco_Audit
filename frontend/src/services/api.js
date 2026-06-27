import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

export const createWasteLog = (payload) => api.post('/logs', payload);
export const getLogs = () => api.get('/logs');
export const getLogsByDate = (date) => api.get(`/logs/date/${date}`);
export const getStatistics = () => api.get('/statistics');
export const getStatisticsByDate = (date) => api.get(`/statistics/date/${date}`);

export default api;
