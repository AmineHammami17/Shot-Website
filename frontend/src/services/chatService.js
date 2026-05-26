import { apiRequest } from './apiClient';

export const sendChatMessage = (message) =>
  apiRequest('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
