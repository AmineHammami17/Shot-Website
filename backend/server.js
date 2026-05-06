const express = require('express');
const dotenv = require('dotenv');

// ✅ dotenv en premier, avant tout autre import
dotenv.config();

const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes'); // ✅ Chatbot

require('./config/passport');

connectDB();

const odooService = require('./services/odooService');
(async () => {
    try {
        await odooService.authenticate();
        console.log("✅ Odoo connecté");
    } catch (err) {
        console.log("❌ Odoo error", err.message);
    }
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'shot_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send("Le serveur de SHOT est en ligne ! 🚀");
});

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes); // ✅ Chatbot route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur : http://localhost:${PORT}`);
});
