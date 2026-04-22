const Product = require('../models/Product');
const ImageProduit = require('../models/ImageProduit');
const Inventaire = require('../models/Inventaire');
const APIFeatures = require('../utils/apiFeatures');
const { createProductInOdoo } = require('../services/odooService');

exports.createProduct = async (req, res) => {
    try {
        // 1. Create product in Mongo
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stockQuantity: req.body.stockQuantity || req.body.stock || 0
        });

        // 2. Sync with Odoo
        try {
            const odooId = await createProductInOdoo(product);
            product.odoo_id = odooId;
            await product.save();
            console.log("✅ Product synced to Odoo:", odooId);
        } catch (err) {
            console.log("❌ Odoo sync failed:", err.message);
        }

        // 3. Images
        let savedImages = [];

        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map(file =>
                ImageProduit.create({
                    product: product._id,
                    url: file.path,
                    altText: product.name
                })
            );
            savedImages = await Promise.all(imagePromises);
        } else if (req.body.images && Array.isArray(req.body.images)) {
            const imagePromises = req.body.images.map(url =>
                ImageProduit.create({
                    product: product._id,
                    url,
                    altText: product.name
                })
            );
            savedImages = await Promise.all(imagePromises);
        }

        // 4. Inventory
        const inventory = await Inventaire.create({
            product: product._id,
            stockActuel: product.stockQuantity
        });

        // 5. Link everything
        product.images = savedImages.map(img => img._id);
        product.inventory = inventory._id;
        await product.save();

        // 6. Response (ONLY ONCE)
        res.status(201).json({
            success: true,
            message: "Produit créé + sync Odoo OK",
            data: product
        });

    } catch (err) {
        console.log("❌ ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });

        await Inventaire.findOneAndDelete({ product: product._id });
        await ImageProduit.deleteMany({ product: product._id });
        await product.deleteOne();

        res.status(200).json({ success: true, message: "Produit et données liées supprimés" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ACTIONS CATALOGUE (Public) ---

exports.getProducts = async (req, res) => {
    try {
        const features = new APIFeatures(
            Product.find().populate('category images inventory'), 
            req.query
        )
        .search()
        .filter()
        .sort();

        const products = await features.query;

        res.status(200).json({ 
            success: true, 
            count: products.length, 
            data: products 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category images inventory');
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
