import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    language,
    t,
    cartItems,
    cartTotals,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    formatPrice,
    navigateTo,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pb-20">
        <Breadcrumbs items={[{ label: t('shoppingCart'), active: true }]} />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{t('cartEmpty')}</h1>
          <p className="mt-2 text-stone-500 text-sm leading-relaxed">{t('cartEmptySubtitle')}</p>
          <div className="mt-8">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {t('continueShopping')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('shoppingCart'), active: true }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('shoppingCart')}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {language === 'bn'
                ? `আপনার ব্যাগে ${cartItems.length} টি আইটেম রয়েছে`
                : `You have ${cartItems.length} distinct item(s) in your cart`}
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearCart')}</span>
          </button>
        </div>

        {/* Cart Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs divide-y divide-stone-100 overflow-hidden">
              {cartItems.map((item) => {
                const displayName =
                  language === 'bn' ? item.product.nameBn : item.product.nameEn;
                const unitPrice = item.unitPrice;
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Image & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        onClick={() =>
                          navigateTo('product', { slug: item.product.slug })
                        }
                        className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden shrink-0 cursor-pointer border border-stone-100"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          {item.product.brand}
                        </span>
                        <h4
                          onClick={() =>
                            navigateTo('product', { slug: item.product.slug })
                          }
                          className="font-bold text-stone-900 text-sm hover:text-emerald-700 cursor-pointer line-clamp-1"
                        >
                          {displayName}
                        </h4>

                        {/* Selected Variants display */}
                        {item.selectedVariants &&
                          Object.entries(item.selectedVariants).length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap text-[11px] text-stone-500 font-medium">
                              {Object.entries(item.selectedVariants).map(
                                ([key, val]) => (
                                  <span
                                    key={key}
                                    className="px-2 py-0.5 bg-stone-100 rounded-md text-stone-700"
                                  >
                                    {key}: <strong>{val}</strong>
                                  </span>
                                )
                              )}
                            </div>
                          )}

                        <p className="text-xs font-semibold text-emerald-700">
                          {formatPrice(unitPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Counter */}
                      <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-200 transition font-bold text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold text-stone-900 bg-white min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition font-bold text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm sm:text-base font-extrabold text-stone-900">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition"
                        title={language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shopping Continuation Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition"
              >
                &larr; <span>{t('continueShopping')}</span>
              </button>
            </div>
          </div>

          {/* Order Summary & Coupon Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-6">
              <h3 className="font-bold text-stone-900 text-lg tracking-tight pb-3 border-b border-stone-100">
                {t('orderSummary')}
              </h3>

              {/* Coupon Code Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'কুপন কোড' : 'Coupon Code'}</span>
                </span>

                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-900 uppercase">
                        {appliedCoupon}
                      </span>
                      <p className="text-emerald-700 text-[11px]">
                        {language === 'bn' ? 'কুপন সক্রিয়' : 'Coupon applied'} (-{formatPrice(cartTotals.discount)})
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-emerald-700 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="e.g. AMAR10, EID2026"
                      className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl uppercase font-semibold text-stone-800 focus:outline-hidden focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      {t('applyCoupon')}
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-rose-600 text-xs font-medium">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(cartTotals.subtotal)}
                  </span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-semibold">
                    <span>{t('discount')}</span>
                    <span>-{formatPrice(cartTotals.discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(cartTotals.deliveryCharge)}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-base font-extrabold text-stone-950">
                  <span>{t('total')}</span>
                  <span className="text-emerald-700">
                    {formatPrice(cartTotals.total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guarantee badges */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('paymentMethodCod')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? '১০০% নিরাপদ চেকআউট' : '100% Safe & Encrypted'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
