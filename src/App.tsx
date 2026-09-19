import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { CustomerLoginPage } from './pages/CustomerLoginPage';
import { CustomerRegisterPage } from './pages/CustomerRegisterPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { ReturnRefundPolicyPage } from './pages/ReturnRefundPolicyPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';

const PageRenderer: React.FC = () => {
  const { route, navigateTo, t } = useApp();

  switch (route.page) {
    case 'home':
      return <HomePage />;

    case 'shop':
      return <ShopPage />;

    case 'category':
      return <ShopPage initialCategory={route.category} />;

    case 'search':
      return <ShopPage initialQuery={route.query} />;

    case 'product':
      return <ProductDetailPage slug={route.slug || 'sundarban-wild-pure-raw-honey'} />;

    case 'cart':
      return <CartPage />;

    case 'checkout':
      return <CheckoutPage />;

    case 'order-success':
      return <OrderSuccessPage orderNumber={route.orderNumber || route.orderId || ''} />;

    case 'track-order':
      return <TrackOrderPage initialOrderNumber={route.orderNumber || route.orderId} />;

    case 'login':
      return <CustomerLoginPage />;

    case 'register':
      return <CustomerRegisterPage />;

    case 'account':
      return <CustomerAccountPage />;

    case 'my-orders':
      return <MyOrdersPage />;

    case 'wishlist':
      return <WishlistPage />;

    case 'about':
      return <AboutUsPage />;

    case 'contact':
      return <ContactUsPage />;

    case 'faq':
      return <FAQPage />;

    case 'privacy-policy':
      return <PrivacyPolicyPage />;

    case 'terms':
      return <TermsConditionsPage />;

    case 'return-refund':
      return <ReturnRefundPolicyPage />;

    case 'shipping-policy':
      return <ShippingPolicyPage />;

    default:
      return (
        <main className="max-w-md mx-auto py-24 px-4 text-center">
          <span className="text-5xl font-black text-stone-300">404</span>
          <h1 className="text-2xl font-bold text-stone-900 mt-2">{t('pageNotFoundTitle')}</h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">{t('pageNotFoundDesc')}</p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            {t('navHome')}
          </button>
        </main>
      );
  }
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Layout>
          <PageRenderer />
        </Layout>
      </AppProvider>
    </ErrorBoundary>
  );
}
