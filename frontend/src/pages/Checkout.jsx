import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { createAddress } from '../services/addressService';
import { addToBackendCart, clearBackendCart } from '../services/cartService';
import { createOrderFromCart, previewCoupon } from '../services/orderService';
import {
  Truck, CreditCard, AlertCircle, ChevronRight,
  CheckCircle, Trash2, ShoppingBag,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import WishlistSidebar from '../components/WishlistSidebar';
import ShopSidebar from '../components/ShopSidebar';

/* â”€â”€â”€ Fallback card illustration â”€â”€â”€ */
const CardIllustration = ({ holder, number, expiry, cvc }) => {
  const { t } = useTranslation();
  const displayNum  = number ? number.replace(/\s/g,'').replace(/(\d{4})/g,'$1 ').trim() : '0000 0000 0000 0000';
  const displayName = holder || t('YOUR NAME');
  const displayExp  = expiry || '07 / 27';
  const displayCvc  = cvc    ? 'â€¢'.repeat(cvc.length) : '000';
  return (
    <div className="relative w-full" style={{ minHeight: 300 }}>
      <div className="absolute left-0 top-0 w-[80%] rounded-3xl p-7 shadow-2xl text-white z-10"
        style={{ background: 'linear-gradient(135deg,#149484 0%,#0d6e61 100%)' }}>
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-white rounded-md px-2 py-1"><span className="text-blue-700 font-black text-xs">VISA</span></div>
          <div className="flex"><div className="w-6 h-6 rounded-full bg-red-500"/><div className="w-6 h-6 rounded-full bg-yellow-400 -ml-3"/></div>
          <div className="bg-blue-500 rounded-md px-2 py-0.5"><span className="text-white font-black text-[10px]">AMEX</span></div>
          <div className="ml-auto w-10 h-7 bg-yellow-400 rounded-lg"/>
        </div>
        <p className="text-xl font-bold tracking-[0.22em] mb-6 font-mono">{displayNum}</p>
        <div>
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">{t('Card Holder')}</p>
          <p className="font-bold text-sm uppercase">{displayName}</p>
        </div>
      </div>
      <div className="absolute right-0 w-[72%] rounded-3xl shadow-xl overflow-hidden bg-gray-200 z-0" style={{top:'45%'}}>
        <div className="bg-gray-800 h-9 w-full mt-5 mb-3"/>
        <div className="px-5 pb-5">
          <div className="bg-white rounded px-3 py-1.5 flex justify-end">
            <span className="font-bold text-gray-700 tracking-widest text-sm">{displayCvc}</span>
          </div>
          <div className="flex justify-between mt-1.5 px-0.5">
            <p className="text-gray-500 text-[10px]">EXP: {displayExp}</p>
            <p className="text-gray-500 text-[10px]">CVC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* â”€â”€â”€ style input rÃ©utilisable â”€â”€â”€ */
const inp =
  'w-full px-4 py-[13px] bg-white rounded-2xl ' +
  'border border-gray-200 ' +
  'focus:outline-none focus:border-[#149484] focus:ring-0 ' +
  'text-gray-800 font-medium text-sm placeholder-gray-400 transition-colors';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CHECKOUT PAGE
ï¿½ï¿½ï¿½â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const {
    cartItems, removeFromCart, clearCart,
    subtotal, totalProducts, shippingCost, promoDiscount, discountedTotal,
    appliedPromo, setAppliedPromo,
    isWishlistOpen, isShopOpen,
    addToShop, openWishlist, openShop, closeSidebars,
  } = useCart();

  const { wishlistItems, isClearing, removeItem, clearAll } = useWishlist();

  const [step, setStep]                   = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showError, setShowError]         = useState(false);
  const [activeIcon, setActiveIcon]       = useState(null);
  const [activeLink, setActiveLink]       = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [form, setForm] = useState({ name:'', surname:'', address:'', city:'', zipCode:'', phone:'' });
  const [card, setCard] = useState({ holder:'', number:'', expiry:'', cvc:'', save:false });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [apiError, setApiError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const fmt = (num) =>
    (typeof num === 'number' ? num : 0)
      .toLocaleString('fr-TN', { minimumFractionDigits:3, maximumFractionDigits:3 }) + ' DT';

  const parsePrice = (p) => {
    if (typeof p === 'number') return p;
    if (!p) return 0;
    return parseFloat(p.toString().replace(',', '.').replace(/[^0-9.]/g, '')) || 0;
  };

  const discountAmount = promoDiscount;
  const grandTotal = discountedTotal;

  const handleApplyPromo = async () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setAppliedPromo(null);
      return;
    }

    setIsApplyingPromo(true);
    try {
      const response = await previewCoupon({ promoCode: code, subtotal });
      setAppliedPromo(response.data || null);
    } catch (error) {
      setAppliedPromo(null);
      setPromoError(error.message || 'Promo code not recognized.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleCloseSidebars = () => {
    closeSidebars(); setActiveIcon(null); setIsMobileMenuOpen(false);
  };

  const handleNext = () => {
    if (!isAuthenticated) {
      navigate('/auth-gateway', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    if (step === 1) { setStep(2); window.scrollTo(0,0); return; }
    if (step === 2) {
      if (!paymentMethod) { setShowError(true); setTimeout(()=>setShowError(false),3000); return; }
      setShowError(false);
      if (paymentMethod === 'cash') {
        syncCartAndCreateOrder('cash');
        return;
      }
      setStep(3);
      window.scrollTo(0,0);
    }
  };

  const syncCartAndCreateOrder = async (selectedMethod) => {
    if (cartItems.length === 0) {
      setApiError('Your cart is empty.');
      return;
    }

    setIsPlacingOrder(true);
    setApiError('');
    try {
      const addressResponse = await createAddress({
        rue: form.address,
        ville: form.city,
        codePostal: form.zipCode,
        telephone: form.phone,
      });
      const addressId = addressResponse.data?._id;

      await clearBackendCart();

      for (const item of cartItems) {
        await addToBackendCart({
          productId: item.id,
          quantity: item.quantity || 1,
        });
      }

      await createOrderFromCart({
        addressId,
        methodePaiement: selectedMethod,
        promoCode: appliedPromo?.code || null,
      });

      setStep(4);
      window.scrollTo(0, 0);
    } catch (error) {
      setApiError(error.message || 'Order creation failed');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full font-['Montserrat'] overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/Sign Up.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay blanc lÃ©ger */}
      <div className="absolute inset-0 bg-white/15 pointer-events-none z-0" />

      {/* Sidebars */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={()=>setIsMobileMenuOpen(false)} />
      <WishlistSidebar
        isOpen={isWishlistOpen} onClose={handleCloseSidebars}
        wishlistItems={wishlistItems} isClearing={isClearing}
        onAddToShop={addToShop} onRemoveItem={removeItem} onClearAll={clearAll}
      />
      <ShopSidebar isOpen={isShopOpen} onClose={handleCloseSidebars} />
      {(isWishlistOpen || isShopOpen || isMobileMenuOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" onClick={handleCloseSidebars}/>
      )}

      {/* Navbar */}
      <div className="relative z-20">
        <MobileHeader
          activeIcon={activeIcon} setActiveIcon={setActiveIcon}
          cartItemsCount={cartItems.length}
          onHeartClick={openWishlist} onCartClick={openShop}
          onMenuClick={()=>setIsMobileMenuOpen(true)}
        />
        <Navbar
          activeIcon={activeIcon} setActiveIcon={setActiveIcon}
          activeLink={activeLink} setActiveLink={setActiveLink}
          cartItemsCount={cartItems.length}
          onHeartClick={openWishlist} onCartClick={openShop}
        />
      </div>

      {/* â•â• SUCCESS POPUP â•â• */}
      {step === 4 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] px-10 py-12 shadow-2xl text-center max-w-sm w-full">
            <img loading="lazy" decoding="async"
              src="/images/logo_SHOT.webp" alt="S.HOT"
              className="h-8 object-contain mx-auto mb-10"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
            />
            <div style={{display:'none'}} className="font-black text-2xl tracking-tighter mb-10">
              S.<span className="text-[#149484]">HOT</span>
            </div>
            <div className="flex items-center justify-center mb-7">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <line x1="4"  y1="34" x2="22" y2="34" stroke="#149484" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="8"  y1="44" x2="22" y2="44" stroke="#149484" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="12" y1="54" x2="22" y2="54" stroke="#149484" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M26 28L42 20L58 28V52L42 60L26 52V28Z" stroke="#149484" strokeWidth="3" strokeLinejoin="round" fill="none"/>
                <line x1="42" y1="20" x2="42" y2="60" stroke="#149484" strokeWidth="2.5"/>
                <path d="M26 28L34 24L42 28" stroke="#149484" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                <path d="M42 28L50 24L58 28" stroke="#149484" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <h2 className="text-[19px] font-extrabold text-gray-900 mb-3">{t('Your S.HOT is on its way !')}</h2>
            <p className="text-gray-500 text-sm font-medium mb-9 leading-relaxed">
              {t('You will receive a confirmation email')}<br/>{t('with your tracking number shortly')}
            </p>
            <button onClick={() => { clearCart(); navigate('/home'); }}
              className="bg-[#149484] text-white font-bold py-4 rounded-[50px] text-base hover:bg-[#0e7568] transition-all shadow-lg w-full">
              {t('Check Mail')}
            </button>
          </div>
        </div>
      )}

      {/* â•â• MAIN â€” pt-[120px] navbar + espace â•â• */}
      <div className={`relative z-10 pt-[120px] pb-20 px-5 md:px-10 lg:px-16 ${step===4 ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* â•â• LEFT â•â• */}
          <div className="flex-[1.4] min-w-0">

            {/* â”€â”€â”€ STEP 1: Shipping â”€â”€â”€ */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-[22px] font-black text-gray-900 mb-6">{t('Shipping Informations')}</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Name')}</label>
                    <input
                      className={inp}
                      placeholder={t('Mark')}
                      autoComplete="given-name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Surname')}</label>
                    <input
                      className={inp}
                      placeholder={t('Nova')}
                      autoComplete="family-name"
                      value={form.surname}
                      onChange={e => setForm({ ...form, surname: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Shipping Adress')}</label>
                  <input
                    className={inp}
                    placeholder={t('Tunisia')}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm mb-2">{t('City')}</label>
                    <input
                      className={inp}
                      placeholder={t('Tunisia')}
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Zip Code')}</label>
                    <input
                      className={inp}
                      placeholder="1000"
                      autoComplete="postal-code"
                      value={form.zipCode}
                      onChange={e => setForm({ ...form, zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Phone Number')}</label>
                  <input
                    className={inp}
                    placeholder="+1 (555) 012-3456"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-[#149484] text-white font-extrabold py-5 rounded-[50px] text-base mt-2 shadow-md hover:bg-[#0e7568] active:scale-[0.98] transition-all"
                >
                  {t('Next')}
                </button>
                <button onClick={() => navigate(-1)} className="block text-gray-600 font-semibold text-sm hover:text-gray-800 pt-1">
                  {t('Back')}
                </button>
              </div>
            )}

            {/* â”€â”€â”€ STEP 2: Payment method â”€â”€â”€ */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Cash */}
                  <div
                    onClick={() => { setPaymentMethod('cash'); setShowError(false); }}
                    className={`bg-white/90 backdrop-blur-sm p-8 rounded-[28px] cursor-pointer border-2 transition-all relative select-none
                      ${paymentMethod==='cash' ? 'border-[#149484]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    {paymentMethod==='cash' && (
                      <div className="absolute top-5 right-5 text-[#149484]"><CheckCircle size={22} strokeWidth={2}/></div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors
                      ${paymentMethod==='cash' ? 'bg-[#149484]' : 'bg-gray-100'}`}>
                      <Truck size={26} className={paymentMethod==='cash' ? 'text-white' : 'text-gray-500'}/>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">{t('Cash on Delivery')}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {t('Pay at your door. Just give the cash to the driver when your S.HOT arrives. No upfront payment needed.')}
                    </p>
                    <div className="border-t border-gray-100 pt-5 text-[#149484] font-bold text-sm">
                      {t('Additional Fees')}: 0.00 DT
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => { setPaymentMethod('card'); setShowError(false); }}
                    className={`bg-white/90 backdrop-blur-sm p-8 rounded-[28px] cursor-pointer border-2 transition-all relative select-none
                      ${paymentMethod==='card' ? 'border-[#149484]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    {paymentMethod==='card' && (
                      <div className="absolute top-5 right-5 text-[#149484]"><CheckCircle size={22} strokeWidth={2}/></div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors
                      ${paymentMethod==='card' ? 'bg-[#149484]' : 'bg-gray-100'}`}>
                      <CreditCard size={26} className={paymentMethod==='card' ? 'text-white' : 'text-gray-500'}/>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">{t('Card Payment')}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {t('Secure payment via Visa, Mastercard, or American Express. Use your saved cards or enter a new one.')}
                    </p>
                    <div className="border-t border-gray-100 pt-5 text-[#149484] font-bold text-sm">
                      {t('Additional Fees')}: 0.00 DT
                    </div>
                  </div>
                </div>

                {showError && (
                  <div className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 border-l-4 border-[#149484] z-50">
                    <div className="bg-[#149484] text-white rounded-full p-1 flex items-center justify-center">
                      <AlertCircle size={16} strokeWidth={3}/>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{t('Please Choose a Payment Method')}</span>
                  </div>
                )}
                {apiError && (
                  <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm font-semibold">
                    {apiError}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep(1)} className="text-gray-600 font-bold text-sm hover:text-gray-800">
                    {t('Previous Step')}
                  </button>
                  <button onClick={handleNext}
                    className="bg-[#149484] text-white px-10 py-4 rounded-[50px] font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-[#0e7568] active:scale-[0.98]">
                    {t('Next')} <ChevronRight size={18} strokeWidth={2.5}/>
                  </button>
                </div>
              </div>
            )}

            {/* â”€â”€â”€ STEP 3: Card details â”€â”€â”€ */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[22px] font-extrabold text-gray-900 mb-1">{t('Add New Card')}</h2>
                  <p className="text-gray-400 font-medium text-sm">{t('Enter your card details for payments.')}</p>
                </div>

                <div className="flex flex-col xl:flex-row gap-12 items-start">
                  <div className="flex-1 w-full space-y-5">

                    <div>
                      <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Cardholder Name')}</label>
                      <input
                        className={inp + ' uppercase tracking-wide'}
                        placeholder="MARK NOVA"
                        autoComplete="cc-name"
                        value={card.holder}
                        onChange={e => setCard({ ...card, holder: e.target.value })}
                      />
                      <p className="text-xs text-gray-400 mt-1">{t('Exactly as it appears on the front of your card.')}</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Card Number')}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <CreditCard size={15} strokeWidth={2}/>
                        </span>
                        <input
                          className={inp + ' pl-10 tracking-widest'}
                          placeholder="0000 0000 0000 0000"
                          autoComplete="cc-number"
                          maxLength={19}
                          value={card.number}
                          onChange={e => setCard({ ...card, number: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-gray-700 font-semibold text-sm mb-2">{t('Expiry Date')}</label>
                        <input
                          className={inp + ' text-center'}
                          placeholder="MM / YY"
                          autoComplete="cc-exp"
                          value={card.expiry}
                          onChange={e => setCard({ ...card, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold text-sm mb-2">CVC</label>
                        <input
                          type="password"
                          className={inp + ' text-center tracking-widest'}
                          placeholder="â€¢â€¢â€¢"
                          autoComplete="cc-csc"
                          maxLength={3}
                          value={card.cvc}
                          onChange={e => setCard({ ...card, cvc: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-1">
                      <input
                        type="checkbox" id="saveCard"
                        checked={card.save}
                        onChange={e => setCard({ ...card, save: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-[#149484] focus:ring-[#149484] cursor-pointer"
                      />
                      <label htmlFor="saveCard" className="font-medium text-gray-600 text-sm cursor-pointer">
                        {t('Save this card for future payments')}
                      </label>
                    </div>

                    <button
                      onClick={() => syncCartAndCreateOrder('card')}
                      className="w-full bg-[#149484] text-white font-extrabold py-5 rounded-[50px] text-base shadow-md hover:bg-[#0e7568] active:scale-[0.98] transition-all"
                    >
                      {isPlacingOrder ? 'Placing order...' : t('Order')}
                    </button>
                    <button onClick={() => setStep(2)} className="block text-gray-600 font-bold text-sm hover:text-gray-800">
                      {t('Previous Step')}
                    </button>
                  </div>

                  {/* Card mockup */}
                  <div className="shrink-0 mx-auto xl:mx-0 w-full max-w-[420px]">
                    <img loading="lazy" decoding="async"
                      src="/images/card-mockup.webp"
                      alt="Card diagram"
                      className="w-full h-auto object-contain drop-shadow-xl"
                      onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                    />
                    <div style={{display:'none'}}>
                      <CardIllustration holder={card.holder} number={card.number} expiry={card.expiry} cvc={card.cvc}/>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* â•â• RIGHT: Summary â•â• */}
          {step < 3 && (
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-[32px] p-8 shadow-sm">

                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-300">
                    <ShoppingBag size={52} className="mb-4 opacity-30"/>
                    <p className="font-medium text-sm">{t('Your cart is empty')}</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    {cartItems.map((item, idx) => (
                      <div key={item.id}>
                        <div className="flex items-center gap-4 py-4">
                          <div className="w-[52px] h-[52px] bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                            <img loading="lazy" decoding="async" src={item.img||'/images/p1.webp'} alt={item.name}
                              className="w-full h-full object-contain rounded-xl"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-gray-900 text-sm truncate">{item.name}</p>
                            <p className="text-[#149484] font-black text-sm mt-0.5">
                              {fmt(parsePrice(item.price) * (item.quantity||1))}
                            </p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                        {idx < cartItems.length - 1 && <div className="border-t border-gray-100"/>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-[#149484] rounded-[24px] p-7 text-white relative overflow-hidden">
                  <h3 className="text-base font-extrabold mb-5 relative z-10">{t('Summary')}</h3>
                  <div className="space-y-2.5 text-sm opacity-90 mb-6 relative z-10 font-medium">
                    <div className="flex justify-between"><span>{t('Subtotal')}</span><span className="font-bold">{fmt(subtotal)}</span></div>
                    <div className="flex justify-between"><span>{t('Total Products')}</span><span className="font-bold">{totalProducts}</span></div>
                    <div className="flex justify-between"><span>{t('Delivery Fees')}</span><span className="font-bold">{fmt(shippingCost)}</span></div>
                    {appliedPromo && (
                      <div className="flex justify-between text-emerald-100"><span>{t('Promo Discount')} ({appliedPromo.code})</span><span className="font-bold">- {fmt(discountAmount)}</span></div>
                    )}
                  </div>
                  <div className="relative z-10 mb-5">
                    <label className="block text-white/90 text-xs font-semibold mb-2">{t('Promo Code')}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="SHOT10"
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo}
                        className="bg-white text-[#149484] font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-100"
                      >
                        {isApplyingPromo ? t('Applying...') : t('Apply')}
                      </button>
                    </div>
                    {promoError && <p className="text-red-100 text-xs mt-2">{promoError}</p>}
                  </div>
                  <div className="border-t border-white/20 pt-5 flex justify-between items-end relative z-10">
                    <span className="text-lg font-extrabold">{t('Total')}</span>
                    <span className="text-4xl font-black tracking-tight">{fmt(grandTotal)}</span>
                  </div>
                  <div className="absolute bottom-[-30px] left-[-20px] w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none"/>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;