import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Zap, Leaf, Recycle } from 'lucide-react';

// Import des components
import Navbar from '../components/Navbar';
import MobileMenu from '../components/MobileMenu';
import WishlistSidebar from '../components/cart/WishlistSidebar';
import ShopSidebar from '../components/cart/ShopSidebar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import Modal from '../components/layout/Modal';

// Import des données produits
import { allProducts } from '../data/products';

const Home = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const closeSidebars = () => {
    setIsWishlistOpen(false);
    setIsShopOpen(false);
    setActiveIcon(null);
    setIsMobileMenuOpen(false);
  };

  const handleIconClick = (type) => {
    if (type === 'wishlist') {
      setIsWishlistOpen(true);
      setIsShopOpen(false);
    }
    if (type === 'cart') {
      setIsShopOpen(true);
      setIsWishlistOpen(false);
    }
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(i => i.id === product.id);
    if (exists) {
      setWishlistItems(prev => prev.filter(i => i.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, { id: product.id, name: product.name, price: product.price, img: product.img }]);
    }
  };

  const isInWishlist = (id) => wishlistItems.some(i => i.id === id);

  const addToCart = (product) => {
    setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    setIsShopOpen(true);
  };

  const handleSubscribe = () => {
    setShowSubscribeModal(true);
  };

  const toggleHeartWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const addToShop = (item) => {
    if (!cartItems.find(i => i.id === item.id)) {
      setCartItems(prev => [...prev, item]);
    }
    setIsShopOpen(true);
    setIsWishlistOpen(false);
  };

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24"
        fill={i < rating ? "#f39c12" : "none"}
        stroke={i < rating ? "#f39c12" : "#d1d5db"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ));

  return (
    <div className="relative min-h-screen w-full font-['Montserrat'] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        * { font-family:'Montserrat',sans-serif; }

        .video-hero { position:relative; width:100%; height:100vh; overflow:hidden; }
        .video-bg { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:0; }
        .video-overlay { position:absolute; inset:0; background:linear-gradient(135deg, rgba(13,74,62,0.75) 0%, rgba(15,90,71,0.65) 100%); z-index:1; }

        .nav-fixed-video { background-color:rgba(45,75,68,.85); height:75px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.1); }
        .nav-link-item { color:white; opacity:.8; font-weight:600; font-size:15px; transition:all .3s ease; cursor:pointer; }
        .nav-link-item:hover { opacity:1; text-shadow:0 0 8px rgba(255,255,255,.5); }
        .icon-box-vid { width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:14px; transition:all .2s ease; color:white; cursor:pointer; position:relative; }
        .icon-box-vid:hover,.icon-box-active { background-color:white !important; color:#238d7b !important; transform:translateY(-2px); }
        .btn-signup-vid { background-color:white; color:#238d7b; font-weight:700; font-size:14px; height:42px; padding:0 25px; border-radius:50px; border:2px solid white; transition:all .3s ease; cursor:pointer; }
        .btn-signup-vid:hover { background-color:#238d7b; color:white !important; }

        .mobile-header { display: none; }
        @media (max-width: 1023px) {
          .mobile-header { display: flex; align-items: center; justify-content: space-between; background-color: rgba(45,75,68,.85); height: 70px; backdrop-filter: blur(12px); padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,.1); }
          .desktop-nav { display: none !important; }
        }

        .hero-content { position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:0 20px; }
        .hero-badge { display:inline-block; background:rgba(255,255,255,0.15); color:white; padding:10px 24px; border-radius:50px; font-size:14px; font-weight:600; margin-bottom:24px; backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.2); }
        .hero-title { font-size:clamp(40px, 7vw, 80px); font-weight:900; color:white; line-height:1.1; margin-bottom:20px; letter-spacing:-1px; text-shadow:0 4px 20px rgba(0,0,0,0.3); }
        .hero-subtitle { font-size:clamp(16px, 2.5vw, 22px); color:rgba(255,255,255,0.95); max-width:700px; margin:0 auto 40px; line-height:1.6; font-weight:500; }
        .hero-cta { display:inline-flex; align-items:center; gap:12px; background-color:#f39c12; color:white; font-weight:700; font-size:18px; padding:18px 40px; border-radius:50px; border:none; cursor:pointer; box-shadow:0 8px 24px rgba(243,156,18,0.4); transition:all .3s ease; text-decoration:none; }
        .hero-cta:hover { background-color:#d68910; transform:translateY(-2px); box-shadow:0 12px 32px rgba(243,156,18,0.5); }

        .section-padding { padding:80px 20px; }
        .section-title { font-size:clamp(28px, 5vw, 48px); font-weight:800; text-align:center; margin-bottom:16px; color:#0d4a3e; letter-spacing:-0.5px; }
        .section-subtitle { text-align:center; color:#6b7280; font-size:clamp(14px, 2vw, 18px); max-width:600px; margin:0 auto 60px; font-weight:500; }

        .value-card { background:white; border-radius:24px; padding:40px 30px; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.08); transition:transform .3s ease, box-shadow .3s ease; border:2px solid transparent; }
        .value-card:hover { transform:translateY(-8px); box-shadow:0 16px 48px rgba(0,0,0,0.12); border-color:#16a085; }
        .value-icon { width:80px; height:80px; margin:0 auto 24px; background:linear-gradient(135deg, #16a085 0%, #0d8c73 100%); border-radius:20px; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 8px 20px rgba(22,160,133,0.3); }

        .product-card { background:white; border-radius:24px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); transition:transform .3s ease, box-shadow .3s ease; position:relative; }
        .product-card:hover { transform:translateY(-8px); box-shadow:0 12px 40px rgba(0,0,0,0.15); }
        .product-img-wrap { position:relative; width:100%; height:280px; background:#f7f9f8; overflow:hidden; }
        .product-img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
        .product-card:hover .product-img { transform:scale(1.05); }
        .product-badge { position:absolute; top:16px; left:16px; color:white; font-weight:700; font-size:12px; padding:6px 16px; border-radius:50px; z-index:2; }
        .product-heart { position:absolute; top:16px; right:16px; width:44px; height:44px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:all .3s ease; z-index:2; }
        .product-heart:hover { transform:scale(1.1); }
        .product-cart-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .3s ease; z-index:1; }
        .product-card:hover .product-cart-overlay { opacity:1; }
        .product-cart-btn { width:56px; height:56px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,0.2); cursor:pointer; transition:transform .2s ease; }
        .product-cart-btn:hover { transform:scale(1.1); }
        .product-body { padding:24px; }
        .product-stars { display:flex; gap:4px; margin-bottom:12px; }
        .product-name { font-weight:700; font-size:18px; color:#111827; margin-bottom:8px; }
        .product-desc { font-size:14px; color:#6b7280; line-height:1.5; margin-bottom:12px; }
        .product-price { font-weight:800; font-size:20px; color:#16a085; margin-bottom:12px; }
        .product-stock { font-size:13px; color:#9ca3af; margin-bottom:16px; }
        .btn-shop { background:#f39c12; color:white; padding:12px 28px; border-radius:50px; font-weight:700; font-size:14px; border:none; cursor:pointer; transition:all .3s ease; display:inline-flex; align-items:center; gap:8px; }
        .btn-shop:hover { background:#d68910; transform:translateY(-2px); }

        .stay-ahead-container { background-image: url('/images/Sign Up.png'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; position: relative; padding: 80px 40px; }
        .stay-ahead-overlay { position: absolute; inset: 0; background: transparent; }
        .stay-ahead-content { position: relative; z-index: 10; text-align: center; }
        .stay-ahead-title { font-size: clamp(32px, 6vw, 64px); font-weight: 900; letter-spacing: -1px; line-height: 1.1; color: #0d4a3e; }

        @keyframes popIn { 0%{transform:scale(.6);opacity:0} 100%{transform:scale(1);opacity:1} }

        @media (max-width: 768px) {
          .section-padding { padding: 60px 16px; }
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar 
        cartCount={cartItems.length}
        onIconClick={handleIconClick}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
      />

      {/* MOBILE MENU */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* WISHLIST SIDEBAR */}
      <WishlistSidebar 
        isOpen={isWishlistOpen}
        items={wishlistItems}
        onClose={closeSidebars}
        onToggleHeart={toggleHeartWishlist}
        onAddToShop={addToShop}
      />

      {/* SHOP SIDEBAR */}
      <ShopSidebar 
        isOpen={isShopOpen}
        items={cartItems}
        onClose={closeSidebars}
      />

      {/* OVERLAY */}
      {(isWishlistOpen || isShopOpen || isMobileMenuOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity" onClick={closeSidebars} />
      )}

      {/* VIDEO HERO */}
      <section className="video-hero">
        <video autoPlay loop muted playsInline className="video-bg">
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">✨ 100% Natural & Organic</span>
          <h1 className="hero-title">
            Power Your Life<br/>with Spirulina
          </h1>
          <p className="hero-subtitle">
            Experience the purest, most potent spirulina supplement. Sustainably sourced, scientifically proven, and ready to transform your wellness journey.
          </p>
          <Link to="/products" className="hero-cta">
            Shop Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #f8fffe 0%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Why Choose S.HOT?</h2>
          <p className="section-subtitle">
            We're committed to delivering the highest quality spirulina with complete transparency and sustainability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="value-card">
              <div className="value-icon">
                <Leaf size={40} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0d4a3e', marginBottom: 12 }}>100% Pure & Natural</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 15 }}>
                No fillers, no additives. Just pure, organic spirulina grown in pristine conditions.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Zap size={40} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0d4a3e', marginBottom: 12 }}>Maximum Potency</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 15 }}>
                Rich in protein, vitamins, and antioxidants for optimal health benefits.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Recycle size={40} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0d4a3e', marginBottom: 12 }}>Sustainably Sourced</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 15 }}>
                Eco-friendly farming practices that protect our planet for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Discover our premium selection of spirulina products, each crafted for maximum quality and convenience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 product-grid">
            {allProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={product.img} alt={product.name} className="product-img" />
                  <span className="product-badge" style={{ backgroundColor: product.badgeColor }}>
                    {product.badge}
                  </span>
                  <button 
                    className="product-heart"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                  >
                    <Heart 
                      size={20} 
                      fill={isInWishlist(product.id) ? '#ef4444' : 'none'}
                      stroke={isInWishlist(product.id) ? '#ef4444' : '#9ca3af'}
                      strokeWidth={2}
                    />
                  </button>
                  <div className="product-cart-overlay">
                    <button 
                      className="product-cart-btn"
                      onClick={() => openProductDetails(product)}
                    >
                      <ShoppingCart size={24} color="#16a085" strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <div className="product-body">
                  <div className="product-stars">{renderStars(product.rating)}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <p className="product-price">{product.price}</p>
                  <p className="product-stock">{product.stock}</p>
                  <button 
                    className="btn-shop"
                    onClick={() => openProductDetails(product)}
                  >
                    Shop Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN NEWSLETTER */}
      <div className="stay-ahead-container">
        <div className="stay-ahead-overlay"></div>
        <div className="stay-ahead-content max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="stay-ahead-title">Join our Newsletter</h2>
        </div>
      </div>

      {/* NEWSLETTER */}
      <Newsletter onSubscribe={handleSubscribe} />

      {/* FOOTER */}
      <Footer />

      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <Modal onClose={() => setShowSubscribeModal(false)}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid #238d7b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#238d7b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 style={{ fontWeight: 800, fontSize: 22, color: '#111827', marginBottom: 12 }}>Thank You!</h3>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
            Please check your inbox to confirm your subscription.
          </p>
          <button 
            onClick={() => setShowSubscribeModal(false)} 
            style={{ 
              width: '100%', padding: '16px', borderRadius: 50, background: '#238d7b', 
              color: 'white', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', 
              transition: 'background .2s ease' 
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a6e60'}
            onMouseLeave={e => e.currentTarget.style.background = '#238d7b'}
          >
            Done
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Home;