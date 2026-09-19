import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Store, Search, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { route, navigateTo, cartCount, wishlistCount, t } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center text-center">
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            route.page === 'home' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('navHome')}</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            route.page === 'shop' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('navShop')}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => {
            navigateTo('shop');
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) searchInput.focus();
          }}
          className={`flex flex-col items-center justify-center py-1 transition ${
            route.page === 'search' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('searchPlaceholder').split(' ')[0]}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => navigateTo('wishlist')}
          className={`relative flex flex-col items-center justify-center py-1 transition ${
            route.page === 'wishlist' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('navWishlist')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => navigateTo('cart')}
          className={`relative flex flex-col items-center justify-center py-1 transition ${
            route.page === 'cart' || route.page === 'checkout'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-emerald-700 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('navCart')}</span>
        </button>
      </div>
    </div>
  );
};
