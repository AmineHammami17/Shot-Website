import { apiRequest } from './apiClient';

export const addToBackendCart = (payload) => apiRequest('/cart/add', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const clearBackendCart = () => apiRequest('/cart', {
  method: 'DELETE',
});
