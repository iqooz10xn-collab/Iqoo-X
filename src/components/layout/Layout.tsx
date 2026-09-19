import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../common/ToastContainer';
import { IntegrationNotice } from '../common/IntegrationNotice';
import { AdminPortalModal } from '../admin/AdminPortalModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Top Architecture Notice Banner */}
      <IntegrationNotice />

      {/* Main Header & Navigation */}
      <Header />

      {/* Page Content */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Toast Feedback Notifications */}
      <ToastContainer />

      {/* WordPress / WooCommerce Alternative Admin Management Modal */}
      <AdminPortalModal />
    </div>
  );
};
