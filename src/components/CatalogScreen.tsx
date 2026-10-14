import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { toBnDigit } from './Header';

export const CatalogScreen: React.FC = () => {
  const {
    lang,
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedProduct,
    setIsCertModalOpen,
    isWishlisted,
    toggleWishlist,
    showToast
  } = useApp();

  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [loadMoreState, setLoadMoreState] = useState<'idle' | 'loading' | 'loaded'>('idle');

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        item =>
          item.nameBn.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          item.subtitleBn.toLowerCase().includes(q) ||
          item.subtitleEn.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'popular') {
      result.sort((a, b) => b.popularScore - a.popularScore);
    } else if (sortOption === 'newest') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  const categoryPills: { id: string; labelBn: string; labelEn: string }[] = [
    { id: 'all', labelBn: 'সকল পণ্য (All)', labelEn: 'All Items' },
    { id: 'ghee', labelBn: 'ঘি ও মাখন (Ghee)', labelEn: 'Ghee & Butter' },
    { id: 'honey', labelBn: 'মধু (Honey)', labelEn: 'Wild Honey' },
    { id: 'oil', labelBn: 'সরিষার তেল ও তৈল (Oil)', labelEn: 'Cold Pressed Oils' },
    { id: 'grains', labelBn: 'চাল ও ডাল (Grains)', labelEn: 'Rice & Lentils' },
    { id: 'spices', labelBn: 'মসলা ও বীজ (Spices & Seeds)', labelEn: 'Spices & Seeds' },
    { id: 'dry-fruits', labelBn: 'বাদাম ও খেজুর (Dry Fruits)', labelEn: 'Dry Fruits' }
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortOption('popular');
  };

  const handleLoadMore = () => {
    setLoadMoreState('loading');
    setTimeout(() => {
      setLoadMoreState('loaded');
      showToast(lang === 'bn' ? 'সকল ৪২টি আইটেম প্রদর্শিত হয়েছে' : 'All 42 organic items displayed');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Search & Filter Sticky Bar */}
      <section className="sticky top-24 z-40 bg-[#f5fbf1]/95 backdrop-blur-md px-4 pt-2.5 pb-2.5 shadow-[0_4px_16px_rgba(23,77,53,0.04)] border-b border-[#dee4db]/40">
        {/* Live Search Input */}
        <div className="relative w-full mb-2.5">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#404943] text-[20px]">
            search
          </span>
          <input
            id="product-search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#171d17] font-['Inter'] text-[14px] pl-10 pr-10 py-2.5 rounded-xl placeholder:text-[#717973] focus:outline-none focus:ring-2 focus:ring-[#174d35]/30 shadow-sm border border-[#dee4db]/50"
            placeholder={lang === 'bn' ? 'পণ্য খুঁজুন... (Search 40+ Organic Items)' : 'Search 40+ Organic Items...'}
            type="search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#171d17] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Category Pills Scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {categoryPills.map(pill => {
            const isActive = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedCategory(pill.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#003521] text-white shadow-sm'
                    : 'bg-[#eaf0e6] text-[#404943] hover:bg-[#e4eae0]'
                }`}
              >
                {lang === 'bn' ? pill.labelBn : pill.labelEn}
              </button>
            );
          })}
        </div>

        {/* Filter Meta & Sorting Bar */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#316a2f]" />
            <span className="text-[11px] text-[#404943] font-medium">
              {lang === 'bn' ? (
                <>
                  মোট{' '}
                  <span className="font-bold text-[#003521]">
                    {toBnDigit(filteredProducts.length)}টি
                  </span>{' '}
                  পণ্য পাওয়া গেছে
                </>
              ) : (
                <>
                  Found <span className="font-bold text-[#003521]">{filteredProducts.length}</span> items
                </>
              )}
            </span>
          </div>

          <div className="relative inline-flex items-center">
            <label className="sr-only" htmlFor="sort-select">
              সর্টিং করুন
            </label>
            <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-[#dee4db]/50">
              <span className="material-symbols-outlined text-[16px] text-[#003521]">sort</span>
              <select
                id="sort-select"
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-[#171d17] focus:outline-none pr-1 cursor-pointer"
              >
                <option value="popular">{lang === 'bn' ? 'জনপ্রিয়তা (Popularity)' : 'Popularity'}</option>
                <option value="price-asc">{lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="newest">{lang === 'bn' ? 'নতুন পণ্য (Newest)' : 'Newest'}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Notice of Trust Banner */}
      <div className="px-4 my-2.5">
        <button
          onClick={() => setIsCertModalOpen(true)}
          className="w-full bg-[#b2f3a8]/50 hover:bg-[#b2f3a8]/70 transition-colors rounded-xl px-3 py-2 flex items-center justify-between text-left border border-[#97d68f]/60 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#316a2f] text-[20px]">verified</span>
            <span className="text-[11px] text-[#16521a] font-semibold">
              {lang === 'bn'
                ? 'বিএসটিআই ও ল্যাব পরীক্ষিত ১০০% অর্গানিক সার্টিফাইড পণ্য'
                : 'BSTI & Lab Tested 100% Organic Certified Goods'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[#316a2f] text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Product Catalog Grid */}
      <section className="px-4 pb-4">
        {filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e4eae0] flex items-center justify-center text-[#003521] mb-3">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h4 className="font-['Hind_Siliguri'] text-[18px] font-bold text-[#003521] mb-1">
              {lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No Organic Products Found'}
            </h4>
            <p className="text-[12px] text-[#404943] max-w-xs mb-4">
              {lang === 'bn'
                ? 'আপনার কাঙ্ক্ষিত পণ্যটি হয়তো অন্য নামে রয়েছে অথবা সরাসরি হোয়াটসঅ্যাপে আমাদের জানান।'
                : 'Try searching with another keyword or connect directly with our WhatsApp assistant.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#003521] text-white rounded-xl text-[13px] font-semibold active:scale-95 shadow-sm"
            >
              {lang === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3" id="product-grid">
            {filteredProducts.map(prod => (
              <article
                key={prod.id}
                className="flex flex-col bg-white rounded-2xl shadow-[0_4px_18px_rgba(23,77,53,0.05)] overflow-hidden transition-transform duration-200 active:scale-[0.98] border border-[#dee4db]/40"
              >
                {/* Image and badges */}
                <div className="relative w-full aspect-square bg-[#e4eae0] overflow-hidden">
                  <img
                    alt={prod.nameBn}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    src={prod.imageUrl}
                    onClick={() => setSelectedProduct(prod)}
                  />
                  {prod.discountBadgeBn && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] bg-[#ffdea2] text-[#261900] font-bold shadow-xs">
                      {lang === 'bn' ? prod.discountBadgeBn : prod.discountBadgeEn}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    aria-label="Add to Wishlist"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#717973] hover:text-red-500 transition-colors"
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isWishlisted(prod.id) ? 'text-red-500 fill-1' : ''
                      }`}
                      style={isWishlisted(prod.id) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {isWishlisted(prod.id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[11px] bg-white/90 backdrop-blur-sm text-[#171d17] font-semibold shadow-2xs">
                    {prod.weight}
                  </span>
                </div>

                {/* Details */}
                <div className="p-2.5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#316a2f]" />
                      <span className="text-[10px] text-[#316a2f] font-semibold">
                        {lang === 'bn' ? prod.stockStatusBn : prod.stockStatusEn}
                      </span>
                    </div>
                    <h3
                      onClick={() => setSelectedProduct(prod)}
                      className="font-['Hind_Siliguri'] text-[13px] text-[#171d17] line-clamp-1 font-bold cursor-pointer hover:text-[#003521]"
                    >
                      {lang === 'bn' ? prod.nameBn : prod.nameEn}
                    </h3>
                    <p className="font-['Inter'] text-[11px] text-[#404943] truncate mb-1.5">
                      {lang === 'bn' ? prod.subtitleEn : prod.subtitleBn}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="font-['Inter'] text-[16px] font-bold text-[#003521]">
                        ৳ {lang === 'bn' ? toBnDigit(prod.price) : prod.price}
                      </span>
                      <span className="font-['Inter'] text-[12px] text-[#717973] line-through">
                        ৳ {lang === 'bn' ? toBnDigit(prod.originalPrice) : prod.originalPrice}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {/* WhatsApp Order Action */}
                      <a
                        className="w-full bg-[#25D366] text-white py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-semibold active:opacity-90 shadow-sm"
                        href={`https://wa.me/8801774749768?text=I%20want%20to%20order%20${encodeURIComponent(prod.nameBn)}%20(${prod.weight})%20৳${prod.price}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        <span>{lang === 'bn' ? 'WhatsApp Order' : 'Order via WhatsApp'}</span>
                      </a>

                      {/* View Details Action */}
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="w-full bg-[#eaf0e6] text-[#171d17] py-1.5 px-2 rounded-lg text-[11px] text-center hover:bg-[#e4eae0] transition-colors font-medium active:scale-95"
                      >
                        {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination & Progress Load More Section */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-full max-w-xs flex flex-col items-center gap-1.5">
              <div className="w-full h-1.5 bg-[#e4eae0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#003521] rounded-full transition-all duration-300"
                  style={{ width: loadMoreState === 'loaded' ? '100%' : '38%' }}
                />
              </div>
              <span className="text-[11px] text-[#404943] font-medium">
                {lang === 'bn' ? (
                  <>
                    প্রদর্শিত হচ্ছে{' '}
                    <span className="font-bold text-[#003521]">
                      {loadMoreState === 'loaded' ? toBnDigit(42) : toBnDigit(filteredProducts.length)}
                    </span>{' '}
                    / {toBnDigit(42)}টি পণ্য
                  </>
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-bold text-[#003521]">
                      {loadMoreState === 'loaded' ? 42 : filteredProducts.length}
                    </span>{' '}
                    / 42 items
                  </>
                )}
              </span>
            </div>

            <button
              onClick={handleLoadMore}
              disabled={loadMoreState === 'loaded'}
              className={`w-full max-w-xs bg-white hover:bg-[#eaf0e6] text-[#003521] font-['Hind_Siliguri'] text-[13px] font-semibold py-3 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all border border-[#dee4db]/60 active:scale-[0.98] ${
                loadMoreState === 'loaded' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loadMoreState === 'loading' ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading items...'}</span>
                </>
              ) : loadMoreState === 'loaded' ? (
                <>
                  <span className="material-symbols-outlined text-[18px] text-[#316a2f]">done_all</span>
                  <span>{lang === 'bn' ? 'সকল ৪২টি পণ্য প্রদর্শিত হয়েছে' : 'All 42 products loaded'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                  <span>{lang === 'bn' ? 'আরো ২০টি পণ্য দেখুন (Load More)' : 'Load 20 More Items'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Sticky / Bottom WhatsApp Quick Order Floating Banner */}
      <section className="px-4 pb-4">
        <div className="bg-[#174d35] text-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(23,77,53,0.18)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-[26px]">chat</span>
            </div>
            <div>
              <h4 className="font-['Hind_Siliguri'] text-[13px] font-bold text-white leading-tight">
                {lang === 'bn' ? 'সরাসরি অর্ডার করতে চান?' : 'Want to order directly?'}
              </h4>
              <p className="text-[11px] text-[#87bd9e]">
                {lang === 'bn' ? 'আমাদের প্রতিনিধি লাইভ সহযোগিতার জন্য প্রস্তুত' : 'Our team is ready to assist you live on WhatsApp'}
              </p>
            </div>
          </div>
          <a
            className="bg-[#25D366] text-white text-[13px] px-3.5 py-2 rounded-xl font-bold whitespace-nowrap shadow-sm hover:opacity-90 active:scale-95 transition-all"
            href="https://wa.me/8801774749768?text=Hello%20Organic%20Foods%20BD,%20I%20want%20to%20place%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'bn' ? 'চ্যাট করুন' : 'Chat Now'}
          </a>
        </div>
      </section>
    </div>
  );
};
