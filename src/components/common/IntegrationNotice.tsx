import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Info, ChevronDown, ChevronUp, Terminal, Settings } from 'lucide-react';

export const IntegrationNotice: React.FC = () => {
  const { language, setIsAdminOpen } = useApp();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-stone-900 text-stone-300 text-xs border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-stone-300 font-medium">
            {language === 'bn'
              ? 'প্রোডাকশন-রেডি আর্কিটেকচার: রিয়েল গেটওয়ে ও ডাটাবেজ ইন্টিগ্রেশন পয়েন্ট প্রস্তুত।'
              : 'Production-Ready Architecture: Honest gateway boundaries & decoupled backend services.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-stone-400 hover:text-white inline-flex items-center gap-1 font-medium transition"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'আর্কিটেকচার বিবরণ' : 'Architecture Specs'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md font-semibold transition"
          >
            <Settings className="w-3 h-3" />
            <span>{language === 'bn' ? 'অ্যাডমিন কনসোল' : 'Admin Console'}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-stone-800 bg-stone-950/80 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-300">
            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Fake Payments Policy</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                bKash, Nagad, Rocket, and Upay gateways are built with real API endpoints and merchant placeholders. No fake payment confirmations or synthetic transaction IDs are generated. Cash on Delivery is live for checkout verification.
              </p>
            </div>

            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1.5">
                <Terminal className="w-4 h-4" />
                <span>Decoupled Repository Pattern</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Product, Cart, Order, and Customer services reside behind strict repository interfaces. Swapping local storage persistence with Firebase Firestore, Supabase, or PostgreSQL takes minutes.
              </p>
            </div>

            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1.5">
                <Settings className="w-4 h-4" />
                <span>Bangladesh Localization</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Includes 8 Bangladesh divisions, districts, thanas/upazilas, ৳ BDT currency with authentic Bengali numeral formatting, and 100% complete bilingual English/Bangla language dictionaries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
