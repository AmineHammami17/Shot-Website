const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Avis = require('../models/Avis'); // Nom exact de ton fichier modèle
const Contact = require('../models/Contact');
const Coupon = require('../models/Coupon');

const validateCouponPayload = (payload = {}) => {
    const code = String(payload.code || '').trim().toUpperCase();
    const discountType = payload.discountType;
    const discountValue = Number(payload.discountValue);
    const expiryDate = payload.expiryDate ? new Date(payload.expiryDate) : null;
    const isActive = typeof payload.isActive === 'boolean' ? payload.isActive : true;

    if (!code) {
        return { error: 'Le code promo est requis.' };
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
        return { error: 'Le type de remise est invalide.' };
    }

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
        return { error: 'La valeur de remise doit etre superieure a 0.' };
    }

    if (discountType === 'percentage' && discountValue > 100) {
        return { error: 'Une remise en pourcentage ne peut pas depasser 100%.' };
    }

    if (!expiryDate || Number.isNaN(expiryDate.getTime())) {
        return { error: 'La date d expiration est invalide.' };
    }

    return {
        data: {
            code,
            discountType,
            discountValue,
            expiryDate,
            isActive,
        }
    };
};

// @desc    Statistiques globales du Dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = {
            // 1. REVENU
            totalRevenue: await Order.aggregate([
                { $match: { statut: { $in: ['confirmed', 'cash', 'delivered'] } } },
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]),

            // 2. COMPTEURS
            stockValue: await Product.aggregate([
                { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", { $ifNull: ["$stockQuantity", 0] }] } } } }
            ]),
            ordersCount: await Order.countDocuments(),
            productsCount: await Product.countDocuments(),
            usersCount: await User.countDocuments({ role: 'user' }),

            // 3. ALERTES STOCK
            stockAlerts: await Product.find().populate('inventory').then(products => 
                products.filter(p => p.inventory && p.inventory.stockActuel <= p.inventory.seuilAlerte)
            ),

            // 4. ENGAGEMENT (Correction ici)
            customerEngagement: {
                avgRating: await Avis.aggregate([
                    { $group: { _id: null, avg: { $avg: "$rating" } } }
                ]).then(res => res[0] ? res[0].avg.toFixed(1) : 0),
                
                // On cherche 'non_lu' car c'est ce qui est dans ta base MongoDB
                unreadMessages: await Contact.countDocuments({ statut: 'non_lu' }) 
            }
        };

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Obtenir tous les messages de contact
exports.getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort('-dateEnvoi');
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @desc    Mettre à jour le statut d'un message (ex: lu)
exports.updateMessageStatus = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: contact });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @desc    Liste de tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
        res.status(200).json({ success: true, data: users });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @desc    Mettre à jour le rôle d'un utilisateur (admin promotion)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: "Rôle invalide." });
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!updated) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Obtenir tous les avis pour modération
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Avis.find()
            .populate('user', 'nom surname email')
            .populate('product', 'name');
        res.status(200).json({ success: true, data: reviews });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @desc    Obtenir tous les codes promo
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ isActive: -1, expiryDate: 1, code: 1 });
        res.status(200).json({ success: true, count: coupons.length, data: coupons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Creer un code promo
exports.createCoupon = async (req, res) => {
    try {
        const { error, data } = validateCouponPayload(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const existingCoupon = await Coupon.findOne({ code: data.code });
        if (existingCoupon) {
            return res.status(409).json({ success: false, message: 'Ce code promo existe deja.' });
        }

        const coupon = await Coupon.create(data);
        res.status(201).json({ success: true, data: coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Mettre a jour un code promo
exports.updateCoupon = async (req, res) => {
    try {
        const { error, data } = validateCouponPayload(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const duplicateCoupon = await Coupon.findOne({ code: data.code, _id: { $ne: req.params.id } });
        if (duplicateCoupon) {
            return res.status(409).json({ success: false, message: 'Ce code promo existe deja.' });
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
        }

        res.status(200).json({ success: true, data: updatedCoupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Supprimer un code promo
exports.deleteCoupon = async (req, res) => {
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!deletedCoupon) {
            return res.status(404).json({ success: false, message: 'Code promo introuvable.' });
        }

        res.status(200).json({ success: true, message: 'Code promo supprime avec succes.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};