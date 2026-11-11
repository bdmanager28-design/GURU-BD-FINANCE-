import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  ShieldCheck,
  Lock,
  ArrowRight,
  TrendingUp,
  Layers,
  Coins,
  ArrowDownLeft,
  DollarSign
} from 'lucide-react';
import { Transaction, LanguageType } from '../types';

interface GuruExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
  currentBalance: number;
  onExecuteExchange: (newTxn: Transaction) => void;
}

export const GuruExchangeModal: React.FC<GuruExchangeModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentBalance,
  onExecuteExchange
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'swap' | 'account' | 'partner'>('swap');
  const [usdtAmount, setUsdtAmount] = useState<string>('1000');
  const [receiveMethod, setReceiveMethod] = useState<'bKash' | 'Nagad' | 'TallyPay Balance' | 'NPSB Bank'>('bKash');
  const [recipientNumber, setRecipientNumber] = useState<string>('01712-345678');
  const [secretKey, setSecretKey] = useState<string>('GX-8821-4902-1190-7741');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  // Exchange rate logic exactly as in the user's screenshot:
  // 1 USDT = 121.58389 BDT (Market 124.61 less 2.75% margin) -> 1,000 USDT = 121,183.89 BDT
  const numericUSDT = parseFloat(usdtAmount) || 0;
  const unitRate = 121.18389;
  const calculatedBDT = numericUSDT * unitRate;

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericUSDT <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const idNum = Math.floor(1000 + Math.random() * 9000);
      const bdtAmount = Math.round(calculatedBDT);

      const newTxn: Transaction = {
        id: `TXN-GF-${idNum}`,
        trxId: `GF${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'GURU Exchange',
        direction: 'in',
        amount: bdtAmount,
        fee: 0.00,
        date: '11 Nov 2026',
        time: timeStr,
        isToday: true,
        senderReceiver: {
          name: 'GURU Finance (guru-exchange.xo.je)',
          number: recipientNumber,
          accountType: 'Merchant'
        },
        status: 'completed',
        foreignDetails: {
          currency: 'USDT',
          foreignAmount: numericUSDT,
          exchangeRate: unitRate,
          platform: 'GURU Finance',
          website: 'guru-exchange.xo.je',
          noKyc: true,
          noteRu: `Успешный обмен ${numericUSDT.toLocaleString()} USDT → ৳ ${bdtAmount.toLocaleString()} BDT без KYC через платформу GURU Finance (guru-exchange.xo.je)`
        },
        reference: `GURU Finance P2P: ${numericUSDT} USDT → ৳${bdtAmount} BDT via ${receiveMethod} (Без KYC)`,
        channel: 'GURU Finance Gateway'
      };

      onExecuteExchange(newTxn);
      setCompletedTxn(newTxn);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b0f19] text-white rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Top Bar with Brand & Language Links (as in screenshot) */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-amber-400 font-mono">
                Guru-Exchange
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                Under GURU Finance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Multi-language links from screenshot */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="text-blue-400 font-medium">English</span>
              <span>·</span>
              <span className="text-slate-300 font-medium">Русский</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">বাংলা</span>
              <span>·</span>
              <span className="text-slate-500">हिन्दी</span>
              <span>·</span>
              <span className="text-slate-500">العربية</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Section from Guru-Exchange Screenshot */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Your USDT wallet, P2P,<br />
            top-up and loans in one app.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
            Deposit USDT on any network, trade with verified merchants in your local currency, top up mobiles and borrow against your history. Rates are shown up front. <span className="text-amber-400 font-semibold">Без верификации KYC / No KYC required.</span>
          </p>

          {/* 7 Quick Feature Chips from screenshot */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mt-4">
            {[
              { id: 'p2p', label: 'P2P', active: true },
              { id: 'mobile', label: 'Mobile Top-up' },
              { id: 'fiat', label: 'Deposit Fiat' },
              { id: 'refer', label: 'Refer & $5' },
              { id: 'loan', label: 'Crypto Loan' },
              { id: 'market', label: 'Market' },
              { id: 'partner', label: 'Partner Net' }
            ].map((f) => (
              <div
                key={f.id}
                className={`py-2 px-1 rounded-xl text-center border text-[11px] font-semibold transition-all ${
                  f.active 
                    ? 'bg-blue-600/30 border-blue-500 text-white shadow-xs' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Content Box */}
        {completedTxn ? (
          <div className="p-6 m-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Обмен успешно выполнен / P2P Settlement Completed
            </h3>

            <p className="text-xs text-slate-300 max-w-md mx-auto">
              ৳ {completedTxn.amount.toLocaleString()} BDT has been credited to your TallyPay Merchant balance from GURU Finance without KYC verification.
            </p>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">TrxID:</span>
                <span className="font-bold text-amber-400">{completedTxn.trxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exchange Pair:</span>
                <span className="text-white font-bold">{completedTxn.foreignDetails?.foreignAmount} USDT → ৳ {completedTxn.amount.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="text-slate-300">1 USDT = {unitRate.toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security & KYC:</span>
                <span className="text-emerald-400 font-bold">100% No-KYC / Без KYC</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCompletedTxn(null)}
                className="flex-1 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                New Swap
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors"
              >
                Close & View Balance
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* "Today's rates" Container (exactly styled like user screenshot) */}
            <div className="bg-gradient-to-b from-[#0e1e38] to-[#0a1628] border border-blue-900/60 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Today's rates — GURU Finance
                </span>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  БЕЗ KYC / NO KYC
                </span>
              </div>

              <form onSubmit={handleExecuteSwap} className="space-y-4">
                {/* You send Input */}
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    You send
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usdtAmount}
                      onChange={(e) => setUsdtAmount(e.target.value)}
                      className="w-full bg-[#050c18] border border-blue-800/80 rounded-xl px-4 py-2.5 text-lg font-bold font-mono text-white focus:outline-hidden focus:border-amber-400"
                      placeholder="1000"
                      required
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                      <span>₮</span>
                      <span>USDT</span>
                    </div>
                  </div>
                </div>

                {/* Recipient gets Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      Recipient currency
                    </label>
                    <div className="bg-[#050c18] border border-blue-800/80 rounded-xl px-3 py-2 text-sm font-bold font-mono text-white flex items-center justify-between">
                      <span>BDT (৳)</span>
                      <span className="text-xs text-slate-500">Bangladeshi Taka</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      Gateway Channel
                    </label>
                    <select
                      value={receiveMethod}
                      onChange={(e) => setReceiveMethod(e.target.value as any)}
                      className="w-full bg-[#050c18] border border-blue-800/80 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-hidden"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="TallyPay Balance">TallyPay Merchant</option>
                      <option value="NPSB Bank">NPSB Direct Bank</option>
                    </select>
                  </div>
                </div>

                {/* Calculated Rate Box (Exact wording from screenshot) */}
                <div className="p-4 rounded-xl bg-[#040812] border border-blue-900/50">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                    {calculatedBDT.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    1 USDT = 121.58 BDT. Market rate 124.61, less 2.75% service margin.
                  </p>
                </div>

                {/* Recipient Account Number */}
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Recipient {receiveMethod} Number
                  </label>
                  <input
                    type="text"
                    value={recipientNumber}
                    onChange={(e) => setRecipientNumber(e.target.value)}
                    className="w-full bg-[#050c18] border border-blue-800/80 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    placeholder="017XX-XXXXXX"
                    required
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Processing swap through guru-exchange.xo.je...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Instant Swap without KYC / Мгновенный обмен</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Account & Secret Key Box (from screenshot) */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">GURU Finance Account Secret Key</span>
                  <span className="font-mono font-bold text-amber-400">{secretKey}</span>
                </div>
              </div>

              <a
                href="http://guru-exchange.xo.je"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 underline underline-offset-2"
              >
                <span>Visit guru-exchange.xo.je</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Payment partners footer from screenshot */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-semibold">Our payment partners:</span>
                <span className="text-slate-300">Support</span>
                <span>·</span>
                <span className="text-slate-300">CEO</span>
                <span>·</span>
                <span className="text-slate-300">Marketing Partner</span>
              </div>
              <div className="text-slate-400">
                <span>Under — GURU Finance</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
