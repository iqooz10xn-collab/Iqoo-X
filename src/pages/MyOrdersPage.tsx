import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { orderService } from '../services/orderService';
import { Order, OrderItem } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PageLoadingSpinner } from '../components/common/LoadingSkeleton';
import {
  Package,
  ChevronRight,
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { language, t, formatPrice, navigateTo, currentUser } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (currentUser?.phone) {
          const userOrders = await orderService.findOrdersByPhone(currentUser.phone);
          setOrders(userOrders);
        } else {
          // Show recent orders placed in current browser session
          const all = await orderService.getAllOrders();
          setOrders(all);
        }
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [currentUser]);

  if (loading) {
    return <PageLoadingSpinner message={language === 'bn' ? 'অর্ডার তালিকা লোড হচ্ছে...' : 'Loading order history...'} />;
  }

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[
          { label: t('navAccount'), page: 'account' },
          { label: language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders', active: true },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Order History'}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {language === 'bn'
                ? `মোট ${orders.length} টি অর্ডারের রেকর্ড রয়েছে`
                : `Found ${orders.length} order history record(s)`}
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            {t('continueShopping')}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 shadow-2xs max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Orders Found'}
            </h3>
            <p className="text-stone-500 text-xs">
              {language === 'bn'
                ? 'আপনি এখনও কোনো অর্ডার করেননি। আমাদের নতুন কালেকশন দেখুন!'
                : 'You have not placed any orders yet. Discover our quality products today!'}
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
            >
              {t('heroShopNow')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-4 hover:border-emerald-500/40 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {order.id}
                    </span>
                    <span className="text-stone-400 ml-2">
                      • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded uppercase text-[10px]">
                      {order.orderStatus}
                    </span>
                    <span className="font-extrabold text-stone-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items preview row */}
                <div className="space-y-2">
                  {order.items.map((item: OrderItem, idx: number) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.nameEn}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <span className="font-medium text-stone-800 line-clamp-1">
                          {language === 'bn' ? item.nameBn : item.nameEn}{' '}
                          <strong className="text-stone-400">
                            &times; {item.quantity}
                          </strong>
                        </span>
                      </div>
                      <span className="font-semibold text-stone-700 shrink-0">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    {order.paymentMethod === 'cod' ? t('paymentMethodCod') : order.paymentMethod.toUpperCase()} •{' '}
                    {order.shippingAddress.district}
                  </span>

                  <button
                    onClick={() =>
                      navigateTo('track-order', { orderNumber: order.id })
                    }
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>{t('navTrackOrder')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
