import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MobileMenu = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navLinks = [
    { key: 'home', label: t('home'), path: '/' },
    { key: 'products', label: t('products'), path: '/products' },
    { key: 'about', label: t('about'), path: '/about' },
    { key: 'contact', label: t('contact'), path: '/contact' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[250]"
        onClick={onClose}
      />

      {/* Menu */}
      <div 
        className="fixed top-0 right-0 w-[280px] h-screen z-[300] p-[30px_20px] flex flex-col"
        style={{ 
          background: 'linear-gradient(135deg, #238d7b 0%, #1a6e60 100%)',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.3)'
        }}
      >
        <div className="flex justify-between items-center mb-10 pb-5 border-b border-white/20">
          <img loading="lazy" decoding="async" src="/images/shot2.webp" alt="S.HOT" style={{ height: '35px' }} />
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white transition-all"
          >
            <X size={18} color="white" />
          </button>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {navLinks.map((item) => (
            <Link 
              key={item.key} 
              to={item.path} 
              onClick={onClose}
              className="text-white text-[17px] font-semibold py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white hover:text-[#238d7b] transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-white/20">
          <Link to="/register" onClick={onClose}>
            <button className="w-full bg-white text-[#238d7b] py-3.5 rounded-xl font-bold text-base hover:shadow-lg transition-all">
              {t('signup')}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;