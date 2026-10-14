import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { toBnDigit } from './Header';

export const CategoriesScreen: React.FC = () => {
  const { lang, navigateToCatalogWithCategory } = useApp();

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-3">
      {/* Header title */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#174d35]" />
          <span className="text-[11px] uppercase tracking-wider text-[#316a2f] font-bold">Category Explorer</span>
        </div>
        <h1 className="font-['Hind_Siliguri'] text-[24px] font-bold text-[#003521]">
          {lang === 'bn' ? 'সকল ক্যাটাগরি ব্রাউজ করুন' : 'Explore All Categories'}
        </h1>
        <p className="text-[12px] text-[#404943]">
          {lang === 'bn'
            ? 'পছন্দের ক্যাটাগরি নির্বাচন করে শতভাগ খাঁটি ও পরীক্ষিত খাদ্যসামগ্রী খুঁজুন'
            : 'Select any category to browse tested authentic organic foods'}
        </p>
      </div>

      {/* Featured Banner */}
      <div
        onClick={() => navigateToCatalogWithCategory('ghee')}
        className="cursor-pointer relative w-full rounded-2xl overflow-hidden bg-[#174d35] text-white p-4 mb-4 shadow-md active:scale-[0.99] transition-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAcRpWfoBkBcFnQI0DmMsV2t9K1LRnmfFmDwgr0eHV0jaPILmVKnY3MzxOOzHUpmOyxj5c_LVLYV2SLp58bLRpXQharU1LFyqFtW-G6lkUxpbd5eX6i_6LFE2ly83Zw3CGrZn3v1kmfOu97BLD5vKKMPYVmiV67kYFx2SJ_34qpn1GJuJZrZJvU6xDBg1P3gHyqSOrkMuB_SPSWDos_qYX4jDUyxscBciqDK0nocvabA8y-tGtw_Ls')`
          }}
        />
        <div className="relative z-10">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#ffdea2] text-[#261900] text-[10px] font-bold mb-1.5">
            {lang === 'bn' ? 'স্পেশাল কালেকশন' : 'Special Collection'}
          </span>
          <h3 className="font-['Hind_Siliguri'] text-[18px] font-bold text-white mb-0.5">
            {lang === 'bn' ? 'খাঁটি গাওয়া ও বিলোনা ঘি' : 'Artisanal Bilona Ghee'}
          </h3>
          <p className="text-[11px] text-[#9cd3b3] mb-2">
            {lang === 'bn' ? 'সিরাজগঞ্জের ঐতিহ্যবাহী খামারের মাখন থেকে তৈরি' : 'Crafted from pasture-fed milk curd churns'}
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] text-[#ffdea2] font-bold">
            <span>{lang === 'bn' ? 'কালেকশন দেখুন' : 'Explore Ghee'}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat, idx) => {
          const prodsInCat = PRODUCTS.filter(p => p.category === cat.id);
          return (
            <div
              key={idx}
              onClick={() => navigateToCatalogWithCategory(cat.id)}
              className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] border border-[#dee4db]/50"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#eaf0e6]">
                <img
                  src={cat.imageUrl}
                  alt={cat.nameBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[#003521] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  {lang === 'bn' ? `${toBnDigit(prodsInCat.length || cat.itemCount)}টি পণ্য` : `${prodsInCat.length || cat.itemCount} items`}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-['Hind_Siliguri'] text-[14px] font-bold text-[#003521] line-clamp-1 group-hover:text-[#316a2f]">
                  {lang === 'bn' ? cat.nameBn : cat.nameEn}
                </h3>
                <p className="text-[11px] text-[#717973] truncate">
                  {lang === 'bn' ? cat.subtitleBn : cat.subtitleEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
