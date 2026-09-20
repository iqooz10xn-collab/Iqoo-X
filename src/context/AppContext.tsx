import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Product, CartItem, WishlistItem, Address, CustomerUser } from '../types';
import { translations, TranslationKey } from '../i18n/translations';
import { cartService, CartTotals } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { authService } from '../services/authService';
import { settingsService, SiteSettings } from '../services/settingsService';

export interface RouteState {
  page: string;
  slug?: string;
  query?: string;
  category?: string;
  orderId?: string;
  orderNumber?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;
  toBanglaDigits: (num: number | string) => string;

  // Site Settings (configured via Admin)
  siteSettings: SiteSettings;
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => void;

  // Navigation / Routing
  route: RouteState;
  navigateTo: (page: string, params?: Partial<RouteState>) => void;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartTotals: CartTotals;
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => boolean;
  updateCartQuantity: (itemId: string, quantity: number) => boolean;
  updateQuantity: (itemId: string, quantity: number) => boolean;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setDeliveryRate: (rate: number) => void;
  setShippingRate: (rate: number) => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;
  removeCoupon: () => void;
  appliedCoupon: string | null;

  // Wishlist
  wishlist: WishlistItem[];
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;

  // Auth / Customer
  currentUser: CustomerUser | null;
  setCurrentUser: (user: CustomerUser | null) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  performSearch: (q: string) => void;

  // Admin
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('amarbazaar_lang');
        return saved === 'bn' || saved === 'en' ? saved : 'en';
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('amarbazaar_lang', lang);
      }
    } catch {
      // ignore
    }
  }, []);

  // Site Settings state
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(() => settingsService.getSettings());
  const updateSiteSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    const updated = settingsService.updateSettings(newSettings);
    setSiteSettingsState(updated);
  }, []);

  // Bangla number converter helper
  const toBanglaDigits = useCallback((input: number | string): string => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(input).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
  }, []);

  // Translation helper
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = translations[language] || translations.en;
      let text = (dict[key] || translations.en[key] || key) as string;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          const displayVal = language === 'bn' && typeof v === 'number' ? toBanglaDigits(v) : String(v);
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), displayVal);
        });
      }
      return text;
    },
    [language, toBanglaDigits]
  );

  // Price formatting helper: ৳ 1,250 or ৳ ১,২৫০
  const formatPrice = useCallback(
    (amount: number): string => {
      const formatted = Math.round(amount).toLocaleString('en-US');
      if (language === 'bn') {
        return `৳ ${toBanglaDigits(formatted)}`;
      }
      return `৳ ${formatted}`;
    },
    [language, toBanglaDigits]
  );

  // Helper to parse hash path into RouteState
  const parseHash = (hashString: string): RouteState => {
    try {
      const clean = hashString ? hashString.replace(/^#\/?/, '').trim() : '';
      if (!clean) return { page: 'home' };

      const [pathPart, queryPart] = clean.split('?');
      const parts = (pathPart || '').split('/').filter(Boolean);
      const page = parts[0] || 'home';
      const slug = parts[1];

      let query: string | undefined;
      let category: string | undefined;
      let orderNumber: string | undefined;

      if (page === 'category' && slug) {
        category = slug;
      }

      if (queryPart) {
        const searchParams = new URLSearchParams(queryPart);
        if (searchParams.has('q')) query = searchParams.get('q') || undefined;
        if (searchParams.has('category')) category = searchParams.get('category') || category;
        if (searchParams.has('orderNumber')) orderNumber = searchParams.get('orderNumber') || undefined;
        if (searchParams.has('orderId')) orderNumber = searchParams.get('orderId') || orderNumber;
      }

      return { page, slug, query, category, orderNumber, orderId: orderNumber };
    } catch (e) {
      console.warn('Error parsing route hash, defaulting to home:', e);
      return { page: 'home' };
    }
  };

  // 2. Routing state
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined' && window.location) {
      return parseHash(window.location.hash);
    }
    return { page: 'home' };
  });

  const navigateTo = useCallback((page: string, params?: Partial<RouteState>) => {
    const newRoute = { page, ...params };
    setRoute(newRoute);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update window hash for browser history / direct link readiness
      let hash = `#${page}`;
      if (page === 'category' && params?.category) {
        hash += `/${params.category}`;
      } else if (params?.slug) {
        hash += `/${params.slug}`;
      }

      const queryParams = new URLSearchParams();
      if (params?.query) queryParams.set('q', params.query);
      if (params?.category && page !== 'category') queryParams.set('category', params.category);
      if (params?.orderNumber) queryParams.set('orderNumber', params.orderNumber);
      if (params?.orderId && !params?.orderNumber) queryParams.set('orderNumber', params.orderId);

      const qs = queryParams.toString();
      if (qs) {
        hash += `?${qs}`;
      }

      try {
        window.history.pushState(null, '', hash);
      } catch {
        // ignore in restrictive environments
      }
    }
  }, []);

  // Listen to popstate and hashchange
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUrlChange = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // 3. Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => cartService.getItems());
  const [cartTotals, setCartTotals] = useState<CartTotals>(() => cartService.getTotals());

  const refreshCart = useCallback(() => {
    setCartItems(cartService.getItems());
    setCartTotals(cartService.getTotals());
  }, []);

  // 4. Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => wishlistService.getItems());

  const refreshWishlist = useCallback(() => {
    setWishlistItems(wishlistService.getItems());
  }, []);

  // 5. Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = `${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart operations
  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedVariants: Record<string, string> = {}) => {
      const res = cartService.addItem(product, quantity, selectedVariants);
      refreshCart();
      if (res.success) {
        showToast(
          language === 'bn'
            ? `"${product.nameBn}" কার্টে যুক্ত হয়েছে!`
            : `"${product.nameEn}" added to cart!`,
          'success'
        );
      } else {
        showToast(res.message, 'warning');
      }
      return res.success;
    },
    [language, refreshCart, showToast]
  );

  const updateCartQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const res = cartService.updateQuantity(itemId, quantity);
      refreshCart();
      return res;
    },
    [refreshCart]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      cartService.removeItem(itemId);
      refreshCart();
      showToast(language === 'bn' ? 'পণ্য কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
    },
    [language, refreshCart, showToast]
  );

  const clearCart = useCallback(() => {
    cartService.clearCart();
    refreshCart();
  }, [refreshCart]);

  const setDeliveryRate = useCallback(
    (rate: number) => {
      cartService.setDeliveryZoneRate(rate);
      refreshCart();
    },
    [refreshCart]
  );

  const applyCouponCode = useCallback(
    (code: string) => {
      const res = cartService.applyCoupon(code);
      refreshCart();
      const msg = language === 'bn' ? res.messageBn : res.messageEn;
      showToast(msg, res.success ? 'success' : 'error');
      return { success: res.success, message: msg };
    },
    [language, refreshCart, showToast]
  );

  const removeCouponCode = useCallback(() => {
    cartService.removeCoupon();
    refreshCart();
    showToast(language === 'bn' ? 'কুপন অপসারিত হয়েছে' : 'Coupon removed', 'info');
  }, [language, refreshCart, showToast]);

  // Wishlist operations
  const toggleWishlist = useCallback(
    (product: Product) => {
      const { added } = wishlistService.toggleWishlist(product);
      refreshWishlist();
      const name = language === 'bn' ? product.nameBn : product.nameEn;
      if (added) {
        showToast(
          language === 'bn'
            ? `"${name}" উইশলিস্টে যুক্ত হয়েছে`
            : `"${name}" added to your wishlist`,
          'success'
        );
      } else {
        showToast(
          language === 'bn'
            ? `"${name}" উইশলিস্ট থেকে সরানো হয়েছে`
            : `"${name}" removed from wishlist`,
          'info'
        );
      }
    },
    [language, refreshWishlist, showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      wishlistService.removeItem(productId);
      refreshWishlist();
    },
    [refreshWishlist]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistService.isInWishlist(productId);
    },
    [wishlistItems] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const clearWishlist = useCallback(() => {
    wishlistService.clearWishlist();
    refreshWishlist();
    showToast(language === 'bn' ? 'উইশলিস্ট খালি করা হয়েছে' : 'Wishlist cleared', 'info');
  }, [language, refreshWishlist, showToast]);

  // Customer authentication state
  const [currentUser, setCurrentUserState] = useState<CustomerUser | null>(() => {
    return authService.getCurrentUser();
  });

  const setCurrentUser = useCallback((user: CustomerUser | null) => {
    setCurrentUserState(user);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const performSearch = useCallback(
    (q: string) => {
      setSearchQuery(q);
      navigateTo('search', { query: q });
    },
    [navigateTo]
  );

  // Admin portal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatPrice,
        toBanglaDigits,
        siteSettings,
        updateSiteSettings,
        route,
        navigateTo,
        cartItems,
        cartCount: cartTotals.itemCount,
        cartTotals,
        addToCart,
        updateCartQuantity,
        updateQuantity: updateCartQuantity,
        removeFromCart,
        clearCart,
        setDeliveryRate,
        setShippingRate: setDeliveryRate,
        applyCouponCode,
        applyCoupon: applyCouponCode,
        removeCouponCode,
        removeCoupon: removeCouponCode,
        appliedCoupon: cartTotals.couponCode || null,
        wishlist: wishlistItems,
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        currentUser,
        setCurrentUser,
        toasts,
        showToast,
        dismissToast,
        searchQuery,
        setSearchQuery,
        performSearch,
        isAdminOpen,
        setIsAdminOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
