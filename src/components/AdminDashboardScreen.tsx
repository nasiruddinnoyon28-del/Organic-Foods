import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, OrderRecord } from '../types';
import { toBnDigit } from './Header';

export const AdminDashboardScreen: React.FC = () => {
  const {
    lang,
    adminUser,
    logoutAdmin,
    products,
    addNewProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    showToast,
    setActiveTab
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'products' | 'new-product'>('orders');

  // New Product Form State
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSubtitleBn, setNewSubtitleBn] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('ghee');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newWeight, setNewWeight] = useState('500g');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Editing existing product price inline
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');

  if (!adminUser) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[48px] text-[#717973] mb-2">lock</span>
        <h2 className="font-['Hind_Siliguri'] text-[18px] font-bold text-[#003521] mb-1">
          {lang === 'bn' ? 'এডমিন অ্যাক্সেস আবশ্যক' : 'Admin Access Required'}
        </h2>
        <p className="text-[12px] text-[#404943] mb-4">
          {lang === 'bn' ? 'অনুগ্রহ করে এডমিন ক্রেডেনশিয়াল দিয়ে লগইন করুন।' : 'Please sign in with admin credentials.'}
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-4 py-2 bg-[#003521] text-white rounded-xl text-[12px] font-bold"
        >
          {lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
        </button>
      </div>
    );
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleBn || !newPrice) {
      showToast(lang === 'bn' ? 'পণ্যের নাম ও দাম লিখুন' : 'Title & Price required');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origNum = parseFloat(newOriginalPrice) || priceNum;

    addNewProduct({
      nameBn: newTitleBn,
      nameEn: newTitleEn || newTitleBn,
      subtitleBn: newSubtitleBn || '১০০% খাঁটি ও প্রাকৃতিক উপাদান',
      subtitleEn: '100% pure organic produce',
      category: newCategory,
      price: priceNum,
      originalPrice: origNum,
      weight: newWeight || '500g',
      imageUrl: newImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRpWfoBkBcFnQI0DmMsV2t9K1LRnmfFmDwgr0eHV0jaPILmVKnY3MzxOOzHUpmOyxj5c_LVLYV2SLp58bLRpXQharU1LFyqFtW-G6lkUxpbd5eX6i_6LFE2ly83Zw3CGrZn3v1kmfOu97BLD5vKKMPYVmiV67kYFx2SJ_34qpn1GJuJZrZJvU6xDBg1P3gHyqSOrkMuB_SPSWDos_qYX4jDUyxscBciqDK0nocvabA8y-tGtw_Ls',
      altText: newTitleBn,
      stockStatusBn: 'স্টকে আছে (In Stock)',
      stockStatusEn: 'In Stock',
      descriptionBn: newDescription || '১০০% খাঁটি ও প্রাকৃতিক প্রক্রিয়ায় সংরক্ষিত।',
      descriptionEn: 'Pure and natural organic food product.',
      benefitsBn: ['প্রাকৃতিক পুষ্টিগুণ সমৃদ্ধ', 'শরীরের সুস্থতা নিশ্চিত করে'],
      benefitsEn: ['Rich in natural nutrients', 'Promotes health & vitality'],
      originBn: 'বাংলাদেশ',
      originEn: 'Bangladesh',
      labCertified: true
    });

    // Reset Form
    setNewTitleBn('');
    setNewTitleEn('');
    setNewSubtitleBn('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewImageUrl('');
    setNewDescription('');
    setActiveAdminTab('products');
  };

  const handleSavePriceEdit = (id: string) => {
    const val = parseFloat(editPriceVal);
    if (!isNaN(val) && val > 0) {
      updateProduct(id, { price: val });
    }
    setEditingProdId(null);
  };

  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3">
      {/* Admin Profile & Status Header */}
      <div className="bg-[#003521] text-white rounded-3xl p-5 shadow-md mb-4 border border-[#b2f3a8]/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdea2] text-[#261900] flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-[26px]">shield_person</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-['Hind_Siliguri'] text-[18px] font-bold leading-tight">
                  {adminUser.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#b2f3a8] text-[#002203] text-[9px] font-bold">
                  {adminUser.role}
                </span>
              </div>
              <p className="text-[11px] text-[#9cd3b3]">{adminUser.email}</p>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-red-500/80 text-white text-[11px] font-bold flex items-center gap-1 transition-colors active:scale-95 border border-white/20"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-[10px] text-[#9cd3b3] block">
              {lang === 'bn' ? 'মোট বিক্রয়' : 'Total Revenue'}
            </span>
            <span className="font-['Inter'] text-[14px] font-bold text-[#ffdea2]">
              ৳ {lang === 'bn' ? toBnDigit(totalSalesRevenue) : totalSalesRevenue}
            </span>
          </div>

          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-[10px] text-[#9cd3b3] block">
              {lang === 'bn' ? 'মোট অর্ডার' : 'Orders'}
            </span>
            <span className="font-['Inter'] text-[14px] font-bold text-[#b2f3a8]">
              {lang === 'bn' ? toBnDigit(orders.length) : orders.length}
            </span>
          </div>

          <div className="bg-white/10 p-2 rounded-xl">
            <span className="text-[10px] text-[#9cd3b3] block">
              {lang === 'bn' ? 'পণ্য সংখ্যা' : 'Live Products'}
            </span>
            <span className="font-['Inter'] text-[14px] font-bold text-white">
              {lang === 'bn' ? toBnDigit(products.length) : products.length}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 bg-[#eff5ec] p-1 rounded-2xl mb-4 border border-[#dee4db]/60">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`flex-1 py-2 text-center rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${
            activeAdminTab === 'orders'
              ? 'bg-white text-[#003521] shadow-xs'
              : 'text-[#404943] hover:text-[#003521]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span>{lang === 'bn' ? `অর্ডার সমূহ (${orders.length})` : `Orders (${orders.length})`}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex-1 py-2 text-center rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${
            activeAdminTab === 'products'
              ? 'bg-white text-[#003521] shadow-xs'
              : 'text-[#404943] hover:text-[#003521]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>{lang === 'bn' ? `পণ্য তালিকা (${products.length})` : `Products (${products.length})`}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('new-product')}
          className={`py-2 px-3 text-center rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${
            activeAdminTab === 'new-product'
              ? 'bg-[#174d35] text-white shadow-xs'
              : 'bg-[#b2f3a8] text-[#16521a] hover:bg-[#97d68f]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>{lang === 'bn' ? 'নতুন পণ্য' : '+ New'}</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4db]/60 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#dee4db]/40">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[12px] font-bold text-[#003521]">{order.id}</span>
                  <span className="text-[10px] text-[#717973]">• {order.orderDate}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdea2] text-[#261900]">
                  {order.paymentMethod}
                </span>
              </div>

              {/* Customer Details */}
              <div className="text-[12px] space-y-0.5">
                <div className="font-bold text-[#171d17] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#316a2f]">person</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="text-[#404943] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#717973]">call</span>
                  <a href={`tel:${order.customerPhone}`} className="text-[#003521] hover:underline font-mono">
                    {order.customerPhone}
                  </a>
                </div>
                <div className="text-[#717973] flex items-start gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#717973] shrink-0 mt-0.5">location_on</span>
                  <span>{order.deliveryAddress}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-2.5 rounded-xl bg-[#eff5ec] text-[11px] space-y-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#171d17]">
                    <span>
                      {it.productNameBn} ({it.size}) x {it.quantity}
                    </span>
                    <span className="font-bold">৳{it.price * it.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1 border-t border-[#dee4db] font-bold text-[#003521] text-[12px]">
                  <span>সর্বমোট বিল:</span>
                  <span>৳{order.totalAmount}</span>
                </div>
              </div>

              {/* Order Status Control */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-[#404943]">স্ট্যাটাস পরিবর্তন:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'প্রসেসিং', 'Processing')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      order.statusBn === 'প্রসেসিং'
                        ? 'bg-[#174d35] text-white border-[#174d35]'
                        : 'bg-[#eff5ec] text-[#404943]'
                    }`}
                  >
                    প্রসেসিং
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ডেলিভারিতে আছে', 'In Transit')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      order.statusBn === 'ডেলিভারিতে আছে'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-[#eff5ec] text-[#404943]'
                    }`}
                  >
                    ডেলিভারি
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'সম্পন্ন', 'Delivered')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      order.statusBn === 'সম্পন্ন'
                        ? 'bg-[#316a2f] text-white border-[#316a2f]'
                        : 'bg-[#eff5ec] text-[#404943]'
                    }`}
                  >
                    সম্পন্ন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Products Catalog Management */}
      {activeAdminTab === 'products' && (
        <div className="space-y-2.5">
          {products.map(prod => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl p-3 shadow-xs border border-[#dee4db]/50 flex items-center justify-between gap-3"
            >
              <img
                src={prod.imageUrl}
                alt={prod.nameBn}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-['Hind_Siliguri'] text-[13px] font-bold text-[#171d17] truncate">
                    {prod.nameBn}
                  </h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    prod.stockStatusBn.includes('স্টকে আছে')
                      ? 'bg-[#b2f3a8] text-[#16521a]'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {prod.weight}
                  </span>
                </div>

                {/* Inline Price Editor */}
                {editingProdId === prod.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-bold text-[#003521]">৳</span>
                    <input
                      type="number"
                      value={editPriceVal}
                      onChange={e => setEditPriceVal(e.target.value)}
                      className="w-20 px-1.5 py-0.5 text-[12px] font-bold border rounded bg-[#eff5ec] outline-none"
                    />
                    <button
                      onClick={() => handleSavePriceEdit(prod.id)}
                      className="px-2 py-0.5 rounded bg-[#003521] text-white text-[10px] font-bold"
                    >
                      সেভ
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-['Inter'] text-[13px] font-bold text-[#003521]">
                      ৳ {prod.price}
                    </span>
                    <button
                      onClick={() => {
                        setEditingProdId(prod.id);
                        setEditPriceVal(prod.price.toString());
                      }}
                      className="text-[10px] text-[#316a2f] hover:underline flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">edit</span>
                      দাম পরিবর্তন
                    </button>
                  </div>
                )}
              </div>

              {/* Stock Toggle & Delete Actions */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  onClick={() => {
                    const isNowInStock = !prod.stockStatusBn.includes('স্টকে আছে');
                    updateProduct(prod.id, {
                      stockStatusBn: isNowInStock ? 'স্টকে আছে (In Stock)' : 'স্টক শেষ (Out of Stock)',
                      stockStatusEn: isNowInStock ? 'In Stock' : 'Out of Stock'
                    });
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    prod.stockStatusBn.includes('স্টকে আছে')
                      ? 'bg-[#b2f3a8] text-[#16521a]'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {prod.stockStatusBn.includes('স্টকে আছে') ? 'ইন স্টক' : 'আউট অব স্টক'}
                </button>

                <button
                  onClick={() => deleteProduct(prod.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete product"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Add New Product Form */}
      {activeAdminTab === 'new-product' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4db]/60 space-y-3">
          <h3 className="font-['Hind_Siliguri'] text-[16px] font-bold text-[#003521] pb-1 border-b border-[#dee4db]/40">
            {lang === 'bn' ? 'ক্যাটালগে নতুন পণ্য যোগ করুন' : 'Add New Organic Product'}
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-[#404943] mb-1">
              পণ্যের নাম (বাংলায়) *
            </label>
            <input
              required
              type="text"
              value={newTitleBn}
              onChange={e => setNewTitleBn(e.target.value)}
              placeholder="যেমন: খাঁটি লিচু ফুলের মধু"
              className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#404943] mb-1">
              পণ্যের নাম (English)
            </label>
            <input
              type="text"
              value={newTitleEn}
              onChange={e => setNewTitleEn(e.target.value)}
              placeholder="e.g. Raw Litchi Flower Honey"
              className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#404943] mb-1">
                ক্যাটাগরি
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full text-[12px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-2 py-2 outline-none"
              >
                <option value="ghee">ঘি ও মাখন (Ghee)</option>
                <option value="honey">মধু (Honey)</option>
                <option value="oil">তেল (Oil)</option>
                <option value="grains">চাল ও ডাল (Grains)</option>
                <option value="spices">মসলা ও বীজ (Spices)</option>
                <option value="dry-fruits">বাদাম ও খেজুর (Dry Fruits)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#404943] mb-1">
                ওজন / প্যাকেজিং
              </label>
              <input
                type="text"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="500g / 1kg"
                className="w-full text-[12px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#404943] mb-1">
                বিক্রয় মূল্য (৳) *
              </label>
              <input
                required
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                placeholder="750"
                className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#404943] mb-1">
                আগের মূল্য (৳)
              </label>
              <input
                type="number"
                value={newOriginalPrice}
                onChange={e => setNewOriginalPrice(e.target.value)}
                placeholder="850"
                className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#404943] mb-1">
              পণ্যের ছবির লিংক (Image URL)
            </label>
            <input
              type="url"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              placeholder="https://... (ঐচ্ছিক)"
              className="w-full text-[12px] bg-[#eff5ec] border border-[#dee4db] rounded-xl px-3 py-2 outline-none focus:border-[#003521]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#003521] text-white text-[13px] font-bold shadow-md hover:bg-[#174d35] active:scale-95 transition-all mt-2"
          >
            {lang === 'bn' ? 'পণ্যটি সংরক্ষণ করুন' : 'Save Product'}
          </button>
        </form>
      )}
    </div>
  );
};
