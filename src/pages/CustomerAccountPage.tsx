import React from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    setCurrentUser,
    navigateTo,
    wishlistCount,
    showToast,
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-stone-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          {language === 'bn' ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'Sign in to your Account'}
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          {language === 'bn'
            ? 'আপনার অর্ডার হিস্ট্রি, ডেলিভারি ঠিকানা এবং উইশলিস্ট সংরক্ষণ দেখতে লগইন করুন।'
            : 'Access your order history, delivery addresses, and saved wishlist.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigateTo('login')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
          >
            {t('loginTitle')}
          </button>
          <button
            onClick={() => navigateTo('register')}
            className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            {t('registerTitle')}
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    authService.signOut();
    setCurrentUser(null);
    showToast(language === 'bn' ? 'লগআউট সফল হয়েছে' : 'Logged out successfully', 'info');
    navigateTo('home');
  };

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('navAccount'), active: true }]} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                {currentUser.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5" />
                  {currentUser.phone}
                </span>
                {currentUser.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {currentUser.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold border border-rose-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
          </button>
        </div>

        {/* Dashboard Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigateTo('my-orders')}
            className="p-6 bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500 hover:shadow-md cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition">
                  {language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও বিস্তারিত' : 'Track orders & history'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-emerald-700 transition" />
          </div>

          <div
            onClick={() => navigateTo('wishlist')}
            className="p-6 bg-white rounded-2xl border border-stone-200/90 hover:border-rose-500 hover:shadow-md cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm group-hover:text-rose-600 transition">
                  {t('myWishlist')}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {wishlistCount} {language === 'bn' ? 'টি পণ্য সংরক্ষিত' : 'items saved'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-rose-600 transition" />
          </div>

          <div
            onClick={() => navigateTo('track-order')}
            className="p-6 bg-white rounded-2xl border border-stone-200/90 hover:border-blue-500 hover:shadow-md cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition">
                  {t('navTrackOrder')}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {language === 'bn' ? 'লাইভ পার্সেল আপডেট' : 'Live shipment tracker'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-blue-600 transition" />
          </div>
        </div>

        {/* Security & Verification Banner */}
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
          <div className="text-xs text-stone-600 leading-relaxed space-y-1">
            <h5 className="font-bold text-stone-900">
              {language === 'bn' ? 'নিরাপদ অ্যাকাউন্ট ও তথ্য সুরক্ষা' : 'Verified Consumer Protection'}
            </h5>
            <p>
              {language === 'bn'
                ? 'আপনার ব্যক্তিগত মোবাইল নম্বর ও ডেলিভারি ঠিকানা সম্পূর্ণ এনক্রিপ্ট করা। আমরা কোনো তৃতীয় পক্ষের সাথে গ্রাহকের তথ্য শেয়ার করি না।'
                : 'Your profile and delivery coordinates are securely localized. We enforce strict privacy and zero third-party marketing sharing.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
