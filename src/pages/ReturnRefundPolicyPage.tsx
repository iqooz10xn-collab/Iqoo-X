import React from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ReturnRefundPolicyPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('returnRefundTitle'), active: true }]} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xs space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-stone-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('returnRefundTitle')}
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              Hassle-Free 7-Day Protection Policy
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              1. 7-Day Return Guarantee
            </h3>
            <p>
              If a product delivered is damaged, broken, expired, or differs significantly from what was displayed on the product page, you are eligible for an immediate replacement or full refund within 7 calendar days of delivery.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              2. Return Eligibility Criteria
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The product must be unused, in original condition with manufacturer tags intact.</li>
              <li>For apparel and lifestyle goods, original packaging, labels, and warranty cards must accompany the item.</li>
              <li>Perishable food items (e.g., fresh groceries) must be reported within 24 hours of delivery.</li>
            </ul>

            <h3 className="text-base font-bold text-stone-900">
              3. Refund Processing Timeline
            </h3>
            <p>
              Once a returned parcel is inspected and approved at our fulfillment center, refunds are processed within 3 to 5 business days directly through bKash, Nagad, or original payment channel. For Cash on Delivery orders, customer care will verify your desired MFS account for reimbursement.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              4. How to Initiate a Return
            </h3>
            <p>
              Call our customer helpline at <strong>+880 1700-123456</strong> or send an email with photos of the damaged item to <strong>returns@amarbazaar.com.bd</strong> along with your Order Number (e.g. AB-2026-1001).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
