import React from 'react';
import { useApp } from '../context/AppContext';

export const TrustCertModal: React.FC = () => {
  const { lang, isCertModalOpen, setIsCertModalOpen } = useApp();

  if (!isCertModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsCertModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 max-h-[85vh] flex flex-col overflow-hidden border border-[#dee4db]">
        <div className="p-4 bg-[#174d35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#ffdea2]">verified</span>
            <h3 className="font-['Hind_Siliguri'] text-[16px] font-bold">
              {lang === 'bn' ? 'অর্গানিক কোয়ালিটি সার্টিফিকেট' : 'Organic Quality Certification'}
            </h3>
          </div>
          <button
            onClick={() => setIsCertModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="text-center p-4 rounded-2xl bg-[#eff5ec] border border-[#dee4db]/70">
            <span className="material-symbols-outlined text-[42px] text-[#316a2f] mb-1">workspace_premium</span>
            <h4 className="font-['Hind_Siliguri'] text-[16px] font-bold text-[#003521]">
              {lang === 'bn' ? 'শতভাগ বিশুদ্ধতার অঙ্গীকার' : '100% Purity & Lab Verified'}
            </h4>
            <p className="text-[12px] text-[#404943] mt-1 leading-relaxed">
              {lang === 'bn'
                ? 'অর্গানিক বিডি (Organic Foods BD)-এর প্রতিটি পণ্য সরকারি মান নিয়ন্ত্রণকারী সংস্থা BSTI ও আন্তর্জাতিক খাদ্য নিরাপত্তা স্ট্যান্ডার্ড অনুসরণ করে সংগ্রহ ও মোড়কজাত করা হয়।'
                : 'Every food batch is rigorously sampled and certified compliant with BSTI national standards and ISO 22000 hygiene benchmarks.'}
            </p>
          </div>

          {/* Test Parameters */}
          <div className="space-y-2">
            <h5 className="text-[12px] font-bold text-[#003521] uppercase tracking-wide">
              {lang === 'bn' ? 'ল্যাবরেটরি টেস্ট রিপোর্ট পয়েন্টসমূহ:' : 'Laboratory Test Key Parameters:'}
            </h5>

            {[
              {
                titleBn: '০% ডালডা ও কৃত্রিম ফ্যাট',
                titleEn: '0% Hydrogenated Vegetable Fat',
                descBn: 'গাওয়া ঘিয়ে কোনো কৃত্রিম ফ্যাট বা সুগন্ধি নেই',
                descEn: 'Natural pure butterfat verified'
              },
              {
                titleBn: '১০০% অপালিশকৃত ও প্রাকৃতিক',
                titleEn: '100% Unadulterated & Natural',
                descBn: 'সুন্দরবনের মধুতে কোনো মিষ্টি সিরাপ বা চিনি ভেজাল নেই',
                descEn: 'Zero sucrose / adulterant syrups'
              },
              {
                titleBn: 'লেড ও ক্রোমেট মুক্ত',
                titleEn: 'Zero Lead & Heavy Metals',
                descBn: 'হলুদ ও মসলায় ক্ষতিকর কোনো রাসায়নিক রঙ নেই',
                descEn: 'Clean hills produce without chemical dye'
              },
              {
                titleBn: 'কোল্ড প্রেসড প্রথম চাপ',
                titleEn: 'First Cold Press Extraction',
                descBn: 'কাঠের ঘানিতে কম তাপমাত্রায় নিষ্কাশিত সরিষা তেল',
                descEn: 'Natural pungency and nutrients intact'
              }
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#f5fbf1] border border-[#dee4db] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#316a2f] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <div className="text-[12px] font-bold text-[#171d17]">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </div>
                  <div className="text-[11px] text-[#717973]">
                    {lang === 'bn' ? item.descBn : item.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#b2f3a8]/30 rounded-xl text-[11px] text-[#16521a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#316a2f]">security</span>
            <span>
              {lang === 'bn'
                ? 'মান নিয়ে কোনো সংশয় থাকলে সম্পূর্ণ মানিব্যাক বা পণ্য পরিবর্তনের নিশ্চয়তা।'
                : 'Full replacement or refund if you detect any compromise in purity.'}
            </span>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-[#dee4db] flex justify-end">
          <button
            onClick={() => setIsCertModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-[#003521] text-white text-[12px] font-bold"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};
