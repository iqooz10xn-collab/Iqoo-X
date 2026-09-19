import React from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ShippingPolicyPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('shippingPolicyTitle'), active: true }]} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xs space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-stone-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('shippingPolicyTitle')}
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              Nationwide Logistics Across 64 Districts
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              1. Delivery Coverage and Zones
            </h3>
            <p>
              AmarBazaar ships to every district, upazila, and thana across Bangladesh in partnership with established courier networks including Steadfast Courier, Pathao Logistics, and RedX.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              2. Shipping Charges
            </h3>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between font-medium">
                <span>Inside Dhaka Metropolitan:</span>
                <span className="font-bold text-stone-900">৳ 60 Flat Fee</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Outside Dhaka / All Other 63 Districts:</span>
                <span className="font-bold text-stone-900">৳ 120 Flat Fee</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-stone-900">
              3. Delivery Timelines
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Inside Dhaka:</strong> 24 to 48 hours following order verification.</li>
              <li><strong>Outside Dhaka / Divisional Cities:</strong> 2 to 3 business days.</li>
              <li><strong>Remote Upazilas & Thanas:</strong> 3 to 4 business days.</li>
            </ul>

            <h3 className="text-base font-bold text-stone-900">
              4. Parcel Inspection Upon Receipt
            </h3>
            <p>
              We encourage all customers to inspect the outer packaging and verify invoice totals before handing over Cash on Delivery payments to the delivery agent.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
