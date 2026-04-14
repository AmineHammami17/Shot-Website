import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Bell, ShieldCheck, HelpCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';

// Hooks des Contexts
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Import des components
import Navbar from '../components/Navbar';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import WishlistSidebar from '../components/WishlistSidebar';
import ShopSidebar from '../components/ShopSidebar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const EditProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();

  // Context Wishlist
  const { 
    wishlistItems, 
    isClearing, 
    removeItem, 
    clearAll 
  } = useWishlist();

  // Context Cart
  const { 
    cartItems,
    isWishlistOpen,
    isShopOpen,
    addToCart,
    openWishlist, 
    openShop,
    closeSidebars
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    address: '',
    city: '',
    country: 'Tunisia',
    zipCode: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState([]);
  const [activeIcon, setActiveIcon] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/auth-gateway', { replace: true });
      return;
    }

    if (user) {
      setFormData({
        name: user.username || '',
        surname: user.surname || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'Tunisia',
        zipCode: user.zipCode || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    } else {
      // If auth is valid but user object is not hydrated yet, force refresh from API.
      refreshUser();
    }
  }, [isAuthenticated, isLoading, navigate, refreshUser, user]);

  const userAvatar = localStorage.getItem('userAvatar') || null;
  const userName = `${formData.name} ${formData.surname.charAt(0)}`;

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const newErrors = [];
    
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) newErrors.push(key);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 2000);
      return;
    }
    
    setIsSaving(true);
    try {
      await updateProfile({
        username: formData.name,
        surname: formData.surname,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
      });
      await refreshUser();
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSidebars = () => {
    closeSidebars();
    setActiveIcon(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div 
      className="min-h-screen font-['Montserrat'] text-[#1A1A1A] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/Sign Up.webp')" }}
    >
      <style>{shakeAnimation}</style>

      {/* Sidebars Globales */}
      <WishlistSidebar 
        isOpen={isWishlistOpen} 
        onClose={handleCloseSidebars} 
        wishlistItems={wishlistItems}
        isClearing={isClearing}
        onAddToShop={addToCart} 
        onRemoveItem={removeItem}
        onClearAll={clearAll}
      />
      <ShopSidebar isOpen={isShopOpen} onClose={handleCloseSidebars} cartItems={cartItems} />

      {/* Overlay global */}
      {(isWishlistOpen || isShopOpen || isMobileMenuOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity" onClick={handleCloseSidebars} />
      )}

      {/* Navigation */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <MobileHeader
        activeIcon={activeIcon}
        setActiveIcon={setActiveIcon}
        cartItemsCount={cartItems.length}
        onHeartClick={openWishlist}
        onCartClick={openShop}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />
      <Navbar
        activeIcon={activeIcon}
        setActiveIcon={setActiveIcon}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        cartItemsCount={cartItems.length}
        onHeartClick={openWishlist}
        onCartClick={openShop}
      />
      
      <main className="container mx-auto px-4 md:px-10 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* --- SIDEBAR --- */}
          <div className="w-full lg:w-1/4 self-start">
            <div className="bg-white rounded-[2rem] px-6 py-8 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                {userAvatar ? (
                  <img loading="lazy" decoding="async" src={userAvatar} alt="User" className="w-28 h-28 rounded-full object-cover mx-auto mb-4" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#129384] mx-auto mb-4 flex items-center justify-center text-2xl text-white font-bold">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : <User size={36} />}
                  </div>
                )}
                <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-1">{userName}</h2>
                <p className="text-[#757575] text-[14px]">{formData.email}</p>
              </div>
              <div className="border-t border-[#E0E0E0] mb-6" />
              <h3 className="font-bold text-[#1A1A1A] mb-5 text-[14px] uppercase tracking-wide">{t('account_settings')}</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer group" onClick={() => navigate('/add-card')}>
                  <CreditCard size={19} className="text-[#555555] group-hover:text-[#129384]" strokeWidth={2} />
                  <span className="text-[13px] font-semibold text-[#555555] group-hover:text-[#129384] transition-colors">{t('payment_card')}</span>
                </div>
                <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-default">
                  <Bell size={19} className="text-[#555555]" strokeWidth={2} />
                  <span className="text-[13px] font-semibold text-[#555555]">{t('notifications')}</span>
                </div>
                <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-default">
                  <ShieldCheck size={19} className="text-[#555555]" strokeWidth={2} />
                  <span className="text-[13px] font-semibold text-[#555555]">{t('security_privacy')}</span>
                </div>
                <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-default">
                  <HelpCircle size={19} className="text-[#555555]" strokeWidth={2} />
                  <span className="text-[13px] font-semibold text-[#555555]">{t('help_support')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- FORMULAIRE EDIT PROFILE --- */}
          <div className="w-full lg:w-3/4 pt-2">
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-2">{t('edit_profile')}</h1>
              <p className="text-[#757575] text-[15px]">{t('edit_profile_subtitle')}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 max-w-3xl">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('name') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('surname')}</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('surname') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('shipping_address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('address') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('city')}</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('city') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('country')}</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('country') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('zip_code')}</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('zipCode') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('phone_number')}</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('phone') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#1A1A1A] font-bold uppercase tracking-wider">{t('email_address')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('email') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 max-w-xl">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 py-3 border-2 border-[#129384] text-[#129384] rounded-full font-bold text-[14px] transition-all hover:bg-[#129384] hover:text-white"
                >
                  {t('btn_cancel')}
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-[#129384] hover:bg-[#0e7a6d] text-white rounded-full font-bold text-[14px] transition-all shadow-md"
                >
                  {isSaving ? 'Saving...' : t('btn_update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <div className="pt-10 pb-16 text-center">
        <h2 className="text-5xl font-black text-[#0d4a3e]">{t('comm_cta')}</h2>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default EditProfile;