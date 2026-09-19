import React from 'react';
import { useApp } from '../context/AppContext';
import { WishlistItem } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, Trash2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, clearWishlist, t, language, navigateTo } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="pb-20">
        <Breadcrumbs items={[{ label: t('myWishlist'), active: true }]} />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {t('wishlistEmpty')}
          </h1>
          <p className="mt-2 text-stone-500 text-sm leading-relaxed">
            {t('wishlistEmptySubtitle')}
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {t('heroShopNow')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('myWishlist'), active: true }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('myWishlist')}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {language === 'bn'
                ? `আপনার উইশলিস্টে ${wishlist.length} টি সংরক্ষিত পণ্য রয়েছে`
                : `You have saved ${wishlist.length} product(s) in your wishlist`}
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'উইশলিস্ট খালি করুন' : 'Clear Wishlist'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {wishlist.map((item: WishlistItem) => (
            <ProductCard key={item.productId} product={item.product} />
          ))}
        </div>
      </main>
    </div>
  );
};
