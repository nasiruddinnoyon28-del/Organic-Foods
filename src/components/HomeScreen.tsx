import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { CATEGORIES, TESTIMONIALS } from '../data/categories';
import { toBnDigit } from './Header';
import { Product } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    lang,
    products,
    setActiveTab,
    addToCart,
    setSelectedProduct,
    setIsCertModalOpen,
    setSearchQuery,
    navigateToCatalogWithCategory,
    isWishlisted,
    toggleWishlist,
    showToast
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});
  const testimonialContainerRef = useRef<HTMLDivElement>(null);

  // Real-time flash countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal.trim());
      setActiveTab('products-catalog');
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveTab('products-catalog');
  };

  const handleAddToCartWithAnim = (product: Product) => {
    addToCart(product);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const scrollTestimonials = (direction: number) => {
    if (testimonialContainerRef.current) {
      testimonialContainerRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText('PUJA20');
    showToast(lang === 'bn' ? 'কুপন কোড PUJA20 কপি হয়েছে!' : 'Coupon PUJA20 copied!');
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Search Bar Section */}
      <section className="px-4 pt-3 pb-2">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="relative w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(23,77,53,0.06)] p-1.5 flex items-center transition-all duration-300 focus-within:shadow-[0_12px_36px_rgba(23,77,53,0.12)] focus-within:ring-2 focus-within:ring-[#174d35]/20 border border-[#dee4db]/40">
            <div className="w-10 h-10 rounded-xl bg-[#eff5ec] flex items-center justify-center text-[#174d35] shrink-0 ml-1">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              aria-label="Search organic foods"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full bg-transparent border-0 outline-none px-3 font-['Inter'] text-[14px] text-[#171d17] placeholder:text-[#717973] text-ellipsis"
              placeholder={lang === 'bn' ? 'খাঁটি ঘি, সুন্দরবনের মধু, সরিষার তেল খুঁজুন...' : 'Search Ghee, Wild Honey, Mustard Oil...'}
              type="search"
            />
            <div className="flex items-center gap-1 shrink-0 pr-1">
              <button
                type="button"
                onClick={() => showToast(lang === 'bn' ? 'ভয়েস সার্চ প্রস্তুত হচ্ছে...' : 'Listening for voice search...')}
                className="w-9 h-9 rounded-xl bg-[#eff5ec] text-[#003521] hover:bg-[#b2f3a8] transition-colors flex items-center justify-center active:scale-95"
                title={lang === 'bn' ? 'ভয়েস সার্চ' : 'Voice Search'}
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('products-catalog')}
                className="w-9 h-9 rounded-xl bg-[#174d35] text-white flex items-center justify-center shadow-sm active:scale-95"
                title={lang === 'bn' ? 'ফিল্টার' : 'Filter'}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Search Pill Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5 pb-1">
          <span className="text-[11px] text-[#717973] shrink-0 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[13px] text-[#594000]">trending_up</span>
            {lang === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
          </span>
          {[
            { bn: 'খাঁটি গাওয়া ঘি', en: 'Pure Cow Ghee' },
            { bn: 'সুন্দরবনের খলিসা মধু', en: 'Sundarbans Honey' },
            { bn: 'ঘানির সরিষার তেল', en: 'Mustard Oil' },
            { bn: 'কালোজিরা তেল', en: 'Black Seed Oil' }
          ].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickTagClick(tag.bn)}
              className="shrink-0 px-3 py-1 rounded-full bg-[#eaf0e6] text-[#404943] text-[11px] hover:bg-[#b2f3a8] transition-colors active:scale-95 whitespace-nowrap font-medium"
            >
              {lang === 'bn' ? tag.bn : tag.en}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Banner: Pure Goodness Storytelling */}
      <section className="px-4 py-2">
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#174d35] text-white shadow-[0_16px_40px_-8px_rgba(23,77,53,0.22)]">
          {/* Ambient Visual Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqV2gmg-YoVpDdKofLIVilDAd6qgRvq7Hfz1ky-RTmIO14u0qDhz2nP6dw_U9B8tYfwD3IcYlfawSAAV8b1_0W1BDbL1tTO2Cx2lOT29Nd91aOkfe9hts8Vs9jlM6LEGctHYqJw1ICehmh7OEo3hsG-E_suE1oTJdQ_BswHDtPVBqv7mgi6v_RkrPwTDoy0544HpiSaxJHNtPd9bQFWCbbZomc3IVgG4j5LfhzermKnDTYR3wkivs')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003521] via-[#174d35]/85 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-5 flex flex-col justify-between">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdea2] text-[#261900] text-[11px] font-bold shadow-sm hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {lang === 'bn' ? '১০০% খাঁটি ও পরীক্ষিত' : '100% Pure & Lab Tested'}
              </button>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#b2f3a8] text-[#377135] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                {lang === 'bn' ? 'রাসায়নিক মুক্ত' : 'Zero Chemical Added'}
              </span>
            </div>

            {/* Typography Block */}
            <div className="space-y-1.5 mb-5">
              <h1 className="font-['Hind_Siliguri'] text-[28px] text-white font-bold leading-tight drop-shadow-sm">
                {lang === 'bn' ? (
                  <>প্রকৃতির বিশুদ্ধতা,<br />আপনার প্রতিদিনের খাবারে</>
                ) : (
                  <>Pure Goodness,<br />Delivered To Your Table</>
                )}
              </h1>
              <p className="font-['Inter'] text-[14px] text-[#9cd3b3] font-medium tracking-wide">
                Pure Goodness from Nature to Your Dining Table
              </p>
            </div>

            {/* Farm Trust Micro-Stats */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3.5 mb-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="flex flex-col text-left">
                <span className="font-['Inter'] text-[18px] font-bold text-[#ffdea2]">
                  {lang === 'bn' ? '২৫+' : '25+'}
                </span>
                <span className="text-[10px] text-[#e4eae0] leading-tight font-medium">
                  {lang === 'bn' ? 'নিজস্ব খামার' : 'Direct Farms'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-['Inter'] text-[18px] font-bold text-[#b2f3a8]">
                  {lang === 'bn' ? '৭২ ঘ' : '72h'}
                </span>
                <span className="text-[10px] text-[#e4eae0] leading-tight font-medium">
                  {lang === 'bn' ? 'দ্রুত ডেলিভারি' : 'Express Delivery'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-['Inter'] text-[18px] font-bold text-[#ffdea2]">
                  {lang === 'bn' ? '৫০k+' : '50k+'}
                </span>
                <span className="text-[10px] text-[#e4eae0] leading-tight font-medium">
                  {lang === 'bn' ? 'তুষ্ট গ্রাহক' : 'Happy Families'}
                </span>
              </div>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                onClick={() => setActiveTab('products-catalog')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ffdea2] text-[#261900] text-[13px] font-bold shadow-lg hover:bg-[#f2bf52] transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[19px]">shopping_basket</span>
                <span>{lang === 'bn' ? 'কেনাকাটা শুরু করুন / Shop Now' : 'Shop Organic Catalog'}</span>
              </button>
              <a
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white text-[13px] font-bold shadow-md hover:opacity-95 transition-transform active:scale-[0.98]"
                href="https://wa.me/8801774749768?text=Hello%20Organic%20Foods%20BD,%20I%20would%20like%20to%20place%20an%20order"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[19px]">chat</span>
                <span>{lang === 'bn' ? 'WhatsApp-এ অর্ডার করুন' : 'Order on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Offer Banner with Realtime Dynamic Countdown */}
      <section className="px-4 py-2">
        <div className="w-full bg-gradient-to-r from-[#594000] via-[#3d2b00] to-[#174d35] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#ffdea2]/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#ffdea2] text-[#261900] font-bold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              {lang === 'bn' ? 'ফ্ল্যাশ অফার' : 'Flash Offer'}
            </span>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#ffdea2] bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs font-mono font-bold">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span>
                {lang === 'bn'
                  ? `${toBnDigit(timeLeft.days)} দিন : ${toBnDigit(timeLeft.hours)} ঘণ্টা : ${toBnDigit(timeLeft.minutes)} মি : ${toBnDigit(timeLeft.seconds)} সে`
                  : `${timeLeft.days}d : ${timeLeft.hours}h : ${timeLeft.minutes}m : ${timeLeft.seconds}s`}
              </span>
            </div>
          </div>

          <h2 className="font-['Hind_Siliguri'] text-[18px] font-bold text-[#ffdea2] leading-tight mb-1">
            {lang === 'bn' ? 'শারদীয় দুর্গোৎসব ও পুজো স্পেশাল অফার - ২০% পর্যন্ত ছাড়!' : 'Sharodiya Durga Puja Special Offer - Up to 20% OFF!'}
          </h2>
          <p className="text-[12px] text-[#e4eae0] mb-3">
            {lang === 'bn'
              ? 'পূজার ভোগ ও রান্নায় খাঁটি ঘি, মধু ও সরিষার তেলের স্পেশাল কম্বো প্যাকেজে ফ্রি হোম ডেলিভারি সারাদেশে।'
              : 'Free nationwide home delivery on pure Ghee, Honey & Mustard Oil combo packs for Puja.'}
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={copyCoupon}
              className="text-[11px] text-[#b2f3a8] flex items-center gap-1 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>{lang === 'bn' ? 'কুপন কোড:' : 'Coupon Code:'}</span>
              <strong className="text-[#ffdea2] underline decoration-dashed font-mono">PUJA20</strong>
              <span className="material-symbols-outlined text-[13px] ml-0.5">content_copy</span>
            </button>
            <button
              onClick={() => setActiveTab('products-catalog')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ffdea2] hover:text-white transition-colors"
            >
              <span>{lang === 'bn' ? 'অফার দেখুন' : 'View Offers'}</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section: 8 Crafted Pillars (4x2 Mobile Grid) */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#174d35]" />
              <span className="text-[11px] uppercase tracking-wider text-[#316a2f] font-bold">Categories</span>
            </div>
            <h2 className="font-['Hind_Siliguri'] text-[20px] text-[#003521] font-bold">
              {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-[11px] text-[#316a2f] hover:text-[#003521] flex items-center gap-0.5 font-bold"
          >
            <span>{lang === 'bn' ? 'সবগুলো' : 'View All'}</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* 4x2 Grid on Mobile */}
        <div className="grid grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigateToCatalogWithCategory(cat.id)}
              className="group flex flex-col items-center text-center p-2 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95 border border-[#dee4db]/40"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#e4eae0] mb-1.5 relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={cat.nameBn}
                  src={cat.imageUrl}
                  loading="lazy"
                />
              </div>
              <span className="font-['Hind_Siliguri'] text-[12px] leading-tight text-[#171d17] font-semibold line-clamp-2">
                {lang === 'bn' ? cat.nameBn : cat.nameEn}
              </span>
              <span className="text-[10px] text-[#717973] font-normal truncate w-full">
                {lang === 'bn' ? cat.subtitleEn : cat.subtitleBn}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 py-3" id="featured">
        <div className="flex items-end justify-between mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#316a2f]" />
              <span className="text-[11px] uppercase tracking-wider text-[#316a2f] font-bold">Featured Catalog</span>
            </div>
            <h2 className="font-['Hind_Siliguri'] text-[20px] text-[#003521] font-bold">
              {lang === 'bn' ? 'ফিচার্ড প্রোডাক্টস' : 'Featured Products'}
            </h2>
          </div>
          <span className="text-[11px] text-[#717973]">
            {lang === 'bn' ? 'শতভাগ খাঁটি নিশ্চয়তা' : '100% Purity Tested'}
          </span>
        </div>

        {/* 2-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map(prod => (
            <article
              key={prod.id}
              className="flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(23,77,53,0.06)] overflow-hidden transition-all duration-300 hover:shadow-lg border border-[#dee4db]/40"
            >
              {/* Product Image Box */}
              <div className="relative w-full aspect-square bg-[#eff5ec] overflow-hidden">
                <img
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  alt={prod.nameBn}
                  src={prod.imageUrl}
                  loading="lazy"
                  onClick={() => setSelectedProduct(prod)}
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                  {prod.discountBadgeBn && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ffdea2] text-[#261900] text-[10px] font-bold shadow-sm">
                      {lang === 'bn' ? prod.discountBadgeBn : prod.discountBadgeEn}
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded-full bg-[#b2f3a8] text-[#002203] text-[9px] font-semibold">
                    {lang === 'bn' ? 'ইন স্টক' : 'In Stock'}
                  </span>
                </div>
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  aria-label="Wishlist"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm text-[#003521] flex items-center justify-center hover:bg-white transition-colors"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isWishlisted(prod.id) ? 'text-red-500 fill-1' : 'text-[#717973]'
                    }`}
                    style={isWishlisted(prod.id) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {isWishlisted(prod.id) ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-2.5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-[14px] text-[#f2bf52] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-[11px] font-bold text-[#171d17]">{prod.rating}</span>
                    <span className="text-[10px] text-[#717973]">
                      ({lang === 'bn' ? toBnDigit(prod.reviewsCount) : prod.reviewsCount})
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(prod)}
                    className="font-['Hind_Siliguri'] text-[13px] leading-snug font-semibold text-[#003521] line-clamp-2 mb-0.5 cursor-pointer hover:text-[#316a2f]"
                  >
                    {lang === 'bn' ? prod.nameBn : prod.nameEn}
                  </h3>
                  <p className="text-[11px] text-[#404943] font-medium mb-1.5 truncate">
                    {lang === 'bn' ? prod.subtitleEn : prod.subtitleBn}
                  </p>
                </div>

                <div>
                  {/* Pricing */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-['Inter'] text-[16px] font-bold text-[#003521]">
                      ৳ {lang === 'bn' ? toBnDigit(prod.price) : prod.price}
                    </span>
                    <span className="text-[11px] text-[#717973] line-through">
                      ৳ {lang === 'bn' ? toBnDigit(prod.originalPrice) : prod.originalPrice}
                    </span>
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleAddToCartWithAnim(prod)}
                      className={`w-full py-2 px-2 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all ${
                        addedItemIds[prod.id]
                          ? 'bg-[#316a2f] text-white'
                          : 'bg-[#174d35] text-white hover:bg-[#003521]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {addedItemIds[prod.id] ? 'check_circle' : 'add_shopping_cart'}
                      </span>
                      <span>
                        {addedItemIds[prod.id]
                          ? (lang === 'bn' ? 'যোগ হয়েছে!' : 'Added!')
                          : (lang === 'bn' ? 'কার্টে নিন' : 'Add to Cart')}
                      </span>
                    </button>

                    <a
                      className="w-full py-1.5 px-2 rounded-xl bg-[#b2f3a8] text-[#002203] text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#97d68f] transition-colors"
                      href={`https://wa.me/8801774749768?text=I%20want%20to%20order%20${encodeURIComponent(prod.nameBn)}%20(${prod.weight})%20Price%3A%20৳${prod.price}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#316a2f]">chat</span>
                      <span>{lang === 'bn' ? 'WhatsApp অর্ডার' : 'WhatsApp Order'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why Choose Us: 4 Core Pillars of Provenance */}
      <section className="px-4 py-4">
        <div className="w-full bg-[#eff5ec] rounded-3xl p-5 shadow-sm border border-[#dee4db]/60">
          <div className="text-center max-w-sm mx-auto mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#316a2f] font-bold">Our Promise</span>
            <h2 className="font-['Hind_Siliguri'] text-[20px] text-[#003521] font-bold">
              {lang === 'bn' ? 'কেন আমাদের বেছে নেবেন?' : 'Why Choose Us?'}
            </h2>
            <p className="text-[12px] text-[#404943] mt-0.5">
              {lang === 'bn' ? 'বিশুদ্ধ খাদ্যের নির্ভরযোগ্য ঠিকানা' : 'The Most Trusted Destination For Pure Organics'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Pillar 1 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white shadow-sm border border-[#dee4db]/40">
              <div className="w-10 h-10 rounded-xl bg-[#b2f3a8] text-[#377135] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">agriculture</span>
              </div>
              <div>
                <h3 className="font-['Hind_Siliguri'] text-[14px] font-semibold text-[#003521]">
                  {lang === 'bn' ? '১. সরাসরি চাষি ও বন থেকে সংগৃহীত' : '1. Directly From Farmers & Forest Harvesters'}
                </h3>
                <p className="text-[12px] text-[#404943] leading-relaxed">
                  {lang === 'bn'
                    ? 'কোনো মধ্যস্বত্বভোগী নেই, সুন্দরবনের বিশ্বস্ত মৌয়াল ও প্রান্তিক খামারিদের থেকে সরাসরি যাচাইকৃত পণ্য।'
                    : 'No middlemen. Directly sourced from native beekeepers of Sundarbans and verified organic farmers.'}
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white shadow-sm border border-[#dee4db]/40">
              <div className="w-10 h-10 rounded-xl bg-[#ffdea2] text-[#261900] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">sanitizer</span>
              </div>
              <div>
                <h3 className="font-['Hind_Siliguri'] text-[14px] font-semibold text-[#003521]">
                  {lang === 'bn' ? '২. কোনো রাসায়নিক বা ভেজাল নেই' : '2. Zero Preservatives or Chemical Adulteration'}
                </h3>
                <p className="text-[12px] text-[#404943] leading-relaxed">
                  {lang === 'bn'
                    ? '১০০% প্রিজারভেটিভ ও কেমিক্যাল মুক্ত। প্রতিটি ব্যাচ ল্যাব টেস্ট সার্টিফিকেট দ্বারা পরীক্ষিত।'
                    : '100% free from artificial colors, flavors or waxes. Every batch undergoes verified laboratory screening.'}
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white shadow-sm border border-[#dee4db]/40">
              <div className="w-10 h-10 rounded-xl bg-[#e4eae0] text-[#003521] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div>
                <h3 className="font-['Hind_Siliguri'] text-[14px] font-semibold text-[#003521]">
                  {lang === 'bn' ? '৩. সারা দেশে ক্যাশ অন ডেলিভারি' : '3. Cash On Delivery All Over Bangladesh'}
                </h3>
                <p className="text-[12px] text-[#404943] leading-relaxed">
                  {lang === 'bn'
                    ? 'পণ্য হাতে পেয়ে কোয়ালিটি দেখে মূল্য পরিশোধের সুবিধা। ঢাকা ও জেলা শহরে হোম ডেলিভারি।'
                    : 'Inspect packages at your doorstep before payment. Doorstep delivery across Dhaka and all 64 districts.'}
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white shadow-sm border border-[#dee4db]/40">
              <div className="w-10 h-10 rounded-xl bg-[#b2f3a8] text-[#002203] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <h3 className="font-['Hind_Siliguri'] text-[14px] font-semibold text-[#003521]">
                  {lang === 'bn' ? '৪. শতভাগ মানিব্যাক গ্যারান্টি' : '4. 100% Money-Back Guarantee'}
                </h3>
                <p className="text-[12px] text-[#404943] leading-relaxed">
                  {lang === 'bn'
                    ? 'আমাদের পণ্যের বিশুদ্ধতায় অসন্তুষ্ট হলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ টাকা ফেরত বা রিপ্লেসমেন্ট।'
                    : 'If you are unsatisfied with purity or quality, we offer full immediate refund or replacement.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Carousel */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-[#316a2f] font-bold">Happy Families</span>
            <h2 className="font-['Hind_Siliguri'] text-[20px] text-[#003521] font-bold">
              {lang === 'bn' ? 'গ্রাহকদের প্রতিক্রিয়া' : 'Customer Reviews'}
            </h2>
          </div>
          <div className="flex gap-1">
            <button
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full bg-white text-[#003521] shadow-sm flex items-center justify-center hover:bg-[#eaf0e6] transition-colors border border-[#dee4db]/60 active:scale-95"
              onClick={() => scrollTestimonials(-1)}
            >
              <span className="material-symbols-outlined text-[16px]">west</span>
            </button>
            <button
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full bg-white text-[#003521] shadow-sm flex items-center justify-center hover:bg-[#eaf0e6] transition-colors border border-[#dee4db]/60 active:scale-95"
              onClick={() => scrollTestimonials(1)}
            >
              <span className="material-symbols-outlined text-[16px]">east</span>
            </button>
          </div>
        </div>

        {/* Horizontal Testimonial Scroller */}
        <div
          ref={testimonialContainerRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {TESTIMONIALS.map(item => (
            <div
              key={item.id}
              className="min-w-[270px] max-w-[270px] p-4 rounded-2xl bg-white shadow-sm flex flex-col justify-between shrink-0 border border-[#dee4db]/60"
            >
              <div>
                <div className="flex items-center gap-1 text-[#f2bf52] mb-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[16px] fill-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-[13px] text-[#171d17] leading-relaxed italic mb-3">
                  {lang === 'bn' ? item.commentBn : item.commentEn}
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-[#dee4db]/40">
                <div className="w-8 h-8 rounded-full bg-[#003521] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {item.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#003521]">
                    {lang === 'bn' ? item.nameBn : item.nameEn}
                  </span>
                  <span className="text-[10px] text-[#717973]">
                    {lang === 'bn' ? item.locationBn : item.locationEn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp Instant Order Sticky Floating Card */}
      <section className="px-4 py-2 mb-2">
        <div className="w-full bg-[#128C7E] rounded-2xl p-4 text-white shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
              <span className="material-symbols-outlined text-[28px]">chat</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Hind_Siliguri'] text-[14px] font-bold truncate">
                {lang === 'bn' ? 'পণ্য পছন্দ হয়েছে?' : 'Liked Our Products?'}
              </span>
              <p className="text-[11px] text-[#e4eae0] truncate">
                {lang === 'bn' ? 'সরাসরি WhatsApp-এ দ্রুত অর্ডার করুন' : 'Order instantly via direct WhatsApp'}
              </p>
              <span className="text-[13px] font-bold text-[#b2f3a8] font-['Inter']">+880 1774-749768</span>
            </div>
          </div>
          <a
            className="shrink-0 px-3.5 py-2.5 rounded-xl bg-white text-[#128C7E] text-[13px] font-bold shadow-md hover:bg-[#eff5ec] transition-transform active:scale-95"
            href="https://wa.me/8801774749768?text=Hello%20Organic%20Foods%20BD,%20I%20want%20to%20order%20directly"
            rel="noopener noreferrer"
            target="_blank"
          >
            {lang === 'bn' ? 'মেসেজ দিন' : 'Message'}
          </a>
        </div>
      </section>

      {/* Lab Tested & Delivery Guarantee Seals */}
      <footer className="px-4 pt-1 pb-4">
        <div className="p-4 rounded-2xl bg-[#eff5ec] flex flex-col gap-3 border border-[#dee4db]/50">
          <div className="grid grid-cols-2 gap-2 text-center">
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="p-2.5 rounded-xl bg-white flex flex-col items-center justify-center border border-[#dee4db]/40 hover:bg-[#b2f3a8]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] text-[#003521] mb-1">verified_user</span>
              <span className="text-[11px] font-bold text-[#003521]">
                {lang === 'bn' ? 'ল্যাব টেস্ট সার্টিফাইড' : 'Lab Tested Quality'}
              </span>
              <span className="text-[9px] text-[#717973]">BSTI & ISO Standards</span>
            </button>
            <div className="p-2.5 rounded-xl bg-white flex flex-col items-center justify-center border border-[#dee4db]/40">
              <span className="material-symbols-outlined text-[24px] text-[#316a2f] mb-1">security</span>
              <span className="text-[11px] font-bold text-[#316a2f]">
                {lang === 'bn' ? 'নিরাপদ প্যাকিং' : '100% Eco Packaging'}
              </span>
              <span className="text-[9px] text-[#717973]">Zero Leakage Delivery</span>
            </div>
          </div>
          <div className="text-center text-[11px] text-[#717973]">
            {lang === 'bn'
              ? '© ২০২৫ অর্গানিক ফুডস বিডি (Organic Foods BD) • সর্বস্বত্ব সংরক্ষিত'
              : '© 2025 Organic Foods BD • All Rights Reserved'}
          </div>
        </div>
      </footer>
    </div>
  );
};
