import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { WhatsAppScreen } from './components/WhatsAppScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TrustCertModal } from './components/TrustCertModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-[#f5fbf1] text-[#171d17] flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-28 z-50 px-4 py-2 bg-[#003521] text-white rounded-full text-[12px] font-bold shadow-xl border border-[#b2f3a8]/30 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-[#b2f3a8]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header />

      {/* Viewport Content */}
      <main className="w-full max-w-xl flex-1 pt-24 min-h-screen flex flex-col">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'products-catalog' && <CatalogScreen />}
        {activeTab === 'categories' && <CategoriesScreen />}
        {activeTab === 'whatsapp-order' && <WhatsAppScreen />}
        {activeTab === 'account' && <ProfileScreen />}
        {activeTab === 'admin-dashboard' && <AdminDashboardScreen />}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Detailed Product Modal */}
      <ProductDetailModal />

      {/* BSTI Certification Modal */}
      <TrustCertModal />

      {/* Admin Login Modal */}
      <AdminLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
