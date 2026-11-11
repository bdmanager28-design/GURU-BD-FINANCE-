import React, { useState } from 'react';
import { X, QrCode, Download, Printer, CheckCircle2 } from 'lucide-react';
import { MerchantProfile, LanguageType } from '../types';

interface BanglaQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
  merchant: MerchantProfile;
}

export const BanglaQRModal: React.FC<BanglaQRModalProps> = ({
  isOpen,
  onClose,
  lang,
  merchant
}) => {
  if (!isOpen) return null;
  const [amount, setAmount] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">
                {lang === 'bn' ? 'বাংলা কিউআর (Bangla QR)' : 'Bangla QR Code'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'bn' ? 'বাংলাদেশ ব্যাংক অনুমোদিত ইন্টার-অপারেবল QR' : 'BB Inter-operable Standard QR'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Standee Card */}
        <div className="p-6 text-center space-y-4">
          <div className="bg-gradient-to-b from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
            {/* Merchant Brand Lockup */}
            <div className="mb-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                TallyPay Merchant
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {lang === 'bn' ? merchant.businessNameBn : merchant.businessName}
              </h4>
              <p className="text-xs text-slate-500 font-mono-num">
                Merchant ID: {merchant.merchantId}
              </p>
            </div>

            {/* Official Bangla QR Standee */}
            <div className="relative mx-auto w-56 h-56 bg-white p-3 rounded-2xl border-2 border-slate-900 flex flex-col items-center justify-center shadow-xs">
              {/* Corner Targets */}
              <div className="w-full h-full border border-dashed border-slate-300 p-2 flex flex-col items-center justify-center relative">
                <QrCode className="w-40 h-40 text-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-lg bg-white p-1 shadow-md border border-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-700">TP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Amount Generator */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <label className="text-[11px] text-slate-500 font-medium block mb-1">
                {lang === 'bn' ? 'নির্দিষ্ট পরিমাণ টাকা সেট করুন (ঐচ্ছিক):' : 'Set Fixed Amount (Optional):'}
              </label>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">৳</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-xs font-bold font-mono-num text-center bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Supported Gateway Logos */}
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-medium">
                {lang === 'bn' ? 'যেকোনো অ্যাপ থেকে স্ক্যান করে পেমেন্ট করুন:' : 'Accepts scan from all BD payment apps:'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-600">
                <span className="px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded border border-pink-200">bKash</span>
                <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-200">Nagad</span>
                <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">Rocket</span>
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">Upay</span>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">Visa / Mastercard</span>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">NPSB Bank Apps</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'bn' ? 'দোকানে টানাতে প্রিন্ট করুন' : 'Print Standee'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              {downloaded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? 'Downloaded!' : (lang === 'bn' ? 'QR সেভ করুন' : 'Save QR')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
