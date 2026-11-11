import React from 'react';
import { 
  X, 
  Copy, 
  Printer, 
  Share2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  PhoneCall,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Transaction, LanguageType } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  lang: LanguageType;
  onClose: () => void;
  onOpenBBPolicy: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  lang,
  onClose,
  onOpenBBPolicy
}) => {
  if (!transaction) return null;

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPending = transaction.status === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Receipt Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              ৳
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {lang === 'bn' ? 'ডিজিটাল লেনদেন রসিদ' : 'Digital Transaction Receipt'}
              </h3>
              <p className="text-xs text-slate-300">
                TallyPay Merchant · {transaction.channel}
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

        {/* Pending Reversal Highlight Box (Prompt Requirement) */}
        {isPending && (
          <div className="bg-amber-500/15 border-b border-amber-300 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {lang === 'bn' ? 'বাংলাদেশ ব্যাংক নীতিমালা নোটিশ' : 'Bangladesh Bank Regulatory Notice'}
                </h4>
                <p className="text-xs font-bold text-amber-950 mt-1 leading-snug">
                  {transaction.pendingReason}
                </p>
                <p className="text-[11px] text-amber-900 mt-1.5 leading-relaxed">
                  {transaction.delayDetails?.regulatoryNotice}
                </p>
              </div>
            </div>

            {/* 4-Step Visual Timeline */}
            <div className="mt-4 pt-3 border-t border-amber-300/60">
              <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider block mb-2">
                {lang === 'bn' ? 'রিভার্সাল ও সমাধান টাইমলাইন:' : 'Resolution & Refund Progress:'}
              </span>
              <div className="space-y-2 text-xs">
                {/* Step 1 */}
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{lang === 'bn' ? '১. লেনদেন শুরু:' : '1. Initiated:'}</span>
                  <span className="text-slate-600">{transaction.date}, {transaction.time}</span>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-2 text-amber-900">
                  <div className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ২
                  </div>
                  <span className="font-semibold">{lang === 'bn' ? '২. সিস্টেম হোল্ড:' : '2. System On-Hold:'}</span>
                  <span className="text-amber-900 font-medium">
                    {lang === 'bn' ? 'অবৈধ নাম্বার (000) চিহ্নিত ও NPSB সুইচে রিপোর্ট' : "Invalid '000' flagged in MFS switch"}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0">
                    ৩
                  </div>
                  <span>{lang === 'bn' ? '৩. বাংলাদেশ ব্যাংক ডিসপিউট ক্লিয়ারিং' : '3. BB Dispute Switch Review'}</span>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0">
                    ৪
                  </div>
                  <span>
                    {lang === 'bn' 
                      ? '৪. মার্চেন্ট একাউন্টে টাকা ফেরত (২-৩ কার্যদিবস)' 
                      : '4. Refund Reversal to Merchant (2-3 Business Days)'}
                  </span>
                </div>
              </div>

              {/* Case details */}
              <div className="mt-3 pt-2 bg-amber-100/60 rounded-lg p-2.5 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2">
                <span className="text-amber-900">Case ID: {transaction.delayDetails?.disputeCaseId}</span>
                <span className="text-amber-950 font-bold">Est: {transaction.delayDetails?.estimatedRefundDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Content */}
        <div className="p-6 space-y-4">
          {/* Amount Badge */}
          <div className="text-center py-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">
              {lang === 'bn' ? 'লেনদেনের পরিমাণ' : 'Transaction Amount'}
            </span>
            <div className="text-3xl font-extrabold font-mono-num text-slate-900 mt-0.5">
              ৳ {transaction.amount.toFixed(2)}
            </div>
            <div className="mt-1">
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                transaction.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : transaction.status === 'pending'
                    ? 'bg-amber-100 text-amber-800 font-bold'
                    : 'bg-rose-100 text-rose-800'
              }`}>
                {transaction.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'Transaction ID'}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-800">{transaction.trxId}</span>
                <button
                  onClick={() => copyToClipboard(transaction.trxId)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  title="Copy TrxID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copied && <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>}
              </div>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'bn' ? 'তারিখ ও সময়' : 'Date & Time'}</span>
              <span className="font-medium text-slate-800 font-mono-num">{transaction.date}, {transaction.time}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'bn' ? 'পেমেন্ট মাধ্যম / গেটওয়ে' : 'Gateway / Channel'}</span>
              <span className="font-semibold text-slate-800">{transaction.type} ({transaction.channel})</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">
                {transaction.direction === 'out' 
                  ? (lang === 'bn' ? 'প্রাপকের বিবরণী' : 'Recipient Details')
                  : (lang === 'bn' ? 'প্রেরকের বিবরণী' : 'Sender Details')}
              </span>
              <div className="text-right">
                <div className="font-bold text-slate-800">{transaction.senderReceiver.name}</div>
                <div className="font-mono text-slate-600">{transaction.senderReceiver.number}</div>
                {transaction.senderReceiver.bankName && (
                  <div className="text-blue-600 text-[11px]">{transaction.senderReceiver.bankName}</div>
                )}
              </div>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'bn' ? 'ফি / সার্ভিস চার্জ' : 'Service Fee'}</span>
              <span className="font-mono-num text-slate-800">৳ {transaction.fee.toFixed(2)}</span>
            </div>

            {transaction.reference && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{lang === 'bn' ? 'রেফারেন্স / নোট' : 'Reference Note'}</span>
                <span className="font-medium text-slate-800 italic">{transaction.reference}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'bn' ? 'রসিদ প্রিন্ট' : 'Print Slip'}</span>
            </button>

            {isPending && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBBPolicy();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'বিবি নীতিমালা দেখুন' : 'BB Policy Info'}</span>
              </button>
            )}

            <button
              onClick={() => copyToClipboard(`TallyPay TrxID: ${transaction.trxId}, Amount: BDT ${transaction.amount}, Status: ${transaction.status}`)}
              className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bangladesh Bank & MFS Helpline Notice */}
          <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                {lang === 'bn' ? 'সহায়তা হেল্পলাইন:' : 'Helplines:'}
              </span>
              <span>TallyPay 16723 · BB 16236</span>
            </div>
            <p>
              {lang === 'bn'
                ? 'যেকোনো অমীমাংসিত পেমেন্টের ক্ষেত্রে বাংলাদেশ ব্যাংকের সার্কুলার মোতাবেক গ্রাহকের সুরক্ষার জন্য অভিযোগ নিষ্পত্তির ব্যবস্থা রয়েছে।'
                : 'All transactions are monitored under Bangladesh Bank National Payment Switch regulations.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
