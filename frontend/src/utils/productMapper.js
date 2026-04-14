const formatPrice = (priceNumber) => `${Number(priceNumber || 0).toFixed(3)} DT`;

export const mapProductToUiModel = (product) => {
  const imageUrls = Array.isArray(product?.images)
    ? product.images.map((img) => img?.url).filter(Boolean)
    : [];

  const firstImage = imageUrls[0] || '/images/p1.webp';
  const rating = Math.round(product?.ratingsAverage || 0);

  return {
    id: product?._id,
    name: product?.name || '',
    description: product?.description || '',
    fullDescription: product?.description || '',
    price: formatPrice(product?.price),
    priceNum: Number(product?.price || 0),
    category: product?.category?.name || '',
    rating,
    reviews: Number(product?.ratingsCount || 0),
    overallRating: Number(product?.ratingsAverage || 0),
    totalReviews: Number(product?.ratingsCount || 0),
    img: firstImage,
    images: imageUrls.length ? imageUrls : [firstImage],
    features: [
      `Stock: ${product?.stockQuantity ?? 0}`,
      `Category: ${product?.category?.name || 'N/A'}`,
    ],
    nutritionalInfo: [],
    customerReviews: [],
  };
};
