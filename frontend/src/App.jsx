import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './ScrollToTop';

// PAGES EXISTANTES
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetails from './pages/ProductDetails';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PasswordChanged from './pages/PasswordChanged';
import AuthGateway from './pages/AuthGateway'; 
import Checkout from './pages/Checkout';

// PAGES PROFIL
import Profile from './pages/Profile'; 
import EditProfile from './pages/EditProfile'; 
import AddCard from './pages/AddCard';

// PAGE ADMIN
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

// Add this to redirect logged in admins to dashboard when they visit base or home
const HomeRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  return <Home />;
};

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider> 
          <ScrollToTop />
          <Routes>
            {/* ACCUEIL */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/home" element={<HomeRoute />} />

            {/* BOUTIQUE */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* INFORMATION */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />

            {/* AUTHENTIFICATION */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-changed" element={<PasswordChanged />} />
            <Route path="/auth-gateway" element={<AuthGateway />} />

            {/* PROFIL */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/add-card" element={<AddCard />} />
            </Route>

            {/* ADMIN DASHBOARD */}
            <Route element={<AdminRoute />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;