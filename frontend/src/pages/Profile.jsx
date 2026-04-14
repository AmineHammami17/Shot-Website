import React, { useState, useRef, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Globe, CreditCard, Bell, ShieldCheck, HelpCircle, LogOut, MoreHorizontal, Camera, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { cancelOrder, downloadInvoice, getMyOrders, getOrderStats } from '../services/orderService';

// Hooks des Contexts
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Import des components
import Navbar from '../components/Navbar';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import WishlistSidebar from '../components/WishlistSidebar';
import ShopSidebar from '../components/ShopSidebar';
import ProductCard from '../components/ProductCard'; 
import Newsletter from '../components/Newsletter'; 
import Footer from '../components/Footer';

// Assets images pour les stats
import DeliveredImg from '../assets/icons/Delivered.webp';
import PendingImg from '../assets/icons/Pending.webp';
import CancelledImg from '../assets/icons/Cancelled.webp';

const AdminButton = () => (
  <Link to="/admin-dashboard">
    <button className="w-full py-3.5 bg-[#1B4332] text-[#F0FFF4] rounded-full font-bold text-[14px] mt-4 transition-all hover:bg-[#2D6A4E] shadow-md border border-[#1B4332]/20">
      Go to Admin Dashboard
    </button>
  </Link>
);

const Profile = () => {
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  // Context Wishlist
  const { 
    wishlistItems, 
    isClearing, 
    toggleWishlist, 
    removeItem, 
    clearAll, 
    isInWishlist 
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

  const [profileImage, setProfileImage] = useState(() => localStorage.getItem('userAvatar') || null);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || "Mark Nova");
  const [activeIcon, setActiveIcon] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, delivered: 0, pending: 0, cancelled: 0 });
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const refreshOrders = async () => {
    const [, myOrders] = await Promise.all([getOrderStats(), getMyOrders()]);
    setOrders(myOrders);

    // Source of truth: count from actual orders currently displayed.
    const normalized = myOrders.map((order) => (order.statut || '').toLowerCase());
    const computedStats = {
      totalOrders: myOrders.length,
      delivered: normalized.filter((status) => status === 'delivered').length,
      pending: normalized.filter((status) => status === 'pending' || status === 'cash' || status === 'confirmed').length,
      cancelled: normalized.filter((status) => status === 'cancelled').length,
    };
    setOrderStats(computedStats);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    signOut();
    navigate('/login');
  };

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/auth-gateway', { replace: true });
      return;
    }

    if (user?.username) {
      setUserName(user.username);
      localStorage.setItem('userName', user.username);
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        setIsOrdersLoading(true);
        await refreshOrders();
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('userAvatar', reader.result);
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSidebars = () => {
    closeSidebars();
    setActiveIcon(null);
    setIsMobileMenuOpen(false);
  };

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className="min-h-screen font-['Montserrat'] text-[#1A1A1A] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/Sign Up.webp')" }}
    >
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
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Profil */}
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm text-center border border-gray-100">
              <div
                className="relative w-32 h-32 mx-auto cursor-pointer mb-6 group"
                onClick={() => fileInputRef.current.click()}
              >
                {profileImage ? (
                  <img loading="lazy" decoding="async" src={profileImage} alt="User" className="w-32 h-32 rounded-full object-cover" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#129384] flex items-center justify-center text-white text-3xl font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <Camera className="text-white w-7 h-7" />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              <h2 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">{userName}</h2>
              <p className="text-[#757575] text-[14px] mt-1">{user?.email || 'user@email.com'}</p>
              
              <div className="mt-8 text-left">
                <div className="border-t border-[#F0F0F0] mb-6" />
                <h3 className="font-bold text-[#1A1A1A] text-[14px] mb-5 uppercase tracking-wide">
                  {t('profile_personal_info')}
                </h3>
                <div className="space-y-4">
                  <InfoItem icon={<Phone size={18} className="text-[#129384]" />} label={t('phone_number')} value="+1 (555) 012-3456" />
                  <InfoItem icon={<MapPin size={18} className="text-[#129384]" />} label={t('city')} value="Tunisia" />
                  <InfoItem icon={<Globe size={18} className="text-[#129384]" />} label={t('country')} value="Tunisia" />
                </div>
                <Link to="/edit-profile">
                  <button className="w-full py-3.5 bg-[#129384] text-white rounded-full font-bold text-[14px] mt-8 transition-all hover:bg-[#0e7a6d] shadow-md">
                    {t('edit_profile')}
                  </button>
                </Link>
                {user?.role === 'admin' && <AdminButton />}
              </div>
            </div>

            <AccountSettings handleLogout={handleLogout} />
          </div>

          {/* Dashboard & History */}
          <div className="w-full lg:w-3/4 space-y-8">
            <div className="bg-gradient-to-r from-[#36B3A8] to-[#129384] rounded-[2rem] p-8 text-white relative shadow-xl overflow-hidden">
              <div className="flex justify-between items-start relative z-10 mb-8">
                <div>
                  <h2 className="text-[26px] font-bold mb-1 tracking-tight">{t('profile_dashboard_title')}</h2>
                  <p className="opacity-90 text-[15px]">{t('profile_dashboard_subtitle')}</p>
                </div>
                <ShopButton />
              </div>

              <div className="grid grid-cols-4 gap-4 relative z-10">
                <DashboardStat count={String(orderStats.totalOrders)} label={t('profile_total_orders')} isImage={false} />
                <DashboardStat count={String(orderStats.delivered)} label={t('profile_delivered')} icon={DeliveredImg} isImage={true} />
                <DashboardStat count={String(orderStats.pending)} label={t('profile_pending')} icon={PendingImg} isImage={true} />
                <DashboardStat count={String(orderStats.cancelled)} label={t('profile_cancelled')} icon={CancelledImg} isImage={true} />
              </div>
            </div>

            {/* Historique Table */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] font-bold">{t('profile_purchase_history')}</h3>
                <button className="text-gray-400 text-[14px] hover:text-[#129384]">{t('profile_view_all')}</button>
              </div>
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="overflow-x-auto overflow-y-auto max-h-[350px]">
                  <table className="w-full text-left">
                    <thead className="text-gray-400 text-[13px] font-semibold border-b border-gray-100">
                      <tr>
                        <th className="pb-4 font-semibold">{t('profile_table_product')}</th>
                        <th className="pb-4 font-semibold">{t('profile_table_date')}</th>
                        <th className="pb-4 font-semibold">{t('profile_table_total')}</th>
                        <th className="pb-4 font-semibold">{t('profile_table_status')}</th>
                        <th className="pb-4 font-semibold text-right">{t('profile_table_action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {isOrdersLoading ? (
                        <tr>
                          <td className="py-4 text-sm text-gray-500" colSpan={5}>Loading orders...</td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td className="py-4 text-sm text-gray-500" colSpan={5}>No orders yet.</td>
                        </tr>
                      ) : (
                        orders.map((order, index) => {
                          const firstItem = order.orderItems?.[0]?.product;
                          return (
                            <HistoryRow
                              key={order._id}
                              id={index}
                              activeId={openMenuId}
                              setActiveId={setOpenMenuId}
                              menuRef={menuRef}
                              name={firstItem?.name || 'Product'}
                              date={new Date(order.dateCommande).toLocaleDateString()}
                              price={`${Number(order.total || 0).toFixed(3)}DT`}
                              status={order.statut}
                              image={firstItem?.images?.[0]?.url || '/images/p1.webp'}
                              onCancel={async () => {
                                await cancelOrder(order._id);
                                await refreshOrders();
                              }}
                              onInvoice={() => downloadInvoice(order._id)}
                            />
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Wishlist Dynamique */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] font-bold">{t('profile_saved_later')}</h3>
                <button onClick={openWishlist} className="text-gray-400 text-[14px] hover:text-[#129384]">{t('profile_view_wishlist')}</button>
              </div>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-[14px]">{t('profile_no_saved')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {wishlistItems.slice(0, 4).map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      isHovered={hoveredProduct === product.id}
                      isInWishlist={isInWishlist(product.id)}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onToggleWishlist={toggleWishlist}
                      onOpenDetails={() => openProductDetails(product)}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </div>
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

// --- Sous-composants ---
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-5 pt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-[11px] text-[#B0B0B0] font-semibold mb-0.5 uppercase tracking-wide">{label}</p>
      <p className="text-[14px] font-semibold text-[#404040]">{value}</p>
    </div>
  </div>
);

const DashboardStat = ({ count, label, icon, isImage }) => (
  <div className="bg-[#F0FFF4] backdrop-blur-sm rounded-[1.5rem] p-5 flex flex-col items-center justify-center text-center border border-[#1B4332]/10 shadow-md min-h-[140px]">
    {icon && (
      <div className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] mb-3 flex items-center justify-center">
        {isImage ? <img loading="lazy" decoding="async" src={icon} alt={label} className="w-full h-full object-contain drop-shadow-sm" /> : icon}
      </div>
    )}
    <span className="text-[28px] font-black text-[#1B4332] leading-none mb-1">{count}</span>
    <p className="text-[12px] md:text-[13px] font-bold text-[#1B4332] uppercase tracking-wide">{label}</p>
  </div>
);

const HistoryRow = ({ id, activeId, setActiveId, menuRef, name, date, price, status, image, onCancel, onInvoice }) => {
  const { t } = useTranslation();
  const isOpen = activeId === id;
  const statusConfig = {
    pending: { dot: "bg-orange-400", label: t('profile_status_pending') },
    delivered: { dot: "bg-[#129384]", label: t('profile_status_delivered') },
    cancelled: { dot: "bg-red-500", label: t('profile_status_cancelled') },
    cash: { dot: "bg-orange-400", label: t('profile_status_pending') },
    Pending: { dot: "bg-orange-400", label: t('profile_status_pending') },
    Delivered: { dot: "bg-[#129384]", label: t('profile_status_delivered') },
    Cancelled: { dot: "bg-red-500", label: t('profile_status_cancelled') }
  };
  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-50 p-2 border border-gray-100 shrink-0">
            <img loading="lazy" decoding="async" src={image} alt={name} className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-gray-800 text-[14px]">{name}</span>
        </div>
      </td>
      <td className="py-4 text-gray-500 text-[13px] font-medium">{date}</td>
      <td className="font-bold text-gray-800 text-[14px]">{price}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="font-bold text-gray-800 text-[13px]">{config.label}</span>
        </div>
      </td>
      <td className="py-4 text-right relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setActiveId(isOpen ? null : id); }} 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
        {isOpen && (
          <div ref={menuRef} className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 min-w-[140px]">
            <button
              onClick={async () => {
                await onCancel?.();
                setActiveId(null);
              }}
              className="w-full px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 text-left transition-colors"
            >
              {t('profile_cancel_order')}
            </button>
            <button
              onClick={async () => {
                await onInvoice?.();
                setActiveId(null);
              }}
              className="w-full px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 text-left transition-colors"
            >
              {t('profile_invoice')}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

const ShopButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/products')}
      className="bg-white text-[#129384] flex items-center gap-2 px-8 py-3 rounded-full font-bold text-[15px] hover:bg-gray-50 transition-all shadow-md"
    >
      <span>{t('btn_shop')}</span>
    </button>
  );
};

const AccountSettings = ({ handleLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-[#1A1A1A] mb-5 text-[14px] uppercase tracking-wide">{t('account_settings')}</h3>
      <div className="space-y-1">
        <SettingItem icon={<CreditCard size={19} />} label={t('payment_card')} onClick={() => navigate('/add-card')} />
        <SettingItem icon={<Bell size={19} />} label={t('notifications')} />
        <SettingItem icon={<ShieldCheck size={19} />} label={t('security_privacy')} />
        <SettingItem icon={<HelpCircle size={19} />} label={t('help_support')} />
      </div>
      <div className="border-t border-[#F0F0F0] mt-5 mb-5" />
      <button onClick={handleLogout} className="w-full py-3 bg-[#129384] text-white rounded-full font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#0e7a6d] transition-all shadow-md">
        <LogOut size={18} />
        {t('profile_logout')}
      </button>
    </div>
  );
};

const SettingItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group hover:bg-gray-50 transition-all">
    <div className="text-[#129384]">{icon}</div>
    <span className="text-[13px] font-semibold text-[#555555] group-hover:text-[#129384] transition-colors">{label}</span>
  </div>
);

export default Profile;
