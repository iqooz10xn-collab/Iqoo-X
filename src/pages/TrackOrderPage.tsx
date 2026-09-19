import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  AlertCircle,
  MapPin,
  PhoneCall,
} from 'lucide-react';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderNumber = '',
}) => {
  const { language, t, formatPrice, route } = useApp();

  const [orderNumberInput, setOrderNumberInput] = useState(
    initialOrderNumber || route.orderNumber || route.orderId || ''
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-search if initialOrderNumber is provided
  useEffect(() => {
    const initNo = initialOrderNumber || route.orderNumber || route.orderId;
    if (initNo) {
      setOrderNumberInput(initNo);
      handleTrack(initNo);
    }
  }, [initialOrderNumber, route.orderNumber, route.orderId]);

  const handleTrack = async (targetNo?: string) => {
    const num = (targetNo || orderNumberInput).trim().toUpperCase();
    if (!num) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক অর্ডার নম্বর লিখুন।'
          : 'Please enter a valid order reference number.'
      );
      return;
    }

    setErrorMessage('');
    setSearching(true);
    setHasSearched(true);

    try {
      const found = await orderService.getOrderByNumber(num);
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setErrorMessage(
          language === 'bn'
            ? `অর্ডার নম্বর "${num}" খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক নম্বরটি লিখুন (যেমন: AB-260312)`
            : `Order reference "${num}" not found. Please double-check your order ID (e.g. AB-260312).`
        );
      }
    } finally {
      setSearching(false);
    }
  };

  const steps: { status: OrderStatus; labelEn: string; labelBn: string }[] = [
    { status: 'pending', labelEn: 'Order Placed', labelBn: 'অর্ডার গৃহীত' },
    { status: 'confirmed', labelEn: 'Confirmed', labelBn: 'নিশ্চিতকৃত' },
    { status: 'processing', labelEn: 'Packaging', labelBn: 'প্যাকিং চলছে' },
    { status: 'shipped', labelEn: 'Handed to Courier', labelBn: 'কুরিয়ারে হস্তান্তর' },
    { status: 'delivered', labelEn: 'Delivered', labelBn: 'ডেলিভার্ড' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('navTrackOrder'), active: true }]} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 space-y-8">
        {/* Track Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xs text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t('trackYourOrder')}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            {language === 'bn'
              ? 'আপনার অর্ডার আইডি (যেমন: AB-260312) দিয়ে ডেলিভারি ট্র্যাকিং ও অগ্রগতি পর্যবেক্ষণ করুন'
              : 'Enter your order reference ID (e.g. AB-260312) to trace your parcel status in real-time'}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                required
                value={orderNumberInput}
                onChange={(e) => {
                  setOrderNumberInput(e.target.value.toUpperCase());
                  setErrorMessage('');
                }}
                placeholder={language === 'bn' ? 'অর্ডার নম্বর দিন (যেমন: AB-260312)' : 'Enter Order Number (e.g. AB-260312)'}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono uppercase focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
              <Package className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {searching ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ট্র্যাক করুন' : 'Track Order'}</span>
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl inline-flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Order Status Timeline Results */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-8 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  {language === 'bn' ? 'অর্ডার বিবরণ' : 'Order Details'}
                </span>
                <h3 className="text-xl font-bold text-stone-900 font-mono">
                  {order.id}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {language === 'bn' ? 'অর্ডার তৈরির তারিখ:' : 'Placed on:'}{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg uppercase">
                  {order.orderStatus}
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="py-4">
              <div className="grid grid-cols-5 gap-2 relative">
                {/* Connecting background track */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-stone-200 -z-0" />

                {steps.map((step, idx) => {
                  const isCompleted = currentStep >= idx;
                  const isCurrent = currentStep === idx;

                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center text-center relative z-10 space-y-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <span
                        className={`text-[11px] font-semibold leading-tight ${
                          isCompleted ? 'text-stone-900' : 'text-stone-400'
                        }`}
                      >
                        {language === 'bn' ? step.labelBn : step.labelEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Delivery snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs text-stone-700">
              <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                <p className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'লজিস্টিক ও কুরিয়ার পার্টনার:' : 'Logistics Partner:'}</span>
                </p>
                <p className="text-stone-700 font-semibold">
                  {order.courierPartner || 'Steadfast / Pathao Courier BD'}
                </p>
                {order.trackingNumber && (
                  <p className="font-mono text-stone-600 text-[11px]">
                    {language === 'bn' ? 'কুরিয়ার ট্র্যাকিং নং:' : 'Courier Tracking #:'} {order.trackingNumber}
                  </p>
                )}
                <p className="text-stone-500">
                  {language === 'bn'
                    ? 'আপনার পার্সেল কুরিয়ারে বুক করা হলে মোবাইল নম্বরে এসএমএস ট্র্যাকিং পাঠানো হয়।'
                    : 'Once dispatched, real-time SMS tracking updates are forwarded to your mobile.'}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                <p className="font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('shippingAddress')}</span>
                </p>
                <p className="text-stone-700 font-medium">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-stone-500">
                  {order.shippingAddress.streetAddress}, {order.shippingAddress.upazila},{' '}
                  {order.shippingAddress.district}
                </p>
              </div>
            </div>

            {/* Support hotline */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-900">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'অর্ডারের অগ্রগতি সংক্রান্ত যেকোনো প্রয়োজনে আমাদের হেল্পলাইনে যোগাযোগ করুন:'
                    : 'Need assistance with your delivery status? Speak with our care team:'}
                </span>
              </div>
              <a
                href="tel:+8801700123456"
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition shrink-0"
              >
                +880 1700-123456
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
