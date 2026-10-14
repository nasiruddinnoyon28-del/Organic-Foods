import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toBnDigit } from './Header';

export const ProductDetailModal: React.FC = () => {
  const {
    lang,
    selectedProduct,
    setSelectedProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setIsCertModalOpen
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!selectedProduct) return null;

  const currentSize = selectedSize || selectedProduct.weight;
  const sizes = selectedProduct.availableSizes || [selectedProduct.weight];

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentSize);
    setSelectedProduct(null);
  };

  const handleWhatsAppBuyNow = () => {
    const msg = `আসসালামু আলাইকুম, আমি সরাসরি "${selectedProduct.nameBn}" (${currentSize}) - ${quantity}টি অর্ডার করতে চাই। দাম: ৳${selectedProduct.price * quantity}। দয়া করে কনফার্ম করুন।`;
    const url = `https://wa.me/8801774749768?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden border border-[#dee4db]">
        {/* Close & Wishlist Overlay Controls */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-[#717973] hover:text-red-500 transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isWishlisted(selectedProduct.id) ? 'text-red-500 fill-1' : ''
              }`}
              style={isWishlisted(selectedProduct.id) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {isWishlisted(selectedProduct.id) ? 'favorite' : 'favorite_border'}
            </span>
          </button>
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-[#171d17] hover:bg-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Main Visual */}
          <div className="relative w-full aspect-4/3 bg-[#eff5ec] overflow-hidden">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.nameBn}
              className="w-full h-full object-cover"
            />
            {selectedProduct.discountBadgeBn && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#ffdea2] text-[#261900] text-[11px] font-bold shadow-sm">
                {lang === 'bn' ? selectedProduct.discountBadgeBn : selectedProduct.discountBadgeEn}
              </span>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Title & Ratings */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#316a2f]" />
                <span className="text-[11px] text-[#316a2f] font-semibold">
                  {lang === 'bn' ? selectedProduct.stockStatusBn : selectedProduct.stockStatusEn}
                </span>
                <span className="text-[#dee4db]">•</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-[#f2bf52] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-[#171d17]">{selectedProduct.rating}</span>
                  <span className="text-[#717973]">
                    ({lang === 'bn' ? toBnDigit(selectedProduct.reviewsCount) : selectedProduct.reviewsCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'})
                  </span>
                </div>
              </div>

              <h2 className="font-['Hind_Siliguri'] text-[22px] font-bold text-[#003521] leading-tight">
                {lang === 'bn' ? selectedProduct.nameBn : selectedProduct.nameEn}
              </h2>
              <p className="text-[13px] text-[#404943] mt-0.5 font-medium">
                {lang === 'bn' ? selectedProduct.subtitleBn : selectedProduct.subtitleEn}
              </p>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-2 p-3 rounded-2xl bg-[#eff5ec]">
              <span className="font-['Inter'] text-[24px] font-bold text-[#003521]">
                ৳ {lang === 'bn' ? toBnDigit(selectedProduct.price) : selectedProduct.price}
              </span>
              <span className="font-['Inter'] text-[14px] text-[#717973] line-through">
                ৳ {lang === 'bn' ? toBnDigit(selectedProduct.originalPrice) : selectedProduct.originalPrice}
              </span>
              <span className="text-[11px] font-bold text-[#16521a] bg-[#b2f3a8] px-2 py-0.5 rounded-full ml-auto">
                {lang === 'bn' ? 'সাশ্রয় ৳' + toBnDigit(selectedProduct.originalPrice - selectedProduct.price) : `Save ৳${selectedProduct.originalPrice - selectedProduct.price}`}
              </span>
            </div>

            {/* Package Size Variants */}
            {sizes.length > 1 && (
              <div>
                <label className="block text-[11px] font-bold text-[#404943] uppercase mb-1.5">
                  {lang === 'bn' ? 'প্যাকেটের সাইজ নির্বাচন করুন:' : 'Select Pack Size:'}
                </label>
                <div className="flex gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-bold border transition-all ${
                        currentSize === size
                          ? 'border-[#003521] bg-[#003521] text-white shadow-xs'
                          : 'border-[#dee4db] bg-[#eff5ec] text-[#404943] hover:border-[#003521]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-['Hind_Siliguri'] text-[14px] font-bold text-[#003521] mb-1">
                {lang === 'bn' ? 'পণ্যের বিবরণ' : 'Description'}
              </h3>
              <p className="text-[12px] text-[#404943] leading-relaxed">
                {lang === 'bn' ? selectedProduct.descriptionBn : selectedProduct.descriptionEn}
              </p>
            </div>

            {/* Health Benefits */}
            <div className="p-3.5 rounded-2xl bg-[#f5fbf1] border border-[#dee4db]">
              <h3 className="font-['Hind_Siliguri'] text-[13px] font-bold text-[#003521] mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#316a2f]">health_and_safety</span>
                {lang === 'bn' ? 'স্বাস্থ্য উপকারিতা' : 'Health Benefits'}
              </h3>
              <ul className="space-y-1.5">
                {(lang === 'bn' ? selectedProduct.benefitsBn : selectedProduct.benefitsEn).map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-[12px] text-[#171d17]">
                    <span className="material-symbols-outlined text-[14px] text-[#316a2f]">check_circle</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Origin & Certification Badge */}
            <div className="flex items-center justify-between text-[11px] text-[#404943] pt-1">
              <div>
                <span className="font-semibold text-[#171d17]">
                  {lang === 'bn' ? 'উৎপত্তি:' : 'Origin:'}
                </span>{' '}
                {lang === 'bn' ? selectedProduct.originBn : selectedProduct.originEn}
              </div>
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="text-[#316a2f] font-bold flex items-center gap-0.5 hover:underline"
              >
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>BSTI Certified</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Footer CTAs with Quantity */}
        <div className="p-4 bg-white border-t border-[#dee4db] flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-[#eff5ec] rounded-xl px-2.5 py-1.5 border border-[#dee4db]">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-[#171d17] font-bold text-base hover:bg-white"
            >
              -
            </button>
            <span className="text-[13px] font-bold text-[#003521] min-w-4 text-center">
              {lang === 'bn' ? toBnDigit(quantity) : quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-[#171d17] font-bold text-base hover:bg-white"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3 rounded-xl bg-[#003521] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-md hover:bg-[#174d35]"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
          </button>

          {/* WhatsApp Direct Buy */}
          <button
            onClick={handleWhatsAppBuyNow}
            className="py-3 px-3.5 rounded-xl bg-[#25D366] text-white text-[13px] font-bold flex items-center justify-center gap-1 active:scale-95 shadow-md hover:bg-[#1ebd59]"
            title="Order directly on WhatsApp"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
