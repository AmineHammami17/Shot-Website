import { X, ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WishlistSidebar = ({ 
  isOpen, 
  onClose, 
  wishlistItems = [], 
  isClearing = false,
  onAddToShop,
  onRemoveItem,
  onClearAll 
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[200] shadow-[-10px_0_30px_rgba(0,0,0,0.2)]"
      style={{ transform: 'translateX(0)' }}
    >
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#0f1a18]">{t('wishlist_title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {wishlistItems.length > 0 ? wishlistItems.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between border-b border-gray-100 pb-6 transition-all duration-500 ${isClearing ? 'opacity-0 scale-95' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100">
                  <img loading="lazy" decoding="async" src={item.img} alt={item.name} className="max-h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0f1a18]">{item.name}</h4>
                  <p className="text-[#238d7b] font-bold">{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onAddToShop && onAddToShop(item)} 
                  className="w-10 h-10 bg-gray-50 text-[#238d7b] rounded-full flex items-center justify-center transition-all hover:bg-[#238d7b] hover:text-white"
                >
                  <ShoppingCart size={18} />
                </button>
                <button 
                  onClick={() => onRemoveItem && onRemoveItem(item.id)} 
                  className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center transition-all text-red-500 hover:scale-110"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          )) : (
            <p className="text-center text-gray-400 mt-10">{t('wishlist_empty')}</p>
          )}
        </div>
        <button 
          onClick={onClearAll} 
          disabled={wishlistItems.length === 0}
          className={`w-full py-3.5 rounded-full font-bold mt-6 flex items-center justify-center gap-3 transition-all active:scale-95 border-2 ${wishlistItems.length === 0 ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-[#333] border-[#238d7b] hover:bg-gray-50'}`}
        >
          {t('wishlist_clear')} {isClearing && <Trash2 size={20} className="text-[#238d7b] animate-bounce" />}
        </button>
      </div>
    </div>
  );
};

export default WishlistSidebar;