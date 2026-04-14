import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart, ShoppingCart, User, Globe, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const MobileHeader = ({ 
  activeIcon, 
  setActiveIcon, 
  cartItemsCount = 0,
  onHeartClick,
  onCartClick,
  onMenuClick 
}) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = () => {
    navigate(isAuthenticated ? '/profile' : '/auth-gateway');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const icons = [
    { id: 'globe', icon: Globe, action: () => setShowLangMenu((prev) => !prev) },
    { id: 'heart', icon: Heart, action: onHeartClick },
    { id: 'cart', icon: ShoppingCart, action: onCartClick },
    { id: 'user', icon: User, action: handleUserClick }
  ];

  return (
    <div className="mobile-header fixed top-0 left-0 z-[100] w-full px-4 sm:px-5">
      <Link to="/">
        <img loading="eager" fetchPriority="high" decoding="async" src="/images/shot2.webp" alt="S.HOT" className="h-8 w-auto" />
      </Link>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <div className="relative flex items-center justify-center gap-1.5 sm:gap-2">
          {icons.map((item) => (
            <div 
              key={item.id} 
              onClick={() => { 
                setActiveIcon && setActiveIcon(item.id); 
                if(item.action) item.action(); 
              }} 
              className={`icon-box-vid relative shrink-0 ${activeIcon === item.id ? 'icon-box-active' : 'opacity-80'}`}
            >
              <item.icon size={18} strokeWidth={2.5} />

              {item.id === 'globe' && showLangMenu && (
                <div
                  ref={langMenuRef}
                  className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl p-2 w-40 z-[120] animate-in fade-in zoom-in duration-200"
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
        <button className="icon-box-vid shrink-0" onClick={onMenuClick}>
          <Menu size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;