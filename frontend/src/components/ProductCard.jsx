import React from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ 
  product, 
  isHovered, 
  isInWishlist, 
  onMouseEnter, 
  onMouseLeave, 
  onToggleWishlist, 
  onOpenDetails, 
  onAddToCart 
}) => {
  const { t } = useTranslation();
  const productName = product.nameKey ? t(product.nameKey) : product.name;
  const productDescription = product.descriptionKey ? t(product.descriptionKey) : product.description;

  return (
    <div 
      className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl border border-gray-100 relative flex flex-col h-full w-full max-w-[350px]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* --- SECTION IMAGE --- */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 cursor-pointer">

        {/* Badge ✅ */}
        {product.badgeKey && (
          <span 
            className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: product.badgeColor }}
          >
            {t(product.badgeKey)}
          </span>
        )}

        {/* Wishlist Heart */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={18} fill={isInWishlist ? "#ef4444" : "none"} className={isInWishlist ? "text-red-500" : "text-gray-400"} />
        </button>

        {/* L'IMAGE */}
        <img loading="lazy" decoding="async" 
          src={product.img} 
          alt={productName}
          onClick={onOpenDetails}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* PANIER AU SURVOL */}
        {isHovered && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300"
            onClick={onOpenDetails}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                onAddToCart(product); 
              }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-100 hover:scale-110 transition-transform duration-200"
            >
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#238d7b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* --- INFOS PRODUIT --- */}
      <div className="flex flex-col flex-grow space-y-2">

        {/* TITRE ✅ */}
        <h3 
          onClick={onOpenDetails}
          className="font-bold text-gray-900 text-lg cursor-pointer hover:text-[#238d7b] transition-colors"
        >
          {productName}
        </h3>
        
        {/* DESCRIPTION ✅ */}
        <p className="text-sm text-gray-500 line-clamp-2 h-10">
          {productDescription}
        </p>
        
        <div className="pt-2 flex items-center justify-between mt-auto">
          <span className="text-[#238d7b] font-black text-xl">{product.price}</span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(); 
            }}
            className="bg-[#f39c12] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#e67e22] transition-colors shadow-sm"
          >
            {t('btn_shop')}
          </button>
        </div>

        {/* Ratings */}
        <div className="flex text-yellow-400 text-xs mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < product.rating ? "opacity-100" : "opacity-30"}>⭐</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;