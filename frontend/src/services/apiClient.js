// Base URL rules:
// - If `VITE_API_BASE_URL` is provided, use it.
// - In local dev (Vite on 517x), call backend directly on :5000.
// - In Docker/Nginx (app served on :8080), call the same-origin `/api` so Nginx can proxy.
const computeApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined') {
    const port = window.location.port;
    const isViteDevPort = port.startsWith('517');
    if (import.meta.env.DEV && isViteDevPort) return 'http://localhost:5000/api';
  }

  return '/api';
};

const API_BASE_URL = computeApiBaseUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (path, options = {}) => {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      // If we send FormData, do NOT set Content-Type (browser sets boundary).
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export { API_BASE_URL };
