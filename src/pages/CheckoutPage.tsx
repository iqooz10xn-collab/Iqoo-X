import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  getDivisionList,
  getDistrictsByDivisionId,
  getUpazilasByDistrictName,
  DivisionInfo,
  DistrictInfo,
} from '../data/bangladeshData';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { Address, PaymentMethod, OrderItem } from '../types';
import {
  Truck,
  Lock,
  AlertCircle,
  Info,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    language,
    t,
    cartItems,
    cartTotals,
    formatPrice,
    navigateTo,
    clearCart,
    currentUser,
    setShippingRate,
    siteSettings,
  } = useApp();

  const divisionList = getDivisionList();
  const insideRate = siteSettings?.insideDhakaDeliveryRate ?? 60;
  const outsideRate = siteSettings?.outsideDhakaDeliveryRate ?? 120;

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [divisionId, setDivisionId] = useState(divisionList[0]?.id || 'dhaka');
  const [districtName, setDistrictName] = useState('Dhaka (City & Suburbs)');
  const [upazilaName, setUpazilaName] = useState('Dhanmondi');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Shipping & Payment selection
  const [shippingMethod, setShippingMethod] = useState<'inside-dhaka' | 'outside-dhaka'>('inside-dhaka');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Available districts and upazilas
  const availableDistricts = getDistrictsByDivisionId(divisionId);
  const availableUpazilas = getUpazilasByDistrictName(districtName);

  // Update initial districts when division changes
  const handleDivisionChange = (newDivId: string) => {
    setDivisionId(newDivId);
    const districts = getDistrictsByDivisionId(newDivId);
    if (districts.length > 0) {
      const firstDist = districts[0].nameEn;
      setDistrictName(firstDist);
      const upz = getUpazilasByDistrictName(firstDist);
      setUpazilaName(upz.length > 0 ? upz[0].en : 'Sadar');
    }

    // Auto-adjust delivery zone
    if (newDivId === 'dhaka') {
      setShippingMethod('inside-dhaka');
      setShippingRate(insideRate);
    } else {
      setShippingMethod('outside-dhaka');
      setShippingRate(outsideRate);
    }
  };

  const handleDistrictChange = (newDistName: string) => {
    setDistrictName(newDistName);
    const upz = getUpazilasByDistrictName(newDistName);
    setUpazilaName(upz.length > 0 ? upz[0].en : 'Sadar');

    if (newDistName.toLowerCase().includes('dhaka')) {
      setShippingMethod('inside-dhaka');
      setShippingRate(insideRate);
    } else {
      setShippingMethod('outside-dhaka');
      setShippingRate(outsideRate);
    }
  };

  // Sync with current user profile if available
  useEffect(() => {
    if (currentUser) {
      if (!fullName && currentUser.name) setFullName(currentUser.name);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
      if (!email && currentUser.email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = language === 'bn' ? 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন' : 'Full name is required';
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!cleanPhone) {
      newErrors.phone = language === 'bn' ? 'মোবাইল নম্বর লিখুন' : 'Phone number is required';
    } else if (!bdPhoneRegex.test(cleanPhone)) {
      newErrors.phone = t('phoneValidationNote');
    }

    if (!streetAddress.trim()) {
      newErrors.streetAddress = language === 'bn' ? 'বিস্তারিত ঠিকানা প্রদান করুন' : 'Street address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentNotice(null);

    try {
      const selectedDivision = divisionList.find((d) => d.id === divisionId);
      const divisionLabel = language === 'bn' ? selectedDivision?.nameBn || divisionId : selectedDivision?.nameEn || divisionId;

      const shippingAddress: Address = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        division: divisionLabel,
        district: districtName,
        upazila: upazilaName,
        streetAddress: streetAddress.trim(),
        postalCode: postalCode.trim(),
      };

      // 1. Process payment via paymentService
      const tempId = `TEMP-${Date.now()}`;
      const paymentRes = await paymentService.initiatePayment(selectedPayment, cartTotals.total, tempId);

      // If online gateway is selected without live credentials, transparently inform user
      if (!paymentRes.success) {
        setIsProcessing(false);
        setPaymentNotice(language === 'bn' ? paymentRes.messageBn : paymentRes.messageEn);
        return;
      }

      // 2. Prepare Order Items
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.productId,
        nameEn: item.product.nameEn,
        nameBn: item.product.nameBn,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity,
        image: item.product.images[0] || '',
      }));

      // 3. Create real order record in OrderService
      const newOrder = await orderService.createOrder({
        customerInfo: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        shippingAddress,
        items: orderItems,
        subtotal: cartTotals.subtotal,
        discountAmount: cartTotals.discount,
        deliveryCharge: cartTotals.deliveryCharge,
        totalAmount: cartTotals.total,
        paymentMethod: selectedPayment,
      });

      // 4. Clear shopping cart and redirect
      clearCart();
      navigateTo('order-success', { orderId: newOrder.id, orderNumber: newOrder.id });
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to place order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-stone-900">{t('cartEmpty')}</h2>
        <p className="text-stone-500 text-xs mt-1">{t('cartEmptySubtitle')}</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md transition"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[
          { label: t('shoppingCart'), page: 'cart' },
          { label: t('checkoutTitle'), active: true },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight pb-4 border-b border-stone-200">
          {t('checkoutTitle')}
        </h1>

        <form onSubmit={handlePlaceOrder} className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Customer Info, Shipping Address, Payment (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Customer Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-extrabold">
                    1
                  </span>
                  <span>{t('customerInfo')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('fullNameLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tanvir Ahmed"
                      className={`w-full p-2.5 text-xs border rounded-xl focus:outline-hidden focus:border-emerald-600 ${
                        errors.fullName ? 'border-rose-500 bg-rose-50' : 'border-stone-200'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>
                    )}
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
                      className={`w-full p-2.5 text-xs border rounded-xl focus:outline-hidden focus:border-emerald-600 ${
                        errors.phone ? 'border-rose-500 bg-rose-50' : 'border-stone-200'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('emailLabel')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tanvir@example.com"
                      className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address in Bangladesh */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-extrabold">
                    2
                  </span>
                  <span>{t('shippingAddress')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Division */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('divisionLabel')}
                    </label>
                    <select
                      value={divisionId}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 bg-white cursor-pointer"
                    >
                      {divisionList.map((div: DivisionInfo) => (
                        <option key={div.id} value={div.id}>
                          {language === 'bn' ? div.nameBn : div.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('districtLabel')}
                    </label>
                    <select
                      value={districtName}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 bg-white cursor-pointer"
                    >
                      {availableDistricts.map((dist: DistrictInfo) => (
                        <option key={dist.nameEn} value={dist.nameEn}>
                          {language === 'bn' ? dist.nameBn : dist.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila / Thana */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('upazilaLabel')}
                    </label>
                    <select
                      value={upazilaName}
                      onChange={(e) => setUpazilaName(e.target.value)}
                      className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 bg-white cursor-pointer"
                    >
                      {availableUpazilas.map((upz) => (
                        <option key={upz.en} value={upz.en}>
                          {language === 'bn' ? upz.bn : upz.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('streetAddressLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder={language === 'bn' ? 'বাড়ি নং, রোড নং, এলাকা (যেমন: বাড়ি ১২, রোড ৪, ধানমন্ডি)' : 'House No, Road No, Area (e.g. House 12, Road 4, Dhanmondi)'}
                      className={`w-full p-2.5 text-xs border rounded-xl focus:outline-hidden focus:border-emerald-600 ${
                        errors.streetAddress ? 'border-rose-500 bg-rose-50' : 'border-stone-200'
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="text-rose-600 text-[11px] mt-1">{errors.streetAddress}</p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('postalCodeLabel')}
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1209"
                      className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Delivery Notes */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('deliveryNoteLabel')}
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder={language === 'bn' ? 'ডেলিভারি ম্যানের জন্য কোনো বিশেষ নির্দেশনা থাকলে লিখুন...' : 'Any special notes for courier delivery...'}
                      className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Shipping Method Selector */}
                <div className="pt-4 border-t border-stone-100">
                  <span className="block text-xs font-bold text-stone-800 mb-2">
                    {language === 'bn' ? 'ডেলিভারি জোন ও চার্জ:' : 'Shipping Zone:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => {
                        setShippingMethod('inside-dhaka');
                        setShippingRate(insideRate);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        shippingMethod === 'inside-dhaka'
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <div>
                          <p className="text-xs font-bold text-stone-900">{t('insideDhaka')}</p>
                          <p className="text-[11px] text-stone-500">
                            {language === 'bn' ? '২৪-৪৮ ঘণ্টার দ্রুত ডেলিভারি' : '24-48 Hours Express'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-stone-900">
                        {formatPrice(insideRate)}
                      </span>
                    </div>

                    <div
                      onClick={() => {
                        setShippingMethod('outside-dhaka');
                        setShippingRate(outsideRate);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        shippingMethod === 'outside-dhaka'
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <div>
                          <p className="text-xs font-bold text-stone-900">{t('outsideDhaka')}</p>
                          <p className="text-[11px] text-stone-500">
                            {language === 'bn' ? '২-৪ কার্যদিবস (দেশব্যাপী)' : '2-4 Business Days (Nationwide)'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-stone-900">
                        {formatPrice(outsideRate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-extrabold">
                    3
                  </span>
                  <span>{t('paymentSelection')}</span>
                </h3>

                <div className="space-y-3 pt-2">
                  {/* Cash on Delivery (Recommended & Live) */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition ${
                      selectedPayment === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={selectedPayment === 'cod'}
                        onChange={() => {
                          setSelectedPayment('cod');
                          setPaymentNotice(null);
                        }}
                        className="mt-0.5 accent-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">
                            {t('paymentMethodCod')}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                            {language === 'bn' ? 'নিরাপদ ডেলিভারি' : 'Zero Advance'}
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          {t('paymentMethodCodDesc')}
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* bKash */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition ${
                      selectedPayment === 'bkash'
                        ? 'border-pink-500 bg-pink-50/30 ring-1 ring-pink-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={selectedPayment === 'bkash'}
                        onChange={() => {
                          setSelectedPayment('bkash');
                          setPaymentNotice(null);
                        }}
                        className="mt-0.5 accent-pink-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">
                            {t('paymentMethodBkash')}
                          </span>
                          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold rounded">
                            MFS
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          {t('paymentMethodBkashDesc')}
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition ${
                      selectedPayment === 'nagad'
                        ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={selectedPayment === 'nagad'}
                        onChange={() => {
                          setSelectedPayment('nagad');
                          setPaymentNotice(null);
                        }}
                        className="mt-0.5 accent-orange-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">
                            {t('paymentMethodNagad')}
                          </span>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">
                            Postal MFS
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          {t('paymentMethodNagadDesc')}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Honest Architectural Status Box for Online Gateways */}
                {paymentNotice && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-amber-900 text-xs animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">{language === 'bn' ? 'পেমেন্ট গেটওয়ে স্ট্যাটাস নোটিশ:' : 'Payment Gateway Status:'}</p>
                      <p className="text-amber-800 leading-relaxed">{paymentNotice}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-6 sticky top-24">
                <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
                  {t('orderSummary')}
                </h3>

                {/* Compact Items List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.nameEn}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-900 truncate">
                          {language === 'bn' ? item.product.nameBn : item.product.nameEn}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {formatPrice(item.unitPrice)} &times; {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900 shrink-0">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs text-stone-600">
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

                {errors.form && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium">
                    {errors.form}
                  </div>
                )}

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'bn' ? 'অর্ডার প্রক্রিয়াধীন...' : 'Processing Order...'}</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {t('placeOrderButton', { amount: cartTotals.total })}
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-stone-400">
                  {language === 'bn' ? '🔒 আপনার ব্যক্তিগত তথ্য ও অর্ডার সম্পূর্ণ সুরক্ষিত।' : '🔒 Safe & Encrypted Checkout'}
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
