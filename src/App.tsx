import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { MerchantCard } from './components/MerchantCard';
import { PendingAlertBanner } from './components/PendingAlertBanner';
import { TransactionHistory } from './components/TransactionHistory';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { PaymentGatewaysModal } from './components/PaymentGatewaysModal';
import { MobileRechargeModal } from './components/MobileRechargeModal';
import { BangladeshBankPolicyModal } from './components/BangladeshBankPolicyModal';
import { BanglaQRModal } from './components/BanglaQRModal';
import { TallyLedgerModal } from './components/TallyLedgerModal';
import { GuruExchangeModal } from './components/GuruExchangeModal';
import { INITIAL_MERCHANT, INITIAL_TRANSACTIONS } from './data/mockData';
import { Transaction, MerchantProfile, LanguageType } from './types';

export default function App() {
  const [lang, setLang] = useState<LanguageType>('bn');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [merchant, setMerchant] = useState<MerchantProfile>(INITIAL_MERCHANT);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Modals state
  const [detailModalTxn, setDetailModalTxn] = useState<Transaction | null>(null);
  const [isGatewaysModalOpen, setIsGatewaysModalOpen] = useState(false);
  const [initialGateway, setInitialGateway] = useState<string>('bKash');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isBBPolicyModalOpen, setIsBBPolicyModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isGuruModalOpen, setIsGuruModalOpen] = useState(false);

  // Find the prominent 12:06 AM pending transaction
  const pendingTxn = transactions.find(t => t.status === 'pending');

  const handleOpenGateways = (gateway?: string) => {
    setInitialGateway(gateway || 'bKash');
    setIsGatewaysModalOpen(true);
  };

  const handleExecuteTransaction = (newTxn: Transaction) => {
    setTransactions(prev => [newTxn, ...prev]);

    setMerchant(prev => {
      let newBalance = prev.balance;
      let newHold = prev.holdBalance;
      let newOutflow = prev.dailyOutflow;
      let newInflow = prev.dailyInflow;

      if (newTxn.direction === 'out') {
        newBalance -= newTxn.amount + newTxn.fee;
        newOutflow += newTxn.amount;
        if (newTxn.status === 'pending') {
          newHold += newTxn.amount;
        }
      } else if (newTxn.direction === 'in') {
        newBalance += newTxn.amount;
        newInflow += newTxn.amount;
      }

      return {
        ...prev,
        balance: Math.max(0, newBalance),
        holdBalance: newHold,
        dailyOutflow: newOutflow,
        dailyInflow: newInflow
      };
    });

    // Auto open receipt slip to review
    setDetailModalTxn(newTxn);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        merchant={merchant}
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTransfer={() => handleOpenGateways('bKash')}
        onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
        onOpenGuruExchange={() => setIsGuruModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            {/* Merchant Identity & Available Balance Card */}
            <MerchantCard
              merchant={merchant}
              lang={lang}
              onOpenGateways={handleOpenGateways}
              onOpenRecharge={() => setIsRechargeModalOpen(true)}
              onOpenQR={() => setIsQRModalOpen(true)}
              onOpenLedger={() => setIsLedgerModalOpen(true)}
              onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
              onOpenPendingDispute={() => {
                if (pendingTxn) setDetailModalTxn(pendingTxn);
              }}
              onOpenGuruExchange={() => setIsGuruModalOpen(true)}
            />

            {/* Prompt's Explicit Requirement: 12:06 AM Pending bKash (000) Alert Banner */}
            {pendingTxn && (
              <PendingAlertBanner
                pendingTxn={pendingTxn}
                lang={lang}
                onViewDispute={(txn) => setDetailModalTxn(txn)}
                onViewBBPolicy={() => setIsBBPolicyModalOpen(true)}
              />
            )}

            {/* Integrated Gateways & NPSB Feature Strip */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {lang === 'bn' ? 'সংযুক্ত পেমেন্ট নেটওয়ার্ক ও গেটওয়ে' : 'Connected Payment Networks & Gateways'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' 
                      ? 'বাংলাদেশ ব্যাংক অনুমোদিত MFS ও NPSB ইন্টারব্যাংক সুইচ সরাসরি সক্রিয়' 
                      : 'Real-time routing via Bangladesh Bank NPSB switch & MFS direct gateways'}
                  </p>
                </div>
                <button
                  onClick={() => setIsBBPolicyModalOpen(true)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'বাংলাদেশ ব্যাংক নীতিমালা দেখুন' : 'View BB Policies'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {/* bKash */}
                <div 
                  onClick={() => handleOpenGateways('bKash')}
                  className="p-3 rounded-xl border border-pink-200 bg-pink-50/40 hover:bg-pink-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-pink-700">bKash</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {lang === 'bn' ? 'বিকাশ মার্চেন্ট গেটওয়ে' : 'MFS Core Gateway'}
                  </div>
                  <div className="text-[10px] text-pink-700 font-semibold mt-1 group-hover:underline">
                    {lang === 'bn' ? 'পেমেন্ট করুন →' : 'Pay Now →'}
                  </div>
                </div>

                {/* Nagad */}
                <div 
                  onClick={() => handleOpenGateways('Nagad')}
                  className="p-3 rounded-xl border border-orange-200 bg-orange-50/40 hover:bg-orange-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-700">Nagad</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {lang === 'bn' ? 'নগদ ডিরেক্ট পেআউট' : 'Direct Payout'}
                  </div>
                  <div className="text-[10px] text-orange-700 font-semibold mt-1 group-hover:underline">
                    {lang === 'bn' ? 'পেমেন্ট করুন →' : 'Pay Now →'}
                  </div>
                </div>

                {/* Rocket */}
                <div 
                  onClick={() => handleOpenGateways('Rocket')}
                  className="p-3 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-700">Rocket</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {lang === 'bn' ? 'ডাচ-বাংলা রকেট' : 'DBBL MFS Gateway'}
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-1 group-hover:underline">
                    {lang === 'bn' ? 'পেমেন্ট করুন →' : 'Pay Now →'}
                  </div>
                </div>

                {/* Upay */}
                <div 
                  onClick={() => handleOpenGateways('Upay')}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-700">Upay</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {lang === 'bn' ? 'উপায় (ইউসিবি)' : 'UCB Upay Direct'}
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-1 group-hover:underline">
                    {lang === 'bn' ? 'পেমেন্ট করুন →' : 'Pay Now →'}
                  </div>
                </div>

                {/* NPSB Bank Transfer */}
                <div 
                  onClick={() => handleOpenGateways('NPSB Bank')}
                  className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700">NPSB Bank</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {lang === 'bn' ? '৪০+ ব্যাংক ইন্সট্যান্ট' : '40+ BD Banks 24/7'}
                  </div>
                  <div className="text-[10px] text-blue-700 font-semibold mt-1 group-hover:underline">
                    {lang === 'bn' ? 'ট্রান্সফার করুন →' : 'Transfer →'}
                  </div>
                </div>

                {/* Bangla QR */}
                <div 
                  onClick={() => setIsQRModalOpen(true)}
                  className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-700">Bangla QR</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {lang === 'bn' ? 'জাতীয় বাংলা কিউআর' : 'National QR'}
                  </div>
                  <div className="text-[10px] text-indigo-700 font-semibold mt-1 group-hover:underline">
                    {lang === 'bn' ? 'QR দেখুন →' : 'View QR →'}
                  </div>
                </div>

                {/* GURU Finance */}
                <div 
                  onClick={() => setIsGuruModalOpen(true)}
                  className="p-3 rounded-xl border border-amber-300 bg-gradient-to-b from-[#0a1628] to-[#050c18] text-white hover:border-amber-400 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">GURU Finance</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    guru-exchange.xo.je
                  </div>
                  <div className="text-[10px] text-amber-300 font-semibold mt-1 group-hover:underline">
                    БЕЗ KYC / No KYC →
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Transaction History Module */}
            <TransactionHistory
              transactions={transactions}
              lang={lang}
              onSelectTransaction={(txn) => setDetailModalTxn(txn)}
              onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
            />
          </>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="space-y-5">
            {pendingTxn && (
              <PendingAlertBanner
                pendingTxn={pendingTxn}
                lang={lang}
                onViewDispute={(txn) => setDetailModalTxn(txn)}
                onViewBBPolicy={() => setIsBBPolicyModalOpen(true)}
              />
            )}
            <TransactionHistory
              transactions={transactions}
              lang={lang}
              onSelectTransaction={(txn) => setDetailModalTxn(txn)}
              onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
            />
          </div>
        )}

        {/* RECHARGE TAB */}
        {activeTab === 'recharge' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'মোবাইল রিচার্জ টার্মিনাল' : 'Mobile Recharge Terminal'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'bn'
                    ? 'গ্রামীণফোন, বাংলালিংক, রবি, এয়ারটেল, টেলিটক ও স্কিটো সিমে সরাসরি রিচার্জ করুন'
                    : 'Instant flexiload and package activation across all Bangladeshi operators.'}
                </p>
              </div>
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
              >
                {lang === 'bn' ? 'রিচার্জ উইন্ডো খুলুন' : 'Open Recharge Window'}
              </button>
            </div>

            {/* Filtered to show only Mobile Recharge history */}
            <TransactionHistory
              transactions={transactions.filter(t => t.type === 'Mobile Recharge')}
              lang={lang}
              onSelectTransaction={(txn) => setDetailModalTxn(txn)}
              onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
            />
          </div>
        )}

        {/* GATEWAYS & NPSB TAB */}
        {activeTab === 'gateways' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                {lang === 'bn' ? 'মাল্টি-পেমেন্ট গেটওয়ে ও ন্যাশনাল পেমেন্ট সুইচ (NPSB)' : 'Multi-Payment Gateways & NPSB Hub'}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {lang === 'bn' 
                  ? 'বিকাশ, নগদ, রকেট, উপায় এবং বাংলাদেশ ব্যাংকের NPSB নেটওয়ার্কের মাধ্যমে আন্তঃব্যাংক অর্থ স্থানান্তর'
                  : 'Execute instant payouts and interbank transfers with full regulatory compliance.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* bKash */}
                <div className="p-5 rounded-2xl border border-pink-200 bg-pink-50/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-pink-700">bKash Merchant Pay</span>
                      <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {lang === 'bn' ? 'বিকাশ পার্সোনাল ও মার্চেন্ট ওয়ালেটে তাত্ক্ষণিক পেআউট।' : 'Direct instant transfer to any bKash account.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenGateways('bKash')}
                    className="w-full py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors"
                  >
                    {lang === 'bn' ? 'বিকাশ ট্রান্সফার করুন' : 'bKash Transfer'}
                  </button>
                </div>

                {/* Nagad */}
                <div className="p-5 rounded-2xl border border-orange-200 bg-orange-50/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-orange-700">Nagad Direct</span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {lang === 'bn' ? 'ডাক বিভাগীয় ডিজিটাল লেনদেন নগদ গেটওয়ে।' : 'Government post office digital payment gateway.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenGateways('Nagad')}
                    className="w-full py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors"
                  >
                    {lang === 'bn' ? 'নগদ ট্রান্সফার করুন' : 'Nagad Transfer'}
                  </button>
                </div>

                {/* NPSB Instant Bank */}
                <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-blue-700">NPSB Direct Bank</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">24/7 Live</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {lang === 'bn' ? 'ব্র্যাক, সিটি, ডাচ-বাংলা, ইস্টার্ন ব্যাংকসহ ৪০+ ব্যাংকে রিয়েল-টাইম ট্রান্সফার।' : 'National Payment Switch Bangladesh instant interbank fund transfer.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenGateways('NPSB Bank')}
                    className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    {lang === 'bn' ? 'NPSB ব্যাংক ট্রান্সফার' : 'NPSB Transfer'}
                  </button>
                </div>

                {/* GURU Finance (guru-exchange.xo.je) */}
                <div className="p-5 rounded-2xl border border-amber-400 bg-gradient-to-b from-[#0a1628] to-[#040812] text-white flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-amber-400">GURU Finance</span>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">Без KYC / No KYC</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      guru-exchange.xo.je — {lang === 'ru' ? 'Обмен USDT, рублей (RUB) и криптоактивов на BDT без прохождения KYC.' : 'P2P multi-network USDT/RUB exchange directly into BDT without KYC.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsGuruModalOpen(true)}
                    className="w-full py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-colors"
                  >
                    {lang === 'ru' ? 'Открыть GURU Exchange' : 'Open GURU Exchange'}
                  </button>
                </div>
              </div>
            </div>

            <TransactionHistory
              transactions={transactions.filter(t => t.type !== 'Mobile Recharge')}
              lang={lang}
              onSelectTransaction={(txn) => setDetailModalTxn(txn)}
              onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TallyPay Merchant</span>
            <span>·</span>
            <span>{lang === 'bn' ? 'মোঃ তানভীর (তানভীর এন্টারপ্রাইজ)' : 'Md Tanvir (Tanvir Enterprise)'}</span>
            <span>·</span>
            <span className="font-mono">ID: {merchant.merchantId}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => setIsBBPolicyModalOpen(true)} 
              className="text-slate-600 hover:text-emerald-700 font-medium"
            >
              {lang === 'bn' ? 'বাংলাদেশ ব্যাংক নীতিমালা' : 'BB Policies'}
            </button>
            <span>·</span>
            <button 
              onClick={() => setIsQRModalOpen(true)} 
              className="text-slate-600 hover:text-emerald-700 font-medium"
            >
              {lang === 'bn' ? 'বাংলা QR' : 'Bangla QR'}
            </button>
            <span>·</span>
            <span>Helpline: 16723 / BB: 16236</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Transaction Receipt / Slip Modal */}
      <TransactionDetailModal
        transaction={detailModalTxn}
        lang={lang}
        onClose={() => setDetailModalTxn(null)}
        onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
      />

      {/* 2. Gateways & Money Transfer Modal */}
      <PaymentGatewaysModal
        isOpen={isGatewaysModalOpen}
        onClose={() => setIsGatewaysModalOpen(false)}
        lang={lang}
        currentBalance={merchant.balance}
        initialGateway={initialGateway}
        onExecuteTransaction={handleExecuteTransaction}
        onOpenBBPolicy={() => setIsBBPolicyModalOpen(true)}
      />

      {/* 3. Mobile Recharge Modal */}
      <MobileRechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        lang={lang}
        currentBalance={merchant.balance}
        transactions={transactions}
        onExecuteRecharge={handleExecuteTransaction}
      />

      {/* 4. Bangladesh Bank Policy Modal */}
      <BangladeshBankPolicyModal
        isOpen={isBBPolicyModalOpen}
        onClose={() => setIsBBPolicyModalOpen(false)}
        lang={lang}
      />

      {/* 5. Bangla QR Modal */}
      <BanglaQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        lang={lang}
        merchant={merchant}
      />

      {/* 6. Tally Ledger Modal */}
      <TallyLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
        lang={lang}
      />

      {/* 7. GURU Finance (guru-exchange.xo.je) Modal */}
      <GuruExchangeModal
        isOpen={isGuruModalOpen}
        onClose={() => setIsGuruModalOpen(false)}
        lang={lang}
        currentBalance={merchant.balance}
        onExecuteExchange={handleExecuteTransaction}
      />
    </div>
  );
}
