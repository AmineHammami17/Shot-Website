import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ── Initialisation depuis localStorage ──
  const [wishlistItems, setWishlistItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlistItems')) || []; }
    catch { return []; }
  });

  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cartItems')) || []; }
    catch { return []; }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('appliedPromo')) || null; }
    catch { return null; }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // ── Sauvegarde automatique ──
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('appliedPromo', JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem('appliedPromo');
    }
  }, [appliedPromo]);

  // ── Logique de calcul pour le Summary ──
  // Gère tous les formats : 59 | "59,000 DT" | "59.000DT" | "59,000"
  // En format tunisien "59,000 DT" = cinquante-neuf dinars (virgule = séparateur décimal)
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    // Remplace la virgule par un point, puis retire tout ce qui n'est pas chiffre ou point
    return parseFloat(price.toString().replace(',', '.').replace(/[^0-9.]/g, '')) || 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0);
  const totalProducts = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const taxCost = 0;
  const shippingCost = cartItems.length > 0 ? 7 : 0;
  const promoDiscount = (() => {
    if (!appliedPromo) return 0;
    const discountValue = Number(appliedPromo.discountValue || 0);
    if (appliedPromo.discountType === 'percentage') {
      return Math.min(subtotal, (subtotal * discountValue) / 100);
    }
    return Math.min(subtotal, discountValue);
  })();
  const finalTotal = subtotal + shippingCost;
  const discountedTotal = Math.max(0, subtotal - promoDiscount) + shippingCost;

  // ── Fonctions Wishlist ──
  const toggleWishlistProduct = (product) => {
    const exists = wishlistItems.find(i => i.id === product.id);
    if (exists) {
      setWishlistItems(prev => prev.filter(i => i.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, { id: product.id, name: product.name, price: product.price, img: product.img }]);
    }
  };

  const isInWishlist = (id) => wishlistItems.some(i => i.id === id);
  const removeFromWishlist = (id) => setWishlistItems(prev => prev.filter(item => item.id !== id));
  
  const clearAllWishlist = () => {
    if (wishlistItems.length === 0) return;
    setIsClearing(true);
    setTimeout(() => { setWishlistItems([]); setIsClearing(false); }, 600);
  };

  // ── Fonctions Cart ──
  const addToCart = (product, quantity = 1) => {
    const exists = cartItems.find(i => i.id === product.id);
    if (exists) {
      setCartItems(prev => prev.map(i =>
        i.id === product.id ? { ...i, quantity: (i.quantity || 1) + quantity } : i
      ));
    } else {
      setCartItems(prev => [...prev, { ...product, quantity }]);
    }
  };

  const addToShop = (item) => {
    if (!cartItems.find(i => i.id === item.id)) {
      setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
    setIsShopOpen(true);
    setIsWishlistOpen(false);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== id));
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
    }
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const clearPromo = () => setAppliedPromo(null);

  // ── Sidebars ──
  const openWishlist = () => { setIsWishlistOpen(true); setIsShopOpen(false); };
  const openShop = () => { setIsShopOpen(true); setIsWishlistOpen(false); };
  const closeSidebars = () => { setIsWishlistOpen(false); setIsShopOpen(false); };

  return (
    <CartContext.Provider value={{
      wishlistItems, cartItems, isWishlistOpen, isShopOpen, isClearing,
      subtotal, totalProducts, taxCost, shippingCost, promoDiscount, finalTotal, discountedTotal,
      appliedPromo, setAppliedPromo, clearPromo,
      toggleWishlistProduct, isInWishlist, removeFromWishlist, clearAllWishlist,
      addToCart, addToShop, updateQuantity, removeFromCart, clearCart,
      openWishlist, openShop, closeSidebars,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);