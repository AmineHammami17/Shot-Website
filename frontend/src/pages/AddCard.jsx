import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, Bell, ShieldCheck, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const AddCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [holderName, setHolderName] = useState('');
  
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);
  const [errors, setErrors] = useState([]);

  const userAvatar = localStorage.getItem('userAvatar') || null;
  const userName = user?.username || localStorage.getItem('userName') || 'Mark Nova';
  const { openWishlist, openShop } = useCart();

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `;

  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 4) input = input.slice(0, 4);
    if (input.length >= 3) {
      input = `${input.slice(0, 2)} / ${input.slice(2)}`;
    }
    setExpiryDate(input);
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!holderName.trim()) newErrors.push('name');
    if (!cardNumber.replace(/\s/g, '')) newErrors.push('card');
    if (!expiryDate.trim()) newErrors.push('expiry');
    if (!cvc.trim()) newErrors.push('cvc');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 2000);
      return;
    }
    navigate('/profile');
  };

  useEffect(() => {
    // Title should be "Add new card" (no hyphens)
    document.title = 'Add new card';
  }, []);

  return (
    <div 
      className="min-h-screen font-sans text-[#1A1A1A] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/Sign Up.webp')" }}
    >
      <style>{shakeAnimation}</style>
      <Navbar onHeartClick={openWishlist} onCartClick={openShop} />
      
      <main className="container mx-auto px-4 md:px-10 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 items-stretch">
          
          <div className="w-full lg:w-1/4 self-start">
            <div className="bg-white rounded-[2rem] px-8 py-10 shadow-sm border border-gray-100">
              <div className="text-center mb-10">
                {userAvatar ? (
                  <img loading="lazy" decoding="async" src={userAvatar} alt="User" className="w-28 h-28 rounded-full object-cover mx-auto mb-5" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#C4C4C4] mx-auto mb-5 flex items-center justify-center text-2xl text-white font-bold">
                    {userName.charAt(0)}
                  </div>
                )}
                <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-1">{userName}</h2>
                <p className="text-[#757575] text-[14px]">{user?.email || 'utilisateur@email.com'}</p>
              </div>
              <div className="border-t border-[#E0E0E0] mb-8" />
              <h3 className="font-bold text-[#1A1A1A] mb-6 text-[15px]">{t('account_settings')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 py-2 px-3 rounded-xl cursor-pointer group">
                  <CreditCard size={20} className="text-[#129384]" strokeWidth={1.8} />
                  <span className="text-sm font-bold text-[#129384]">{t('payment_card')}</span>
                </div>
                <div className="flex items-center gap-4 py-2 px-3 rounded-xl cursor-default group">
                  <Bell size={20} className="text-[#129384]" strokeWidth={1.8} />
                  <span className="text-sm font-medium text-[#555555] group-hover:text-[#129384] transition-colors">{t('notifications')}</span>
                </div>
                <div className="flex items-center gap-4 py-2 px-3 rounded-xl cursor-default group">
                  <ShieldCheck size={20} className="text-[#129384]" strokeWidth={1.8} />
                  <span className="text-sm font-medium text-[#555555] group-hover:text-[#129384] transition-colors">{t('security_privacy')}</span>
                </div>
                <div className="flex items-center gap-4 py-2 px-3 rounded-xl cursor-default group">
                  <HelpCircle size={20} className="text-[#129384]" strokeWidth={1.8} />
                  <span className="text-sm font-medium text-[#555555] group-hover:text-[#129384] transition-colors">{t('help_support')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/4 pt-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Add new card</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-10 max-w-xl">
              <div className="space-y-2">
                <label className="text-[12px] text-[#1A1A1A] font-bold uppercase tracking-widest">Nom du titulaire</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="MARK NOVA"
                  className={`w-full px-5 py-3.5 bg-white border rounded-2xl outline-none transition-all text-[14px] font-medium 
                    ${errors.includes('name') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                />
                <p className="text-[11px] text-[#757575] italic">Exactement comme il apparaÃ®t sur le devant de la carte.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-[#1A1A1A] font-bold uppercase tracking-widest">NumÃ©ro de carte</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6B2AF]" size={18} />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumber}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full pl-12 pr-5 py-3.5 bg-white border rounded-2xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('card') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] text-[#1A1A1A] font-bold uppercase tracking-widest">Date d'expiration</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM / AA"
                    maxLength="7"
                    className={`w-full px-5 py-3.5 bg-white border rounded-2xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('expiry') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] text-[#1A1A1A] font-bold uppercase tracking-widest">CVC / Code de sÃ©curitÃ©</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={handleCvcChange}
                    placeholder="***"
                    className={`w-full px-5 py-3.5 bg-white border rounded-2xl outline-none transition-all text-[14px] font-medium 
                      ${errors.includes('cvc') ? 'border-red-500 animate-shake ring-2 ring-red-500/10' : 'border-[#E2E8E6] focus:ring-2 focus:ring-[#129384]/20 focus:border-[#129384]'}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="save" className="w-4 h-4 accent-[#129384] cursor-pointer rounded" />
                <label htmlFor="save" className="text-sm text-[#1A1A1A] cursor-pointer font-medium">Enregistrer la carte</label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onMouseEnter={() => setHoverCancel(true)}
                  onMouseLeave={() => setHoverCancel(false)}
                  onClick={() => navigate('/profile')}
                  className="flex-1 py-3.5 border-2 border-[#129384] text-[#129384] rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-1 overflow-hidden"
                >
                  <div className={`w-6 flex items-center transition-all duration-300 ${hoverCancel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <span className="h-5 w-[2px] bg-[#129384] rounded-full mr-0.5 inline-block"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 rotate-180">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-300 ${hoverCancel ? 'translate-x-1' : 'translate-x-0'}`}>{t('btn_cancel')}</span>
                  <div className="w-6 shrink-0" />
                </button>

                <button
                  type="submit"
                  onMouseEnter={() => setHoverSave(true)}
                  onMouseLeave={() => setHoverSave(false)}
                  className="flex-1 py-3.5 bg-[#129384] hover:bg-[#0e7a6d] text-white rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-1 overflow-hidden shadow-lg shadow-[#129384]/25"
                >
                  <div className="w-6 shrink-0" />
                  <span className={`transition-all duration-300 ${hoverSave ? '-translate-x-1' : 'translate-x-0'}`}>{t('btn_save')}</span>
                  <div className={`w-6 flex items-center transition-all duration-300 ${hoverSave ? 'opacity-100 translate-x-0.5' : 'opacity-0 -translate-x-1'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="h-5 w-[2px] bg-white rounded-full ml-0.5 inline-block"></span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddCard;
