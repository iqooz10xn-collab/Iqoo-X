import React from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Store,
  ShieldCheck,
  Truck,
  Heart,
  Users,
  Award,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { language, t, navigateTo } = useApp();

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('navAbout'), active: true }]} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 space-y-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-4 shadow-xl border border-stone-800">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-lg">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn'
              ? 'আমারবাজার – বাংলাদেশের নিজস্ব ডিজিটাল মার্কেটপ্লেস'
              : 'AmarBazaar – The Authentic Bangladeshi Commerce Platform'}
          </h1>
          <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আমাদের লক্ষ্য বাংলাদেশের প্রতিটি কোণের খাঁটি, ঐতিহ্যবাহী ও মানসম্মত পণ্যকে সরাসরি সাধারণ ক্রেতাদের দোরগোড়ায় পৌঁছে দেওয়া।'
              : 'Our mission is to bridge traditional producers and verified craftspeople with millions of households across Bangladesh.'}
          </p>
        </div>

        {/* Core Values 3-column */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'শতভাগ আসল পণ্যের গ্যারান্টি' : '100% Authentic Quality'}
            </h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              {language === 'bn'
                ? 'সুন্দরবনের খাঁটি মধু, দিনাজপুরের সুগন্ধি চাল থেকে শুরু করে আন্তর্জাতিক ব্র্যান্ড—কোনো ডুপ্লিকেট পণ্যের স্থান নেই।'
                : 'Every jar of wild honey and every weave of Jamdani saree is vetted directly from source producers.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? '৬৪ জেলায় দ্রুত ডেলিভারি' : 'Nationwide Fast Delivery'}
            </h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              {language === 'bn'
                ? 'ঢাকায় ২৪ ঘণ্টার মধ্যে এবং বাংলাদেশের যেকোনো জেলা ও উপজেলায় সর্বোচ্চ ২ থেকে ৪ কার্যদিবসের মধ্যে নির্ভরযোগ্য ডেলিভারি।'
                : 'Steadfast logistics partnership spanning all 64 districts with transparent SMS notifications.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'গ্রাহক সন্তুষ্টিই প্রথম' : 'Customer-First Ethics'}
            </h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              {language === 'bn'
                ? 'ক্যাশ অন ডেলিভারিতে পণ্য দেখে নেওয়ার সুবিধা এবং ত্রুটিপূর্ণ পণ্যে ৭ দিনের সহজ এক্সচেঞ্জ ও রিফান্ড নীতি।'
                : 'Hassle-free inspection upon parcel arrival, zero advance extortion, and friendly 7-day returns.'}
            </p>
          </div>
        </div>

        {/* Bangladeshi Heritage Story */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-2xs space-y-4">
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'bn' ? 'আমাদের গল্প ও দর্শন' : 'Our Story & Philosophy'}
          </h2>
          <div className="space-y-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
            <p>
              {language === 'bn'
                ? 'আমারবাজার প্রতিষ্ঠিত হয়েছে বাংলাদেশের সাধারণ মানুষের অনলাইন কেনাকাটার অভিজ্ঞতাকে বিশ্বস্ত ও সহজ করতে। বহু বছর ধরে অনলাইন ক্রেতাদের সবচেয়ে বড় অভিযোগ ছিল—"যা দেখানো হয়, তা পাওয়া যায় না" অথবা "অগ্রিম টাকা নিয়ে প্রতারণা করা হয়"।'
                : 'AmarBazaar was established with a singular vision: to eliminate the credibility gap that historically plagued e-commerce in Bangladesh. Our architecture refuses predatory advance payment demands.'}
            </p>
            <p>
              {language === 'bn'
                ? 'আমরা এই সংস্কৃতির সম্পূর্ণ পরিবর্তন ঘটিয়েছি। আমাদের প্ল্যাটফর্মে ক্যাশ অন ডেলিভারি ডিফল্ট পেমেন্ট মেথড হিসেবে কাজ করে। পণ্য হাতে পেয়ে সন্তুষ্ট হয়েই কেবল ক্রেতা মূল্য পরিশোধ করেন।'
                : 'By partnering directly with weavers of Rupganj, beekeepers of Satkhira, organic farmers of North Bengal, and verified consumer tech distributors, we eliminate middlemen and deliver genuine savings.'}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-semibold text-stone-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>BSTI Quality Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Registered Bangladeshi Enterprise</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>E-CAB Member Compliant</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
          >
            {t('heroShopNow')}
          </button>
        </div>
      </main>
    </div>
  );
};
