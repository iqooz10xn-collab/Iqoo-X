import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { productService } from '../services/productService';
import { Product, ProductVariant, Review } from '../types';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PageLoadingSpinner } from '../components/common/LoadingSkeleton';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    language,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    showToast,
  } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'delivery'>('desc');
  const [addedEffect, setAddedEffect] = useState(false);

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const found = await productService.getProductBySlug(slug);
        if (found) {
          setProduct(found);
          setSelectedImageIndex(0);
          setQuantity(1);

          // Initialize default variant selections
          if (found.variants) {
            const defaults: Record<string, string> = {};
            found.variants.forEach((v: ProductVariant) => {
              if (v.options.length > 0) {
                defaults[v.name] = v.options[0];
              }
            });
            setSelectedVariants(defaults);
          }

          // Fetch related products
          const related = await productService.getRelatedProducts(found.id, found.category);
          setRelatedProducts(related);

          // Save to recently viewed in sessionStorage
          try {
            const recent = JSON.parse(sessionStorage.getItem('amarbazaar_recent') || '[]');
            const updated = [found.slug, ...recent.filter((s: string) => s !== found.slug)].slice(0, 5);
            sessionStorage.setItem('amarbazaar_recent', JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <PageLoadingSpinner message={t('loading')} />;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">{t('pageNotFoundTitle')}</h2>
        <p className="text-stone-500 text-sm mt-2">{t('pageNotFoundDesc')}</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isFavorite = isInWishlist(product.id);
  const displayName = language === 'bn' ? product.nameBn : product.nameEn;
  const displayDescription =
    language === 'bn' ? product.descriptionBn : product.descriptionEn;

  // Calculate adjusted price with variant adjustments
  let currentUnitPrice = product.discountPrice ?? product.price;
  if (product.variants) {
    product.variants.forEach((v: ProductVariant) => {
      const selected = selectedVariants[v.name];
      if (selected && v.priceAdjustments && v.priceAdjustments[selected]) {
        currentUnitPrice += v.priceAdjustments[selected];
      }
    });
  }

  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity, selectedVariants);
    if (success) {
      setAddedEffect(true);
      setTimeout(() => setAddedEffect(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity, selectedVariants);
    if (success) {
      navigateTo('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: displayName,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          showToast(language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Product link copied to clipboard!', 'info');
        })
        .catch(() => {
          showToast(language === 'bn' ? 'লিঙ্ক কপি করা সম্ভব হয়নি' : 'Could not copy link', 'warning');
        });
    } else {
      showToast(language === 'bn' ? 'লিঙ্ক কপি করা সম্ভব হয়নি' : 'Clipboard not supported in this browser', 'info');
    }
  };

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[
          { label: t('navShop'), page: 'shop' },
          {
            label: product.category,
            page: 'category',
            params: { category: product.category },
          },
          { label: displayName, active: true },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        {/* Top Product Section: Image Gallery + Specs & Buy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-xs">
          {/* Image Gallery Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Main Image Container */}
            <div className="relative aspect-square rounded-2xl bg-stone-100 overflow-hidden border border-stone-200/60 group">
              <img
                src={product.images?.[selectedImageIndex] || product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
                alt={displayName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {hasDiscount && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm">
                  {discountPercent}% {t('discount')}
                </span>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-4 py-2 bg-rose-600 text-white font-bold text-sm rounded-xl uppercase tracking-wider shadow-lg">
                    {t('outOfStock')}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {(product.images?.length || 0) > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Actions Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand, SKU & Share */}
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-semibold uppercase">
                    {product.brand}
                  </span>
                  <span>•</span>
                  <span>
                    {t('sku')}: <strong className="text-stone-700">{product.sku}</strong>
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="text-stone-500 hover:text-emerald-700 flex items-center gap-1 transition"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('shareProduct')}</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 leading-snug">
                {displayName}
              </h1>

              {/* Rating and Reviews Counter */}
              <div className="flex items-center gap-4 text-xs">
                <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
                <span className="text-stone-300">|</span>
                <span
                  className={`font-semibold ${
                    isOutOfStock ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {isOutOfStock ? t('outOfStock') : `${t('inStock')} (${product.stock})`}
                </span>
              </div>

              {/* Price & Discount Display */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-stone-950 tracking-tight">
                  {formatPrice(currentUnitPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-stone-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {t('saveAmount')}: {formatPrice(product.price - currentUnitPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Product Variants Selector (Size, Color, Weight) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-2">
                  {product.variants.map((variant: ProductVariant) => (
                    <div key={variant.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800">
                          {language === 'bn' && variant.name === 'Size'
                            ? 'সাইজ'
                            : language === 'bn' && variant.name === 'Color'
                            ? 'রং'
                            : language === 'bn' && variant.name === 'Weight'
                            ? 'ওজন'
                            : variant.name}
                          :
                        </span>
                        <span className="text-stone-500 font-medium">
                          {selectedVariants[variant.name]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option: string) => {
                          const isSelected = selectedVariants[variant.name] === option;
                          const adj = variant.priceAdjustments?.[option];
                          return (
                            <button
                              key={option}
                              onClick={() =>
                                setSelectedVariants((prev: Record<string, string>) => ({
                                  ...prev,
                                  [variant.name]: option,
                                }))
                              }
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                isSelected
                                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <span>{option}</span>
                              {adj !== undefined && adj > 0 && (
                                <span className="ml-1 text-[10px] opacity-80">
                                  (+৳{adj})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector & Stock Limits */}
              <div className="pt-2 space-y-2">
                <span className="font-bold text-stone-800 text-xs">{t('quantity')}:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-2 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-bold text-stone-900 bg-white min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="px-3 py-2 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-stone-500">
                    {language === 'bn'
                      ? `স্টকে উপলব্ধ: ${product.stock} টি`
                      : `Available Stock: ${product.stock}`}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs: Add to Cart, Buy Now, Wishlist */}
            <div className="pt-4 border-t border-stone-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : addedEffect
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                  }`}
                >
                  {addedEffect ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('addedToCart')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{t('buyNow')}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition shadow-xs ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-stone-200 text-stone-600 hover:text-rose-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Delivery Assurance Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{language === 'bn' ? '২৪-৪৮ ঘণ্টায় ডেলিভারি' : '24-48h Delivery'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{language === 'bn' ? '১০০% আসল পণ্য' : 'Authentic Item'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{language === 'bn' ? '৭ দিনে রিটার্ন' : '7-Day Return'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === 'desc'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('description')}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === 'specs'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('specifications')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === 'reviews'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('reviews')} ({product.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-6 py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === 'delivery'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('deliveryAndReturns')}
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl text-stone-700 text-sm leading-relaxed">
                <p>{displayDescription}</p>
                <div className="pt-4 border-t border-stone-100 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-stone-400 uppercase">Tags:</span>
                  {product.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-lg font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                {product.specifications ? (
                  <dl className="divide-y divide-stone-100 text-xs sm:text-sm">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="py-3 grid grid-cols-3 gap-4">
                        <dt className="font-semibold text-stone-600">{key}</dt>
                        <dd className="col-span-2 text-stone-900 font-medium">{String(val)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-stone-500 text-xs">Standard specifications apply.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div>
                    <h4 className="font-bold text-stone-900 text-base">
                      {language === 'bn' ? 'গ্রাহকদের মূল্যায়ন' : 'Customer Feedback'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      showToast(
                        language === 'bn'
                          ? 'রিভিউ জমা দেওয়ার জন্য অ্যাকাউন্ট যাচাইকরণ প্রয়োজন।'
                          : 'Review submission opens after order delivery verification.',
                        'info'
                      )
                    }
                    className="px-4 py-2 border border-stone-300 hover:border-emerald-600 text-stone-800 hover:text-emerald-700 rounded-xl text-xs font-semibold transition"
                  >
                    {t('writeReview')}
                  </button>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((rev: Review) => (
                      <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs sm:text-sm">
                              {rev.userName}
                            </span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                {language === 'bn' ? 'ভেরিফায়েড ক্রেতা' : 'Verified Purchase'}
                              </span>
                            )}
                          </div>
                          <span className="text-stone-400 text-xs">{rev.date}</span>
                        </div>
                        <RatingStars rating={rev.rating} size="sm" showCount={false} />
                        <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 text-xs">No reviews submitted yet.</p>
                )}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="max-w-2xl space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-stone-900 mb-1">
                    {language === 'bn' ? 'ডেলিভারি সময়সীমা ও চার্জ:' : 'Shipping Schedule & Charges:'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{language === 'bn' ? 'ঢাকার ভেতরে: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি (চার্জ ৳৬০)' : 'Inside Dhaka: 24 to 48 hours delivery (Charge ৳60)'}</li>
                    <li>{language === 'bn' ? 'ঢাকার বাইরে / সারাদেশে: ২ থেকে ৪ কার্যদিবসের মধ্যে (চার্জ ৳১২০)' : 'Outside Dhaka / Nationwide: 2 to 4 business days (Charge ৳120)'}</li>
                    <li>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য' : 'Cash on Delivery (COD) fully supported'}</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-stone-900 mb-1">
                    {language === 'bn' ? '৭ দিনের সহজ রিটার্ন শর্তাবলী:' : '7-Day Return & Exchange Rules:'}
                  </h4>
                  <p>
                    {language === 'bn'
                      ? 'পণ্য গ্রহণের সময় কোনো ক্ষতি বা ত্রুটি পরিলক্ষিত হলে ডেলিভারি ম্যানের উপস্থিতিতেই পরীক্ষা করুন। পণ্য অবিকৃত অবস্থায় ৭ কার্যদিবসের মধ্যে যোগাযোগ করে সম্পূর্ণ ফেরত বা বিনিময় সুবিধা উপভোগ করতে পারবেন।'
                      : 'Please inspect the product upon receiving from courier. If there is any defect or damage, you can return or exchange within 7 business days without hassle.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-stone-900 mb-6 tracking-tight">
              {t('relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
