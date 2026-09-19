import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { productService } from '../services/productService';
import { DEMO_CATEGORIES } from '../data/mockProducts';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  TrendingUp,
  Tag,
  Star,
  Quote,
  Clock,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t, navigateTo, toBanglaDigits } = useApp();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Flash Sale countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [featured, sale, fresh] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getSaleProducts(),
          productService.getNewArrivals(),
        ]);
        setFeaturedProducts(featured);
        setSaleProducts(sale);
        setNewArrivals(fresh);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const formatTimerVal = (val: number) => {
    const str = val.toString().padStart(2, '0');
    return language === 'bn' ? toBanglaDigits(str) : str;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section - Original Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 p-6 sm:p-10 lg:p-14 shadow-2xl border border-stone-800">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {language === 'bn'
                  ? 'খাঁটি ও নির্ভরযোগ্য দেশীয় বাণিজ্য প্ল্যাটফর্ম'
                  : '100% Authentic Bangladeshi Products'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <span>{t('heroShopNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('shop', { query: 'sale' })}
                className="px-6 py-3.5 bg-stone-800/80 hover:bg-stone-700/80 text-white border border-stone-700 font-semibold text-sm rounded-xl transition"
              >
                {t('heroSpecialOffers')}
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-stone-800 grid grid-cols-3 gap-4 text-xs text-stone-300">
              <div>
                <p className="font-bold text-base text-emerald-400">
                  {language === 'bn' ? '৬৪ জেলা' : '64 Districts'}
                </p>
                <p className="text-stone-400 text-[11px]">{t('cashOnDeliveryAvailable')}</p>
              </div>
              <div>
                <p className="font-bold text-base text-emerald-400">
                  {language === 'bn' ? '২৪-৪৮ ঘণ্টা' : '24-48 Hours'}
                </p>
                <p className="text-stone-400 text-[11px]">{t('fastDelivery')}</p>
              </div>
              <div>
                <p className="font-bold text-base text-emerald-400">
                  {language === 'bn' ? '৭ দিনের' : '7-Day Return'}
                </p>
                <p className="text-stone-400 text-[11px]">{t('easyReturn')}</p>
              </div>
            </div>
          </div>

          {/* Hero Featured Collage / Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xl">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-800 relative">
                <img
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
                  alt="Raw Sundarban Honey"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  {language === 'bn' ? 'জনপ্রিয় সেরা পণ্য' : 'Top Highlight'}
                </div>
              </div>

              <div className="mt-4 p-2 text-white">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
                  <span>Sundarbans Mangrove Reserve</span>
                  <span>BSTI Certified</span>
                </div>
                <h3 className="font-bold text-base text-white">
                  {language === 'bn'
                    ? 'সুন্দরবনের প্রাকৃতিক খলিশা ফুলের খাঁটি মধু'
                    : 'Sundarbans Natural Raw Wild Honey'}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-extrabold text-emerald-400">
                    ৳ ৯৫০ <span className="text-xs text-stone-400 line-through">৳ ১,১৫০</span>
                  </div>
                  <button
                    onClick={() => navigateTo('product', { slug: 'sundarban-wild-pure-raw-honey' })}
                    className="px-3.5 py-1.5 bg-white text-stone-900 text-xs font-bold rounded-lg hover:bg-emerald-50 transition"
                  >
                    {t('buyNow')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {t('popularCategories')}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              {t('popularCategoriesSubtitle')}
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {DEMO_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('category', { category: cat.slug })}
              className="group cursor-pointer bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-stone-100 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-stone-900 text-xs sm:text-sm leading-snug group-hover:text-emerald-700 transition">
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </h3>
              <p className="text-[11px] text-stone-400 mt-1">
                {language === 'bn' ? `${toBanglaDigits(cat.itemCount)} টি পণ্য` : `${cat.itemCount} items`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale with Live Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-rose-900 via-rose-850 to-stone-900 rounded-3xl p-6 sm:p-8 text-white mb-6 border border-rose-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/30 text-rose-300 rounded-lg text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>{language === 'bn' ? 'সীমিত সময়ের অফার' : 'LIMITED TIME OFFER'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t('flashSale')}
              </h2>
              <p className="text-rose-200 text-xs sm:text-sm max-w-lg">
                {t('flashSaleSubtitle')}
              </p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center bg-stone-900/90 border border-rose-500/30 px-3.5 py-2 rounded-xl min-w-[56px]">
                <span className="text-xl font-bold text-white tracking-tight">
                  {formatTimerVal(timeLeft.hours)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-300 font-medium">
                  {language === 'bn' ? 'ঘণ্টা' : 'Hours'}
                </span>
              </div>
              <span className="text-rose-400 font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-stone-900/90 border border-rose-500/30 px-3.5 py-2 rounded-xl min-w-[56px]">
                <span className="text-xl font-bold text-white tracking-tight">
                  {formatTimerVal(timeLeft.minutes)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-300 font-medium">
                  {language === 'bn' ? 'মিনিট' : 'Mins'}
                </span>
              </div>
              <span className="text-rose-400 font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-stone-900/90 border border-rose-500/30 px-3.5 py-2 rounded-xl min-w-[56px]">
                <span className="text-xl font-bold text-rose-400 tracking-tight">
                  {formatTimerVal(timeLeft.seconds)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-300 font-medium">
                  {language === 'bn' ? 'সেকেন্ড' : 'Secs'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            saleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'জনপ্রিয় পছন্দ' : 'CURATED SELECTION'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {t('featuredProducts')}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              {t('featuredSubtitle')}
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 5. Promotional Cultural Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-amber-400 text-stone-950 text-xs font-extrabold rounded-lg uppercase tracking-wide">
              {language === 'bn' ? 'উৎসবের উপহার' : 'Festival Specials'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn'
                ? 'ঢাকাই জামদানি ও ঐতিহ্যবাহী হস্তশিল্পের সমাহার'
                : 'Dhakai Jamdani & Handloom Heritage Craft'}
            </h3>
            <p className="text-stone-200 text-xs sm:text-sm leading-relaxed">
              {language === 'bn'
                ? 'সরাসরি তাঁতিদের নিজস্ব তাঁতে বোনা শতভাগ খাঁটি সুতি ও রেশম জামদানি শাড়ি। বিশেষ কুপন কোড EID2026 ব্যবহার করে পান অতিরিক্ত ১০% ছাড়।'
                : 'Hand-loomed by master weavers of Rupganj. Use coupon code EID2026 during checkout to receive an instant 10% discount.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('category', { category: 'fashion-lifestyle' })}
                className="px-5 py-2.5 bg-white hover:bg-stone-100 text-teal-950 font-bold text-xs rounded-xl transition shadow-md"
              >
                {language === 'bn' ? 'কালেকশন দেখুন' : 'Shop Heritage Collection'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {t('newArrivals')}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              {t('newArrivalsSubtitle')}
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 7. Why Choose AmarBazaar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-100/80 rounded-3xl p-8 sm:p-10 border border-stone-200/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t('whyChooseUs')}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {language === 'bn'
                ? 'অনলাইন কেনাকাটায় সততা, গুণমান ও দ্রুত সেবাই আমাদের মূল লক্ষ্য'
                : 'Commitment to authenticity, transparent delivery, and customer first policies'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">
                {language === 'bn' ? 'সারা দেশে ক্যাশ অন ডেলিভারি' : 'Cash on Delivery Nationwide'}
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed">
                {language === 'bn'
                  ? 'কোনো প্রকার অগ্রিম পেমেন্ট ছাড়া পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধের সুবিধা।'
                  : 'Zero advance charges. Verify your parcel upon arrival and pay the delivery courier directly.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">
                {language === 'bn' ? 'শতভাগ আসল ও খাঁটি পণ্য' : '100% Guaranteed Authentic'}
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed">
                {language === 'bn'
                  ? 'সুন্দরবনের মধু, দিনাজপুরের সুগন্ধি চাল কিংবা রূপগঞ্জের জামদানি—সব সরাসরি প্রস্তুতকারক থেকে।'
                  : 'We work directly with certified organic producers, registered weavers, and official brand importers.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs text-center space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">
                {language === 'bn' ? '৭ দিনের সহজ রিটার্ন পলিসি' : '7 Days Easy Return Window'}
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed">
                {language === 'bn'
                  ? 'পণ্য ক্ষতিগ্রস্ত বা বিবরণের সাথে অমিল পেলে ৭ দিনের মধ্যে অতি সহজে পরিবর্তন বা রিফান্ড।'
                  : 'Damaged or mismatched order? Our customer support guarantees prompt exchange or full refund.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            {t('customerReviewsTitle')}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {t('customerReviewsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3 relative">
            <Quote className="w-8 h-8 text-stone-200 absolute top-4 right-4" />
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed">
              &ldquo;সুন্দরবনের মধুটা আসলেও খাঁটি। ঢাকাতে অনেক সুপারশপ থেকে কিনেছি কিন্তু এই প্রাকৃতিক ঘ্রাণ পাইনি। ডেলিভারিও মাত্র ২৪ ঘণ্টায় পেয়েছি।&rdquo;
            </p>
            <div className="pt-2 border-t border-stone-100">
              <p className="font-bold text-stone-900 text-xs">মুহাম্মদ তানভীর আহমেদ</p>
              <p className="text-[11px] text-stone-500">ধানমন্ডি, ঢাকা</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3 relative">
            <Quote className="w-8 h-8 text-stone-200 absolute top-4 right-4" />
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed">
              &ldquo;The handloom cotton panjabi fit perfectly and the fabric comfort during humid weather is exceptional. Cash on delivery courier was polite and prompt.&rdquo;
            </p>
            <div className="pt-2 border-t border-stone-100">
              <p className="font-bold text-stone-900 text-xs">Arifur Rahman</p>
              <p className="text-[11px] text-stone-500">GEC Circle, Chattogram</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3 relative">
            <Quote className="w-8 h-8 text-stone-200 absolute top-4 right-4" />
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed">
              &ldquo;দিনাজপুরের চিনিগুঁড়া চালের পোলাওয়ের সুবাস সত্যিই অপূর্ব ছিল। পরিবারের সবাই প্রশংসা করেছে। পরবর্তী অর্ডারের অপেক্ষায় রইলাম।&rdquo;
            </p>
            <div className="pt-2 border-t border-stone-100">
              <p className="font-bold text-stone-900 text-xs">নাসরিন সুলতানা</p>
              <p className="text-[11px] text-stone-500">উপশহর, সিলেট</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
