const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../services/aiService');

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
        res.status(500).json({ error: "L'IA ne répond pas pour le moment." });
    }
});

module.exports = router;
