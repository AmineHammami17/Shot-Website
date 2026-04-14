import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Navbar          from '../components/Navbar';
import MobileHeader    from '../components/MobileHeader';
import MobileMenu      from '../components/MobileMenu';
import WishlistSidebar from '../components/WishlistSidebar';
import ShopSidebar     from '../components/ShopSidebar';
import Footer          from '../components/Footer';
import Newsletter      from '../components/Newsletter';
import Modal           from '../components/Modal';
import ProductGrid     from '../components/ProductGrid';
import { useWishlist } from '../context/WishlistContext';
import { useCart }     from '../context/CartContext';
import { getProductById, getProducts } from '../services/productService';
import { addProductReview, getProductReviews } from '../services/reviewService';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { wishlistItems, isClearing, toggleWishlist, removeItem, clearAll, isInWishlist } = useWishlist();

  const {
    cartItems,
    isWishlistOpen,
    isShopOpen,
    addToCart,
    addToShop,
    openWishlist,
    openShop,
    closeSidebars,
  } = useCart();

  const [activeIcon, setActiveIcon] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', review: '', rating: 0 });
  const [product, setProduct] = useState(null);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProduct(true);
      setLoadError('');

      try {
        const [selectedProduct, allCatalogProducts] = await Promise.all([
          getProductById(productId),
          getProducts({ sort: '-createdAt' }),
        ]);

        const reviews = await getProductReviews(productId);

        setProduct(selectedProduct);
        setCustomerReviews(reviews);
        setRecommendedProducts(
          allCatalogProducts.filter((p) => p.id !== selectedProduct.id).slice(0, 3),
        );
      } catch (error) {
        setLoadError(error.message || 'Unable to load product');
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchData();
  }, [productId]);

  const getTotalPrice = () => (product.priceNum * quantity).toLocaleString('en-US');
  const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-700">Loading product...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{loadError}</h2>
          <Link to="/products" className="text-[#238d7b] hover:underline">{t('back_products')}</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('product_not_found')}</h2>
          <Link to="/products" className="text-[#238d7b] hover:underline">{t('back_products')}</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    openShop();
  };

  const handleCloseSidebars = () => {
    closeSidebars();
    setActiveIcon(null);
    setIsMobileMenuOpen(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!reviewForm.rating) {
      setReviewError('Please choose a rating before submitting.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addProductReview(product.id, {
        rating: reviewForm.rating,
        comment: reviewForm.review,
      });

      const refreshed = await getProductReviews(product.id);
      setCustomerReviews(refreshed);
      setReviewSuccess('Thanks! Your review has been added.');
      setShowReviewModal(false);
      setReviewForm({ name: '', email: '', review: '', rating: 0 });
    } catch (error) {
      setReviewError(error.message || 'Unable to add your review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const totalReviewsCount = customerReviews.length || product.totalReviews;
  const averageRating = customerReviews.length
    ? customerReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / customerReviews.length
    : Number(product.overallRating || 0);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (<svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f39c12" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>))}
        {hasHalf && (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
        {Array.from({ length: 5 - fullStars - (hasHalf ? 1 : 0) }, (_, i) => (<svg key={i + fullStars} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>))}
      </>
    );
  };

  return (
    <div className="relative min-h-screen w-full font-['Montserrat'] overflow-x-hidden" style={{ backgroundImage: "url('/images/Sign Up.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        * { font-family:'Montserrat',sans-serif; }
        .product-hero { max-width:1200px; margin:0 auto; padding:30px 35px 35px; display:grid; grid-template-columns: 1.15fr 1fr; gap:35px; align-items:center; }
        .product-images { display:flex; gap:14px; }
        .thumbnails { display:flex; flex-direction:column; gap:11px; }
        .thumbnail { width:80px; height:80px; border-radius:14px; cursor:pointer; overflow:hidden; border:3px solid rgba(255,255,255,0.7); transition:all .3s ease; background:rgba(255,255,255,0.8); box-shadow:0 4px 12px rgba(0,0,0,0.14); }
        .thumbnail:hover, .thumbnail.active { border-color:#238d7b; box-shadow:0 5px 15px rgba(0,0,0,0.2); transform:scale(1.06); }
        .thumbnail img { width:100%; height:100%; object-fit:cover; }
        .main-image-wrapper { background:rgba(255,255,255,0.88); border-radius:24px; padding:24px; box-shadow:0 14px 45px rgba(0,0,0,0.2); }
        .main-image { position:relative; background:transparent; border-radius:20px; overflow:hidden; display:flex; align-items:center; justify-content:center; width:100%; height:480px; }
        .main-image img { width:100%; height:100%; object-fit:contain; }
        .product-info h1 { font-size:30px; font-weight:700; color:#1a1a1a; margin-bottom:11px; line-height:1.3; letter-spacing:-0.3px; }
        .rating-section { display:flex; align-items:center; gap:12px; margin-bottom:17px; }
        .rating-stars { display:flex; gap:3px; }
        .rating-text { color:#2d2d2d; font-size:13px; font-weight:600; }
        .price-section { font-size:28px; font-weight:800; color:#238d7b; margin-bottom:17px; letter-spacing:-0.5px; }
        .description-text { color:#404040; line-height:1.6; margin-bottom:19px; font-size:13px; font-weight:500; }
        .key-features { background:transparent; padding:0; border-radius:0; margin-bottom:22px; }
        .key-features h3 { font-weight:700; color:#1a1a1a; margin-bottom:10px; font-size:14px; }
        .key-features ul { list-style:none; padding:0; margin:0; }
        .key-features li { padding:6px 0; color:#404040; font-size:13px; font-weight:500; line-height:1.5; }
        .key-features li:before { content:'â€¢ '; color:#238d7b; font-weight:bold; margin-right:8px; font-size:15px; }
        .cart-box { background:#238d7b; color:white; padding:22px; border-radius:18px; box-shadow:0 10px 32px rgba(35,141,123,0.3); }
        .cart-box-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .cart-box-title { font-weight:700; font-size:15px; }
        .quantity-controls { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.14); padding:8px 12px; border-radius:50px; }
        .quantity-btn { background:rgba(255,255,255,0.2); border:none; cursor:pointer; color:white; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all .3s ease; font-size:14px; font-weight:700; }
        .quantity-btn:hover { background:rgba(255,255,255,0.3); }
        .quantity-input { width:38px; text-align:center; border:none; background:transparent; font-weight:700; font-size:15px; color:white; }
        .price-display { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; gap:14px; }
        .price-label { font-weight:600; font-size:13px; }
        .price-value { font-size:28px; font-weight:800; }
        .add-to-cart-btn { width:100%; padding:14px; background:white; color:#238d7b; border:none; border-radius:50px; font-weight:700; font-size:15px; cursor:pointer; transition:all .3s ease; box-shadow:0 5px 14px rgba(0,0,0,0.12); }
        .add-to-cart-btn:hover { background:#f5f5f5; transform:translateY(-1px); box-shadow:0 6px 16px rgba(0,0,0,0.14); }
        .tabs-section { max-width:1200px; margin:30px auto; padding:32px; background:rgba(255,255,255,0.42); border-radius:18px; }
        .tabs { display:flex; gap:30px; border-bottom:2px solid #238d7b; margin-bottom:28px; padding-bottom:0; }
        .tab { padding:14px 0; font-weight:600; color:#2d2d2d; cursor:pointer; border-bottom:3px solid transparent; transition:all .3s ease; font-size:14px; margin-bottom:-2px; }
        .tab.active { color:#238d7b; border-bottom-color:#238d7b; font-weight:700; }
        .tab-content { margin-bottom:22px; }
        .tab-content p { color:#404040; line-height:1.7; font-size:13px; font-weight:500; }
        .tab-content h2 { color:#1a1a1a; font-weight:700; margin-bottom:14px; font-size:17px; }
        .nutritional-table { width:100%; }
        .nutritional-table tr { border-bottom:1px solid rgba(0,0,0,0.08); }
        .nutritional-table td { padding:12px 0; font-size:13px; color:#404040; font-weight:500; }
        .nutritional-table td:first-child { color:#238d7b; font-weight:700; }
        .reviews-section { background:transparent; border-radius:0; padding:0; margin-bottom:22px; }
        .overall-rating { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid rgba(0,0,0,0.08); }
        .rating-box { display:flex; align-items:center; gap:14px; }
        .rating-number { font-size:40px; font-weight:800; color:#1a1a1a; }
        .rating-info-text { font-size:13px; color:#2d2d2d; font-weight:600; }
        .add-review-btn { background:#238d7b; color:white; padding:10px 24px; border:none; border-radius:50px; font-weight:700; cursor:pointer; font-size:13px; box-shadow:0 4px 12px rgba(35,141,123,0.28); transition:all .3s ease; }
        .add-review-btn:hover { background:#1a6e60; transform:translateY(-1px); }
        .reviews-title { font-size:15px; font-weight:700; color:#1a1a1a; margin-bottom:19px; padding-bottom:14px; border-bottom:1px solid rgba(0,0,0,0.08); }
        .customer-reviews { display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-top:19px; }
        .review-card { background:#238d7b; color:white; border-radius:14px; padding:18px; box-shadow:0 5px 14px rgba(35,141,123,0.22); transition:all .3s ease; }
        .review-card:hover { transform:translateY(-2px); }
        .review-header { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
        .review-avatar { width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.27); display:flex; align-items:center; justify-center; font-weight:700; font-size:14px; }
        .review-name { font-weight:700; font-size:13px; }
        .review-date { font-size:11px; opacity:0.85; }
        .review-stars { display:flex; gap:2px; margin-bottom:10px; }
        .review-text { font-size:12px; line-height:1.5; font-style:italic; font-weight:500; }
        .recommended-section { max-width:1200px; margin:35px auto; padding:32px; }
        .recommended-title { font-size:30px; font-weight:800; color:#238d7b; text-align:center; margin-bottom:10px; letter-spacing:-0.3px; }
        .recommended-subtitle { text-align:center; color:#404040; margin-bottom:32px; font-size:13px; font-weight:500; }
        .stay-ahead-container { background-image: url('/images/Sign Up.webp'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; position: relative; padding: 40px 40px; margin-top: 40px; }
        .stay-ahead-overlay { position: absolute; inset: 0; background: transparent; }
        .stay-ahead-content { position: relative; z-index: 10; text-align: center; }
        .stay-ahead-title { font-size: clamp(24px, 5vw, 48px); font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; color: #0d4a3e; }
        .review-modal { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:500; }
        .review-modal-content { background:white; border-radius:20px; padding:35px; max-width:420px; width:100%; position:relative; box-shadow:0 22px 65px rgba(0,0,0,0.32); }
        .review-modal-header { text-align:center; margin-bottom:28px; }
        .review-modal-icon { width:60px; height:60px; border-radius:50%; background:#238d7b; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 12px rgba(35,141,123,0.28); }
        .review-modal-title { font-size:22px; font-weight:700; color:#1a1a1a; margin-bottom:8px; }
        .review-modal-subtitle { font-size:13px; color:#404040; font-weight:500; }
        .review-stars-input { display:flex; gap:8px; justify-center:center; margin-bottom:24px; }
        .star-btn { background:none; border:none; cursor:pointer; transition:transform .2s ease; }
        .star-btn:hover { transform:scale(1.12); }
        .form-group { margin-bottom:16px; }
        .form-group label { display:block; font-weight:600; color:#1a1a1a; margin-bottom:8px; font-size:13px; }
        .form-group input, .form-group textarea { width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:8px; font-size:13px; font-family:'Montserrat', sans-serif; transition:all .3s ease; color:#1a1a1a; }
        .form-group textarea { resize:vertical; min-height:100px; }
        .form-group input:focus, .form-group textarea:focus { outline:none; border-color:#238d7b; box-shadow:0 0 0 3px rgba(35,141,123,0.12); }
        .submit-review-btn { width:100%; background:#238d7b; color:white; padding:12px; border:none; border-radius:50px; font-weight:700; font-size:14px; cursor:pointer; transition:all .3s ease; box-shadow:0 4px 12px rgba(35,141,123,0.28); }
        .submit-review-btn:hover { background:#1a6e60; transform:translateY(-1px); }
        .close-modal-btn { position:absolute; top:20px; right:20px; background:none; border:none; color:#999; cursor:pointer; font-size:24px; transition:color .2s ease; }
        .close-modal-btn:hover { color:#1a1a1a; }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @media (max-width: 768px) {
          .product-hero { grid-template-columns: 1fr; gap: 22px; padding: 18px 18px; align-items: start; }
          .main-image { height: 320px; }
          .customer-reviews { grid-template-columns: 1fr; }
          .tabs-section { padding: 24px; }
          .recommended-section { padding: 24px; }
          .stay-ahead-container { margin-top: 30px; padding: 30px 20px; }
        }
      `}</style>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={handleCloseSidebars} wishlistItems={wishlistItems} isClearing={isClearing} onAddToShop={addToShop} onRemoveItem={removeItem} onClearAll={clearAll} />
      <ShopSidebar isOpen={isShopOpen} onClose={handleCloseSidebars} cartItems={cartItems} />

      {(isWishlistOpen || isShopOpen || isMobileMenuOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity" onClick={handleCloseSidebars} />
      )}

      <MobileHeader activeIcon={activeIcon} setActiveIcon={setActiveIcon} cartItemsCount={cartItems.length} onHeartClick={openWishlist} onCartClick={openShop} onMenuClick={() => setIsMobileMenuOpen(true)} />
      <Navbar activeIcon={activeIcon} setActiveIcon={setActiveIcon} activeLink={activeLink} setActiveLink={setActiveLink} cartItemsCount={cartItems.length} onHeartClick={openWishlist} onCartClick={openShop} />

      <div className="pt-24 pb-16">
        <div className="product-hero">
          <div className="product-images">
            <div className="thumbnails">
              {product.images.map((img, idx) => (<div key={idx} className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`} onClick={() => setCurrentImageIndex(idx)}><img loading="lazy" decoding="async" src={img} alt={`${product.name} ${idx + 1}`} /></div>))}
            </div>
            <div className="main-image-wrapper"><div className="main-image"><img loading="lazy" decoding="async" src={product.images[currentImageIndex]} alt={product.name} /></div></div>
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="rating-section"><div className="rating-stars">{renderStars(averageRating)}</div><span className="rating-text">{averageRating.toFixed(1)} ({totalReviewsCount} {t('reviews_count')})</span></div>
            <div className="price-section">{product.price}</div>
            <p className="description-text">{product.description}</p>
            <div className="key-features"><h3>{t('key_features')}</h3><ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
            <div className="cart-box">
              <div className="cart-box-header">
                <span className="cart-box-title">{product.name}</span>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>âˆ’</button>
                  <input type="text" className="quantity-input" value={quantity} readOnly />
                  <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              <div className="price-display"><span className="price-label">{t('total_price')}</span><span className="price-value">{formatPrice(getTotalPrice())} DT</span></div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>{t('add_to_cart')}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12">
        <div className="tabs-section">
          <div className="tabs">
            {[{ key: 'description', label: t('tab_desc') },{ key: 'nutritional', label: t('tab_nutri') },{ key: 'reviews', label: t('tab_reviews') }].map(({ key, label }) => (
              <button key={key} className={`tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
            ))}
          </div>
          {activeTab === 'description' && (<div className="tab-content"><h2>{t('prod_desc_title')}</h2><p>{product.fullDescription}</p></div>)}
          {activeTab === 'nutritional' && (
            <div className="tab-content">
              <h2>{t('nutri_info_title')}</h2>
              {product.nutritionalInfo.length > 0 ? (
                <table className="nutritional-table">
                  <tbody>{product.nutritionalInfo.map((info, idx) => <tr key={idx}><td>{info.label}</td><td>{info.value}</td></tr>)}</tbody>
                </table>
              ) : (
                <p>No nutritional data available.</p>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="tab-content">
              <div className="reviews-section">
                <div className="overall-rating">
                  <div className="rating-box"><div className="rating-number">{averageRating.toFixed(1)}</div><div className="rating-info"><div className="rating-stars">{renderStars(averageRating)}</div><div className="rating-info-text">{totalReviewsCount} {t('reviews_count')}</div></div></div>
                  <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>{t('write_review_btn')}</button>
                </div>
                <h3 className="reviews-title">{t('customer_reviews_title')}</h3>
                {customerReviews.length > 0 ? (
                  <div className="customer-reviews">
                    {customerReviews.map((review, idx) => (
                      <div key={idx} className="review-card">
                        <div className="review-header"><div className="review-avatar">{review.name.charAt(0)}</div><div><div className="review-name">{review.name}</div><div className="review-date">{review.date}</div></div></div>
                        <div className="review-stars">{renderStars(review.rating)}</div>
                        <p className="review-text">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No customer reviews yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* âœ… PRODUITS RECOMMANDÃ‰S */}
      {recommendedProducts.length > 0 && (
        <div className="px-4 md:px-12">
          <div className="recommended-section">
            <h2 className="recommended-title">{t('reco_title')}</h2>
            <p className="recommended-subtitle">{t('reco_subtitle')}</p>

            <ProductGrid
              products={recommendedProducts}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
              openProductDetails={(prod) => {
                setQuantity(1);
                setActiveTab('description');
                navigate(`/product/${prod.id}`);
                window.scrollTo(0, 0);
              }}
              addToShop={(prod) => {
                addToCart(prod);
                openShop();
              }}
            />
          </div>
        </div>
      )}

      <div className="stay-ahead-container"><div className="stay-ahead-overlay"></div><div className="stay-ahead-content max-w-7xl mx-auto px-6 md:px-12"><h2 className="stay-ahead-title">{t('comm_cta')}</h2></div></div>
      <Newsletter onSubscribe={() => setShowSubscribeModal(true)} />
      <Footer />
      <Modal isOpen={showSubscribeModal} onClose={() => setShowSubscribeModal(false)} />

      {showReviewModal && (
        <div className="review-modal" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowReviewModal(false)}>Ã—</button>
            <div className="review-modal-header"><div className="review-modal-icon"><Headphones size={30} /></div><h2 className="review-modal-title">{t('add_review_title')}</h2><p className="review-modal-subtitle">{t('add_rating_sub')}</p></div>
            <form onSubmit={handleSubmitReview}>
              <div className="review-stars-input">
                {[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" className="star-btn" onClick={() => setReviewForm({ ...reviewForm, rating: star })}><Star size={32} fill={star <= reviewForm.rating ? '#f39c12' : 'none'} stroke={star <= reviewForm.rating ? '#f39c12' : '#ddd'} /></button>))}
              </div>
              {reviewError && <p className="text-red-600 text-sm mb-3">{reviewError}</p>}
              {reviewSuccess && <p className="text-emerald-700 text-sm mb-3">{reviewSuccess}</p>}
              <div className="form-group"><label htmlFor="name">{t('form_name')}</label><input type="text" id="name" placeholder="Mark" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} /></div>
              <div className="form-group"><label htmlFor="email">{t('form_email')}</label><input type="email" id="email" placeholder="mark1890@gmail.com" value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} /></div>
              <div className="form-group"><label htmlFor="review">{t('form_review')}</label><textarea id="review" placeholder="Write here..." value={reviewForm.review} onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })} required /></div>
              <button type="submit" className="submit-review-btn" disabled={isSubmittingReview}>{isSubmittingReview ? 'Submitting...' : t('form_submit')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;