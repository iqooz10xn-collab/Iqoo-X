import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ChevronDown, ChevronUp, HelpCircle, PhoneCall } from 'lucide-react';

interface FAQItem {
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
}

const FAQS: FAQItem[] = [
  {
    qEn: 'How does Cash on Delivery (COD) work at AmarBazaar?',
    qBn: 'আমারবাজারে ক্যাশ অন ডেলিভারি (COD) কীভাবে কাজ করে?',
    aEn: 'You do not need to pay anything upfront. Simply place your order with your delivery address. When the Steadfast or Pathao courier delivers your parcel, you can inspect the package exterior, verify your items, and pay the cash directly to the delivery agent.',
    aBn: 'আপনাকে কোনো প্রকার অগ্রিম মূল্য দিতে হবে না। ওয়েবসাইটে পণ্যের অর্ডার করুন। কুরিয়ার ম্যান পার্সেল নিয়ে পৌঁছালে পণ্য দেখে সম্পূর্ণ মূল্য ক্যাশ পরিশোধ করুন।',
  },
  {
    qEn: 'What are the shipping charges and delivery timelines across Bangladesh?',
    qBn: 'বাংলাদেশের বিভিন্ন প্রান্তে ডেলিভারি চার্জ এবং সময়সীমা কত?',
    aEn: 'Inside Dhaka Metropolitan area: Standard delivery takes 24 to 48 hours at a flat charge of ৳60. Outside Dhaka / Nationwide (all 64 districts and upazilas): Delivery takes 2 to 4 business days at a flat charge of ৳120.',
    aBn: 'ঢাকা সিটির ভেতরে: চার্জ মাত্র ৬০ টাকা এবং ডেলিভারি সময় ২৪ থেকে ৪৮ ঘণ্টা। ঢাকার বাইরে / সারাদেশে: চার্জ ১২০ টাকা এবং ডেলিভারি সময় ২ থেকে ৪ কার্যদিবস।',
  },
  {
    qEn: 'How do I track my placed order?',
    qBn: 'আমি কীভাবে আমার অর্ডার ট্র্যাক করব?',
    aEn: 'Click on "Track Order" in the top navigation or bottom mobile bar, and enter your unique order number (e.g. AB-2026-1001). You will see real-time status: Order Placed, Confirmed, Processing, Handed to Courier, and Delivered.',
    aBn: 'ওয়েবসাইটের "Track Order" অপশনে গিয়ে আপনার অর্ডার নম্বর (যেমন: AB-2026-1001) লিখুন। সাথে সাথে আপনার পার্সেলের সর্বশেষ অবস্থা দেখতে পারবেন।',
  },
  {
    qEn: 'What is your Return and Refund policy if a product is damaged or mismatched?',
    qBn: 'পণ্য ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ হলে রিটার্ন বা রিফান্ড পলিসি কী?',
    aEn: 'We provide a 7-day hassle-free return window. If an item arrives broken, expired, or significantly different from the product description, contact our support hotline (+880 1700-123456) within 7 days. We provide a full replacement or refund.',
    aBn: 'আমাদের রয়েছে ৭ দিনের সহজ রিটার্ন সুবিধা। পণ্য ভাঙা বা ভুল হলে ডেলিভারির ৭ দিনের মধ্যে আমাদের হেল্পলাইনে (+880 1700-123456) যোগাযোগ করুন। আমরা সম্পূর্ণ বিনামূল্যে পরিবর্তন বা রিফান্ড প্রদান করব।',
  },
  {
    qEn: 'Are all food and grocery items BSTI and organically certified?',
    qBn: 'খাদ্যপণ্য ও ভেষজ সামগ্রী কি বিএসটিআই এবং শতভাগ খাঁটি?',
    aEn: 'Yes. All our food items, including Sundarbans natural wild honey, cold-pressed mustard oil, and premium Chinigura rice, are procured directly from verified grassroots producers and comply with Bangladesh BSTI quality standards.',
    aBn: 'হ্যাঁ। আমাদের সুন্দরবনের খলিশা ফুলের মধু, ঘানিভাঙা খাঁটি সরিষার তেল ও দিনাজপুরের চিনিগুঁড়া চাল সরাসরি বিশ্বস্ত উৎপাদকদের থেকে সংগৃহীত এবং বিএসটিআই মানসম্পন্ন।',
  },
];

export const FAQPage: React.FC = () => {
  const { language, t, navigateTo } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((cur) => (cur === idx ? null : idx));
  };

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('navFaq'), active: true }]} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t('faqTitle')}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            {language === 'bn'
              ? 'আমারবাজার সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্ন ও স্পষ্ট উত্তর'
              : 'Answers to frequently asked questions about orders, delivery, and payments'}
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const q = language === 'bn' ? faq.qBn : faq.qEn;
            const a = language === 'bn' ? faq.aBn : faq.aEn;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 transition"
                >
                  <span className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                    {q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                    <p>{a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="p-6 bg-stone-100 rounded-3xl border border-stone-200 text-center space-y-3">
          <h3 className="font-bold text-stone-900 text-base">
            {language === 'bn' ? 'আরও কোনো প্রশ্ন আছে?' : 'Still have unanswered questions?'}
          </h3>
          <p className="text-stone-500 text-xs max-w-md mx-auto">
            {language === 'bn'
              ? 'আমাদের গ্রাহক সেবা দল আপনার যেকোনো প্রশ্নের দ্রুত উত্তর দিতে প্রস্তুত।'
              : 'Our customer support representatives are on standby 7 days a week.'}
          </p>
          <div className="pt-1 flex justify-center gap-3">
            <button
              onClick={() => navigateTo('contact')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {t('navContact')}
            </button>
            <a
              href="tel:+8801700123456"
              className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>+880 1700-123456</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
