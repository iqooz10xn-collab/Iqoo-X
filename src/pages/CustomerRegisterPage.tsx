import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { User, Phone, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerRegisterPage: React.FC = () => {
  const { language, t, navigateTo, setCurrentUser, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে শর্তাবলীতে সম্মত হন।'
          : 'Please agree to terms and conditions.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      });

      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast(
          language === 'bn'
            ? 'অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে!'
            : 'Customer account created successfully!',
          'success'
        );
        navigateTo('account');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('registerTitle'), active: true }]} />

      <main className="max-w-md mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t('registerTitle')}
            </h1>
            <p className="text-stone-500 text-xs">
              {language === 'bn'
                ? 'দ্রুত অ্যাকাউন্ট খুলে অর্ডার ট্র্যাক করুন ও ঠিকানা সংরক্ষণ করুন'
                : 'Create an account to track orders and save shipping addresses'}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
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
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tanvir@example.com"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('password')} *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                {language === 'bn'
                  ? 'আমি আমারবাজারের শর্তাবলী ও গোপনীয়তা নীতি মেনে নিচ্ছি।'
                  : 'I agree to the AmarBazaar Terms of Service & Privacy Policy.'}
              </span>
            </label>

            {error && (
              <p className="text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('registerButton')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>{t('alreadyHaveAccount')} </span>
            <button
              onClick={() => navigateTo('login')}
              className="font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              {t('loginButton')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
