/**
 * API service — base URL and helper methods for backend communication
 */
const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('eventhub_token');

// Generic fetch wrapper with auth header
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.errors?.[0]?.msg || 'Request failed');
  }
  return data;
};

// Auth endpoints
export const authAPI = {
  register: (body) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => apiFetch('/api/auth/profile'),
  updateProfile: (body) => apiFetch('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// Event endpoints
export const eventAPI = {
  list: () => apiFetch('/api/events'),
  get: (id) => apiFetch(`/api/events/${id}`),
  create: (body) => apiFetch('/api/events', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateStatus: (id, status) => apiFetch(`/api/events/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getHistory: (id) => apiFetch(`/api/events/${id}/history`),
};

// RSVP endpoints
export const rsvpAPI = {
  create: (eventId) => apiFetch(`/api/events/${eventId}/rsvp`, { method: 'POST', body: '{}' }),
  cancel: (eventId) => apiFetch(`/api/events/${eventId}/rsvp`, { method: 'PUT', body: '{}' }),
  list: (eventId) => apiFetch(`/api/events/${eventId}/rsvps`),
};

export default { authAPI, eventAPI, rsvpAPI };
