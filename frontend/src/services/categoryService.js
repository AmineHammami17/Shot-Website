import { apiRequest } from './apiClient';

export const getCategories = async () => {
  const response = await apiRequest('/categories');
  return response.data || [];
};
