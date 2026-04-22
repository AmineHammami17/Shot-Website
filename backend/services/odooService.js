const xmlrpc = require('xmlrpc');

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

const common = xmlrpc.createClient({ url: `${url}/xmlrpc/2/common` });
const models = xmlrpc.createClient({ url: `${url}/xmlrpc/2/object` });

let uid = null;

// 🔐 AUTHENTICATION
const authenticate = async (retries = 5) => {
    try {
        return await new Promise((resolve, reject) => {
            common.methodCall('authenticate', [db, username, password, {}], (err, res) => {
                if (err) return reject(err);
                uid = res;
                console.log("✅ Odoo authenticated");
                resolve(uid);
            });
        });
    } catch (err) {
        if (retries > 0) {
            console.log("⏳ Retrying Odoo connection...");
            await new Promise(r => setTimeout(r, 3000));
            return authenticate(retries - 1);
        }
        throw err;
    }
};

// 🔁 ENSURE AUTH
const ensureAuth = async () => {
    if (!uid) {
        await authenticate();
    }
};

// 👤 CREATE CUSTOMER
const createCustomerInOdoo = async (user) => {
    await ensureAuth();

    return new Promise((resolve, reject) => {
        models.methodCall(
            'execute_kw',
            [
                db,
                uid,
                password,
                'res.partner',
                'create',
                [{
                    name: user.username || user.email,
                    email: user.email,
                    phone: user.phone || ''
                }]
            ],
            (err, res) => {
                if (err) {
                    console.log("❌ Odoo create customer error:", err);
                    return reject(err);
                }

                // 🔥 VERY IMPORTANT CHECK
                if (!res) {
                    console.log("❌ Odoo returned undefined customer ID");
                    return reject(new Error("Odoo did not return customer ID"));
                }

                console.log("✅ Odoo customer created with ID:", res);
                resolve(res);
            }
        );
    });
};

// 🧾 CREATE ORDER
const createOrderInOdoo = async (partnerId, products) => {
    await ensureAuth(); // ✅ IMPORTANT

    return new Promise((resolve, reject) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'sale.order', 'create',
            [{
                partner_id: partnerId
            }]
        ], (err, orderId) => {
            if (err) return reject(err);

            // Ajouter les lignes de commande
            const promises = products.map(p => {
                return new Promise((resLine, rejLine) => {
                    models.methodCall('execute_kw', [
                        db, uid, password,
                        'sale.order.line', 'create',
                        [{
                            order_id: orderId,
                            product_id: p.product_id,
                            product_uom_qty: p.qty,
                            price_unit: 1
                        }]
                    ], (err) => {
                        if (err) return rejLine(err);
                        resLine();
                    });
                });
            });

            Promise.all(promises)
                .then(() => resolve(orderId))
                .catch(reject);
        });
    });
};
const createProductInOdoo = async (product) => {
    await ensureAuth();

    return new Promise((resolve, reject) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'product.product', 'create',
            [{
                name: product.name,
                list_price: product.price
            }]
        ], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

module.exports = {
    authenticate,
    createCustomerInOdoo,
    createOrderInOdoo,
    createProductInOdoo
};
