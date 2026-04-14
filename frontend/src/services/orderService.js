import { apiRequest, API_BASE_URL } from './apiClient';

export const createOrderFromCart = (payload) => apiRequest('/orders/create-from-cart', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const previewCoupon = (payload) => apiRequest('/orders/coupon/preview', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getMyOrders = async () => {
  const response = await apiRequest('/orders/my-orders');
  return response.data || [];
};

export const getOrderStats = async () => {
  const response = await apiRequest('/orders/stats');
  return response.data || {
    totalOrders: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0,
  };
};

export const cancelOrder = (orderId) => apiRequest(`/orders/cancel/${orderId}`, {
  method: 'PUT',
});

export const downloadInvoice = async (orderId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/orders/invoice/${orderId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Unable to download invoice');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `invoice-${orderId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};
