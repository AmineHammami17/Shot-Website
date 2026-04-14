import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Leaf, Recycle, HeartHandshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Navbar from '../components/Navbar';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import WishlistSidebar from '../components/WishlistSidebar';
import ShopSidebar from '../components/ShopSidebar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SubscribeModal from '../components/SubscribeModal';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const AboutUs = () => {
  const { t } = useTranslation();
  const [activeIcon, setActiveIcon] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [activeValueCard, setActiveValueCard] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { 
    wishlistItems, 
    isClearing, 
    toggleWishlist, 
    removeItem, 
    clearAll, 
    isInWishlist 
  } = useWishlist();

  const {
    cartItems,
    isWishlistOpen,
    isShopOpen,
    addToCart,
    openWishlist,
    openShop,
    closeSidebars,
  } = useCart();

  const handleCloseSidebars = () => {
    closeSidebars();
    setActiveIcon(null);
    setIsMobileMenuOpen(false);
  };

  const handleSubscribe = () => { 
    if (subscribeEmail.trim()) { 
      setShowSubscribeModal(true); 
      setSubscribeEmail(''); 
    } 
  };

  const addToShop = (item) => {
    addToCart(item);
    openShop();
  };

  const values = [
    {
      id: 1,
      icon: <Leaf size={32} strokeWidth={2} />, 
      title: t('about_val1_t'),
      text: t('about_val1_d'),
      color: "#0f766e"
    },
    {
      id: 2,
      icon: <Recycle size={32} strokeWidth={2} />, 
      title: t('about_val2_t'),
      text: t('about_val2_d'),
      color: "#8b5cf6"
    },
    {
      id: 3,
      icon: <HeartHandshake size={32} strokeWidth={2} />, 
      title: t('about_val3_t'),
      text: t('about_val3_d'),
      color: "#f59e0b"
    }
  ];

  const testimonials = [
    {
      name: "Michael T",
      role: t('role_coach'),
      stars: 5,
      text: t('testi_1')
    },
    {
      name: "Sarah J",
      role: t('role_fitness'),
      stars: 5,
      text: t('testi_2')
    },
    {
      name: "Alex R",
      role: t('role_athlete'),
      stars: 5,
      text: t('testi_3')
    }
  ];

  return (
    <div className="relative min-h-screen w-full font-['Montserrat'] signup-bg overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        * { font-family:'Montserrat',sans-serif; }

        .signup-bg {
          background-image: url('/images/Sign Up.webp');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .nav-fixed-video { background-color:rgba(45,75,68,.85); height:75px; backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.1); }
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

        .mobile-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 250; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
        .mobile-menu-overlay.open { opacity: 1; pointer-events: auto; }
        .mobile-menu { position: fixed; top: 0; right: 0; width: 280px; height: 100vh; background: linear-gradient(135deg, #238d7b 0%, #1a6e60 100%); z-index: 300; padding: 30px 20px; transform: translateX(100%); transition: transform 0.3s ease; display: flex; flex-direction: column; box-shadow: -5px 0 25px rgba(0,0,0,0.3); }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.2); }
        .mobile-menu-close { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .mobile-menu-close:hover { background: white; transform: rotate(90deg); }
        .mobile-menu-close:hover svg { color: #238d7b; }
        .mobile-menu-links { display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .mobile-menu-link { color: white; font-size: 17px; font-weight: 600; padding: 14px 18px; border-radius: 12px; background: rgba(255,255,255,0.1); transition: all 0.3s ease; text-decoration: none; display: block; }
        .mobile-menu-link:hover { background: white; color: #238d7b; transform: translateX(5px); }
        .mobile-menu-footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); }
        .mobile-signup-btn { width: 100%; background: white; color: #238d7b; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: block; text-align: center; }
        .mobile-signup-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

        .hero-card-container {
          width: 100%;
          max-width: 1440px;
          height: 340px;
          background-image: url('/images/p6.webp');
          background-size: cover;
          background-position: center;
          position: relative;
          margin: 40px auto;
          border-radius: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(15, 118, 110, 0.15);
        }
        
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(15, 118, 110, 0.35) 0%, rgba(15, 118, 110, 0.28) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 92%;
          height: 100%;
          gap: 50px;
        }

        .hero-logo-wrapper {
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: -5mm;
        }
        
        .hero-logo-img {
          height: 60px;
          width: auto;
          display: block;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }

        .hero-divider {
          width: 2px;
          height: 130px;
          background: linear-gradient(to bottom, 
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.2) 100%
          );
          border-radius: 2px;
        }

        .hero-text-wrapper {
          flex: 1;
          max-width: 620px;
        }

        .hero-text-p {
          color: white;
          font-size: 19px;
          line-height: 1.65;
          font-weight: 500;
          letter-spacing: 0.3px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          text-align: left;
        }

        .value-card {
          background: white;
          border-radius: 24px;
          padding: 40px 20px;
          text-align: center;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .value-card:hover, .value-card.active {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: transparent;
        }
        .value-icon-box {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: white;
          transition: all 0.3s ease;
        }
        
        .testimonial-card {
          background-color: #0f766e;
          color: white;
          border-radius: 24px;
          padding: 35px;
          text-align: left;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.2);
          display:flex; align-items:center; justify-content:center;
          font-weight:700;
        }
        
        .video-section {
          position: relative;
          height: 400px;
          border-radius: 30px;
          overflow: hidden;
          margin-top: 40px;
        }
        .video-bg { width: 100%; height: 100%; object-fit: cover; }
        .play-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; }
        .play-btn { width: 80px; height: 80px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; transition: transform 0.2s; }
        .play-btn:hover { transform: scale(1.1); }

        .stay-ahead-container { position: relative; padding: 50px 40px; margin-top: 0px; }
        .stay-ahead-overlay { position: absolute; inset: 0; background: transparent; }
        .stay-ahead-content { position: relative; z-index: 10; text-align: center; }
        .stay-ahead-title { font-size: clamp(24px, 5vw, 48px); font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; color: #0d4a3e; }

        @media (max-width: 1024px) {
          .hero-content { gap: 35px; width: 90%; }
          .hero-text-p { font-size: 17px; }
          .hero-logo-img { height: 52px; }
          .hero-divider { height: 110px; }
        }

        @media (max-width: 768px) {
          .hero-card-container { height: auto; padding: 50px 0; }
          .hero-content { flex-direction: column; text-align: center; gap: 25px; }
          .hero-divider { width: 70px; height: 2px; } 
          .hero-logo-wrapper { margin-left: 0; }
          .hero-logo-img { height: 48px; }
          .hero-text-wrapper { text-align: center; }
          .hero-text-p { font-size: 16px; text-align: center; }
        }
      `}</style>

      {/* Sidebars Globales */}
      <WishlistSidebar 
        isOpen={isWishlistOpen} 
        onClose={handleCloseSidebars} 
        wishlistItems={wishlistItems}
        isClearing={isClearing}
        onAddToShop={addToShop} 
        onRemoveItem={removeItem}
        onClearAll={clearAll}
      />
      <ShopSidebar isOpen={isShopOpen} onClose={handleCloseSidebars} cartItems={cartItems} />

      {/* Overlay global */}
      {(isWishlistOpen || isShopOpen || isMobileMenuOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity" onClick={handleCloseSidebars} />
      )}

      {/* CONTENU */}
      <div className="relative z-10">

        {/* MOBILE HEADER */}
        <MobileHeader 
          activeIcon={activeIcon}
          setActiveIcon={setActiveIcon}
          cartItemsCount={cartItems.length}
          onHeartClick={openWishlist}
          onCartClick={openShop}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* NAVBAR */}
        <Navbar 
          activeIcon={activeIcon}
          setActiveIcon={setActiveIcon}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          cartItemsCount={cartItems.length}
          onHeartClick={openWishlist}
          onCartClick={openShop}
        />

        {/* MOBILE MENU */}
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* MAIN CONTENT */}
        <div className="pt-32 pb-16 px-4 md:px-6 w-[98%] max-w-[1600px] mx-auto">
          
          {/* SECTION 1: WHO WE ARE */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: '#0d4a3e' }}>{t('about_title')}</h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-medium">
              {t('about_subtitle')}
            </p>
          </div>

          {/* SECTION 2: HERO BANNER CARD */}
          <div className="hero-card-container">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-logo-wrapper">
                <img loading="lazy" decoding="async" src="/images/1.webp" alt="S.HOT" className="hero-logo-img" />
              </div>
              <div className="hero-divider"></div>
              <div className="hero-text-wrapper">
                <p className="hero-text-p">
                  {t('about_hero_text')}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: OUR VALUES */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0d4a3e' }}>{t('about_values_title')}</h2>
            <p className="text-gray-600 mb-12 font-medium">{t('about_values_desc')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {values.map((val) => {
                const isActive = activeValueCard === val.id;
                return (
                  <div 
                    key={val.id} 
                    className={`value-card ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setActiveValueCard(val.id)}
                    onMouseLeave={() => setActiveValueCard(null)}
                    style={isActive ? { backgroundColor: val.color, color: 'white' } : {}}
                  >
                    <div className="value-icon-box" style={{ backgroundColor: isActive ? 'white' : val.color, color: isActive ? val.color : 'white' }}>
                      {val.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                    {isActive && <p className="font-medium text-sm md:text-base leading-relaxed">{val.text}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: WHAT'S SPIRULINA */}
          <div className="text-center mb-24 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0d4a3e' }}>{t('about_spiru_title')}</h2>
            <p className="text-gray-600 mb-10 font-medium">{t('about_spiru_desc')}</p>
            
            <div className="video-section">
              <img loading="lazy" decoding="async" src="/images/Rectangle 39.webp" alt="Spirulina Algae" className="video-bg" />
              <div className="play-overlay">
                <div className="play-btn">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex items-center gap-4 text-white font-mono text-sm">
                <span>02 : 36</span>
                <div className="flex-1 h-1 bg-gray-500 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#f59e0b]"></div>
                </div>
                <span>05 : 02</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: WHAT PEOPLE SAY */}
          <div className="text-center mb-4 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0d4a3e' }}>{t('about_testi_title')}</h2>
            <p className="text-gray-600 mb-12 font-medium">{t('about_testi_desc')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t_item, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      {t_item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight">{t_item.name}</h4>
                      <p className="text-xs opacity-80">{t_item.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4 text-[#f59e0b]">
                    {[...Array(t_item.stars)].map((_, i) => <span key={i}>â˜…</span>)}
                  </div>
                  <p className="text-sm italic font-medium leading-relaxed opacity-95">"{t_item.text}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* REJOIGNEZ LA COMMUNAUTÃ‰ S.HOT */}
        <div className="stay-ahead-container">
          <div className="stay-ahead-overlay"></div>
          <div className="stay-ahead-content max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="stay-ahead-title">{t('comm_cta')}</h2>
          </div>
        </div>

        {/* NEWSLETTER */}
        <Newsletter 
          subscribeEmail={subscribeEmail}
          onEmailChange={(e) => setSubscribeEmail(e.target.value)}
          onSubscribe={handleSubscribe}
        />

        {/* FOOTER */}
        <Footer />

        {/* SUBSCRIBE MODAL */}
        <SubscribeModal 
          isOpen={showSubscribeModal}
          onClose={() => setShowSubscribeModal(false)}
        />
      </div>
    </div>
  );
};

export default AboutUs;