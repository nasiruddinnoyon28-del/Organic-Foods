import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { toBnDigit } from './Header';

export const ProfileScreen: React.FC = () => {
  const {
    lang,
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
    showToast,
    setIsCertModalOpen,
    adminUser,
    setIsAdminModalOpen,
    logoutAdmin,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'wishlist' | 'orders' | 'addresses'>('wishlist');

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const sampleOrders = [
    {
      id: 'ORD-89412',
      dateBn: '১০ অক্টোবর ২০২৫',
      dateEn: '10 Oct 2025',
      itemsBn: 'খাঁটি গাওয়া ঘি (500g), সুন্দরবনের মধু (500g)',
      itemsEn: 'Cow Ghee (500g), Wild Honey (500g)',
      total: 1670,
      statusBn: 'ডেলিভারি সম্পন্ন',
      statusEn: 'Delivered',
      statusColor: 'bg-[#b2f3a8] text-[#16521a]'
    },
    {
      id: 'ORD-87114',
      dateBn: '২৮ সেপ্টেম্বর ২০২৫',
      dateEn: '28 Sep 2025',
      itemsBn: 'ঘানি ভাঙা সরিষার তেল (1L), প্রাকৃতিক চিয়া সিড (250g)',
      itemsEn: 'Mustard Oil (1L), Chia Seeds (250g)',
      total: 760,
      statusBn: 'ডেলিভারি সম্পন্ন',
      statusEn: 'Delivered',
      statusColor: 'bg-[#b2f3a8] text-[#16521a]'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#dee4db]/60 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#003521] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            নাহ
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="font-['Hind_Siliguri'] text-[17px] font-bold text-[#003521]">
                {lang === 'bn' ? 'নাসির উদ্দিন নয়ন' : 'Nasir Uddin Noyon'}
              </h2>
              <span className="material-symbols-outlined text-[#316a2f] text-[16px]">verified</span>
            </div>
            <p className="text-[11px] text-[#717973]">+880 1712-345678</p>
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#ffdea2] text-[#261900] text-[9px] font-bold mt-1">
              {lang === 'bn' ? 'গোল্ড মেম্বার • ১০০% অর্গানিক লাভার' : 'Gold Member • Organic Lover'}
            </span>
          </div>
        </div>

        <button
          onClick={() => showToast(lang === 'bn' ? 'প্রোফাইল আপডেট সক্রিয়' : 'Profile updated')}
          className="w-9 h-9 rounded-full bg-[#eff5ec] text-[#003521] flex items-center justify-center hover:bg-[#e4eae0]"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-[#eff5ec] rounded-2xl mb-4">
        {[
          { id: 'wishlist', labelBn: `ফেভারিট (${wishlist.length})`, labelEn: `Wishlist (${wishlist.length})`, icon: 'favorite' },
          { id: 'orders', labelBn: 'অর্ডার সমূহ', labelEn: 'My Orders', icon: 'local_mall' },
          { id: 'addresses', labelBn: 'ঠিকানা', labelEn: 'Addresses', icon: 'location_on' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-2 px-1 text-center rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
              activeSubTab === tab.id
                ? 'bg-white text-[#003521] shadow-xs'
                : 'text-[#404943] hover:text-[#003521]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Wishlist View */}
      {activeSubTab === 'wishlist' && (
        <div className="space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#dee4db]/50">
              <span className="material-symbols-outlined text-[36px] text-[#717973] mb-2">favorite_border</span>
              <p className="text-[13px] font-medium text-[#404943]">
                {lang === 'bn' ? 'আপনার ফেভারিট লিস্ট খালি' : 'Your wishlist is empty'}
              </p>
            </div>
          ) : (
            wishlistedProducts.map(prod => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-3 shadow-xs border border-[#dee4db]/50 flex items-center justify-between gap-3"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.nameBn}
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                  onClick={() => setSelectedProduct(prod)}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => setSelectedProduct(prod)}
                    className="font-['Hind_Siliguri'] text-[13px] font-bold text-[#003521] truncate cursor-pointer hover:underline"
                  >
                    {lang === 'bn' ? prod.nameBn : prod.nameEn}
                  </h4>
                  <p className="text-[11px] text-[#717973]">{prod.weight}</p>
                  <span className="text-[13px] font-bold text-[#003521] font-['Inter']">
                    ৳ {lang === 'bn' ? toBnDigit(prod.price) : prod.price}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => addToCart(prod)}
                    className="px-3 py-1.5 rounded-lg bg-[#174d35] text-white text-[11px] font-semibold flex items-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                    <span>{lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="text-[11px] text-red-500 hover:underline flex items-center justify-center"
                  >
                    {lang === 'bn' ? 'মুছুন' : 'Remove'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Orders View */}
      {activeSubTab === 'orders' && (
        <div className="space-y-3">
          {sampleOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-[#dee4db]/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#717973] font-mono">{order.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.statusColor}`}>
                  {lang === 'bn' ? order.statusBn : order.statusEn}
                </span>
              </div>
              <p className="text-[12px] font-medium text-[#171d17]">
                {lang === 'bn' ? order.itemsBn : order.itemsEn}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-[#dee4db]/40 text-[11px]">
                <span className="text-[#717973]">{lang === 'bn' ? order.dateBn : order.dateEn}</span>
                <span className="font-bold text-[#003521] font-['Inter']">
                  ৳ {lang === 'bn' ? toBnDigit(order.total) : order.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Addresses View */}
      {activeSubTab === 'addresses' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#dee4db]/50 relative">
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b2f3a8] text-[#16521a]">
              {lang === 'bn' ? 'ডিফল্ট ঠিকানা' : 'Default'}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#003521]">home</span>
              <h4 className="text-[13px] font-bold text-[#003521]">
                {lang === 'bn' ? 'বাসার ঠিকানা (ধানমন্ডি)' : 'Home (Dhanmondi)'}
              </h4>
            </div>
            <p className="text-[12px] text-[#404943] leading-relaxed">
              বাড়ি #১২/এ, রোড #৪, ধানমন্ডি আ/এ, ঢাকা - ১২০৫
            </p>
            <p className="text-[11px] text-[#717973] mt-1">+880 1712-345678</p>
          </div>

          <button
            onClick={() => showToast(lang === 'bn' ? 'নতুন ঠিকানা ফর্ম সক্রিয়' : 'New address sheet ready')}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#174d35] text-[#174d35] text-[12px] font-bold flex items-center justify-center gap-1 hover:bg-[#eff5ec] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>{lang === 'bn' ? 'নতুন ঠিকানা যোগ করুন' : 'Add New Address'}</span>
          </button>
        </div>
      )}

      {/* Admin Portal Gateway */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-[#dee4db] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#003521] text-[#ffdea2] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </div>
            <div>
              <h4 className="font-['Hind_Siliguri'] text-[14px] font-bold text-[#003521]">
                {lang === 'bn' ? 'স্টোর এডমিন প্যানেল' : 'Store Admin Portal'}
              </h4>
              <p className="text-[11px] text-[#717973]">
                {adminUser
                  ? (lang === 'bn' ? `লগইনকৃত: ${adminUser.email}` : `Logged in as: ${adminUser.email}`)
                  : (lang === 'bn' ? 'মালিক ও ম্যানেজারদের জন্য' : 'For Store Owners & Managers')}
              </p>
            </div>
          </div>

          {adminUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className="px-3 py-1.5 rounded-xl bg-[#003521] text-white text-[11px] font-bold shadow-xs hover:bg-[#174d35]"
              >
                {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
              </button>
              <button
                onClick={logoutAdmin}
                className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                title="Logout"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#ffdea2] text-[#261900] text-[11px] font-bold shadow-xs hover:bg-[#f2bf52] active:scale-95 transition-transform"
            >
              {lang === 'bn' ? 'এডমিন লগইন' : 'Admin Login'}
            </button>
          )}
        </div>
      </div>

      {/* Trust & Certifications shortcut */}
      <div className="mt-4 p-4 rounded-2xl bg-[#eff5ec] border border-[#dee4db]/60 space-y-2">
        <h4 className="font-['Hind_Siliguri'] text-[14px] font-bold text-[#003521]">
          {lang === 'bn' ? 'কোয়ালিটি ও সার্টিফাইড নিশ্চয়তা' : 'Quality & Certified Assurance'}
        </h4>
        <p className="text-[11px] text-[#404943]">
          {lang === 'bn'
            ? 'প্রতিটি খাদ্য সামগ্রী বিজ্ঞান ও স্বাস্থ্য সুরক্ষা মেনে পরীক্ষিত।'
            : 'Every food item adheres strictly to sanitary food grading protocols.'}
        </p>
        <button
          onClick={() => setIsCertModalOpen(true)}
          className="text-[11px] text-[#316a2f] font-bold flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span>{lang === 'bn' ? 'বিএসটিআই ও ল্যাব সার্টিফিকেট দেখুন' : 'View BSTI & Lab Test Certificates'}</span>
        </button>
      </div>
    </div>
  );
};
