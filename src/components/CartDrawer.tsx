import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toBnDigit } from './Header';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    deliveryFee,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    showToast,
    addOrder
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 1500;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleConfirmCod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন' : 'Please fill all required delivery details');
      return;
    }

    addOrder({
      customerName: name,
      customerPhone: phone,
      deliveryAddress: address,
      items: cart.map(c => ({
        productNameBn: c.product.nameBn,
        productNameEn: c.product.nameEn,
        quantity: c.quantity,
        size: c.selectedSize,
        price: c.product.price
      })),
      totalAmount: cartTotal,
      paymentMethod: 'Cash on Delivery'
    });

    setOrderConfirmed(true);
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  const handleWhatsAppOrder = () => {
    const itemsList = cart
      .map(item => `• ${item.product.nameBn} (${item.selectedSize}) x ${item.quantity} = ৳${item.product.price * item.quantity}`)
      .join('\n');

    const msg = `আসসালামু আলাইকুম অর্গানিক বিডি,\nআমি কার্ট থেকে অর্ডার কনফার্ম করতে চাই:\n\n${itemsList}\n\nসাবটোটাল: ৳${cartSubtotal}\n${appliedCoupon ? `ডিসকাউন্ট: -৳${cartDiscount}\n` : ''}ডেলিভারি চার্জ: ${deliveryFee === 0 ? 'ফ্রি' : `৳${deliveryFee}`}\nসর্বমোট: ৳${cartTotal}\n\nদয়া করে অর্ডারটি দ্রুত প্রসেস করুন। ধন্যবাদ!`;

    const url = `https://wa.me/8801774749768?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#f5fbf1] h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3.5 bg-white border-b border-[#dee4db] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#003521]">shopping_bag</span>
            <h2 className="font-['Hind_Siliguri'] text-[18px] font-bold text-[#003521]">
              {lang === 'bn' ? 'শপিং ব্যাগ' : 'Shopping Bag'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#eaf0e6] text-[#003521] text-[11px] font-bold">
              {lang === 'bn' ? `${toBnDigit(cartCount)}টি আইটেম` : `${cartCount} items`}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-[#eff5ec] text-[#404943] hover:text-[#171d17] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-4 py-2.5 bg-[#eff5ec] border-b border-[#dee4db]/60">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#174d35] mb-1">
            <span>
              {remainingForFreeDelivery === 0
                ? (lang === 'bn' ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন' : 'Congrats! Free delivery unlocked')
                : (lang === 'bn'
                  ? `আর ৳${toBnDigit(remainingForFreeDelivery)} টাকার অর্ডারে ফ্রি ডেলিভারি!`
                  : `Add ৳${remainingForFreeDelivery} more for Free Delivery!`)}
            </span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#dee4db] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#316a2f] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {orderConfirmed ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 rounded-full bg-[#b2f3a8] text-[#16521a] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <h3 className="font-['Hind_Siliguri'] text-[20px] font-bold text-[#003521] mb-1">
                {lang === 'bn' ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-[12px] text-[#404943] max-w-xs mb-4">
                {lang === 'bn'
                  ? 'আমাদের টিম খুব দ্রুত ফোন করে আপনার অর্ডারটি কনফার্ম করবে। ক্যাশ অন ডেলিভারিতে চেক করে মূল্য পরিশোধ করুন।'
                  : 'Our support agent will call you shortly to confirm dispatch. Check before payment.'}
              </p>
              <button
                onClick={() => {
                  setOrderConfirmed(false);
                  setIsCheckingOut(false);
                  setIsCartOpen(false);
                }}
                className="px-5 py-2.5 bg-[#003521] text-white rounded-xl text-[13px] font-bold"
              >
                {lang === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full text-[#717973]">
              <span className="material-symbols-outlined text-[48px] mb-2 text-[#dee4db]">shopping_cart</span>
              <p className="text-[14px] font-semibold text-[#404943] mb-1">
                {lang === 'bn' ? 'আপনার ব্যাগটি এখনো খালি' : 'Your bag is empty'}
              </p>
              <p className="text-[12px] max-w-xs mb-4">
                {lang === 'bn'
                  ? 'আমাদের খাঁটি ঘি, মধু ও সরিষার তেলের ক্যাটালগ ঘুরে দেখুন।'
                  : 'Explore our catalog for authentic Ghee, Honey & Mustard Oil.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 bg-[#003521] text-white rounded-xl text-[12px] font-bold"
              >
                {lang === 'bn' ? 'পণ্য ব্রাউজ করুন' : 'Browse Products'}
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleConfirmCod} className="space-y-3 bg-white p-4 rounded-2xl border border-[#dee4db]/60">
              <div className="flex items-center justify-between pb-2 border-b border-[#dee4db]">
                <h3 className="font-['Hind_Siliguri'] text-[15px] font-bold text-[#003521]">
                  {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি তথ্য' : 'Cash on Delivery Details'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-[11px] text-[#316a2f] font-bold underline"
                >
                  {lang === 'bn' ? 'ব্যাগে ফিরে যান' : 'Back to Cart'}
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#404943] mb-1">
                  {lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Nasir Uddin"
                  className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#404943] mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#404943] mb-1">
                  {lang === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা *' : 'Delivery Address *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House, Road, Area, City"
                  className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#003521] text-white text-[14px] font-bold shadow-md hover:bg-[#174d35] active:scale-95 transition-all"
                >
                  {lang === 'bn' ? `অর্ডার কনফার্ম করুন (৳ ${toBnDigit(cartTotal)})` : `Place Order (৳ ${cartTotal})`}
                </button>
              </div>
            </form>
          ) : (
            /* Items List */
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${idx}`}
                className="bg-white rounded-2xl p-3 shadow-xs border border-[#dee4db]/50 flex items-center gap-3"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.nameBn}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-['Hind_Siliguri'] text-[13px] font-bold text-[#171d17] truncate">
                    {lang === 'bn' ? item.product.nameBn : item.product.nameEn}
                  </h4>
                  <span className="text-[10px] text-[#717973] inline-block mb-1">
                    {item.selectedSize}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Inter'] text-[13px] font-bold text-[#003521]">
                      ৳ {lang === 'bn' ? toBnDigit(item.product.price * item.quantity) : item.product.price * item.quantity}
                    </span>
                    <span className="text-[10px] text-[#717973]">
                      (৳{lang === 'bn' ? toBnDigit(item.product.price) : item.product.price} x {item.quantity})
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    className="text-[#717973] hover:text-red-500 p-0.5"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>

                  <div className="flex items-center gap-1.5 bg-[#eff5ec] rounded-lg px-1.5 py-0.5 border border-[#dee4db]/60">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-[#171d17] hover:bg-white text-[14px] font-bold"
                    >
                      -
                    </button>
                    <span className="text-[12px] font-bold text-[#003521] min-w-3 text-center">
                      {lang === 'bn' ? toBnDigit(item.quantity) : item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-[#171d17] hover:bg-white text-[14px] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Coupon Section */}
          {!isCheckingOut && !orderConfirmed && cart.length > 0 && (
            <div className="bg-white rounded-2xl p-3 border border-[#dee4db]/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#404943]">
                <span>{lang === 'bn' ? 'ডিসকাউন্ট কুপন' : 'Discount Coupon'}</span>
                <span className="text-[#316a2f]">Code: PUJA20</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#b2f3a8]/30 px-3 py-2 rounded-xl border border-[#97d68f]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#16521a] font-bold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{appliedCoupon} (২০% ছাড় প্রযোজ্য)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    {lang === 'bn' ? 'মুছুন' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value)}
                    placeholder="PUJA20"
                    className="flex-1 text-[12px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-1.5 uppercase outline-none focus:border-[#003521]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-[#174d35] text-white text-[11px] font-bold hover:bg-[#003521]"
                  >
                    {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTAs */}
        {!orderConfirmed && cart.length > 0 && !isCheckingOut && (
          <div className="p-4 bg-white border-t border-[#dee4db] space-y-3">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-[12px]">
              <div className="flex items-center justify-between text-[#404943]">
                <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-['Inter'] font-semibold">
                  ৳ {lang === 'bn' ? toBnDigit(cartSubtotal) : cartSubtotal}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-[#316a2f]">
                  <span>{lang === 'bn' ? 'কুপন ছাড় (২০%)' : 'Coupon Discount (20%)'}</span>
                  <span className="font-['Inter'] font-bold">
                    - ৳ {lang === 'bn' ? toBnDigit(cartDiscount) : cartDiscount}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#404943]">
                <span>{lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
                <span className="font-['Inter'] font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#316a2f] font-bold">{lang === 'bn' ? 'ফ্রি' : 'Free'}</span>
                  ) : (
                    `৳ ${lang === 'bn' ? toBnDigit(deliveryFee) : deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-[15px] font-bold text-[#003521] pt-1.5 border-t border-[#dee4db]">
                <span>{lang === 'bn' ? 'সর্বমোট' : 'Total'}</span>
                <span className="font-['Inter']">
                  ৳ {lang === 'bn' ? toBnDigit(cartTotal) : cartTotal}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsCheckingOut(true)}
                className="py-2.5 px-3 rounded-xl bg-[#003521] text-white text-[12px] font-bold flex items-center justify-center gap-1 active:scale-95 shadow-md hover:bg-[#174d35]"
              >
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-[12px] font-bold flex items-center justify-center gap-1 active:scale-95 shadow-md hover:bg-[#1ebd59]"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>{lang === 'bn' ? 'WhatsApp অর্ডার' : 'WhatsApp Order'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
