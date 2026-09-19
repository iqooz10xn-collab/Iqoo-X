import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { language, t, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      language === 'bn'
        ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।'
        : 'Your inquiry has been submitted! Our support team will respond shortly.',
      'success'
    );
    setName('');
    setPhone('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('navContact'), active: true }]} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t('contactUsTitle')}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            {language === 'bn'
              ? 'যেকোনো জিজ্ঞাসা, মতামত বা পরামর্শের জন্য আমাদের সাথে যুক্ত থাকুন'
              : 'Reach out to our customer support team for inquiries, bulk orders, or order assistance'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-300 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-white font-bold text-lg">
              {language === 'bn' ? 'অফিস ও হেল্পলাইন তথ্য' : 'Corporate Headquarters'}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {language === 'bn' ? 'প্রধান কার্যালয়:' : 'Head Office:'}
                  </p>
                  <p className="text-stone-400 mt-0.5">{t('addressDhaka')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {language === 'bn' ? 'গ্রাহক হেল্পলাইন:' : 'Customer Care:'}
                  </p>
                  <a
                    href="tel:+8801700123456"
                    className="text-emerald-400 hover:underline font-mono font-medium block mt-0.5"
                  >
                    +880 1700-123456
                  </a>
                  <a
                    href="tel:+8801800123456"
                    className="text-stone-400 hover:underline font-mono font-medium block mt-0.5"
                  >
                    +880 1800-123456
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {language === 'bn' ? 'ইমেইল যোগাযোগ:' : 'Official Email:'}
                  </p>
                  <p className="text-stone-400 mt-0.5">support@amarbazaar.com.bd</p>
                  <p className="text-stone-400">corporate@amarbazaar.com.bd</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {language === 'bn' ? 'সেবা প্রদান সময়:' : 'Operating Hours:'}
                  </p>
                  <p className="text-stone-400 mt-0.5">{t('supportHours')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs">
            <h3 className="font-bold text-stone-900 text-lg mb-4">
              {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send us a Direct Message'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('fullNameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'bn' ? 'বিষয় (Subject)' : 'Subject'} *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: অর্ডার সংক্রান্ত প্রশ্ন, হোলসেল অনুসন্ধান' : 'e.g. Order Inquiry, Bulk Purchase'}
                  className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'bn' ? 'বিস্তারিত বার্তা (Message)' : 'Detailed Message'} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার বক্তব্য বিস্তারিত লিখুন...' : 'Write your question or request here...'}
                  className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
              </button>

              {submitted && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'bn'
                      ? 'ধন্যবাদ! আপনার বার্তাটি আমাদের গ্রাহক সেবা টিমে পৌঁছেছে।'
                      : 'Thank you! We have received your inquiry.'}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
