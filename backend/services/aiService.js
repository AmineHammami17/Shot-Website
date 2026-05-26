const axios = require('axios');

const CHATBOT_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:5005';
const CHAT_TIMEOUT_MS = Number(process.env.CHATBOT_TIMEOUT_MS || 15000);

const generateChatResponse = async (userPrompt) => {
  const response = await axios.post(
    `${CHATBOT_URL}/chat`,
    { message: userPrompt },
    {
      timeout: CHAT_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: (status) => status < 500,
    },
  );

  if (response.status >= 400) {
    const detail = response.data?.error || `HTTP ${response.status}`;
    throw new Error(`Chatbot indisponible: ${detail}`);
  }

  if (!response.data?.reply) {
    throw new Error('Réponse chatbot vide');
  }

  return response.data.reply;
};

const checkChatbotHealth = async () => {
  const response = await axios.get(`${CHATBOT_URL}/health`, { timeout: 5000 });
  return response.data;
};

module.exports = { generateChatResponse, checkChatbotHealth };
