const express = require('express');
const router = express.Router();

// Import des controllers
const adminCtrl = require('../controllers/adminController'); 
const reviewCtrl = require('../controllers/reviewController'); 

// Import des middlewares de sécurité
const { protect, admin } = require('../middlewares/auth'); 

// --- PROTECTION GLOBALE ---
// Toutes les routes ci-dessous demandent d'être connecté ET admin
router.use(protect);
router.use(admin);

// --- ROUTES DU DASHBOARD ---
router.get('/stats', adminCtrl.getDashboardStats); 
router.get('/users', adminCtrl.getAllUsers); 
router.put('/users/:id/role', adminCtrl.updateUserRole);

// --- GESTION DES CONTACTS ---
router.get('/messages', adminCtrl.getMessages); 
router.put('/messages/:id', adminCtrl.updateMessageStatus); 

// --- GESTION DES AVIS ---
router.get('/reviews', adminCtrl.getAllReviews); 
router.delete('/reviews/:id', reviewCtrl.deleteReview); 

// --- GESTION DES CODES PROMO ---
router.get('/coupons', adminCtrl.getCoupons);
router.post('/coupons', adminCtrl.createCoupon);
router.put('/coupons/:id', adminCtrl.updateCoupon);
router.delete('/coupons/:id', adminCtrl.deleteCoupon);

module.exports = router;