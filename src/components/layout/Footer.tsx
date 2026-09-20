import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  MapPin,
  PhoneCall,
  Clock,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  CreditCard,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t, navigateTo, siteSettings } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 border-t border-stone-800">
      {/* 1. Value Proposition Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-stone-800/50 border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {language === 'bn' ? 'সারা দেশে ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
              </h4>
              <p className="text-stone-400 text-xs mt-0.5">
                {language === 'bn' ? 'পণ্য হাতে পেয়ে মূল্য দিন' : 'Pay when you receive your order'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-stone-800/50 border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {language === 'bn' ? '১০০% আসল পণ্যের নিশ্চয়তা' : '100% Genuine Products'}
              </h4>
              <p className="text-stone-400 text-xs mt-0.5">
                {language === 'bn' ? 'সরাসরি বিশ্বস্ত উৎপাদক থেকে' : 'Direct from verified producers'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-stone-800/50 border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {language === 'bn' ? '৭ দিনের সহজ রিটার্ন পলিসি' : '7-Day Easy Returns'}
              </h4>
              <p className="text-stone-400 text-xs mt-0.5">
                {language === 'bn' ? 'নিরাপদ ও ঝামেলাহীন এক্সচেঞ্জ' : 'Hassle-free guarantee'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-stone-800/50 border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {language === 'bn' ? 'সার্বক্ষণিক গ্রাহক সেবা' : 'Dedicated Support'}
              </h4>
              <p className="text-stone-400 text-xs mt-0.5">
                {siteSettings?.contactPhone || (language === 'bn' ? 'সকাল ৯টা হতে রাত ১০টা' : '9:00 AM – 10:00 PM')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigateTo('home')}
              className="cursor-pointer inline-flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {siteSettings?.websiteName || 'AmarBazaar'}
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              {t('aboutAmarBazaar')}
            </p>

            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteSettings?.businessAddress || t('addressDhaka')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('supportHours')}</span>
              </div>
              {siteSettings?.contactEmail ? (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${siteSettings.contactEmail}`} className="hover:underline">
                    {siteSettings.contactEmail}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-white transition"
                >
                  {t('navShop')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'food-grocery' })}
                  className="hover:text-white transition"
                >
                  {language === 'bn' ? 'খাদ্য ও মুদি সামগ্রী' : 'Organic Groceries'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'fashion-lifestyle' })}
                  className="hover:text-white transition"
                >
                  {language === 'bn' ? 'ফ্যাশন ও জামদানি' : 'Fashion & Handloom'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'electronics-gadgets' })}
                  className="hover:text-white transition"
                >
                  {language === 'bn' ? 'স্মার্ট গ্যাজেটস' : 'Smart Electronics'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { query: 'sale' })}
                  className="hover:text-white transition text-amber-400 font-semibold"
                >
                  {t('flashSale')}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase">
              {t('customerService')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-white transition"
                >
                  {t('navAccount')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('my-orders')}
                  className="hover:text-white transition"
                >
                  {t('navMyOrders')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-white transition"
                >
                  {t('navTrackOrder')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-white transition"
                >
                  {t('navFaq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition"
                >
                  {t('navContact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition"
                >
                  {t('navAbout')}
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase">
              {t('policies')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button
                  onClick={() => navigateTo('privacy-policy')}
                  className="hover:text-white transition"
                >
                  {t('privacyPolicyTitle')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-white transition"
                >
                  {t('termsConditionsTitle')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('return-refund')}
                  className="hover:text-white transition"
                >
                  {t('returnRefundTitle')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shipping-policy')}
                  className="hover:text-white transition"
                >
                  {t('shippingPolicyTitle')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-10 p-6 rounded-2xl bg-stone-800/40 border border-stone-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h4 className="font-bold text-white text-base sm:text-lg">
                {t('newsletterTitle')}
              </h4>
              <p className="text-stone-400 text-xs mt-1 max-w-xl">
                {t('newsletterSubtitle')}
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="w-full lg:w-auto flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-700 text-white placeholder:text-stone-500 text-xs rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shrink-0"
              >
                {t('newsletterButton')}
              </button>
            </form>
          </div>
          {newsletterSubmitted && (
            <p className="mt-3 text-emerald-400 text-xs flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" /> {t('newsletterSuccess')}
            </p>
          )}
        </div>
      </div>

      {/* 3. Payment Integration Badges & Copyright */}
      <div className="border-t border-stone-800/80 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <p>&copy; {new Date().getFullYear()} AmarBazaar Limited. {t('allRightsReserved')}</p>
          </div>

          {/* Payment Gateways Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] font-medium text-stone-400 mr-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              {language === 'bn' ? 'পেমেন্ট ও কুরিয়ার পার্টনার:' : 'Payment & Logistics:'}
            </span>
            <span className="px-2 py-1 bg-stone-800 text-emerald-400 text-[10px] font-bold rounded border border-stone-700">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-1 bg-stone-800 text-pink-400 text-[10px] font-bold rounded border border-stone-700">
              bKash
            </span>
            <span className="px-2 py-1 bg-stone-800 text-orange-400 text-[10px] font-bold rounded border border-stone-700">
              Nagad
            </span>
            <span className="px-2 py-1 bg-stone-800 text-purple-400 text-[10px] font-bold rounded border border-stone-700">
              Rocket
            </span>
            <span className="px-2 py-1 bg-stone-800 text-blue-400 text-[10px] font-bold rounded border border-stone-700">
              Upay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
