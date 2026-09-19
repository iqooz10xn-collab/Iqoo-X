import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { RatingStars } from './RatingStars';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { language, formatPrice, t, addToCart, toggleWishlist, isInWishlist, navigateTo } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const displayName = language === 'bn' ? product.nameBn : product.nameEn;
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  const handleCardClick = () => {
    navigateTo('product', { slug: product.slug });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    // If product has required variants, navigate to details to let customer choose size/color
    if (product.variants && product.variants.length > 0) {
      navigateTo('product', { slug: product.slug });
      return;
    }

    const success = addToCart(product, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse" />
        )}

        <img
          src={imageError ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' : primaryImage}
          alt={displayName}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[11px] rounded-md tracking-tight shadow-xs">
              {discountPercent}% {t('discount')}
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-emerald-700 text-white font-semibold text-[11px] rounded-md shadow-xs">
              {language === 'bn' ? 'নতুন' : 'NEW'}
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full uppercase tracking-wider">
              {t('outOfStock')}
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-500/90 text-white font-medium text-[10px] rounded-md backdrop-blur-xs">
            {t('onlyFewLeft', { count: product.stock })}
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600 border border-stone-200/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1 font-medium">
            <span className="truncate max-w-[130px]">{product.brand}</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-400">
              {product.sku}
            </span>
          </div>

          {/* Title */}
          <h3
            title={displayName}
            className="font-semibold text-stone-800 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition"
          >
            {displayName}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center">
            <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                {formatPrice(product.discountPrice ?? product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? t('outOfStock') : t('addToCart')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('addedToCart')}</span>
              </>
            ) : product.variants && product.variants.length > 0 ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'অপশন দেখুন' : 'Options'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
