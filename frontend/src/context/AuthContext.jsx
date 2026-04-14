import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // Persist user info in localStorage for role-based redirects
  const fetchMe = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user || null);
      if (response.user) {
        localStorage.setItem('userInfo', JSON.stringify(response.user));
      } else {
        localStorage.removeItem('userInfo');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      // Try to restore user from localStorage first for fast role access
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      await fetchMe();
      setIsLoading(false);
    };
    bootstrap();
  }, []);

  // Keep auth state in sync across tabs/windows.
  useEffect(() => {
    const handleStorage = async (event) => {
      if (event.key !== 'accessToken') return;
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchMe();
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const signIn = async ({ email, password }) => {
    const response = await loginUser({ email, password });
    localStorage.setItem('accessToken', response.token);
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
    } else {
      setUser(null);
      localStorage.removeItem('userInfo');
    }
    return response;
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    signIn,
    signOut,
    refreshUser: fetchMe,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
