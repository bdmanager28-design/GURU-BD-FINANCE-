import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  QrCode, 
  Send, 
  Smartphone, 
  Building2, 
  CreditCard, 
  BookOpen, 
  HelpCircle,
  BadgeCheck,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { MerchantProfile, LanguageType } from '../types';

interface MerchantCardProps {
  merchant: MerchantProfile;
  lang: LanguageType;
  onOpenGateways: (initialGateway?: string) => void;
  onOpenRecharge: () => void;
  onOpenQR: () => void;
  onOpenLedger: () => void;
  onOpenBBPolicy: () => void;
  onOpenPendingDispute: () => void;
  onOpenGuruExchange: () => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({
  merchant,
  lang,
  onOpenGateways,
  onOpenRecharge,
  onOpenQR,
  onOpenLedger,
  onOpenBBPolicy,
  onOpenPendingDispute,
  onOpenGuruExchange
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleTapBalance = () => {
    setAnimating(true);
    setShowBalance(prev => !prev);
    setTimeout(() => setAnimating(false), 300);
  };

  const formatTaka = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Banner with Merchant Branding */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                {lang === 'bn' ? 'অফিসিয়াল মার্চেন্ট অ্যাকাউন্ট' : 'Verified Merchant Account'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-900/60 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <BadgeCheck className="w-3 h-3 text-emerald-300" />
                {merchant.tier}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              {lang === 'bn' ? merchant.businessNameBn : merchant.businessName}
            </h1>
            <p className="text-sm text-emerald-100/90 flex items-center gap-2 mt-0.5">
              <span>{lang === 'bn' ? `মালিক: ${merchant.nameBn}` : `Owner: ${merchant.name}`}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-xs">ID: {merchant.merchantId}</span>
            </p>
          </div>

          {/* Interactive Tap for Balance Capsule (bKash & TallyPay Iconic UX) */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-xs text-emerald-200 font-medium mb-1">
              {lang === 'bn' ? 'ব্যবহারযোগ্য ব্যালেন্স' : 'Available Balance'}
            </span>
            <button
              onClick={handleTapBalance}
              className={`group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 transition-all ${
                animating ? 'scale-95' : 'scale-100'
              }`}
              title="Click to view balance"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-white text-xs font-bold">
                ৳
              </div>
              <div className="text-left">
                {showBalance ? (
                  <span className="text-xl font-bold text-white font-mono-num tracking-tight block">
                    ৳ {formatTaka(merchant.balance)}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-emerald-100 block">
                    {lang === 'bn' ? 'ব্যালেন্স দেখতে ট্যাপ করুন' : 'Tap to reveal balance'}
                  </span>
                )}
              </div>
              <div className="text-emerald-200 group-hover:text-white transition-colors ml-1">
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
            </button>
            
            {/* Hold Balance indicator linked to Bangladesh Bank dispute */}
            {merchant.holdBalance > 0 && (
              <button
                onClick={onOpenPendingDispute}
                className="mt-2 text-[11px] text-amber-200/90 hover:text-amber-100 flex items-center gap-1.5 transition-colors group"
              >
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {lang === 'bn' 
                    ? `হোল্ড/অপেক্ষমান: ৳ ${formatTaka(merchant.holdBalance)} (রিভার্সাল প্রক্রিয়াধীন)`
                    : `On-Hold: ৳ ${formatTaka(merchant.holdBalance)} (Reversal in progress)`}
                </span>
                <span className="underline underline-offset-2 ml-1 text-amber-200 font-medium group-hover:text-white">
                  {lang === 'bn' ? 'দেখুন' : 'View'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Financial Flow Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-emerald-200/80 block">{lang === 'bn' ? 'আজকের মোট জমা (Inflow)' : "Today's Inflow"}</span>
            <span className="text-sm font-bold font-mono-num text-white flex items-center gap-1 mt-0.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-300" />
              +৳ {formatTaka(merchant.dailyInflow)}
            </span>
          </div>
          <div>
            <span className="text-emerald-200/80 block">{lang === 'bn' ? 'আজকের খরচ/পেমেন্ট (Outflow)' : "Today's Outflow"}</span>
            <span className="text-sm font-bold font-mono-num text-white flex items-center gap-1 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
              -৳ {formatTaka(merchant.dailyOutflow)}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-emerald-200/80 block">{lang === 'bn' ? 'মাসিক লেনদেন ভলিউম' : 'Monthly Volume'}</span>
            <span className="text-sm font-bold font-mono-num text-white mt-0.5 block">
              ৳ {formatTaka(merchant.monthlyVolume)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="p-4 sm:p-6 bg-slate-50/60">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {lang === 'bn' ? 'মার্চেন্ট সার্ভিস ও পেমেন্ট টুলস' : 'Merchant Services & Payment Tools'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. bKash Transfer */}
          <button
            onClick={() => onOpenGateways('bKash')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {lang === 'bn' ? 'বিকাশ পে' : 'bKash Pay'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'সেন্ড ও পেআউট' : 'Send & Payout'}
            </span>
          </button>

          {/* 2. Mobile Recharge */}
          <button
            onClick={onOpenRecharge}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {lang === 'bn' ? 'মোবাইল রিচার্জ' : 'Recharge'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'সকল অপারেটর' : 'All Operators'}
            </span>
          </button>

          {/* 3. NPSB Bank Transfer */}
          <button
            onClick={() => onOpenGateways('NPSB Bank')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {lang === 'bn' ? 'NPSB ব্যাংক' : 'NPSB Bank'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'bn' ? '২৪/৭ ব্যাংক ট্রান্সফার' : '24/7 Instant'}
            </span>
          </button>

          {/* 4. Multi-Gateway (Nagad/Rocket/Upay) */}
          <button
            onClick={() => onOpenGateways('Nagad')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {lang === 'bn' ? 'নগদ / রকেট' : 'Nagad / Rocket'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'মাল্টি গেটওয়ে' : 'Multi Gateway'}
            </span>
          </button>

          {/* 5. Bangla QR */}
          <button
            onClick={onOpenQR}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {lang === 'bn' ? 'বাংলা QR' : 'Bangla QR'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'কাস্টমার পেমেন্ট' : 'Accept Payment'}
            </span>
          </button>

          {/* 6. Tally Ledger (বাকি খাতা) */}
          <button
            onClick={onOpenLedger}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {lang === 'bn' ? 'ট্যালি খাতা' : 'Tally Ledger'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'দেনা-পাওনা হিসাব' : 'Due Ledger'}
            </span>
          </button>

          {/* 7. BB Policy & Dispute */}
          <button
            onClick={onOpenBBPolicy}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/70 border border-amber-200 hover:border-amber-400 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-900">
              {lang === 'bn' ? 'BB নীতিমালা' : 'BB Policies'}
            </span>
            <span className="text-[10px] text-amber-700 mt-0.5">
              {lang === 'bn' ? '২-৩ দিন রিভার্সাল' : '2-3 Days Refund'}
            </span>
          </button>

          {/* 8. GURU FIN TECH (Без KYC) */}
          <button
            onClick={onOpenGuruExchange}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-400 hover:shadow-xs transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-xs font-semibold text-blue-950">
              {lang === 'ru' ? 'GURU Обмен' : 'GURU Exchange'}
            </span>
            <span className="text-[10px] text-blue-700 font-bold mt-0.5">
              {lang === 'ru' ? 'БЕЗ KYC (RUB)' : 'Без KYC / RUB'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
