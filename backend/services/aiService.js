const axios = require("axios");

// URL du micro-service Python Flask (port 5005)
// En Docker : utilise le nom du service, sinon localhost
const CHATBOT_URL = process.env.CHATBOT_SERVICE_URL || "http://localhost:5005";

const generateChatResponse = async (userPrompt) => {
    try {
        const response = await axios.post(
            `${CHATBOT_URL}/chat`,
            { message: userPrompt },
            { timeout: 5000 }
        );
        return response.data.reply;
    } catch (error) {
        console.error("❌ [AI Service] Erreur chatbot Python :", error.message);
        return "Désolé, je rencontre un problème technique. Posez-moi votre question plus tard !";
    }
};

module.exports = { generateChatResponse };
