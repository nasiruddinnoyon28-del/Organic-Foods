import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { toBnDigit } from './Header';

export const WhatsAppScreen: React.FC = () => {
  const { lang, cart, cartTotal, showToast } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    cart.length > 0 ? cart.map(c => c.product.id) : [PRODUCTS[0].id]
  );
  const [customNote, setCustomNote] = useState('');

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(p => p !== id) : prev) : [...prev, id]
    );
  };

  const selectedProducts = PRODUCTS.filter(p => selectedProductIds.includes(p.id));

  // Generate clean formatted WhatsApp text
  const generateWhatsAppMessage = () => {
    const itemsText = selectedProducts
      .map(p => `• ${p.nameBn} (${p.weight}) - ৳${p.price}`)
      .join('\n');

    const totalEstimated = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    const payLabel =
      paymentMethod === 'cod'
        ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)'
        : paymentMethod === 'bkash'
        ? 'বিকাশ (bKash)'
        : 'নগদ (Nagad)';

    return `আসসালামু আলাইকুম অর্গানিক বিডি,\nআমি নিম্নলিখিত খাঁটি পণ্যগুলো অর্ডার করতে চাই:\n\n${itemsText}\n\nমোট মূল্য: ৳${totalEstimated} (ডেলিভারি চার্জ প্রযোজ্য)\nপেমেন্ট পদ্ধতি: ${payLabel}\n\nগ্রাহকের নাম: ${customerName || '(নাম লিখুন)'}\nমোবাইল নম্বর: ${customerPhone || '(নম্বর লিখুন)'}\nডেলিভারি ঠিকানা: ${deliveryAddress || '(ঠিকানা লিখুন)'}\n${customNote ? `বিশেষ নির্দেশনা: ${customNote}\n` : ''}\nদয়া করে আমার অর্ডারটি কনফার্ম করুন। ধন্যবাদ!`;
  };

  const handleSendWhatsApp = () => {
    if (!customerPhone && !customerName) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম ও ফোন নম্বর লিখুন' : 'Please provide your name & phone number');
    }
    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/8801774749768?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3">
      {/* WhatsApp Hero Card */}
      <div className="w-full bg-[#128C7E] text-white rounded-3xl p-5 shadow-lg mb-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[32px]">chat</span>
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#25D366]/30 text-white text-[10px] font-bold mb-0.5">
              {lang === 'bn' ? 'লাইভ সাপোর্ট ও দ্রুত অর্ডার' : 'Live Order Desk'}
            </span>
            <h1 className="font-['Hind_Siliguri'] text-[20px] font-bold leading-tight">
              {lang === 'bn' ? 'WhatsApp ডিরেক্ট অর্ডার হাব' : 'WhatsApp Direct Order Hub'}
            </h1>
            <p className="text-[12px] text-[#e4eae0]">
              {lang === 'bn' ? 'সরাসরি চ্যাট করে কয়েক সেকেন্ডে অর্ডার দিন' : 'Order in seconds directly via WhatsApp chat'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
          <a
            href="tel:+8801774749768"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[12px] font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>+880 1774-749768</span>
          </a>
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 text-white text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-[#b2f3a8]">schedule</span>
            <span>{lang === 'bn' ? 'সকাল ৮টা - রাত ১১টা' : '8 AM - 11 PM'}</span>
          </div>
        </div>
      </div>

      {/* Direct Order Form Wizard */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4db]/60 mb-4">
        <h2 className="font-['Hind_Siliguri'] text-[16px] font-bold text-[#003521] mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-[#25D366]">edit_note</span>
          {lang === 'bn' ? 'অর্ডার মেসেজ বিল্ডার' : 'Quick Order Builder'}
        </h2>

        {/* Step 1: Select Products */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-[#404943] uppercase mb-1.5">
            {lang === 'bn' ? '১. যে পণ্যগুলো অর্ডার করতে চান (সিলেক্ট করুন)' : '1. Select Products to Order'}
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {PRODUCTS.slice(0, 8).map(prod => {
              const isSelected = selectedProductIds.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  onClick={() => toggleSelectProduct(prod.id)}
                  className={`shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-left transition-all active:scale-95 ${
                    isSelected
                      ? 'border-[#25D366] bg-[#b2f3a8]/20 ring-1 ring-[#25D366]'
                      : 'border-[#dee4db] bg-white opacity-75'
                  }`}
                >
                  <img src={prod.imageUrl} alt={prod.nameBn} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#171d17] line-clamp-1">
                      {lang === 'bn' ? prod.nameBn : prod.nameEn}
                    </span>
                    <span className="text-[10px] text-[#316a2f] font-semibold">
                      ৳{lang === 'bn' ? toBnDigit(prod.price) : prod.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Customer Info */}
        <div className="space-y-2.5 mb-4">
          <label className="block text-[11px] font-bold text-[#404943] uppercase mb-0.5">
            {lang === 'bn' ? '২. আপনার ডেলিভারি তথ্য' : '2. Your Delivery Information'}
          </label>

          <div>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder={lang === 'bn' ? 'আপনার নাম (যেমন: তানজিমুল হাসান)' : 'Your Name'}
              className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 text-[#171d17] outline-none focus:border-[#25D366]"
            />
          </div>

          <div>
            <input
              type="tel"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder={lang === 'bn' ? 'মোবাইল নম্বর (যেমন: 01712345678)' : 'Mobile Number'}
              className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 text-[#171d17] outline-none focus:border-[#25D366]"
            />
          </div>

          <div>
            <textarea
              rows={2}
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              placeholder={lang === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড, থানা, জেলা)' : 'Full Delivery Address (House/Road, Area, City)'}
              className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 text-[#171d17] outline-none focus:border-[#25D366]"
            />
          </div>
        </div>

        {/* Step 3: Payment Method */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-[#404943] uppercase mb-1.5">
            {lang === 'bn' ? '৩. পেমেন্ট পদ্ধতি' : '3. Payment Method'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'cod', labelBn: 'ক্যাশ অন ডেলিভারি', labelEn: 'COD' },
              { id: 'bkash', labelBn: 'বিকাশ', labelEn: 'bKash' },
              { id: 'nagad', labelBn: 'নগদ', labelEn: 'Nagad' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as any)}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-colors ${
                  paymentMethod === m.id
                    ? 'bg-[#174d35] text-white border-[#174d35]'
                    : 'bg-[#eff5ec] text-[#404943] border-[#dee4db]'
                }`}
              >
                {lang === 'bn' ? m.labelBn : m.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Message Preview */}
        <div className="p-3 rounded-xl bg-[#eff5ec] border border-[#dee4db] mb-4">
          <div className="flex items-center justify-between text-[11px] text-[#717973] font-semibold mb-1">
            <span>{lang === 'bn' ? 'মেসেজ প্রিভিউ:' : 'Message Preview:'}</span>
            <span className="text-[#25D366] font-bold">WhatsApp Ready</span>
          </div>
          <pre className="text-[11px] text-[#171d17] font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
            {generateWhatsAppMessage()}
          </pre>
        </div>

        {/* Direct Send WhatsApp Button */}
        <button
          onClick={handleSendWhatsApp}
          className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white text-[14px] font-bold shadow-md hover:bg-[#1ebd59] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">send</span>
          <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার পাঠান' : 'Send Order to WhatsApp'}</span>
        </button>
      </div>

      {/* Safety & Trust Note */}
      <div className="p-3.5 rounded-2xl bg-[#b2f3a8]/30 border border-[#97d68f]/40 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#316a2f] text-[24px]">verified</span>
        <div className="text-[11px] text-[#16521a]">
          <span className="font-bold">
            {lang === 'bn' ? 'নিশ্চিন্তে অর্ডার করুন:' : '100% Risk Free:'}
          </span>{' '}
          {lang === 'bn'
            ? 'পণ্য হাতে পেয়ে চেক করে পেমেন্ট করবেন। কোনো অগ্রিম চার্জ নেই।'
            : 'Inspect packages before payment. No advance fee required for COD.'}
        </div>
      </div>
    </div>
  );
};
