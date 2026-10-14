import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, lang } = useApp();

  const navItems: { id: TabType; icon: string; labelBn: string; labelEn: string; isSpecial?: boolean }[] = [
    { id: 'home', icon: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'products-catalog', icon: 'storefront', labelBn: 'পণ্যসমূহ', labelEn: 'Products' },
    { id: 'categories', icon: 'category', labelBn: 'ক্যাটাগরি', labelEn: 'Categories' },
    { id: 'whatsapp-order', icon: 'chat', labelBn: 'হোয়াটসঅ্যাপ', labelEn: 'WhatsApp', isSpecial: true },
    { id: 'account', icon: 'person', labelBn: 'প্রোফাইল', labelEn: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(23,77,53,0.08)] border-t border-[#dee4db]/60">
      <div className="max-w-xl mx-auto flex justify-around items-center h-16 px-1">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all active:scale-95 ${
                isActive ? 'text-[#003521] font-bold scale-105' : 'text-[#404943] hover:text-[#003521]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-colors ${
                  item.isSpecial
                    ? 'text-[#25D366]'
                    : isActive
                    ? 'text-[#003521] fill-1'
                    : 'text-[#404943]'
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-bold text-[#003521]' : 'font-medium'}`}>
                {lang === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
