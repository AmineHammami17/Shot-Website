const User = require('../models/User');

// Ajouter une nouvelle carte
exports.addPaymentCard = async (req, res) => {
    try {
        const { holderName, cardNumber, expiryDate, cvc } = req.body;

        // Validation simple
        if (!holderName || !cardNumber || !expiryDate || !cvc) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        const user = await User.findById(req.user._id);

        // Ajouter la carte au tableau
        user.cards.push({ holderName, cardNumber, expiryDate, cvc });
        await user.save();

        res.status(201).json({ success: true, message: "Carte ajoutée avec succès !", cards: user.cards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
