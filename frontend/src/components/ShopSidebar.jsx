import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { previewCoupon } from '../services/orderService';

const ShopSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { 
    cartItems, removeFromCart, updateQuantity, clearCart,
    subtotal, totalProducts, shippingCost, promoDiscount, discountedTotal,
    appliedPromo, setAppliedPromo, clearPromo,
  } = useCart();
  const [promoCode, setPromoCode] = useState(appliedPromo?.code || '');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (num) => {
    const n = typeof num === 'number' ? num : parseFloat(num) || 0;
    return n.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' DT';
  };

  const parseItemPrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseFloat(price.toString().replace(',', '.').replace(/[^0-9.]/g, '')) || 0;
  };

  const handleOrder = () => {
    onClose();
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/auth-gateway', { state: { from: { pathname: '/checkout' } } });
    }
    window.scrollTo(0, 0);
  };

  const handleApplyPromo = async () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      clearPromo();
      return;
    }

    setIsApplyingPromo(true);
    try {
      const response = await previewCoupon({ promoCode: code, subtotal });
      setAppliedPromo(response.data || null);
      setPromoCode(code);
    } catch (error) {
      setAppliedPromo(null);
      setPromoError(error.message || 'Promo code not recognized.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end font-montserrat">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative h-full w-full sm:w-[450px] bg-white shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">{t('cart_title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {cartItems.length > 0 ? cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 shrink-0">
                <img loading="lazy" decoding="async" src={item.img} alt={item.name} className="max-h-full object-contain" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-7 h-7 rounded-md bg-[#238d7b] text-white flex items-center justify-center hover:bg-[#1a6e60] transition-all active:scale-90"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm text-gray-800 w-4 text-center">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-7 h-7 rounded-md bg-[#238d7b] text-white flex items-center justify-center hover:bg-[#1a6e60] transition-all active:scale-90"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-[#238d7b]">{formatPrice(parseItemPrice(item.price) * (item.quantity || 1))}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-300">
              <ShoppingBag size={60} className="mb-4 opacity-20" />
              <p className="font-medium">{t('Your cart is empty')}</p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        {cartItems.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-base">{t('Summary')}</h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>{t('Subtotal')}</span>
                <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>{t('Total Products')}</span>
                <span className="text-gray-900 font-bold">{totalProducts}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>{t('Delivery Fees')}</span>
                <span className="text-gray-900 font-bold">{formatPrice(shippingCost)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t('Promo Discount')} ({appliedPromo.code})</span>
                  <span className="font-bold">- {formatPrice(promoDiscount)}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-xs font-semibold mb-2">{t('Promo Code')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="SHOT10"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#238d7b]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo}
                  className="bg-[#238d7b] text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#1a6e60] disabled:opacity-60"
                >
                  {isApplyingPromo ? t('Applying...') : t('Apply')}
                </button>
              </div>
              {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
            </div>

            <div className="flex justify-between items-center mb-8 pt-4 border-t border-gray-100">
              <span className="text-xl font-bold text-gray-800">{t('Total')}</span>
              <span className="text-2xl font-bold text-[#238d7b]">{formatPrice(discountedTotal)}</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={clearCart}
                className="py-3.5 px-4 border-2 border-[#238d7b] text-[#238d7b] rounded-[20px] font-bold hover:bg-[#238d7b]/5 transition-all text-sm active:scale-95"
              >
                {t('cart_clear')}
              </button>
              <button 
                onClick={handleOrder}
                className="py-3.5 px-4 bg-[#238d7b] text-white rounded-[20px] font-bold hover:bg-[#1a6e60] transition-all text-sm shadow-lg shadow-[#238d7b]/20 active:scale-95"
              >
                {t('Order')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSidebar;