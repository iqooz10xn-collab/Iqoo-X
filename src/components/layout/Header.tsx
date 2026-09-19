import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_CATEGORIES } from '../../data/mockProducts';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  PhoneCall,
  Globe,
  Truck,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  PackageCheck,
  Store,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    cartCount,
    cartTotals,
    wishlistCount,
    formatPrice,
    navigateTo,
    searchQuery,
    setSearchQuery,
    performSearch,
    route,
    setIsAdminOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle live search auto-suggest
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await productService.searchAndFilter(searchQuery);
      setSuggestions(results.slice(0, 5));
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to dismiss search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      performSearch(searchQuery.trim());
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigateTo('product', { slug: product.slug });
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 truncate">
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t('cashOnDeliveryAvailable')}</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{t('verified')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="tel:+8801700123456"
              className="hidden lg:flex items-center gap-1.5 text-stone-300 hover:text-white transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>+880 1700-123456</span>
            </a>

            <button
              onClick={() => navigateTo('track-order')}
              className="hover:text-emerald-400 transition font-medium hidden sm:inline"
            >
              {t('navTrackOrder')}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-stone-800 rounded-md p-0.5 border border-stone-700">
              <Globe className="w-3 h-3 text-stone-400 ml-1.5" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'bn'
                    ? 'bg-emerald-600 text-white font-siliguri'
                    : 'text-stone-400 hover:text-stone-200 font-siliguri'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Logo, Search, Actions) */}
      <div className="border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4 sm:gap-8">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-xl transition"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer flex items-center gap-2.5 shrink-0 select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight">
                  Amar<span className="text-emerald-600">Bazaar</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                  BD
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium tracking-tight -mt-0.5">
                {language === 'bn' ? 'আমারবাজার • দেশীয় অনলাইন শপ' : 'Modern Bangladeshi Commerce'}
              </p>
            </div>
          </div>

          {/* Search Bar with Live Suggestions (Desktop & Tablet) */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-11 pr-24 py-2.5 bg-stone-100/90 hover:bg-stone-100 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border border-transparent focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition"
              >
                {t('searchPlaceholder').split(' ')[0]}
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] uppercase tracking-wider font-semibold text-stone-400 border-b border-stone-100">
                  {language === 'bn' ? 'পণ্য সাজেশন' : 'Product Suggestions'}
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-3.5 py-2.5 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.nameEn}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-emerald-700">
                          {formatPrice(item.discountPrice ?? item.price)}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{item.brand}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => {
                    setShowSuggestions(false);
                    performSearch(searchQuery);
                  }}
                  className="px-4 py-2 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-emerald-700 text-center cursor-pointer border-t border-stone-100 transition"
                >
                  {t('viewAll')} ({searchQuery}) &rarr;
                </div>
              </div>
            )}
          </div>

          {/* Action Icons: Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Button */}
            <button
              onClick={() => navigateTo('wishlist')}
              aria-label="Wishlist"
              className="relative p-2.5 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-xl transition"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              onClick={() => navigateTo('account')}
              aria-label="Customer Account"
              className="relative p-2.5 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-xl transition"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Button with Total Preview */}
            <button
              onClick={() => navigateTo('cart')}
              aria-label="Shopping Cart"
              className="relative flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/70 rounded-xl transition shadow-xs"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-emerald-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-emerald-700 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-emerald-800/80 uppercase font-semibold">
                  {t('shoppingCart')}
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  {formatPrice(cartTotals.subtotal)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search input (under main header) */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-stone-100 text-stone-900 placeholder:text-stone-400 text-xs rounded-xl border border-transparent focus:border-emerald-600 focus:bg-white outline-hidden"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* 3. Navigation Bar (Categories, Quick Links) */}
      <nav className="hidden lg:block bg-stone-50 border-b border-stone-200/60 text-xs font-semibold text-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* All Categories Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-t-lg transition"
              >
                <Menu className="w-4 h-4" />
                <span>{t('allCategories')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* Categories Dropdown Menu */}
              {categoriesOpen && (
                <div
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {DEMO_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriesOpen(false);
                        navigateTo('category', { category: cat.slug });
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-stone-700 hover:text-emerald-700 flex items-center justify-between transition text-xs font-medium"
                    >
                      <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        ({cat.itemCount})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2.5 hover:text-emerald-700 transition ${
                route.page === 'home' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              {t('navHome')}
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className={`px-3 py-2.5 hover:text-emerald-700 transition ${
                route.page === 'shop' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              {t('navShop')}
            </button>

            <button
              onClick={() => navigateTo('shop', { query: 'sale' })}
              className="px-3 py-2.5 hover:text-emerald-700 transition flex items-center gap-1 text-rose-600"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('heroSpecialOffers')}</span>
            </button>

            <button
              onClick={() => navigateTo('track-order')}
              className={`px-3 py-2.5 hover:text-emerald-700 transition ${
                route.page === 'track-order' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              {t('navTrackOrder')}
            </button>

            <button
              onClick={() => navigateTo('faq')}
              className={`px-3 py-2.5 hover:text-emerald-700 transition ${
                route.page === 'faq' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              {t('navFaq')}
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`px-3 py-2.5 hover:text-emerald-700 transition ${
                route.page === 'contact' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              {t('navContact')}
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={`px-3 py-2.5 hover:text-emerald-700 transition ${
                route.page === 'about' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              {t('navAbout')}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-stone-500 hover:text-stone-900 transition flex items-center gap-1 text-[11px]"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('navAdmin')}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Offcanvas Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-stone-900">
                  Amar<span className="text-emerald-600">Bazaar</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switcher in Mobile Drawer */}
            <div className="p-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs">
              <span className="font-medium text-stone-600">
                {language === 'bn' ? 'ভাষা পরিবর্তন:' : 'Change Language:'}
              </span>
              <div className="flex items-center gap-1 bg-white rounded-md p-0.5 border border-stone-200">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    language === 'en' ? 'bg-emerald-600 text-white' : 'text-stone-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    language === 'bn' ? 'bg-emerald-600 text-white' : 'text-stone-600'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  {t('allCategories')}
                </p>
                <div className="space-y-1">
                  {DEMO_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigateTo('category', { category: cat.slug });
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  {language === 'bn' ? 'প্রধান লিঙ্ক' : 'Navigation'}
                </p>
                <div className="space-y-1 text-sm font-medium">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('home');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navHome')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('shop');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navShop')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('cart');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                  >
                    <span>{t('navCart')}</span>
                    {cartCount > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('wishlist');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                  >
                    <span>{t('navWishlist')}</span>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('account');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navAccount')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('track-order');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navTrackOrder')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('faq');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navFaq')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('contact');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navContact')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('about');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
                  >
                    {t('navAbout')}
                  </button>
                </div>
              </div>

              {/* Policies list in drawer */}
              <div className="border-t border-stone-100 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  {t('policies')}
                </p>
                <div className="space-y-1 text-xs text-stone-600">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('privacy-policy');
                    }}
                    className="block w-full text-left py-1 hover:text-emerald-700"
                  >
                    {t('privacyPolicyTitle')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('terms');
                    }}
                    className="block w-full text-left py-1 hover:text-emerald-700"
                  >
                    {t('termsConditionsTitle')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('return-refund');
                    }}
                    className="block w-full text-left py-1 hover:text-emerald-700"
                  >
                    {t('returnRefundTitle')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('shipping-policy');
                    }}
                    className="block w-full text-left py-1 hover:text-emerald-700"
                  >
                    {t('shippingPolicyTitle')}
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('navAdmin')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
