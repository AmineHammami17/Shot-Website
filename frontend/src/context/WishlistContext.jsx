import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // On initialise l'état avec le localStorage pour ne pas perdre la wishlist au rafraîchissement
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('shot_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isClearing, setIsClearing] = useState(false);

  // Sauvegarder dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('shot_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const removeItem = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setIsClearing(true);
    setTimeout(() => {
      setWishlistItems([]);
      setIsClearing(false);
    }, 500); // Petit délai pour l'animation de suppression si nécessaire
  };

  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      isClearing, 
      toggleWishlist, 
      removeItem, 
      clearAll, 
      isInWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};