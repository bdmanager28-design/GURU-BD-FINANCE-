import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  BookOpen, 
  FileText,
  Building,
  HelpCircle
} from 'lucide-react';

import { LanguageType } from '../types';

interface BangladeshBankPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
}

export const BangladeshBankPolicyModal: React.FC<BangladeshBankPolicyModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {lang === 'bn' ? 'বাংলাদেশ ব্যাংক নীতিমালা ও বিরোধ নিষ্পত্তি বিধি' : 'Bangladesh Bank NPSB & MFS Guidelines'}
              </h3>
              <p className="text-xs text-emerald-200/90">
                {lang === 'bn' 
                  ? 'পেমেন্ট সিস্টেমস ডিপার্টমেন্ট (PSD) সার্কুলার ০৪/২০২১' 
                  : 'Payment Systems Department (PSD) Directive No. 04/2021'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Urgent Clarification Box for Prompt Requirement */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {lang === 'bn' 
                    ? 'অবৈধ একাউন্ট (যেমন: 000) বা ভুল ট্রানজ্যাকশন রিভার্সাল নীতি' 
                    : 'Invalid Account (e.g., 000) & Pending Dispute Policy'}
                </h4>
                <p className="text-sm font-bold text-amber-950 mt-1">
                  {lang === 'bn'
                    ? '“Payment pending for invalid account বা অন্য কিছু বেক আসতে ২-৩ দিন লাগতে পারে বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী”'
                    : '"Payment pending for invalid account: Reversal takes 2-3 working days per Bangladesh Bank guidelines"'}
                </p>
                <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                  {lang === 'bn'
                    ? 'বিকাশ, রকেট, নগদ বা NPSB ইন্টারব্যাংক সুইচে যখন প্রাপকের একাউন্টটি অমিল বা অস্তিত্বহীন (যেমন "000") হয়, তখন ফান্ডটি তৎক্ষণাৎ প্রাপকের কাছে যায় না। বাংলাদেশ ব্যাংকের সেন্ট্রাল ক্লিয়ারিং ও সেটেলমেন্ট রুলস অনুযায়ী লেনদেনটি "On-Hold / Pending" অবস্থায় জমা থাকে এবং ২ থেকে ৩ কার্যদিবসের মধ্যে স্বয়ংক্রিয়ভাবে মূল মার্চেন্টের একাউন্টে (মোঃ তানভীর) ব্যাক বা রিভার্স করা হয়।'
                    : 'When a transaction is directed to an invalid or unroutable account (e.g. "000") via bKash/NPSB, funds are retained securely in the Bangladesh Bank settlement escrow. Under official regulations, auto-reversal is guaranteed within 2-3 business days without loss.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: 4-Stage Resolution Pipeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'টাকা ফেরত আসার সময়সীমা ও ধাপসমূহ (Timeline)' : 'Reversal Pipeline & Timelines'}
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ১
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'bn' ? 'ধাপ ১: ট্রানজ্যাকশন শনাক্তকরণ ও হোল্ড (দিন ০)' : 'Stage 1: Switch Rejection & Hold (Day 0)'}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'bn'
                      ? 'রাত ১২:০৬ মিনিটে প্রাপক নাম্বার "000" সিস্টেম কর্তৃক অবৈধ হিসেবে চিহ্নিত হয়েছে এবং ফান্ড সুরক্ষিতভাবে হোল্ড করা হয়েছে।'
                      : 'The 12:06 AM outward payment to invalid number "000" was detected by the MFS core gateway and placed in protected escrow.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ২
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'bn' ? 'ধাপ ২: সেন্ট্রাল NPSB ক্লিয়ারিং রিকনসিলিয়েশন (১ম কার্যদিবস)' : 'Stage 2: NPSB Clearing Reconciliation (Day 1)'}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'bn'
                      ? 'বাংলাদেশ ব্যাংক ও বিকাশ গেটওয়ের মধ্যে ডিসপিউট লগে স্বয়ংক্রিয়ভাবে কেস আইডি DISP-2026-11-00045 নথিভুক্ত হয়।'
                      : 'Automatic dispute logging between Bangladesh Bank switch and bKash clearing database.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ৩
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'bn' ? 'ধাপ ৩: ব্যাংক সেটেলমেন্ট অডিট (২য় কার্যদিবস)' : 'Stage 3: Escrow Release Audit (Day 2)'}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'bn'
                      ? 'অডিট সম্পন্ন করে প্রাপকের একাউন্ট বাতিল ঘোষণা করা হয়।'
                      : 'Audit confirms invalidity and prepares reversal release order.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ৪
                </div>
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">
                    {lang === 'bn' ? 'ধাপ ৪: ব্যালেন্স রিভার্সাল ও সম্পূর্ণ ফেরত (২-৩ কার্যদিবসের মধ্যে)' : 'Stage 4: Automated Account Credit (2-3 Business Days)'}
                  </h5>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    {lang === 'bn'
                      ? 'টাকা সম্পূর্ণ নিরাপদে মোঃ তানভীরের মূল TallyPay ব্যালেন্সে (+৳ ২৪,০০০.০০) যুক্ত হয়ে যাবে।'
                      : 'Funds (+24,000.00 BDT) are directly re-credited to Md Tanvir available merchant balance.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: BB Guidelines Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'মার্চেন্ট পেমেন্ট ও লিমিট নীতিমালা' : 'Merchant Limits & Compliance Rules'}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <span className="font-semibold text-slate-800">{lang === 'bn' ? 'দৈনিক লিমিট:' : 'Daily Limit:'}</span>{' '}
                {lang === 'bn' ? 'মার্চেন্ট একাউন্টে দৈনিক সর্বোচ্চ ৩,০০,০০০ টাকা গ্রহণ ও আউটওয়ার্ড সম্ভব।' : 'Maximum 300,000 BDT per day.'}
              </li>
              <li>
                <span className="font-semibold text-slate-800">{lang === 'bn' ? 'মাসিক লিমিট:' : 'Monthly Limit:'}</span>{' '}
                {lang === 'bn' ? 'মাসিক সর্বোচ্চ ১০,০০,০০০ টাকা পেমেন্ট ভলিউম।' : 'Monthly limit up to 1,000,000 BDT.'}
              </li>
              <li>
                <span className="font-semibold text-slate-800">{lang === 'bn' ? 'NPSB ইন্টারব্যাংক ট্রান্সফার:' : 'NPSB Interbank:'}</span>{' '}
                {lang === 'bn' ? '২৪/৭ তাৎক্ষণিক ব্যাংক থেকে ব্যাংকে ট্রান্সফার অনুমোদিত।' : '24/7 instant interbank settlement.'}
              </li>
            </ul>
          </div>

          {/* Section 3: Official Helplines */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block">{lang === 'bn' ? 'জরুরি অভিযোগ ও সহায়তা' : 'Official Assistance Hotline'}</span>
                <span className="font-bold text-sm text-white">বাংলাদেশ ব্যাংক হেল্পডেস্ক: ১৬২৩৬</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">TallyPay Merchant Hotline</span>
              <span className="font-bold text-white">16723</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            {lang === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Understood & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
