import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ 
  activeIcon, 
  setActiveIcon, 
  activeLink, 
  setActiveLink, 
  cartItemsCount = 0,
  onHeartClick,
  onCartClick 
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Ã‰tat pour afficher/cacher le menu des langues
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
    // Ne pas changer activeIcon ici, garder l'icÃ´ne globe active
  };

  const handleUserClick = () => {
    navigate(isAuthenticated ? '/profile' : '/auth-gateway');
  };

  const icons = [
    { id: 'globe', icon: Globe, action: () => setShowLangMenu(!showLangMenu) },
    { id: 'heart', icon: Heart, action: onHeartClick },
    { id: 'cart', icon: ShoppingCart, action: onCartClick },
    { id: 'user', icon: User, action: handleUserClick }
  ];
  
  const navLinks = [
    { key: 'home', label: t('home'), path: '/' },
    { key: 'products', label: t('products'), path: '/products' },
    { key: 'about', label: t('about'), path: '/about' },
    { key: 'contact', label: t('contact'), path: '/contact' }
  ];

  return (
    <div className="desktop-nav fixed top-0 left-0 z-[100] w-full pt-6 px-4 md:px-10 pointer-events-auto">
      <nav className="mx-auto max-w-7xl nav-fixed-video rounded-full px-6 md:px-10 flex items-center justify-between shadow-2xl relative">
        <Link to="/">
          <div className="flex-shrink-0">
            <img loading="eager" fetchPriority="high" decoding="async" src="/images/shot2.webp" alt="S.HOT" className="h-7 md:h-9 w-auto cursor-pointer" />
          </div>
        </Link>
        
        <div className="flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.key} to={link.path}>
              <button className={`nav-link-item ${activeLink === link.key ? 'nav-link-active' : ''}`}>
                {link.label}
              </button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 relative">
            {icons.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { 
                  if (item.id !== 'globe') {
                    setActiveIcon && setActiveIcon(item.id);
                  }
                  if(item.action) item.action(); 
                }} 
                className={`icon-box-vid relative ${activeIcon === item.id ? 'icon-box-active' : 'opacity-80'}`}
              >
                <item.icon size={18} strokeWidth={2.5} />

                {/* Language dropdown */}
                {item.id === 'globe' && showLangMenu && (
                  <div 
                    ref={langMenuRef}
                    className="absolute top-12 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-2 w-40 z-[110] animate-in fade-in zoom-in duration-200"
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        changeLanguage('en');
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-800 font-medium text-sm"
                    >
                      <img loading="lazy" decoding="async" src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-5 h-5 rounded-full object-cover" />
                      {t('language_english')}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        changeLanguage('fr');
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-800 font-medium text-sm"
                    >
                      <img loading="lazy" decoding="async" src="https://flagcdn.com/w40/fr.png" alt="FR" className="w-5 h-5 rounded-full object-cover" />
                      {t('language_french')}
                    </button>
                  </div>
                )}

                {item.id === 'cart' && cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            ))}
          </div>
          {!isAuthenticated && (
            <Link to="/register">
              <button className="btn-signup-vid ml-1 md:ml-2 text-xs md:text-sm">
                {t('signup')}
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;