import React from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { Transaction, LanguageType } from '../types';

interface PendingAlertBannerProps {
  pendingTxn?: Transaction;
  lang: LanguageType;
  onViewDispute: (txn: Transaction) => void;
  onViewBBPolicy: () => void;
}

export const PendingAlertBanner: React.FC<PendingAlertBannerProps> = ({
  pendingTxn,
  lang,
  onViewDispute,
  onViewBBPolicy
}) => {
  if (!pendingTxn) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 border border-amber-300 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Icon & Key Information */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md">
                {lang === 'bn' ? 'জরুরি লেনদেন নোটিশ' : 'Action Required / Pending Alert'}
              </span>
              <span className="text-xs font-medium text-amber-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                {lang === 'bn' ? `আজ রাত ${pendingTxn.time}` : `Today at ${pendingTxn.time}`}
              </span>
              <span className="text-xs font-mono font-medium text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                TrxID: {pendingTxn.trxId}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
              {lang === 'bn' 
                ? 'Payment pending for invalid account বা অন্য কিছু বেক আসতে ২-৩ দিন লাগতে পারে বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী'
                : 'Payment pending for invalid account: Refund takes 2-3 business days per Bangladesh Bank regulations'}
            </h3>

            <div className="text-xs text-slate-700 mt-2 space-y-1">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-900">
                  {lang === 'bn' ? 'প্রাপক বিকাশ নাম্বার:' : 'bKash Number:'}
                </span>
                <span className="font-mono font-bold text-amber-900 bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                  {pendingTxn.senderReceiver.number}
                </span>
                <span>·</span>
                <span className="font-semibold text-slate-900">
                  {lang === 'bn' ? 'পরিমাণ:' : 'Amount:'}
                </span>
                <span className="font-mono-num font-bold text-slate-900">
                  ৳ {pendingTxn.amount.toFixed(2)} BDT
                </span>
                <span>·</span>
                <span className="text-amber-800 font-medium">
                  {lang === 'bn' ? 'গেটওয়ে: bKash MFS & NPSB Switch' : 'Gateway: bKash MFS & NPSB Switch'}
                </span>
              </p>

              <p className="text-slate-600 text-[12px] leading-relaxed">
                {lang === 'bn'
                  ? 'উক্ত একাউন্ট নাম্বারটি অবৈধ বা সুইচিং ত্রুটির কারণে বাংলাদেশ ব্যাংক পেমেন্ট সিস্টেমের অধীনে অটোমেটিক রিভার্সাল প্রক্রিয়ায় সংরক্ষিত রয়েছে।'
                  : 'Due to invalid account routing, the transaction has been held in the Bangladesh Bank clearing settlement queue for automated return.'}
              </p>
            </div>

            {/* Reversal Timeline Progress Bar */}
            <div className="mt-3.5 pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'bn' ? 'রিভার্সাল ট্র্যাকিং (ধাপ ২/৪):' : 'Reversal Tracking (Step 2/4):'}</span>
              </div>
              <div className="flex-1 max-w-md bg-amber-200/60 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-600 h-full w-1/2 rounded-full transition-all"></div>
              </div>
              <span className="text-xs font-medium text-amber-800">
                {lang === 'bn' ? 'সম্ভাব্য ফেরত: ১৩-১৪ নভেম্বর (২-৩ কার্যদিবস)' : 'Est. Refund: 2-3 Business Days'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-end lg:self-center mt-2 lg:mt-0">
          <button
            onClick={() => onViewDispute(pendingTxn)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'বিরোধ বিবরণী ও স্লিপ' : 'View Case & Slip'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onViewBBPolicy}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-amber-950 bg-white/90 hover:bg-white border border-amber-300 rounded-xl transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'bn' ? 'বাংলাদেশ ব্যাংক নীতিমালা' : 'BB Policy Guidelines'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
