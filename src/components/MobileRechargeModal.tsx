import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Zap, 
  Gift, 
  CheckCircle2, 
  History, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RECHARGE_PACKAGES } from '../data/mockData';
import { OperatorType, RechargePackage, Transaction, LanguageType } from '../types';

interface MobileRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
  currentBalance: number;
  transactions: Transaction[];
  onExecuteRecharge: (newTxn: Transaction) => void;
}

export const MobileRechargeModal: React.FC<MobileRechargeModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentBalance,
  transactions,
  onExecuteRecharge
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');
  const [operator, setOperator] = useState<OperatorType>('Grameenphone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [simType, setSimType] = useState<'Prepaid' | 'Postpaid'>('Prepaid');
  const [selectedPack, setSelectedPack] = useState<RechargePackage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-detect operator based on prefix
  const handleNumberChange = (val: string) => {
    setMobileNumber(val);
    const clean = val.replace(/\D/g, '');
    if (clean.startsWith('017') || clean.startsWith('88017')) setOperator('Grameenphone');
    else if (clean.startsWith('013') || clean.startsWith('88013')) setOperator('Skitto');
    else if (clean.startsWith('019') || clean.startsWith('014') || clean.startsWith('88019')) setOperator('Banglalink');
    else if (clean.startsWith('018') || clean.startsWith('88018')) setOperator('Robi');
    else if (clean.startsWith('016') || clean.startsWith('88016')) setOperator('Airtel');
    else if (clean.startsWith('015') || clean.startsWith('88015')) setOperator('Teletalk');
  };

  const rechargeHistory = transactions.filter(t => t.type === 'Mobile Recharge');

  const filteredPacks = RECHARGE_PACKAGES.filter(p => p.operator === operator);

  const handleSelectPackage = (pack: RechargePackage) => {
    setSelectedPack(pack);
    setAmount(pack.price.toString());
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 10) {
      setErrorMsg(lang === 'bn' ? 'সর্বনিম্ন রিচার্জ পরিমাণ ১০ টাকা।' : 'Minimum recharge amount is 10 BDT.');
      return;
    }

    if (numericAmount > currentBalance) {
      setErrorMsg(lang === 'bn' ? 'আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই।' : 'Insufficient balance.');
      return;
    }

    if (!mobileNumber.trim() || mobileNumber.trim().length < 11) {
      setErrorMsg(lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার লিখুন।' : 'Enter a valid 11-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const idNum = Math.floor(1000 + Math.random() * 9000);

      const newTxn: Transaction = {
        id: `TXN-${idNum}`,
        trxId: `RCH${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'Mobile Recharge',
        direction: 'out',
        amount: numericAmount,
        fee: 0.00,
        date: '11 Nov 2026',
        time: timeStr,
        isToday: true,
        senderReceiver: {
          name: `${operator} Subscriber`,
          number: mobileNumber.trim(),
          accountType: 'Personal',
          operator: operator
        },
        status: 'completed',
        reference: selectedPack ? selectedPack.title : `${operator} ${simType} Top-up`,
        channel: 'TallyPay AutoRecharge'
      };

      onExecuteRecharge(newTxn);
      setIsSubmitting(false);
      setActiveTab('history');
      setMobileNumber('');
      setAmount('');
      setSelectedPack(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {lang === 'bn' ? 'ট্যালি পে মোবাইল রিচার্জ' : 'TallyPay Mobile Recharge'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'bn' ? 'সকল অপারেটর ও স্পেশাল অফার বান্ডেল' : 'Instant flexiload to all BD telecom operators'}
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

        {/* Tab Switcher: Recharge Terminal vs Recharge History */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('recharge')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 transition-colors relative ${
              activeTab === 'recharge'
                ? 'text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন রিচার্জ' : 'New Recharge'}</span>
            {activeTab === 'recharge' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 transition-colors relative ${
              activeTab === 'history'
                ? 'text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{lang === 'bn' ? `রিচার্জ হিস্ট্রি (${rechargeHistory.length})` : `Recharge History (${rechargeHistory.length})`}</span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'recharge' ? (
          <form onSubmit={handleRechargeSubmit} className="p-6 space-y-4">
            {/* Operator Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                {lang === 'bn' ? 'অপারেটর নির্বাচন করুন' : 'Select Telecom Operator'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['Grameenphone', 'Banglalink', 'Robi', 'Airtel', 'Teletalk', 'Skitto'] as OperatorType[]).map(op => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => {
                      setOperator(op);
                      setSelectedPack(null);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      operator === op
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block leading-tight truncate">{op}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Number & Sim Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {lang === 'bn' ? 'মোবাইল নাম্বার' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="01712-345678"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {lang === 'bn' ? 'সংযোগের ধরন' : 'Connection'}
                </label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Prepaid">{lang === 'bn' ? 'প্রিপেইড' : 'Prepaid'}</option>
                  <option value="Postpaid">{lang === 'bn' ? 'পোস্টপেইড' : 'Postpaid'}</option>
                </select>
              </div>
            </div>

            {/* Amount & Quick Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  {lang === 'bn' ? 'রিচার্জের পরিমাণ' : 'Recharge Amount (BDT)'}
                </label>
                <span className="text-xs text-slate-500 font-mono-num">
                  {lang === 'bn' ? 'ব্যালেন্স:' : 'Balance:'} ৳ {currentBalance.toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSelectedPack(null);
                  }}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[20, 50, 100, 198, 299, 498].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setAmount(p.toString());
                      setSelectedPack(null);
                    }}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-mono-num"
                  >
                    ৳{p}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Offers / Packages for selected operator */}
            {filteredPacks.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-pink-600" />
                  {lang === 'bn' ? `${operator} স্পেশাল অফার ও বান্ডেল` : `${operator} Exclusive Packs`}
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {filteredPacks.map(pack => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => handleSelectPackage(pack)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        selectedPack?.id === pack.id
                          ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{pack.title}</span>
                          <span className="text-[10px] bg-pink-100 text-pink-700 font-semibold px-1.5 py-0.2 rounded">
                            ৳{pack.cashback} ক্যাশব্যাক
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {pack.data !== 'None' ? `${pack.data} · ` : ''}{pack.validity} মেয়াদ
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono-num text-slate-900">৳{pack.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              {isSubmitting ? (
                <span>{lang === 'bn' ? 'রিচার্জ পাঠানো হচ্ছে...' : 'Recharging...'}</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'তাত্ক্ষণিক রিচার্জ নিশ্চিত করুন' : 'Confirm Instant Recharge'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Recharge History View */
          <div className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {lang === 'bn' ? 'সাম্প্রতিক মোবাইল রিচার্জের তালিকা' : 'Recent Mobile Top-ups'}
            </h4>
            {rechargeHistory.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                {lang === 'bn' ? 'এখনো কোনো রিচার্জের রেকর্ড নেই।' : 'No recharge history yet.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {rechargeHistory.map(r => (
                  <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{r.senderReceiver.number}</span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {r.senderReceiver.operator || 'Mobile'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono-num">
                          {r.date}, {r.time} · TrxID: {r.trxId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono-num text-slate-900 block">
                        ৳ {r.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === 'bn' ? 'সফল' : 'Success'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
