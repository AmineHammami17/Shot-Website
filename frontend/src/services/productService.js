import { apiRequest } from './apiClient';
import { mapProductToUiModel } from '../utils/productMapper';

export const getProducts = async (query = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const response = await apiRequest(`/products${suffix}`);
  return (response.data || []).map(mapProductToUiModel);
};

export const getProductById = async (productId) => {
  const response = await apiRequest(`/products/${productId}`);
  return mapProductToUiModel(response.data);
};
