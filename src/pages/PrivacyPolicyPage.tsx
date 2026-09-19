import React from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { language, t } = useApp();

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: t('privacyPolicyTitle'), active: true }]} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xs space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-stone-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('privacyPolicyTitle')}
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              Last Updated: January 2026 • AmarBazaar Limited (Bangladesh)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              1. Information We Collect
            </h3>
            <p>
              When you purchase or create an account with AmarBazaar, we collect essential consumer contact details including your full legal name, phone number, delivery address (Division, District, Upazila, and street coordinates), and email address. This data is used exclusively to facilitate package delivery, order verification, and shipment notifications.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              2. Zero Data Selling Commitment
            </h3>
            <p>
              We firmly uphold Bangladeshi data protection ethics. We will never sell, lease, or monetize your mobile numbers or personal credentials to third-party telemarketers or external advertising networks.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              3. Courier and Logistics Data Sharing
            </h3>
            <p>
              To complete physical parcel fulfillment, your delivery coordinates and telephone contact are securely passed to our vetted courier partners (e.g., Steadfast Courier, Pathao Logistics, RedX) solely for delivery dispatch.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              4. Payment & Financial Privacy
            </h3>
            <p>
              When utilizing Cash on Delivery, no financial account credentials are requested. If utilizing mobile financial services (bKash, Nagad, Rocket, Upay), transactions occur either on the provider's verified secure gateway interface or via direct customer-to-merchant transaction references.
            </p>

            <h3 className="text-base font-bold text-stone-900">
              5. Customer Rights & Account Removal
            </h3>
            <p>
              Customers may request a complete export or permanent deletion of their order history and address records at any time by contacting support@amarbazaar.com.bd or our support line at +880 1700-123456.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
