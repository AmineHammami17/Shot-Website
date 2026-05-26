const express = require('express');
const router = express.Router();
const { generateChatResponse, checkChatbotHealth } = require('../services/aiService');

router.get('/health', async (req, res) => {
  try {
    const status = await checkChatbotHealth();
    res.json({ ok: true, chatbot: status });
  } catch (error) {
    res.status(503).json({
      ok: false,
      error: "Le micro-service chatbot n'est pas joignable.",
      detail: error.message,
    });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Le message est vide.' });
    }

    const reply = await generateChatResponse(message.trim());
    res.json({ reply });
  } catch (error) {
    console.error('❌ [AI Route] Erreur:', error.message);
    res.status(503).json({
      error: "L'assistant S.HOT est temporairement indisponible.",
      detail: error.message,
    });
  }
});

module.exports = router;
