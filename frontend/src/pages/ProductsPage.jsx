import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

// Components
import Navbar from '../components/Navbar';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import WishlistSidebar from '../components/WishlistSidebar';
import ShopSidebar from '../components/ShopSidebar';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SubscribeModal from '../components/SubscribeModal';

const ProductsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    wishlistItems,
    isClearing,
    toggleWishlist,
    isInWishlist,
    removeItem,
    clearAll,
  } = useWishlist();

  const {
    cartItems,
    isWishlistOpen,
    isShopOpen,
    addToCart,
    openWishlist,
    openShop,
    closeSidebars,
  } = useCart();

  const [activeIcon, setActiveIcon] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 150]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProducts(true);
      setLoadError('');
      try {
        const [items, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(items);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setLoadError(error.message || 'Failed to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchValue
      || product.name.toLowerCase().includes(searchValue)
      || product.description.toLowerCase().includes(searchValue);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.priceNum >= priceRange[0] && product.priceNum <= priceRange[1];
    const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(product.rating);
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'price') return a.priceNum - b.priceNum;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return 0;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  const handleCloseSidebars = () => {
    closeSidebars();
    setActiveIcon(null);
    setIsMobileMenuOpen(false);
  };

  const addToShop = (item) => {
    addToCart(item);
    openShop();
  };

  const toggleCategory = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const toggleRating = (rating) => setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);

  return (
    <div className="relative min-h-screen w-full font-['Montserrat'] overflow-x-hidden">

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={handleCloseSidebars}
        wishlistItems={wishlistItems}
        isClearing={isClearing}
        onAddToShop={addToShop}
        onRemoveItem={removeItem}
        onClearAll={clearAll}
      />
      <ShopSidebar isOpen={isShopOpen} onClose={handleCloseSidebars} cartItems={cartItems} />

      {(isWishlistOpen || isShopOpen || isMobileMenuOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity" onClick={handleCloseSidebars} />
      )}

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

      {/* HERO */}
      <div className="pt-32 pb-16 px-6 md:px-12 signup-bg">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-[32px] md:text-[48px] font-black text-[#0d4a3e] mb-4 leading-tight">{t('all_products_title')}</h1>
          <p className="text-gray-600 text-base md:text-[17px] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {t('all_products_desc')}
          </p>
          <div className="max-w-xl mx-auto flex items-center gap-2">
            <button className="bg-transparent border-none text-[#238d7b] cursor-pointer p-2 text-xl hover:scale-110 transition-transform" onClick={() => setShowFilters(true)}>▤</button>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-5 py-3.5 border-none rounded-full text-sm outline-none bg-white shadow-sm focus:shadow-md transition-shadow"
              />
              <button className="w-12 h-12 rounded-full bg-[#238d7b] border-none cursor-pointer flex items-center justify-center text-white hover:bg-[#1a6e60] transition-colors flex-shrink-0"><Search size={20} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS MODAL */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-5" onClick={() => setShowFilters(false)}>
          <div className="bg-white rounded-3xl p-10 max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('filter_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-12 mb-10 pb-10 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#238d7b] mb-4">{t('filter_categories')}</h3>
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(cat.name)} onChange={() => toggleCategory(cat.name)} className="w-5 h-5 accent-[#238d7b]" />
                    <span className="font-medium text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
              <div className="md:pr-10">
                <h3 className="text-base font-bold text-[#238d7b] mb-4">{t('filter_price')}</h3>
                <div className="flex justify-between text-sm text-gray-500 mb-3 font-semibold"><span>1 DT</span><span>150 DT</span></div>
                <div className="flex gap-4 mb-5">
                  <input type="range" min="1" max="150" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} className="flex-1 accent-[#238d7b]" />
                  <input type="range" min="1" max="150" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="flex-1 accent-[#238d7b]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">{t('min')}</label><input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 1, priceRange[1]])} className="w-full p-2.5 border border-gray-200 rounded-lg text-center font-semibold text-[#238d7b]" /></div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">{t('max')}</label><input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 150])} className="w-full p-2.5 border border-gray-200 rounded-lg text-center font-semibold text-[#238d7b]" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#238d7b] mb-4">{t('filter_ratings')}</h3>
                {[1, 2, 3, 4, 5].map(rating => (
                  <label key={rating} className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" checked={selectedRatings.includes(rating)} onChange={() => toggleRating(rating)} className="w-5 h-5 accent-[#238d7b] flex-shrink-0" />
                    <span className="whitespace-nowrap">{Array.from({ length: rating }).map((_, i) => <span key={i}>⭐</span>)}</span>
                  </label>
                ))}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#238d7b] mb-4">{t('filter_sort')}</h3>
                {[
                  { key: 'name', label: t('sort_name') },
                  { key: 'price', label: t('sort_price') },
                  { key: 'rating', label: t('sort_rating') },
                  { key: 'newest', label: t('sort_newest') }
                ].map(option => (
                  <label key={option.key} className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input type="radio" name="sort" value={option.key} checked={sortBy === option.key} onChange={(e) => setSortBy(e.target.value)} className="w-5 h-5 accent-[#238d7b]" />
                    <span className="font-medium text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full bg-[#238d7b] text-white py-4 rounded-full font-bold text-base hover:bg-[#1a6e60] transition-colors" onClick={() => setShowFilters(false)}>{t('btn_search')}</button>
          </div>
        </div>
      )}

      {/* PRODUCTS SECTION */}
      <div className="pb-28 px-6 md:px-12 signup-bg">
        <div className="max-w-7xl mx-auto">
          {isLoadingProducts ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg font-medium">Loading products...</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg font-semibold">{loadError}</p>
              <p className="text-gray-600 text-sm mt-2">
                {import.meta.env.DEV ? 'Tip: make sure backend is running on localhost:5000' : 'Tip: make sure `/api` is reachable'}
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
              openProductDetails={openProductDetails}
              addToShop={addToShop}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg font-medium">{t('no_products')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="stay-ahead-container">
        <div className="stay-ahead-overlay"></div>
        <div className="stay-ahead-content max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="stay-ahead-title">{t('comm_cta')}</h2>
        </div>
      </div>

      <Newsletter />
      <Footer />
      <SubscribeModal />
    </div>
  );
};

export default ProductsPage;