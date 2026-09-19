import React from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TermsConditionsPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('termsConditionsTitle'), active: true }]} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xs space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-stone-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('termsConditionsTitle')}
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              Compliant with Digital Commerce Guidelines (Ministry of Commerce, Bangladesh)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing AmarBazaar or placing an order, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of Bangladesh.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              2. Product Accuracy & Authentic Pricing
            </h3>
            <p>
              All prices are listed in Bangladeshi Taka (৳ BDT) inclusive of applicable domestic taxes. We strive to provide truthful images, authentic product specifications, and current stock status. In the rare event of an unforeseen stock shortage, customer care will notify you immediately prior to courier dispatch.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              3. Order Confirmation and Dispatch
            </h3>
            <p>
              Placing an order generates a unique reference number (e.g. AB-2026-XXXX). Orders may undergo phone verification before shipment to ensure deliverability and prevent duplicate bookings.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              4. Customer Obligations
            </h3>
            <p>
              Customers agree to provide accurate recipient details and ensure that a designated person is reachable at the delivery address to receive the parcel and settle the invoice upon Cash on Delivery delivery.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
