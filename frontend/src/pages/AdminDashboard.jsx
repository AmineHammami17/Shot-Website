import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Star,
  Users,
  TicketPercent,
  Menu,
  X,
  Trash2,
  Pencil,
  Plus,
  RefreshCw,
  LogOut,
  TrendingUp,
  Activity,
  Globe,
  Monitor,
  UserPlus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiRequest } from '../services/apiClient';
import { getCategories } from '../services/categoryService';

// Dummy data for the analytics chart
const visitorData = [
  { name: 'Mon', visitors: 4000 },
  { name: 'Tue', visitors: 3000 },
  { name: 'Wed', visitors: 2000 },
  { name: 'Thu', visitors: 2780 },
  { name: 'Fri', visitors: 1890 },
  { name: 'Sat', visitors: 2390 },
  { name: 'Sun', visitors: 3490 },
];

const realTimeVisitors = [
  { id: 1, loc: 'Paris, France', device: 'Desktop', page: '/product/123' },
  { id: 2, loc: 'Tunis, Tunisia', device: 'Mobile', page: '/checkout' },
  { id: 3, loc: 'New York, USA', device: 'Desktop', page: '/' },
  { id: 4, loc: 'Lyon, France', device: 'Tablet', page: '/about' },
];

const QuickStatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white shadow-sm border border-[#1B4332]/10 rounded-[20px] p-6 flex flex-col justify-between hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-[#F0FFF4] text-[#1B4332] flex items-center justify-center border border-[#1B4332]/10">
        <Icon strokeWidth={2.5} size={24} />
      </div>
      <div className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
        <TrendingUp size={14} /> {trend}
      </div>
    </div>
    <p className="text-[#1A1A1A]/70 text-[13px] font-bold uppercase tracking-wide mb-1">{title}</p>
    <div className="text-[32px] font-black text-[#1B4332]">{value}</div>
  </div>
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    images: [],
  });

  const [couponForm, setCouponForm] = useState({
    id: null,
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    isActive: true,
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'coupons', label: 'Promo Codes', icon: TicketPercent },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
  ];
  // Category form state
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', description: '' });
  const [isCategoryBusy, setIsCategoryBusy] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsCategoryBusy(true);
    setCategoryError('');
    try {
      if (categoryForm.id) {
        await apiRequest(`/categories/${categoryForm.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: categoryForm.name, description: categoryForm.description }),
        });
      } else {
        await apiRequest('/categories', {
          method: 'POST',
          body: JSON.stringify({ name: categoryForm.name, description: categoryForm.description }),
        });
      }
      setCategoryForm({ id: null, name: '', description: '' });
      setCategories(await getCategories());
    } catch (e) {
      setCategoryError(e.message || 'Save failed');
    } finally {
      setIsCategoryBusy(false);
    }
  };

  const handleEditCategory = (cat) => {
    setCategoryForm({ id: cat._id, name: cat.name, description: cat.description || '' });
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    setIsCategoryBusy(true);
    setCategoryError('');
    try {
      await apiRequest(`/categories/${id}`, { method: 'DELETE' });
      setCategories(await getCategories());
    } catch (e) {
      setCategoryError(e.message || 'Delete failed');
    } finally {
      setIsCategoryBusy(false);
    }
  };

  const loadDashboard = async () => {
    const res = await apiRequest('/admin/stats');
    setStats(res.data);
  };

  const loadProducts = async () => {
    const res = await apiRequest('/products');
    setProducts(res.data || []);
    setCategories(await getCategories());
  };

  const loadOrders = async () => {
    const res = await apiRequest('/orders/admin/all');
    setOrders(res.data || []);
  };

  const loadReviews = async () => {
    const res = await apiRequest('/admin/reviews');
    setReviews(res.data || []);
  };

  const loadMessages = async () => {
    const res = await apiRequest('/admin/messages');
    setMessages(res.data || []);
  };

  const loadUsers = async () => {
    const res = await apiRequest('/admin/users');
    setUsers(res.data || []);
  };

  const loadCoupons = async () => {
    const res = await apiRequest('/admin/coupons');
    setCoupons(res.data || []);
  };

  const refreshActiveTab = async () => {
    setIsBusy(true);
    setError('');
    try {
      if (activeTab === 'dashboard') await loadDashboard();
      if (activeTab === 'products') await loadProducts();
      if (activeTab === 'orders') await loadOrders();
      if (activeTab === 'coupons') await loadCoupons();
      if (activeTab === 'reviews') await loadReviews();
      if (activeTab === 'messages') await loadMessages();
      if (activeTab === 'users') await loadUsers();
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    refreshActiveTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const revenueValue = useMemo(() => {
    const val = stats?.totalRevenue?.[0]?.total || 0;
    return Number(val).toFixed(3) + ' DT';
  }, [stats]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsBusy(true);
    setError('');
    try {
      const form = new FormData();
      form.append('name', productForm.name);
      form.append('description', productForm.description);
      form.append('price', productForm.price);
      form.append('category', productForm.category);
      form.append('stockQuantity', productForm.stockQuantity || '0');
      (productForm.images || []).forEach((file) => form.append('productImages', file));

      if (productForm.id) {
        await apiRequest(`/products/${productForm.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: productForm.name,
            description: productForm.description,
            price: Number(productForm.price),
            category: productForm.category,
            stockQuantity: Number(productForm.stockQuantity || 0),
          }),
        });
      } else {
        await apiRequest('/products', { method: 'POST', body: form });
      }

      setProductForm({ id: null, name: '', description: '', price: '', category: '', stockQuantity: '', images: [] });
      await loadProducts();
    } catch (e2) {
      setError(e2.message || 'Save failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditProduct = (p) => {
    setProductForm({
      id: p._id,
      name: p.name || '',
      description: p.description || '',
      price: String(p.price ?? ''),
      category: p.category?._id || '',
      stockQuantity: String(p.stockQuantity ?? ''),
      images: [],
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    setIsBusy(true);
    setError('');
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      await loadProducts();
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, statut) => {
    setIsBusy(true);
    setError('');
    try {
      await apiRequest(`/orders/status/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ statut }),
      });
      await loadOrders();
    } catch (e) {
      setError(e.message || 'Status update failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete review?')) return;
    setIsBusy(true);
    setError('');
    try {
      await apiRequest(`/admin/reviews/${reviewId}`, { method: 'DELETE' });
      await loadReviews();
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleMarkMessageRead = async (messageId) => {
    setIsBusy(true);
    setError('');
    try {
      await apiRequest(`/admin/messages/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify({ statut: 'lu' }),
      });
      await loadMessages();
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handlePromoteUser = async (userId, role) => {
    setIsBusy(true);
    setError('');
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      await loadUsers();
    } catch (e) {
      setError(e.message || 'Role update failed');
    } finally {
      setIsBusy(false);
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      id: null,
      code: '',
      discountType: 'percentage',
      discountValue: '',
      expiryDate: '',
      isActive: true,
    });
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setIsBusy(true);
    setError('');

    try {
      const payload = {
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        expiryDate: couponForm.expiryDate,
        isActive: couponForm.isActive,
      };

      if (couponForm.id) {
        await apiRequest(`/admin/coupons/${couponForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/admin/coupons', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      resetCouponForm();
      await loadCoupons();
    } catch (e) {
      setError(e.message || 'Coupon save failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setCouponForm({
      id: coupon._id,
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: String(coupon.discountValue ?? ''),
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : '',
      isActive: Boolean(coupon.isActive),
    });
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Delete promo code?')) return;
    setIsBusy(true);
    setError('');
    try {
      await apiRequest(`/admin/coupons/${couponId}`, { method: 'DELETE' });
      if (couponForm.id === couponId) {
        resetCouponForm();
      }
      await loadCoupons();
    } catch (e) {
      setError(e.message || 'Coupon delete failed');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full font-['Montserrat'] bg-[#f8fafc]">
      <div className="flex min-h-screen">
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col sticky top-0 h-screen rounded-tr-2xl rounded-br-2xl border-r border-[#e6f4f1]`}>
          <div className="p-6 flex items-center justify-between border-b border-[#e6f4f1]">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2">
                <img loading="lazy" decoding="async" src="/images/logo_SHOT.webp" alt="S.HOT" className="h-7 w-auto object-contain" />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-10 h-10 bg-[#129384] rounded-2xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">S</span>
                </div>
              </div>
            )}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-[#e6f4f1] rounded-lg transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all
                    ${activeTab === item.id ? 'bg-[#129384] text-white shadow-md' : 'text-[#129384] hover:bg-[#e6f4f1]'}
                    ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                  <Icon size={20} strokeWidth={2.5} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f8fafc] rounded-2xl">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#1B4332]/5 px-6 py-4 flex items-center justify-between shadow-sm">
            <h1 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center text-sm shadow-md">
                A
              </span>
              Admin Panel
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 pr-4 border-r border-[#1B4332]/10">
                <div className="w-9 h-9 rounded-full bg-[#e6f4f1] border border-[#129384]/20 flex items-center justify-center text-[#129384] font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1A1A1A] leading-tight">
                    {user?.username || 'Admin User'}
                  </span>
                  <span className="text-[11px] text-[#1A1A1A]/50 font-medium">Administrator</span>
                </div>
              </div>
              
              <button 
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-all shadow-sm border border-red-100"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <div className="flex-1 p-6 md:p-10 text-[#129384]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#129384]">Dashboard Overview</h1>
                <p className="text-[#129384]/70 text-sm mt-1">Manage products, orders, reviews, and inbox.</p>
              </div>
              <button
                onClick={refreshActiveTab}
                className="bg-[#e6f4f1] hover:bg-[#c6f2e9] border border-[#129384]/10 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 text-[#129384] shadow-sm"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6">
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <QuickStatCard title="Revenue" value={revenueValue} icon={TrendingUp} trend="+12.5%" />
                  <QuickStatCard title="Total Orders" value={String(stats?.ordersCount ?? 0)} icon={ShoppingBag} trend="+5%" />
                  <QuickStatCard title="Total Products" value={String(stats?.productsCount ?? 0)} icon={Package} trend="+2%" />
                  <QuickStatCard title="Total Users" value={String(stats?.usersCount ?? 0)} icon={Users} trend="+8%" />
                </div>
                
                <div className="bg-white shadow-sm border border-[#1B4332]/10 rounded-[20px] p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[#1A1A1A] font-bold text-lg">Daily Visitor Traffic</h2>
                      <p className="text-[#757575] text-sm mt-1">Number of visitors over the current week</p>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={visitorData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 13}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 13}} dx={-10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1B4332', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="visitors" stroke="#129384" strokeWidth={4} dot={{r: 4, fill: '#129384', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, fill: '#1B4332', strokeWidth: 0}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white shadow-sm border border-[#1B4332]/10 rounded-[20px] p-6 lg:p-8 mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[#1A1A1A] font-bold text-lg flex items-center gap-2">
                        <Activity size={20} className="text-[#129384]" /> Total Site Visitors
                      </h2>
                      <p className="text-[#757575] text-sm mt-1">Real-time active visitors showing last known page and location</p>
                    </div>
                    <div className="bg-[#e6f4f1] text-[#129384] font-bold px-4 py-2 rounded-xl text-lg">
                      1,248
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10">
                        <tr>
                          <th className="pb-3 font-semibold">Location</th>
                          <th className="pb-3 font-semibold">Device</th>
                          <th className="pb-3 font-semibold">Active Page</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A1A1A]/5">
                        {realTimeVisitors.map((v) => (
                          <tr key={v.id} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="py-4 font-medium flex items-center gap-2"><Globe size={14} className="text-[#129384]" /> {v.loc}</td>
                            <td className="py-4 text-[#1A1A1A]/70 flex items-center gap-2"><Monitor size={14} className="text-[#129384]" /> {v.device}</td>
                            <td className="py-4 text-[#129384] font-medium">{v.page}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg flex items-center gap-2"><Package size={18} /> Categories</h2>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-sm text-black">
                    <thead className="text-[#129384]/70">
                      <tr className="border-b border-[#129384]/10">
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c._id} className="border-b border-[#129384]/5">
                          <td className="py-3 font-bold">{c.name}</td>
                          <td className="py-3">{c.description || 'â€”'}</td>
                          <td className="py-3 text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleEditCategory(c)} className="px-3 py-2 rounded-xl bg-[#F0FFF4] hover:bg-[#e6f4f1] border border-[#129384]/10 text-[#129384]">Edit</button>
                              <button onClick={() => handleDeleteCategory(c._id)} className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/20 border border-red-500/30 text-red-700">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
                <h2 className="font-black text-lg flex items-center gap-2 mb-4"><Plus size={18} /> {categoryForm.id ? 'Edit category' : 'Add category'}</h2>
                <form onSubmit={handleSaveCategory} className="space-y-3">
                  <input className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3 text-black" placeholder="Name" value={categoryForm.name} onChange={(e) => setCategoryForm((s) => ({ ...s, name: e.target.value }))} />
                  <textarea className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3 text-black" placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm((s) => ({ ...s, description: e.target.value }))} />
                  <button disabled={isCategoryBusy} className="w-full bg-[#129384] hover:bg-[#238d7b] rounded-2xl py-3 font-black text-white">
                    {isCategoryBusy ? 'Saving...' : 'Save'}
                  </button>
                  {categoryError && <div className="text-red-600 text-sm mt-2">{categoryError}</div>}
                </form>
              </section>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg flex items-center gap-2"><Package size={18} /> Products</h2>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-sm text-black">
                    <thead className="text-[#129384]/80 bg-[#e6f4f1]">
                      <tr className="border-b border-[#129384]/20">
                        <th className="py-2 px-2 text-left font-semibold">Product</th>
                        <th className="py-2 px-2 text-left font-semibold">Price</th>
                        <th className="py-2 px-2 text-left font-semibold">Stock</th>
                        <th className="py-2 px-2 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const img = p.images?.[0]?.url || '/images/p1.webp';
                        return (
                          <tr key={p._id} className="border-b border-[#e6f4f1] hover:bg-[#f8fafc] transition-colors">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                <img loading="lazy" decoding="async" src={img} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-[#F0FFF4]" />
                                <div>
                                  <div className="font-bold text-[#129384]">{p.name}</div>
                                  <div className="text-[#129384]/60 text-xs">{p.category?.name || 'â€”'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2">{Number(p.price || 0).toFixed(3)} DT</td>
                            <td className="py-3 px-2">{p.stockQuantity ?? 0}</td>
                            <td className="py-3 px-2 text-right">
                              <div className="inline-flex gap-2">
                                <button onClick={() => handleEditProduct(p)} className="px-3 py-2 rounded-xl bg-[#e6f4f1] hover:bg-[#c6f2e9] border border-[#129384]/10 text-[#129384]"><Pencil size={16} /></button>
                                <button onClick={() => handleDeleteProduct(p._id)} className="px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 border border-red-300 text-red-700"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
                <h2 className="font-black text-lg flex items-center gap-2 mb-4"><Plus size={18} /> {productForm.id ? 'Edit product' : 'Add product'}</h2>
                <form onSubmit={handleSaveProduct} className="space-y-3">
                  <input className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3 text-black" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} />
                  <textarea className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3 text-black" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm((s) => ({ ...s, price: e.target.value }))} />
                    <input className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3" placeholder="Stock" value={productForm.stockQuantity} onChange={(e) => setProductForm((s) => ({ ...s, stockQuantity: e.target.value }))} />
                  </div>
                  <select className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3" value={productForm.category} onChange={(e) => setProductForm((s) => ({ ...s, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>

                  {!productForm.id && (
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setProductForm((s) => ({ ...s, images: Array.from(e.target.files || []) }))}
                      className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3"
                    />
                  )}

                  <button disabled={isBusy} className="w-full bg-[#238d7b] hover:bg-[#1f7a6a] rounded-2xl py-3 font-black">
                    {isBusy ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </section>
            </div>
          )}

          {activeTab === 'orders' && (
            <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
              <h2 className="font-black text-lg flex items-center gap-2 mb-4"><ShoppingBag size={18} /> Orders</h2>
              <div className="overflow-auto">
                <table className="w-full text-sm text-black">
                  <thead className="text-[#1B4332]/70">
                    <tr className="border-b border-[#1B4332]/10">
                      <th className="py-2 text-left">Order</th>
                      <th className="py-2 text-left">Customer</th>
                      <th className="py-2 text-left">Total</th>
                      <th className="py-2 text-left">Status</th>
                      <th className="py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-b border-[#1B4332]/5">
                        <td className="py-3 font-bold">#{String(o._id).slice(-8).toUpperCase()}</td>
                        <td className="py-3">{o.user?.email || o.user?.username || 'â€”'}</td>
                        <td className="py-3">{Number(o.total || 0).toFixed(3)} DT</td>
                        <td className="py-3">
                          <select
                            className="bg-[#F0FFF4] border border-[#1B4332]/10 rounded-xl px-3 py-2"
                            value={o.statut}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          >
                            {['pending', 'confirmed', 'cash', 'delivered', 'cancelled'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 text-[#1B4332]/70">{new Date(o.dateCommande).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[#1B4332]/60 text-xs mt-3">Changing status triggers an email notification (best effort).</p>
            </section>
          )}

          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-black text-lg flex items-center gap-2"><TicketPercent size={18} /> Promo Codes</h2>
                    <p className="text-[#129384]/60 text-sm mt-1">Manage the coupons used by checkout and cart preview.</p>
                  </div>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-sm text-black">
                    <thead className="text-[#129384]/80 bg-[#e6f4f1]">
                      <tr className="border-b border-[#129384]/20">
                        <th className="py-2 px-2 text-left font-semibold">Code</th>
                        <th className="py-2 px-2 text-left font-semibold">Discount</th>
                        <th className="py-2 px-2 text-left font-semibold">Expiry</th>
                        <th className="py-2 px-2 text-left font-semibold">Status</th>
                        <th className="py-2 px-2 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => {
                        const isExpired = coupon.expiryDate ? new Date(coupon.expiryDate) < new Date() : false;
                        return (
                          <tr key={coupon._id} className="border-b border-[#e6f4f1] hover:bg-[#f8fafc] transition-colors">
                            <td className="py-3 px-2 font-bold text-[#129384]">{coupon.code}</td>
                            <td className="py-3 px-2">
                              {coupon.discountType === 'percentage'
                                ? `${Number(coupon.discountValue || 0)}%`
                                : `${Number(coupon.discountValue || 0).toFixed(3)} DT`}
                            </td>
                            <td className="py-3 px-2">{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : '—'}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${coupon.isActive && !isExpired ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                {coupon.isActive ? (isExpired ? 'Expired' : 'Active') : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="inline-flex gap-2">
                                <button onClick={() => handleEditCoupon(coupon)} className="px-3 py-2 rounded-xl bg-[#e6f4f1] hover:bg-[#c6f2e9] border border-[#129384]/10 text-[#129384]"><Pencil size={16} /></button>
                                <button onClick={() => handleDeleteCoupon(coupon._id)} className="px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 border border-red-300 text-red-700"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {coupons.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-[#129384]/60">No promo codes created yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg flex items-center gap-2"><Plus size={18} /> {couponForm.id ? 'Edit promo code' : 'Create promo code'}</h2>
                  {couponForm.id && (
                    <button onClick={resetCouponForm} type="button" className="text-sm font-bold text-[#129384] hover:text-[#1B4332]">
                      Reset
                    </button>
                  )}
                </div>
                <form onSubmit={handleSaveCoupon} className="space-y-3">
                  <input
                    className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3 text-black uppercase"
                    placeholder="Code"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3"
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm((s) => ({ ...s, discountType: e.target.value }))}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed amount</option>
                    </select>
                    <input
                      className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3"
                      type="number"
                      min="0"
                      step={couponForm.discountType === 'fixed' ? '0.001' : '1'}
                      placeholder={couponForm.discountType === 'fixed' ? 'Discount amount' : 'Discount %'}
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm((s) => ({ ...s, discountValue: e.target.value }))}
                    />
                  </div>
                  <input
                    className="w-full bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3"
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={(e) => setCouponForm((s) => ({ ...s, expiryDate: e.target.value }))}
                  />
                  <label className="flex items-center gap-3 bg-[#F0FFF4] border border-[#1B4332]/10 rounded-2xl px-4 py-3 text-black font-medium">
                    <input
                      type="checkbox"
                      checked={couponForm.isActive}
                      onChange={(e) => setCouponForm((s) => ({ ...s, isActive: e.target.checked }))}
                    />
                    Coupon is active and can be used in checkout.
                  </label>
                  <button disabled={isBusy} className="w-full bg-[#238d7b] hover:bg-[#1f7a6a] rounded-2xl py-3 font-black text-white">
                    {isBusy ? 'Saving...' : couponForm.id ? 'Update promo code' : 'Create promo code'}
                  </button>
                </form>
              </section>
            </div>
          )}

          {activeTab === 'reviews' && (
            <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
              <h2 className="font-black text-lg flex items-center gap-2 mb-4"><Star size={18} /> Reviews</h2>
              <div className="overflow-auto">
                <table className="w-full text-sm text-black">
                  <thead className="text-[#1B4332]/70">
                    <tr className="border-b border-[#1B4332]/10">
                      <th className="py-2 text-left">Product</th>
                      <th className="py-2 text-left">User</th>
                      <th className="py-2 text-left">Rating</th>
                      <th className="py-2 text-left">Comment</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r) => (
                      <tr key={r._id} className="border-b border-[#1B4332]/5">
                        <td className="py-3 font-bold">{r.product?.name || 'â€”'}</td>
                        <td className="py-3">{r.user?.email || 'â€”'}</td>
                        <td className="py-3">{r.rating} / 5</td>
                        <td className="py-3 text-[#1B4332]/80">{r.comment}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteReview(r._id)} className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/20 border border-red-500/30">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[#1B4332]/60 text-xs mt-3">Note: model uses `estVisible` (no pending approval status).</p>
            </section>
          )}

          {activeTab === 'messages' && (
            <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
              <h2 className="font-black text-lg flex items-center gap-2 mb-4"><MessageSquare size={18} /> Messages</h2>
              <div className="overflow-auto">
                <table className="w-full text-sm text-black">
                  <thead className="text-[#1B4332]/70">
                    <tr className="border-b border-[#1B4332]/10">
                      <th className="py-2 text-left">From</th>
                      <th className="py-2 text-left">Subject</th>
                      <th className="py-2 text-left">Status</th>
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m) => (
                      <tr key={m._id} className="border-b border-[#1B4332]/5">
                        <td className="py-3">
                          <div className="font-bold">{m.nom}</div>
                          <div className="text-[#1B4332]/60 text-xs">{m.email}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-bold">{m.sujet}</div>
                          <div className="text-[#1B4332]/70 text-xs line-clamp-1">{m.message}</div>
                        </td>
                        <td className="py-3">{m.statut}</td>
                        <td className="py-3 text-[#1B4332]/70">{new Date(m.dateEnvoi).toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleMarkMessageRead(m._id)} className="px-3 py-2 rounded-xl bg-[#F0FFF4] hover:bg-[#e2f5e8] border border-[#1B4332]/10">
                            Mark read
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
              <h2 className="font-black text-lg flex items-center gap-2 mb-4"><Users size={18} /> Users</h2>
              <div className="overflow-auto">
                <table className="w-full text-sm text-black">
                  <thead className="text-[#1B4332]/70">
                    <tr className="border-b border-[#1B4332]/10">
                      <th className="py-2 text-left">Username</th>
                      <th className="py-2 text-left">Email</th>
                      <th className="py-2 text-left">Role</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-[#1B4332]/5">
                        <td className="py-3 font-bold">{u.username}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3">{u.role}</td>
                        <td className="py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => handlePromoteUser(u._id, 'admin')} className="px-3 py-2 rounded-xl bg-[#F0FFF4] hover:bg-[#e2f5e8] border border-[#1B4332]/10">
                              Make admin
                            </button>
                            <button onClick={() => handlePromoteUser(u._id, 'user')} className="px-3 py-2 rounded-xl bg-[#F0FFF4] hover:bg-[#e2f5e8] border border-[#1B4332]/10">
                              Make user
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {isBusy && (
            <div className="fixed bottom-6 right-6 bg-white text-black px-4 py-2 rounded-full font-bold shadow-xl">
              Working...
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow-sm border border-[#1B4332]/10 rounded-3xl p-6">
    <div className="text-[#1B4332]/70 text-sm font-bold">{title}</div>
    <div className="text-3xl font-black text-black mt-2">{value}</div>
  </div>
);

export default AdminDashboard;


