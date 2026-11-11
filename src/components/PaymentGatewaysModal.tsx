import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CreditCard, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { BANGLADESH_BANKS } from '../data/mockData';
import { GatewayType, Transaction, LanguageType } from '../types';

interface PaymentGatewaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
  currentBalance: number;
  initialGateway?: string;
  onExecuteTransaction: (newTxn: Transaction) => void;
  onOpenBBPolicy: () => void;
}

export const PaymentGatewaysModal: React.FC<PaymentGatewaysModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentBalance,
  initialGateway = 'bKash',
  onExecuteTransaction,
  onOpenBBPolicy
}) => {
  if (!isOpen) return null;

  const [selectedGateway, setSelectedGateway] = useState<GatewayType>(
    (initialGateway as GatewayType) || 'bKash'
  );

  const [recipientNumber, setRecipientNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(BANGLADESH_BANKS[0].id);
  const [accountType, setAccountType] = useState<'Personal' | 'Merchant'>('Personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedBank = BANGLADESH_BANKS.find(b => b.id === selectedBankId);

  const isInvalidAccount = recipientNumber.trim() === '000' || recipientNumber.trim() === '01700-000000' || (recipientNumber.length > 0 && recipientNumber.length < 5 && selectedGateway !== 'NPSB Bank');

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    if (numericAmount > currentBalance) {
      setErrorMsg(lang === 'bn' ? 'আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই।' : 'Insufficient balance.');
      return;
    }

    if (!recipientNumber.trim()) {
      setErrorMsg(lang === 'bn' ? 'প্রাপকের নাম্বার বা একাউন্ট নাম্বার প্রদান করুন।' : 'Please provide recipient account/phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const idNumber = Math.floor(1000 + Math.random() * 9000);
      const isPendingInvalid = isInvalidAccount;

      const newTxn: Transaction = {
        id: `TXN-${idNumber}`,
        trxId: `${selectedGateway.slice(0, 3).toUpperCase()}${Math.floor(1000000 + Math.random() * 9000000)}`,
        type: selectedGateway,
        direction: 'out',
        amount: numericAmount,
        fee: selectedGateway === 'NPSB Bank' ? 10.00 : 0.00,
        date: '11 Nov 2026',
        time: timeStr,
        isToday: true,
        senderReceiver: {
          name: recipientName.trim() || (isPendingInvalid ? 'Unverified / Invalid Beneficiary' : 'Customer Account'),
          number: recipientNumber.trim(),
          accountType: selectedGateway === 'NPSB Bank' ? 'Bank A/C' : accountType,
          bankName: selectedGateway === 'NPSB Bank' ? selectedBank?.name : undefined,
          accountNo: selectedGateway === 'NPSB Bank' ? recipientNumber.trim() : undefined
        },
        status: isPendingInvalid ? 'pending' : 'completed',
        pendingReason: isPendingInvalid 
          ? 'Payment pending for invalid account বা অন্য কিছু বেক আসতে ২-৩ দিন লাগতে পারে বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী' 
          : undefined,
        delayDetails: isPendingInvalid ? {
          system: `${selectedGateway} MFS & NPSB Switch Core`,
          expectedTimeline: '2-3 Working Days (২-৩ কার্যদিবস)',
          regulatoryNotice: 'বাংলাদেশ ব্যাংক পেমেন্ট সিস্টেমস ডিপার্টমেন্ট (PSD) সার্কুলার ০৪/২০২১ ও NPSB ইন্টার-অপারেবল নীতি অনুযায়ী ভুল/অকার্যকর একাউন্টে আটকে থাকা ফান্ড ২-৩ কার্যদিবসের মধ্যে স্বয়ংক্রিয়ভাবে মূল মার্চেন্ট একাউন্টে রিভার্স/বেক হবে।',
          referenceNumber: `BB-NPSB-DISPUTE-${idNumber}`,
          disputeCaseId: `DISP-2026-11-${idNumber}`,
          disputeStatus: 'Settlement Reversal in Progress (রিভার্সাল প্রক্রিয়াধীন)',
          disputeStep: 2,
          disputeLoggedAt: `Today at ${timeStr}`,
          estimatedRefundDate: '13 Nov 2026 - 14 Nov 2026'
        } : undefined,
        reference: reference.trim() || `Merchant Payout via ${selectedGateway}`,
        channel: `${selectedGateway} Direct`
      };

      onExecuteTransaction(newTxn);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">
              {lang === 'bn' ? 'পেমেন্ট গেটওয়ে ও ট্রান্সফার' : 'Payment Gateways & Transfer'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'bn' 
                ? 'বিকাশ, নগদ, রকেট, উপায় ও NPSB ইন্টারব্যাংক ট্রান্সফার' 
                : 'bKash, Nagad, Rocket, Upay, and 24/7 NPSB Instant Bank Transfer'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Gateway Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              {lang === 'bn' ? '১. পেমেন্ট গেটওয়ে নির্বাচন করুন' : '1. Select Payment Gateway'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setSelectedGateway('bKash')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                  selectedGateway === 'bKash'
                    ? 'border-pink-500 bg-pink-50 text-pink-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  bK
                </div>
                <span className="text-xs">bKash</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setSelectedGateway('Nagad')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                  selectedGateway === 'Nagad'
                    ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  ন
                </div>
                <span className="text-xs">Nagad</span>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setSelectedGateway('Rocket')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                  selectedGateway === 'Rocket'
                    ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  র
                </div>
                <span className="text-xs">Rocket</span>
              </button>

              {/* Upay */}
              <button
                type="button"
                onClick={() => setSelectedGateway('Upay')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                  selectedGateway === 'Upay'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                  উপ
                </div>
                <span className="text-xs">Upay</span>
              </button>

              {/* NPSB Bank */}
              <button
                type="button"
                onClick={() => setSelectedGateway('NPSB Bank')}
                className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                  selectedGateway === 'NPSB Bank'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs">NPSB Bank</span>
              </button>
            </div>
          </div>

          {/* Conditional: Bank Selector if NPSB */}
          {selectedGateway === 'NPSB Bank' ? (
            <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  {lang === 'bn' ? 'বাংলাদেশ ব্যাংক NPSB নেটওয়ার্ক' : 'National Payment Switch Bangladesh (NPSB)'}
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  ২৪/৭ ইন্সট্যান্ট ট্রান্সফার
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {lang === 'bn' ? 'প্রাপক ব্যাংক নির্বাচন করুন' : 'Select Destination Bank'}
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {BANGLADESH_BANKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.nameBn}) - NPSB Active
                    </option>
                  ))}
                </select>
                {selectedBank && (
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Routing Number: {selectedBank.routingNo}
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {lang === 'bn' ? 'ব্যাংক একাউন্ট নাম্বার' : 'Bank Account Number'}
                </label>
                <input
                  type="text"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  placeholder="e.g. 1501203498217001"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {lang === 'bn' ? 'একাউন্টধারীর নাম (Account Holder Name)' : 'Account Holder Name'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          ) : (
            /* MFS Details (bKash / Nagad / Rocket / Upay) */
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'bn' ? `২. প্রাপক ${selectedGateway} নাম্বার` : lang === 'ru' ? `2. Номер кошелька ${selectedGateway}` : `2. Recipient ${selectedGateway} Number`}
                  </label>
                  <button
                    type="button"
                    onClick={() => setRecipientNumber('000')}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 underline"
                  >
                    {lang === 'bn' ? 'অকার্যকর একাউন্ট: ০০০' : lang === 'ru' ? 'Недействительный счет (000)' : 'Invalid Account: 000'}
                  </button>
                </div>
                <input
                  type="text"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {lang === 'bn' 
                    ? 'বাংলাদেশ ব্যাংক নির্দেশিকা: ভুল বা অকার্যকর একাউন্টে প্রেরিত অর্থ স্বয়ংক্রিয়ভাবে ২-৩ কার্যদিবসে রিভার্স হবে।' 
                    : lang === 'ru'
                      ? 'Согласно правилам ЦБ: при переводе на недействительный счет возврат занимает 2-3 рабочих дня.'
                      : 'BB Policy: Funds sent to an unroutable account will be automatically held and reversed in 2-3 business days.'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {lang === 'bn' ? 'প্রাপকের নাম (ঐচ্ছিক)' : 'Recipient Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Shakil Ahmed"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {lang === 'bn' ? 'একাউন্টের ধরন' : 'Account Type'}
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Personal">{lang === 'bn' ? 'ব্যক্তিগত (Personal)' : 'Personal'}</option>
                    <option value="Merchant">{lang === 'bn' ? 'মার্চেন্ট (Merchant)' : 'Merchant'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Prompt-Specific Warning Banner if "000" or Invalid Number is typed */}
          {isInvalidAccount && (
            <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-950">
                  {lang === 'bn' ? 'অবৈধ একাউন্ট সতর্কতা (বাংলাদেশ ব্যাংক নীতিমালা):' : 'Invalid Account Notice (BB Policy):'}
                </h5>
                <p className="text-xs text-amber-900 mt-0.5 leading-snug">
                  {lang === 'bn'
                    ? 'Payment pending for invalid account বা অন্য কিছু বেক আসতে ২-৩ দিন লাগতে পারে বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী।'
                    : 'Payment will be placed on pending hold due to invalid destination account. Refund will take 2-3 business days per Bangladesh Bank guidelines.'}
                </p>
                <button
                  type="button"
                  onClick={onOpenBBPolicy}
                  className="mt-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'বাংলাদেশ ব্যাংকের নীতিমালা ও সময়সীমা জানুন' : 'Read Bangladesh Bank 2-3 Days Policy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Amount and Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'bn' ? '৩. টাকার পরিমাণ লিখুন' : '3. Enter Amount (BDT)'}
              </label>
              <span className="text-xs text-slate-500 font-mono-num">
                {lang === 'bn' ? 'বর্তমান ব্যালেন্স:' : 'Available:'} ৳ {currentBalance.toFixed(2)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-base">৳</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[500, 1000, 2000, 4500, 5000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-mono-num"
                >
                  +৳{val}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Note */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              {lang === 'bn' ? 'রেফারেন্স / নোট (ঐচ্ছিক)' : 'Reference / Bill Memo (Optional)'}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Supplier Invoice / Purchase"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-xs transition-colors ${
                isInvalidAccount
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isSubmitting ? (
                <span>{lang === 'bn' ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
              ) : (
                <>
                  <span>
                    {isInvalidAccount
                      ? (lang === 'bn' ? 'পেন্ডিং ট্রান্সফার কনফার্ম করুন' : 'Confirm Pending Transfer')
                      : (lang === 'bn' ? 'নিশ্চিত করুন (Send Money)' : 'Confirm Transfer')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
