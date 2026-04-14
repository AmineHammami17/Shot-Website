import { apiRequest, API_BASE_URL } from './apiClient';

export const registerUser = (payload) => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const verifyOtp = (payload) => apiRequest('/auth/verify-otp', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const loginUser = (payload) => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const forgotPassword = (payload) => apiRequest('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const resetPassword = (payload) => apiRequest('/auth/reset-password', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getCurrentUser = () => apiRequest('/auth/me');
export const updateProfile = (payload) => apiRequest('/auth/update-profile', {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const googleAuthUrl = `${API_BASE_URL}/auth/google`;
