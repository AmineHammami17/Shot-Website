import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Moon, Globe, X, Search, Facebook, Instagram, Youtube, Filter, Minus, Plus } from 'lucide-react';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 150]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const allProducts = [
    {
      id: 103,
      name: 'Baby S.HOTs',
      description: 'Premium organic spirulina in easy baby Shots format.',
      fullDescription: 'Get the best of both worlds with our Daily Boost Bundle. This package includes our premium spirulina capsules and powder, giving you flexible options for incorporating this powerful superfood into your daily routine. Perfect for those who want to alternate between quick capsules on busy days and powder for recipes when you have more time.',
      price: '59,000 DT',
      priceNum: 59000,
      badge: 'New',
      badgeColor: '#22c55e',
      stock: 'In Stock (25 available)',
      rating: 4,
      img: '/images/p3.jpg',
      category: 'Shots',
      reviews: 2,
      features: [
        'Easy-to-consume format',
        'Perfect for on-the-go consumption',
        'Pure spirulina concentrate',
        'No additives or fillers'
      ]
    },
    {
      id: 102,
      name: 'Spirulina Diamonds',
      description: 'Premium organic spirulina in easy-to-take tablets. 100g (+200)',
      fullDescription: 'Get the best of both worlds with our Daily Boost Bundle. This package includes our premium spirulina capsules and powder, giving you flexible options for incorporating this powerful superfood into your daily routine. Perfect for those who want to alternate between quick capsules on busy days and powder for recipes when you have more time.',
      price: '59,000 DT',
      priceNum: 59000,
      badge: 'Best Seller',
      badgeColor: '#2563eb',
      stock: 'In Stock (20 available)',
      rating: 5,
      img: '/images/p2.png',
      category: 'Diamonds',
      reviews: 2,
      features: [
        'Includes 1 bottle of capsules and 1 container of powder',
        'Save 10% compared to buying separately',
        'Ideal for varied consumption preferences',
        'Premium quality and purity guaranteed'
      ]
    },
    {
      id: 101,
      name: 'Spirulina Powder',
      description: 'Premium organic spirulina Powder 100g',
      fullDescription: 'Get the best of both worlds with our Daily Boost Bundle. This package includes our premium spirulina capsules and powder, giving you flexible options for incorporating this powerful superfood into your daily routine. Perfect for those who want to alternate between quick capsules on busy days and powder for recipes when you have more time.',
      price: '59,000 DT',
      priceNum: 59000,
      badge: 'Best Seller',
      badgeColor: '#2563eb',
      stock: 'In Stock (50 available)',
      rating: 4,
      img: '/images/p1.png',
      category: 'Powder',
      reviews: 2,
      features: [
        '100% pure spirulina',
        'Easy to mix in drinks',
        '30 servings per container',
        'Rich in chlorophyll and phycocyanin',
        'Cold-pressed to preserve nutrients'
      ]
    },
    {
      id: 104,
      name: 'Spirulina Tablets',
      description: 'Easy-to-take spirulina tablets for daily wellness.',
      fullDescription: 'Get the best of both worlds with our Daily Boost Bundle. This package includes our premium spirulina capsules and powder, giving you flexible options for incorporating this powerful superfood into your daily routine. Perfect for those who want to alternate between quick capsules on busy days and powder for recipes when you have more time.',
      price: '69,000 DT',
      priceNum: 69000,
      badge: 'Popular',
      badgeColor: '#f59e0b',
      stock: 'In Stock (35 available)',
      rating: 4,
      img: '/images/p4.png',
      category: 'Tablets',
      reviews: 2,
      features: [
        '100% pure spirulina powder',
        'Easy to mix in drinks and food',
        '30 servings per container',
        'Rich in chlorophyll and phycocyanin',
        'Cold-pressed to preserve nutrients'
      ]
    },
  ];

  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.priceNum >= priceRange[0] * 1000 && product.priceNum <= priceRange[1] * 1000;
    const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(product.rating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'price') return a.priceNum - b.priceNum;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  const toggleWishlistProduct = (product) => {
    const exists = wishlistItems.find(i => i.id === product.id);
    if (exists) {
      setWishlistItems(prev => prev.filter(i => i.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, { id: product.id, name: product.name, price: product.price, img: product.img }]);
    }
  };

  const isInWishlist = (id) => wishlistItems.some(i => i.id === id);

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  const addProductToCart = () => {
    if (selectedProduct) {
      setCartItems(prev => [...prev, { ...selectedProduct, quantity: productQuantity }]);
      setSelectedProduct(null);
      setIsShopOpen(true);
    }
  };

  const closeSidebars = () => {
    setIsWishlistOpen(false);
    setIsShopOpen(false);
    setActiveIcon(null);
    setSelectedProduct(null);
  };

  const toggleHeart = (id) => setWishlistItems(prev => prev.filter(item => item.id !== id));
  const toggleCategory = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const toggleRating = (rating) => setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);

  const handleSubscribe = () => {
    if (subscribeEmail.trim()) { 
      setShowSubscribeModal(true); 
      setSubscribeEmail(''); 
    }
  };

  const icons = [
    { id: 'moon', icon: Moon },
    { id: 'globe', icon: Globe },
    { id: 'heart', icon: Heart, action: () => { setIsWishlistOpen(true); setIsShopOpen(false); } },
    { id: 'cart', icon: ShoppingCart, action: () => { setIsShopOpen(true); setIsWishlistOpen(false); } },
    { id: 'user', icon: User }
  ];

  const navLinks = ['Home', 'Products', 'About us', 'Contact'];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="17" height="17" viewBox="0 0 24 24"
        fill={i < rating ? "#f39c12" : "none"}
        stroke={i < rating ? "#f39c12" : "#d1d5db"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ));

  return (
    <div className="relative min-h-screen w-full font-['Montserrat'] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

        * { font-family:'Montserrat',sans-serif; }

        .nav-fixed-video { background-color:rgba(45,75,68,.85); height:75px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.1); }
        .nav-link-item { color:white; opacity:.8; font-weight:600; font-size:15px; transition:all .3s ease; cursor:pointer; }
        .nav-link-item:hover { opacity:1; text-shadow:0 0 8px rgba(255,255,255,.5); }
        .icon-box-vid { width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:14px; transition:all .2s ease; color:white; cursor:pointer; position:relative; }
        .icon-box-vid:hover,.icon-box-active { background-color:white !important; color:#238d7b !important; transform:translateY(-2px); }
        .btn-signup-vid { background-color:white; color:#238d7b; font-weight:700; font-size:14px; height:42px; padding:0 25px; border-radius:50px; border:2px solid white; transition:all .3s ease; cursor:pointer; }
        .btn-signup-vid:hover { background-color:#238d7b; color:white !important; border-color:#238d7b; transform:scale(1.05); }

        .prod-card { background:white; border:1px solid #eef0f0; border-radius:20px; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,.07); transition:transform .3s ease,box-shadow .3s ease; display:flex; flex-direction:column; position:relative; }
        .prod-card:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(0,0,0,.13); }
        .prod-img-wrap { position:relative; width:100%; height:300px; background:#f7f9f8; overflow:hidden; flex-shrink:0; }
        .prod-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
        .prod-card:hover .prod-img-wrap img { transform:scale(1.04); }
        .prod-badge { position:absolute; top:14px; left:14px; z-index:3; color:white; font-weight:700; font-size:12px; padding:5px 14px; border-radius:50px; pointer-events:none; }
        .prod-heart { position:absolute; top:12px; right:12px; z-index:3; width:48px; height:48px; border-radius:50%; background:white; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,.15); transition:transform .2s ease,background .2s ease; }
        .prod-heart:hover { transform:scale(1.12); }
        .prod-heart svg { width:26px; height:26px; }
        .prod-cart-overlay { position:absolute; inset:0; z-index:2; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .25s ease; background:rgba(0,0,0,.04); }
        .prod-card:hover .prod-cart-overlay { opacity:1; }
        .prod-cart-btn { width:54px; height:54px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,.18); cursor:pointer; border:none; animation:popIn .22s ease; transition:transform .2s ease; }
        .prod-cart-btn:hover { transform:scale(1.1); }
        .prod-body { padding:18px 20px 22px; display:flex; flex-direction:column; flex:1; }
        .prod-stars { display:flex; gap:2px; margin-bottom:9px; }
        .prod-name { font-weight:700; font-size:16px; color:#111827; margin-bottom:6px; }
        .prod-desc { font-size:13px; color:#6b7280; line-height:1.55; margin-bottom:10px; }
        .prod-price { font-weight:800; font-size:18px; color:#238d7b; margin-bottom:8px; }
        .prod-stock { font-size:12px; color:#9ca3af; }
        .btn-shop-orange { display:inline-flex; align-items:center; gap:7px; background-color:#f39c12; color:white; font-weight:700; font-size:13px; padding:11px 22px; border-radius:50px; border:none; cursor:pointer; box-shadow:0 4px 14px rgba(243,156,18,.4); transition:background .2s ease,transform .15s ease; flex-shrink:0; }
        .btn-shop-orange:hover { background-color:#d68910; transform:translateY(-1px); }

        .footer-container { background: radial-gradient(circle at top right, #1f7a6a 0%, #0d4a3e 100%); color: white; padding: 80px 0 40px; }
        .footer-top { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 50px; max-width: 1200px; margin: 0 auto; padding: 0 40px; margin-bottom: 60px; }
        .footer-col h3 { font-size: 18px; font-weight: 700; color: white; margin-bottom: 25px; text-transform: capitalize; }
        .footer-col ul { list-style: none; padding: 0; margin: 0; }
        .footer-col ul li { margin-bottom: 12px; }
        .footer-col ul li a { color: rgba(255,255,255,0.70); text-decoration: none; font-size: 15px; transition: color .3s ease; cursor:pointer; }
        .footer-col ul li a:hover { color: white; }
        .footer-logo { margin-bottom: 25px; }
        .footer-logo img { height: 45px; width: auto; }
        .footer-description { color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.8; margin-bottom: 25px; font-weight: 500; }
        .footer-contact { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; color: rgba(255,255,255,0.80); font-size: 14px; }
        .footer-contact svg { flex-shrink: 0; width: 18px; height: 18px; color: rgba(255,255,255,0.6); }
        .footer-divider { border-top: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto; padding: 0 40px; margin-bottom: 30px; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 40px; flex-wrap: wrap; gap: 20px; }
        .footer-copyright { color: rgba(255,255,255,0.60); font-size: 13px; }
        .footer-socials { display: flex; gap: 25px; align-items: center; }
        .footer-socials a { color: rgba(255,255,255,0.80); transition: all .3s ease; display: flex; align-items: center; justify-content: center; cursor:pointer; }
        .footer-socials a:hover { color: white; transform: scale(1.1); }

        .search-box { display:flex; align-items:center; gap:10px; }
        .search-input { flex:1; padding:14px 18px; border:none; border-radius:50px; font-size:14px; outline:none; transition:all .3s ease; background:white; }
        .search-input::placeholder { color:#999; }
        .search-input:focus { box-shadow:0 0 0 3px rgba(35,141,123,.1); }
        .search-btn { width:50px; height:50px; border-radius:50%; background:#238d7b; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .3s ease; color:white; flex-shrink:0; }
        .search-btn:hover { background:#1a6e60; }

        .filter-btn { background:none; border:none; color:#238d7b; cursor:pointer; padding:10px; display:flex; align-items:center; justify-content:center; font-size:20px; transition:transform .3s ease; }
        .filter-btn:hover { transform:scale(1.1); }

        .filters-modal { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:300; padding:20px; }
        .filters-content { background:white; border-radius:24px; padding:40px 50px; max-width:1200px; width:100%; max-height:90vh; overflow-y:auto; }
        .filter-title { font-size:28px; font-weight:700; color:#1a1a1a; margin-bottom:32px; }
        .filter-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:40px; margin-bottom:40px; padding-bottom:40px; border-bottom:1px solid #eee; }
        .filter-group { }
        .filter-group h3 { font-size:16px; font-weight:700; color:#238d7b; margin-bottom:16px; }
        .filter-option { display:flex; align-items:center; gap:12px; margin-bottom:14px; cursor:pointer; }
        .filter-option input { cursor:pointer; width:20px; height:20px; accent-color:#238d7b; }
        .filter-option label { cursor:pointer; font-weight:500; color:#333; font-size:15px; }

        .price-range-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .price-range-labels { display:flex; justify-content:space-between; font-size:13px; color:#666; margin-bottom:12px; font-weight:600; }
        .price-sliders-row { display:flex; gap:16px; margin-bottom:20px; }
        .price-slider { flex:1; }
        .price-slider input[type="range"] { width:100%; accent-color:#238d7b; cursor:pointer; }
        .price-inputs { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
        .price-input-wrapper { display:flex; flex-direction:column; }
        .price-input-label { font-size:12px; font-weight:600; color:#666; margin-bottom:6px; }
        .price-input { padding:10px 14px; border:1px solid #ddd; border-radius:8px; font-size:14px; text-align:center; font-weight:600; color:#238d7b; }
        .price-display { display:flex; align-items:center; justify-content:center; gap:8px; padding:12px; background:#f5f5f5; border-radius:8px; margin-top:12px; }
        .price-display-text { font-size:14px; font-weight:600; color:#333; }

        .search-btn-modal { width:100%; background:#238d7b; color:white; padding:16px; border-radius:50px; border:none; font-weight:700; font-size:16px; cursor:pointer; transition:background .3s ease; margin-top:8px; }
        .search-btn-modal:hover { background:#1a6e60; }

        .stay-ahead-container { background-image: url('/images/Sign Up.png'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; position: relative; padding: 80px 40px; }
        .stay-ahead-overlay { position: absolute; inset: 0; background: transparent; }
        .stay-ahead-content { position: relative; z-index: 10; text-align: center; }
        .stay-ahead-title { font-size: clamp(24px, 5vw, 48px); font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; color: #0d4a3e; }

        .signup-bg { background-image: url('/images/Sign Up.png'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; }

        @keyframes popIn { 0%{transform:scale(.6);opacity:0} 100%{transform:scale(1);opacity:1} }
        @media (max-width: 768px) { 
          .filter-grid { grid-template-columns: 1fr; gap: 24px; } 
          .footer-top { gap: 30px; padding: 0 20px; } 
          .footer-bottom { padding: 0 20px; justify-content: center; text-align: center; } 
        }
      `}</style>

      {/* SIDEBAR WISHLIST */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[200] shadow-[-10px_0_30px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-in-out ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#0f1a18]">Wishlist</h2>
            <button onClick={closeSidebars} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {wishlistItems.length > 0 ? wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100">
                    <img src={item.img} alt={item.name} className="max-h-full object-contain" />
                  </div>
                  <div><h4 className="font-bold text-[#0f1a18]">{item.name}</h4><p className="text-[#238d7b] font-bold">{item.price}</p></div>
                </div>
                <button onClick={() => toggleHeart(item.id)} className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center transition-all text-red-500 hover:scale-110"><Heart size={18} fill="currentColor" /></button>
              </div>
            )) : <p className="text-center text-gray-400 mt-10">Your wishlist is empty.</p>}
          </div>
        </div>
      </div>

      {/* SIDEBAR SHOP */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[200] shadow-[-10px_0_30px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-in-out ${isShopOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#0f1a18]">My Shop</h2>
            <button onClick={closeSidebars} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {cartItems.length > 0 ? cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100">
                    <img src={item.img} alt={item.name} className="max-h-full object-contain" />
                  </div>
                  <div><h4 className="font-bold text-[#0f1a18]">{item.name}</h4><p className="text-[#238d7b] font-bold">{item.price}</p><p className="text-sm text-gray-500">Qty: {item.quantity}</p></div>
                </div>
              </div>
            )) : <p className="text-center text-gray-400 mt-10">Your shop is empty.</p>}
          </div>
          <button className="w-full py-4 bg-[#238d7b] text-white rounded-full font-bold mt-6 hover:bg-[#1a6e60] transition-all">Checkout</button>
        </div>
      </div>

      {(isWishlistOpen || isShopOpen) && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity" onClick={closeSidebars} />}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-[100] w-full pt-6 px-4 md:px-10 pointer-events-auto">
        <div className="mx-auto max-w-7xl nav-fixed-video rounded-full px-6 md:px-10 flex items-center justify-between shadow-2xl">
          <Link to="/"><div className="flex-shrink-0 cursor-pointer"><img src="/images/shot2.png" alt="S.HOT" className="h-7 md:h-9 w-auto" /></div></Link>
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((item) => {
              const linkPath = item === 'Products' ? '/products' : item === 'Home' ? '/' : item === 'About us' ? '/about' : '#';
              return (
                <Link key={item} to={linkPath}>
                  <button className="nav-link-item">{item}</button>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              {icons.map((item) => (
                <div key={item.id} onClick={() => { setActiveIcon(item.id); if(item.action) item.action(); }} className={`icon-box-vid ${activeIcon === item.id ? 'icon-box-active' : 'opacity-80'}`}>
                  <item.icon size={18} strokeWidth={2.5} />
                  {item.id === 'cart' && cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartItems.length}</span>}
                </div>
              ))}
            </div>
            <Link to="/register"><button className="btn-signup-vid ml-1 md:ml-2 text-xs md:text-sm">Sign Up</button></Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-32 pb-16 px-6 md:px-12 signup-bg">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-[32px] md:text-[48px] font-black text-[#0d4a3e] mb-4 leading-tight">All Products</h1>
          <p className="text-gray-600 text-base md:text-[17px] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Discover our complete collection of premium spirulina products
          </p>
          
          {/* SEARCH BOX SIMPLE */}
          <div className="max-w-xl mx-auto flex items-center gap-2">
            <button className="filter-btn" onClick={() => setShowFilters(true)}>
              ▤
            </button>
            <div className="search-box flex-1">
              <input
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input flex-1"
              />
              <button className="search-btn">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS MODAL */}
      {showFilters && (
        <div className="filters-modal" onClick={() => setShowFilters(false)}>
          <div className="filters-content" onClick={e => e.stopPropagation()}>
            <h2 className="filter-title">Search With Filters</h2>

            <div className="filter-grid">
              {/* Categories */}
              <div className="filter-group">
                <h3>Categories</h3>
                {['Powder', 'Tablets', 'Diamonds', 'Shots'].map(cat => (
                  <div key={cat} className="filter-option">
                    <input type="checkbox" id={cat} checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                    <label htmlFor={cat}>{cat}</label>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <div className="price-range-header">
                  <h3 style={{ margin: 0 }}>Price Range</h3>
                </div>
                <div className="price-range-labels">
                  <span>1 DT</span>
                  <span>150 DT</span>
                </div>
                <div className="price-sliders-row">
                  <div className="price-slider">
                    <input 
                      type="range" 
                      min="1" 
                      max="150" 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} 
                    />
                  </div>
                  <div className="price-slider">
                    <input 
                      type="range" 
                      min="1" 
                      max="150" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                    />
                  </div>
                </div>
                <div className="price-inputs">
                  <div className="price-input-wrapper">
                    <label className="price-input-label">Min</label>
                    <input 
                      type="number" 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 1, priceRange[1]])}
                      className="price-input" 
                      min="1"
                      max="150"
                    />
                  </div>
                  <div className="price-input-wrapper">
                    <label className="price-input-label">Max</label>
                    <input 
                      type="number" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 150])}
                      className="price-input" 
                      min="1"
                      max="150"
                    />
                  </div>
                </div>
                <div className="price-display">
                  <span className="price-display-text">Selected: {priceRange[0]} DT - {priceRange[1]} DT</span>
                </div>
              </div>

              {/* Ratings */}
              <div className="filter-group">
                <h3>Ratings</h3>
                {[1, 2, 3, 4, 5].map(rating => (
                  <div key={rating} className="filter-option">
                    <input type="checkbox" id={`rating${rating}`} checked={selectedRatings.includes(rating)} onChange={() => toggleRating(rating)} />
                    <label htmlFor={`rating${rating}`}>
                      {Array.from({ length: rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </label>
                  </div>
                ))}
              </div>

              {/* Sort By */}
              <div className="filter-group">
                <h3>Sort By</h3>
                {['Name', 'Price', 'Rating', 'Newest'].map(option => (
                  <div key={option} className="filter-option">
                    <input type="radio" id={option} name="sort" value={option.toLowerCase()} checked={sortBy === option.toLowerCase()} onChange={(e) => setSortBy(e.target.value)} />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <button className="search-btn-modal" onClick={() => setShowFilters(false)}>Search</button>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="pb-28 px-6 md:px-12 signup-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="prod-card"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="prod-img-wrap">
                <img src={product.img} alt={product.name} />
                <span className="prod-badge" style={{ backgroundColor: product.badgeColor }}>{product.badge}</span>
                <button 
                  className="prod-heart" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleWishlistProduct(product); 
                  }}
                >
                  <Heart 
                    fill={isInWishlist(product.id) ? '#ef4444' : 'none'}
                    stroke={isInWishlist(product.id) ? '#ef4444' : '#9ca3af'} 
                    strokeWidth={1.5}
                  />
                </button>
                {hoveredProduct === product.id && (
                  <div className="prod-cart-overlay">
                    <button className="prod-cart-btn" onClick={(e) => { e.stopPropagation(); openProductDetails(product); }}>
                      <ShoppingCart size={22} color="#238d7b" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
              <div className="prod-body">
                <div className="prod-stars">{renderStars(product.rating)}</div>
                <div className="prod-name">{product.name}</div>
                <div className="prod-desc">{product.description}</div>
                <div className="prod-price">{product.price}</div>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="prod-stock">{product.stock}</span>
                  <button className="btn-shop-orange" onClick={(e) => { e.stopPropagation(); openProductDetails(product); }}>
                    Shop
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-medium">No products found matching your search.</p>
          </div>
        )}
      </div>



      {/* Join our Newsletter */}
      <div className="stay-ahead-container">
        <div className="stay-ahead-overlay"></div>
        <div className="stay-ahead-content max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="stay-ahead-title">Join our Newsletter</h2>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div style={{ background: 'linear-gradient(135deg, #0d3d33 0%, #0f5a47 40%, #0d4a3a 70%, #0a3328 100%)', backgroundImage: "url('/images/NL_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', backgroundImage: "url('/images/NL_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, zIndex: 0 }} />
        <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 style={{ color: '#4dd9b8', fontWeight: 700, fontSize: 30, marginBottom: 24, textAlign: 'center' }}>Stay Informed</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, lineHeight: 1.7, marginBottom: 15, textAlign: 'center' }}>
              Subscribe to our newsletter to receive health tips, special offers, and new product announcements.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                placeholder="Enter your email to subscribe"
                value={subscribeEmail}
                onChange={e => setSubscribeEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                style={{
                  flex: '1 1 260px', padding: '15px 22px', borderRadius: 50, border: '2px solid rgba(77,217,184,0.55)',
                  background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 14, outline: 'none', backdropFilter: 'blur(6px)', maxWidth: '400px'
                }}
                onFocus={e => e.target.style.borderColor = '#4dd9b8'}
                onBlur={e => e.target.style.borderColor = 'rgba(77,217,184,0.55)'}
              />
              <button
                onClick={handleSubscribe}
                style={{
                  padding: '15px 34px', borderRadius: 50, background: '#238d7b', color: 'white', fontWeight: 700, fontSize: 15,
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background .2s ease, transform .15s ease',
                  boxShadow: '0 6px 20px rgba(35,141,123,0.45)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a6e60'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#238d7b'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* FOOTER */}
        <footer className="footer-container">
          <div className="footer-top">
            <div className="footer-col">
              <div className="footer-logo">
                <img src="/images/shot2.png" alt="S.HOT" />
              </div>
              <p className="footer-description">Premium spirulina products for your health and wellbeing. We're committed to providing the highest quality, sustainably sourced spirulina to support your wellness journey.</p>
              <div className="footer-contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>shotpremiumspirulina@gmail.com</span>
              </div>
              <div className="footer-contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.43 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+216 46 307 550</span>
              </div>
              <div className="footer-contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Tunis, Tunisia</span>
              </div>
            </div>
            <div className="footer-col">
              <h3>Shop</h3>
              <ul>
                <li><Link to="/products"><a>All Products</a></Link></li>
                <li><a href="#">Spirulina Powder</a></li>
                <li><a href="#">Spirulina Tablets</a></li>
                <li><a href="#">Spirulina Diamonds</a></li>
                <li><a href="#">Baby S.HOTs</a></li>
                <li><a href="#">Bundles</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Support</h3>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Legal</h3>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p className="footer-copyright">© 2026 SHOT. All rights reserved.</p>
            <div className="footer-socials">
              <a href="#" title="Facebook"><Facebook size={22} /></a>
              <a href="#" title="Instagram"><Instagram size={22} /></a>
              <a href="#" title="YouTube"><Youtube size={22} /></a>
              <a href="#" title="Twitter" className="font-bold text-xl">X</a>
            </div>
          </div>
        </footer>

      {/* MODAL */}
      {showSubscribeModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShowSubscribeModal(false)}>
          <div style={{ background: 'white', borderRadius: 24, padding: '52px 40px 44px', maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.25)', animation: 'popIn .3s ease' }}
            onClick={e => e.stopPropagation()}>
            <img src="/images/logo_SHOT.png" alt="S.HOT" style={{ height: 36, objectFit: 'contain', marginBottom: 36 }} />
            <div style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid #238d7b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#238d7b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: '#111827', marginBottom: 12 }}>Thank you !</h3>
            <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>Please check your inbox to confirm your subscription.</p>
            <button onClick={() => setShowSubscribeModal(false)} style={{ width: '100%', padding: '16px', borderRadius: 50, background: '#238d7b', color: 'white', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'background .2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a6e60'}
              onMouseLeave={e => e.currentTarget.style.background = '#238d7b'}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;