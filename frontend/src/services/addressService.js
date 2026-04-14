import { apiRequest } from './apiClient';

export const createAddress = (payload) => apiRequest('/addresses', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getAddresses = async () => {
  const response = await apiRequest('/addresses');
  return response.data || [];
};
