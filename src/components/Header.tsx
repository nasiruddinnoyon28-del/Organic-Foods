import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const toBnDigit = (num: number): string => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map(d => bn[parseInt(d, 10)] || d)
    .join('');
};

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    lang,
    toggleLang,
    cartCount,
    setIsCartOpen,
    adminUser,
    setIsAdminModalOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct
  } = useApp();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const expandedInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products by name for instant header preview
  const matchingProducts = searchQuery.trim()
    ? products.filter(
        p =>
          p.nameBn.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          p.nameEn.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsDropdownOpen(true);
    // Switch to catalog screen so user sees filtered products in catalog in real-time
    if (activeTab !== 'products-catalog') {
      setActiveTab('products-catalog');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (activeTab !== 'products-catalog') {
      setActiveTab('products-catalog');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (isSearchExpanded && expandedInputRef.current) {
      expandedInputRef.current.focus();
    } else if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDropdownOpen(false);
    setIsSearchExpanded(false);
  };

  const openExpandedSearch = () => {
    setIsSearchExpanded(true);
    setIsDropdownOpen(true);
    if (activeTab !== 'products-catalog') {
      setActiveTab('products-catalog');
    }
    setTimeout(() => {
      expandedInputRef.current?.focus();
    }, 100);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-[#f5fbf1]/95 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(23,77,53,0.06)] border-b border-[#dee4db]/40">
      <div ref={searchContainerRef} className="h-24 flex flex-col justify-between max-w-xl mx-auto w-full relative">
        {/* Main Header Row */}
        <div className="flex items-center justify-between px-3 h-16 gap-2">
          {/* Expanded Full Search Mode (when active) */}
          {isSearchExpanded ? (
            <div className="flex items-center gap-2 w-full animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded(false);
                  setIsDropdownOpen(false);
                }}
                aria-label="Back"
                className="w-9 h-9 rounded-full bg-[#eff5ec] hover:bg-[#dee4db] text-[#003521] flex items-center justify-center shrink-0 active:scale-95 transition-colors"
                title="Back"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#316a2f] text-[20px]">
                  search
                </span>
                <input
                  ref={expandedInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder={
                    lang === 'bn'
                      ? 'পণ্যের নাম দিয়ে খুঁজুন (যেমন: ঘি, মধু, তেল)...'
                      : 'Filter products by name (e.g. Ghee, Honey)...'
                  }
                  className="w-full bg-white text-[#171d17] font-['Inter'] text-[13px] pl-9 pr-9 py-2 rounded-xl border border-[#dee4db] shadow-sm outline-none focus:border-[#003521] focus:ring-1 focus:ring-[#003521]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear Search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#171d17] p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </form>

              {/* Quick Close & Clear Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchExpanded(false);
                  setIsDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 text-[12px] font-semibold text-[#404943] hover:text-[#003521] whitespace-nowrap"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          ) : (
            /* Normal Header Layout with Integrated Search Bar */
            <>
              {/* Logo & Brand Name */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('home');
                }}
                className="flex items-center gap-1.5 text-left focus:outline-none group active:scale-95 transition-transform shrink-0"
              >
                <img
                  alt="Organic Foods BD Logo"
                  className="h-8 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UStD0F89-R5OKxp1qs8omdgc0dMAcFM-jV9baG9vGisV1Yf8vrifLQ0eFaiZrzcl2TWR_g6nKKVFdW-nELJwCh6pel_sOw35QTCzTVM7zZN28Ivg4NpiKTZvTWuIQLnMJ42VmyoGVfVmxnb3dGztVqWpI-Rdaa0iA9hHyn5Sd8He1fMWpY3gLdjyJGYdHxGWYSLLYpbXFrYfZ5y2mMNkuLIX-oWu0d2bLiiNmGSdYqZk02H4cvpQ6h"
                />
                <div className="hidden xs:flex sm:flex flex-col">
                  <span className="font-['Hind_Siliguri'] text-[16px] text-[#003521] leading-none tracking-tight font-bold group-hover:text-[#316a2f] transition-colors">
                    {lang === 'bn' ? 'অর্গানিক বিডি' : 'Organic BD'}
                  </span>
                  <span className="text-[10px] text-[#404943] leading-none uppercase tracking-wider font-semibold">
                    {lang === 'bn' ? 'Organic Foods' : 'Pure Foods'}
                  </span>
                </div>
              </button>

              {/* Product Search Bar in Header */}
              <div className="flex-1 min-w-[130px] max-w-xs relative mx-1">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#717973] text-[18px] pointer-events-none">
                    search
                  </span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      if (activeTab !== 'products-catalog') {
                        setActiveTab('products-catalog');
                      }
                    }}
                    placeholder={lang === 'bn' ? 'নাম দিয়ে পণ্য খুঁজুন...' : 'Search by name...'}
                    className="w-full bg-white text-[#171d17] font-['Inter'] text-[12px] pl-8 pr-7 py-1.5 rounded-full border border-[#dee4db] shadow-2xs outline-none focus:border-[#003521] focus:ring-1 focus:ring-[#003521] transition-all"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      aria-label="Clear Search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#171d17] p-0.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openExpandedSearch}
                      aria-label="Expand Search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#003521] sm:hidden p-0.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">open_in_full</span>
                    </button>
                  )}
                </form>
              </div>

              {/* Right Header Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Language Switch */}
                <button
                  onClick={toggleLang}
                  aria-label="Toggle Language"
                  className="h-8 px-2 rounded-full bg-[#e4eae0] text-[#003521] flex items-center gap-0.5 text-[11px] hover:bg-[#dee4db] transition-colors active:scale-95"
                  title="Toggle Language"
                >
                  <span className={`font-semibold ${lang === 'bn' ? 'text-[#003521] underline' : 'text-[#404943]'}`}>
                    বাং
                  </span>
                  <span className="text-[#c0c9c1]">/</span>
                  <span className={`font-medium ${lang === 'en' ? 'text-[#003521] font-bold underline' : 'text-[#404943]'}`}>
                    EN
                  </span>
                </button>

                {/* Cart & WhatsApp Orders Button with Badge */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Cart and WhatsApp Orders"
                  className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#eaf0e6] text-[#003521] transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-[#594000] text-[#ffdea2] flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm">
                      {lang === 'bn' ? toBnDigit(cartCount) : cartCount}
                    </span>
                  )}
                </button>

                {/* Admin Portal Button */}
                {adminUser ? (
                  <button
                    onClick={() => setActiveTab('admin-dashboard')}
                    aria-label="Admin Dashboard"
                    className={`h-8 px-2 rounded-full flex items-center gap-1 text-[11px] font-bold shadow-xs active:scale-95 transition-all ${
                      activeTab === 'admin-dashboard'
                        ? 'bg-[#174d35] text-white ring-2 ring-[#ffdea2]'
                        : 'bg-[#ffdea2] text-[#261900] hover:bg-[#f2bf52]'
                    }`}
                    title="Admin Dashboard"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    <span className="material-symbols-outlined text-[14px]">shield_person</span>
                    <span className="hidden md:inline font-['Hind_Siliguri']">{lang === 'bn' ? 'এডমিন' : 'Admin'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    aria-label="Admin Login"
                    className="w-8 h-8 rounded-full bg-[#e4eae0] hover:bg-[#dee4db] text-[#003521] flex items-center justify-center transition-colors active:scale-95"
                    title={lang === 'bn' ? 'এডমিন লগইন' : 'Admin Sign In'}
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                  </button>
                )}

                {/* User Profile */}
                <button
                  onClick={() => setActiveTab('account')}
                  aria-label="Profile"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                    activeTab === 'account' ? 'bg-[#316a2f] ring-2 ring-[#b2f3a8]' : 'bg-[#003521]'
                  }`}
                >
                  <span className="material-symbols-outlined text-white text-[18px]">person</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Live Search Autocomplete Suggestions Dropdown */}
        {isDropdownOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-16 left-3 right-3 bg-white rounded-2xl shadow-xl border border-[#dee4db] z-50 overflow-hidden max-h-80 flex flex-col">
            <div className="p-2.5 bg-[#eff5ec] border-b border-[#dee4db] flex items-center justify-between text-[11px] font-bold text-[#003521]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#316a2f]">manage_search</span>
                {lang === 'bn' ? (
                  <>
                    "{searchQuery}" নামে{' '}
                    <span className="text-[#316a2f]">{toBnDigit(matchingProducts.length)}টি</span> পণ্য পাওয়া গেছে
                  </>
                ) : (
                  <>
                    Found <span className="text-[#316a2f]">{matchingProducts.length}</span> items for "{searchQuery}"
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="text-[#717973] hover:text-[#171d17]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-[#dee4db]/40">
              {matchingProducts.length === 0 ? (
                <div className="p-4 text-center text-[#717973] text-[12px]">
                  <p className="mb-2">
                    {lang === 'bn' ? 'এই নামে কোনো অর্গানিক পণ্য পাওয়া যায়নি' : 'No organic products found with this name'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                      setActiveTab('products-catalog');
                    }}
                    className="px-3 py-1 bg-[#003521] text-white text-[11px] font-semibold rounded-lg"
                  >
                    {lang === 'bn' ? 'সকল পণ্য দেখুন' : 'View all products'}
                  </button>
                </div>
              ) : (
                matchingProducts.slice(0, 5).map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="p-2.5 hover:bg-[#f5fbf1] cursor-pointer flex items-center justify-between gap-2.5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.imageUrl}
                        alt={prod.nameBn}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#dee4db]/60"
                      />
                      <div className="min-w-0">
                        <h4 className="font-['Hind_Siliguri'] text-[13px] font-bold text-[#171d17] truncate">
                          {lang === 'bn' ? prod.nameBn : prod.nameEn}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#717973]">
                          <span>{prod.weight}</span>
                          <span>•</span>
                          <span className="text-[#316a2f] font-semibold">
                            {lang === 'bn' ? prod.stockStatusBn : prod.stockStatusEn}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-['Inter'] text-[13px] font-bold text-[#003521]">
                        ৳ {lang === 'bn' ? toBnDigit(prod.price) : prod.price}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#717973]">chevron_right</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View Full Catalog Results Link */}
            {matchingProducts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsSearchExpanded(false);
                  setActiveTab('products-catalog');
                }}
                className="p-2.5 text-center bg-[#eff5ec] hover:bg-[#e4eae0] text-[#003521] text-[11px] font-bold border-t border-[#dee4db] flex items-center justify-center gap-1 transition-colors"
              >
                <span>
                  {lang === 'bn'
                    ? `ক্যাটালগে সকল ${toBnDigit(matchingProducts.length)}টি ফলাফল দেখুন`
                    : `View all ${matchingProducts.length} results in catalog`}
                </span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
          </div>
        )}

        {/* Announcement Ticker Bar */}
        <div className="h-8 bg-[#003521] text-white flex items-center overflow-hidden px-4">
          <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto no-scrollbar text-[11px] w-full">
            <span className="material-symbols-outlined text-[14px] text-[#ffdea2]">eco</span>
            <span className="font-['Hind_Siliguri'] text-[11px] font-medium text-[#ffdea2]">
              {lang === 'bn' ? '১০০% খাঁটি পণ্য' : '100% Organic Certified'}
            </span>
            <span className="text-[#9cd3b3]">•</span>
            <span>{lang === 'bn' ? 'Cash on Delivery সারাদেশে' : 'Cash on Delivery Nationwide'}</span>
            <span className="text-[#9cd3b3]">•</span>
            <a
              href="tel:+8801774749768"
              className="flex items-center gap-1 text-[#b2f3a8] hover:underline"
            >
              <span className="material-symbols-outlined text-[13px]">call</span>
              <span className="font-['Inter']">+880 1774-749768</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
