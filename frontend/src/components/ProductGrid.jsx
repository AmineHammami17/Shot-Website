import React, { useState } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isInWishlist, toggleWishlist, openProductDetails, addToShop }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isHovered={hoveredProduct === product.id} 
          isInWishlist={isInWishlist(product.id)} 
          onMouseEnter={() => setHoveredProduct(product.id)} 
          onMouseLeave={() => setHoveredProduct(null)} 
          onToggleWishlist={toggleWishlist} 
          onOpenDetails={() => openProductDetails(product)}
          onAddToCart={addToShop} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;