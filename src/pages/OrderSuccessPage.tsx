import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { orderService } from '../services/orderService';
import { Order, OrderItem } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PageLoadingSpinner } from '../components/common/LoadingSkeleton';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

interface OrderSuccessPageProps {
  orderNumber: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderNumber }) => {
  const { language, t, formatPrice, navigateTo } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const found = await orderService.getOrderByNumber(orderNumber);
        if (found) {
          setOrder(found);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return <PageLoadingSpinner message="Retrieving order verification..." />;
  }

  if (!order) {
    return (
      <div className="pb-20">
        <Breadcrumbs items={[{ label: t('orderSuccessTitle'), active: true }]} />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            {language === 'bn' ? 'অর্ডার খুঁজে পাওয়া যায়নি' : 'Order Reference Not Found'}
          </h2>
          <p className="text-stone-500 text-xs mt-2">
            {language === 'bn'
              ? `অর্ডার নম্বর "${orderNumber}" সম্পর্কিত কোনো তথ্য পাওয়া যায়নি।`
              : `We could not locate records for order #${orderNumber}.`}
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
          >
            {t('continueShopping')}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[
          { label: t('checkoutTitle'), page: 'checkout' },
          { label: t('orderSuccessTitle'), active: true },
        ]}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        {/* Success Banner */}
        <div className="bg-emerald-50 rounded-3xl p-6 sm:p-10 border border-emerald-200 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            {t('orderSuccessTitle')}
          </h1>
          <p className="text-emerald-800 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {language === 'bn'
              ? `আপনার অর্ডারটি সফলভাবে সংরক্ষিত হয়েছে (অর্ডার নং: ${order.id})। আমাদের টিম দ্রুত ডেলিভারির ব্যবস্থা গ্রহণ করবে।`
              : `Your order has been recorded successfully under reference #${order.id}. Our fulfillment team will process dispatch promptly.`}
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-900">
            <span className="px-3 py-1 bg-white rounded-lg border border-emerald-200">
              {t('orderIdLabel')}: {order.id}
            </span>
            <span className="px-3 py-1 bg-emerald-700 text-white rounded-lg uppercase">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Details'}</span>
            </h3>
            <span className="text-xs text-stone-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Delivery & Shipping Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('shippingAddress')}</span>
              </span>
              <p className="font-medium text-stone-900">{order.shippingAddress.fullName}</p>
              <p className="text-stone-500">{order.shippingAddress.streetAddress}</p>
              <p className="text-stone-500">
                {order.shippingAddress.upazila}, {order.shippingAddress.district},{' '}
                {order.shippingAddress.division}
              </p>
              <p className="font-mono text-stone-700 pt-1">
                {order.shippingAddress.phone}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('paymentSelection')}</span>
              </span>
              <p className="font-semibold text-stone-900 uppercase">
                {order.paymentMethod === 'cod' ? t('paymentMethodCod') : order.paymentMethod}
              </p>
              <p className="text-stone-500">
                {order.paymentStatus === 'paid'
                  ? (language === 'bn' ? 'পরিশোধিত' : 'Paid')
                  : (language === 'bn' ? 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন' : 'Payment due upon physical parcel arrival')}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {order.shippingAddress.division.toLowerCase() === 'dhaka'
                    ? (language === 'bn' ? 'আনুমানিক ডেলিভারি: ২৪-৪৮ ঘণ্টা' : 'Est. Delivery: 24-48 Hours')
                    : (language === 'bn' ? 'আনুমানিক ডেলিভারি: ২-৪ কার্যদিবস' : 'Est. Delivery: 2-4 Business Days')}
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="pt-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3">
              {language === 'bn' ? 'অর্ডারকৃত পণ্যসামগ্রী' : 'Purchased Items'}
            </h4>
            <div className="divide-y divide-stone-100">
              {order.items.map((item: OrderItem, idx: number) => (
                <div key={`${item.productId}-${idx}`} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {formatPrice(item.unitPrice)} &times; {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex items-center justify-between">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>{t('discount')}</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
              <span>{formatPrice(order.deliveryCharge)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-base font-extrabold text-stone-900">
              <span>{t('total')}</span>
              <span className="text-emerald-700">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Actions: Track Order & Shop more */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo('track-order', { orderNumber: order.id })}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>{t('navTrackOrder')}</span>
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('continueShopping')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
