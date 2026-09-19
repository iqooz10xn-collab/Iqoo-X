import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const { language, t, navigateTo, setCurrentUser, showToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login(identifier.trim(), password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast(language === 'bn' ? 'সফলভাবে লগইন হয়েছে!' : 'Successfully logged in!', 'success');
        navigateTo('account');
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('loginTitle'), active: true }]} />

      <main className="max-w-md mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t('loginTitle')}
            </h1>
            <p className="text-stone-500 text-xs">
              {language === 'bn'
                ? 'আপনার অ্যাকাউন্টে প্রবেশ করে অর্ডার ট্র্যাক করুন ও ঠিকানা পরিচালনা করুন'
                : 'Sign in to access your orders and account settings'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর বা ইমেইল' : 'Mobile Number or Email'} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="017XXXXXXXX or user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {t('password')} *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      language === 'bn'
                        ? 'পাসওয়ার্ড রিসেট এসএমএস সেবা কনফিগারেশন অধীনে রয়েছে।'
                        : 'Password recovery gateway is connected in the next infrastructure stage.',
                      'info'
                    )
                  }
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <p className="text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('loginButton')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>{t('dontHaveAccount')} </span>
            <button
              onClick={() => navigateTo('register')}
              className="font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              {t('registerButton')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
