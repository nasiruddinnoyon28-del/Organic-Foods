import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminLoginModal: React.FC = () => {
  const { lang, isAdminModalOpen, setIsAdminModalOpen, loginAdmin } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }, 400);
  };

  const handleQuickFill = (accType: 'owner' | 'manager') => {
    if (accType === 'owner') {
      setEmail('nasiruddinnoyon28@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('admin@organicfoods.bd');
      setPassword('admin123');
    }
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAdminModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#dee4db]">
        {/* Header */}
        <div className="bg-[#003521] text-white p-5 flex flex-col items-center relative">
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-[#ffdea2] text-[#261900] flex items-center justify-center shadow-md mb-2">
            <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
          </div>
          <h3 className="font-['Hind_Siliguri'] text-[18px] font-bold">
            {lang === 'bn' ? 'এডমিন পোর্টাল লগইন' : 'Admin Portal Login'}
          </h3>
          <p className="text-[11px] text-[#9cd3b3]">
            {lang === 'bn' ? 'দোকান ব্যবস্থাপনা ও অর্ডার মনিটরিং' : 'Store & Inventory Management'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#404943] mb-1">
              {lang === 'bn' ? 'এডমিন ইমেইল *' : 'Admin Email *'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717973] text-[18px]">
                mail
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@organicfoods.bd"
                className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl pl-9 pr-3 py-2.5 text-[#171d17] outline-none focus:border-[#003521] focus:ring-1 focus:ring-[#003521]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#404943] mb-1">
              {lang === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717973] text-[18px]">
                lock
              </span>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-[13px] bg-[#eff5ec] border border-[#dee4db] rounded-xl pl-9 pr-10 py-2.5 text-[#171d17] outline-none focus:border-[#003521] focus:ring-1 focus:ring-[#003521]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#171d17]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-1">
            <span className="text-[10px] text-[#717973] font-semibold block mb-1">
              {lang === 'bn' ? 'দ্রুত ডেমো লগইন ক্রেডেনশিয়াল:' : 'Quick Demo Credentials:'}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('owner')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#eaf0e6] hover:bg-[#dee4db] text-[#003521] text-[10px] font-bold text-center border border-[#dee4db] transition-colors"
              >
                {lang === 'bn' ? 'অনার (নয়ন)' : 'Owner (Noyon)'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('manager')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#eaf0e6] hover:bg-[#dee4db] text-[#003521] text-[10px] font-bold text-center border border-[#dee4db] transition-colors"
              >
                {lang === 'bn' ? 'ম্যানেজার' : 'Manager'}
              </button>
            </div>
            <p className="text-[9px] text-[#717973] mt-1 text-center">
              (Password: <span className="font-mono font-bold text-[#003521]">admin123</span>)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#003521] hover:bg-[#174d35] text-white text-[13px] font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">login</span>
            )}
            <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In as Admin'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
