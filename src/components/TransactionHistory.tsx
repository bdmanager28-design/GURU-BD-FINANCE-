import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Calendar,
  Layers,
  Building2,
  Send,
  Smartphone,
  CreditCard,
  QrCode,
  FileText,
  Zap
} from 'lucide-react';
import { Transaction, GatewayType, TransactionStatus, LanguageType } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  lang: LanguageType;
  onSelectTransaction: (txn: Transaction) => void;
  onOpenBBPolicy: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  lang,
  onSelectTransaction,
  onOpenBBPolicy
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchTrxId = txn.trxId.toLowerCase().includes(query);
        const matchNumber = txn.senderReceiver.number.toLowerCase().includes(query);
        const matchName = txn.senderReceiver.name.toLowerCase().includes(query);
        const matchRef = (txn.reference || '').toLowerCase().includes(query);
        if (!matchTrxId && !matchNumber && !matchName && !matchRef) {
          return false;
        }
      }

      // Gateway / Type
      if (selectedType !== 'all') {
        if (selectedType === 'bKash' && txn.type !== 'bKash') return false;
        if (selectedType === 'Nagad' && txn.type !== 'Nagad') return false;
        if (selectedType === 'Rocket' && txn.type !== 'Rocket') return false;
        if (selectedType === 'NPSB Bank' && txn.type !== 'NPSB Bank') return false;
        if (selectedType === 'Mobile Recharge' && txn.type !== 'Mobile Recharge') return false;
        if (selectedType === 'Bangla QR' && txn.type !== 'Bangla QR') return false;
        if (selectedType === 'GURU Exchange' && txn.type !== 'GURU Exchange') return false;
      }

      // Status
      if (selectedStatus !== 'all' && txn.status !== selectedStatus) {
        return false;
      }

      // Date Range
      if (dateRange === 'today' && !txn.isToday) return false;
      if (dateRange === 'yesterday' && !txn.date.includes('10 Nov')) return false;
      if (dateRange === 'week' && !txn.date.includes('Nov 2026')) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, selectedType, selectedStatus, dateRange, sortBy]);

  const getGatewayIcon = (type: GatewayType) => {
    switch (type) {
      case 'bKash':
        return <Send className="w-4 h-4 text-pink-600" />;
      case 'Nagad':
        return <CreditCard className="w-4 h-4 text-orange-600" />;
      case 'Rocket':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'NPSB Bank':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'Mobile Recharge':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'Bangla QR':
        return <QrCode className="w-4 h-4 text-indigo-600" />;
      case 'GURU Exchange':
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'bn' ? 'সফল (Completed)' : 'Completed'}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            {lang === 'bn' ? 'অপেক্ষমান (২-৩ দিন রিভার্সাল)' : 'Pending (2-3 Days)'}
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {lang === 'bn' ? 'ব্যর্থ (Failed)' : 'Failed'}
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            {lang === 'bn' ? 'বিরোধাধীন (Disputed)' : 'Disputed'}
          </span>
        );
    }
  };

  const exportCSV = () => {
    const headers = ['TrxID,Type,Direction,Amount,Date,Time,Status,Recipient/Sender,Number,Reference\n'];
    const rows = filteredTransactions.map(t => 
      `"${t.trxId}","${t.type}","${t.direction}","${t.amount}","${t.date}","${t.time}","${t.status}","${t.senderReceiver.name}","${t.senderReceiver.number}","${t.reference || ''}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TallyPay-Transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Header and Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'bn' ? 'সকল লেনদেনের হিস্ট্রি ও রেকর্ড' : 'Transaction History & Records'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn' 
                ? 'বিকাশ, নগদ, রকেট, মোবাইল রিচার্জ ও NPSB ইন্টারব্যাংক লেনদেনের রিয়েল-টাইম হিসাব'
                : 'Real-time ledger of bKash, Nagad, Rocket, Mobile Recharge, and NPSB transactions'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'bn' ? 'CSV ডাউনলোড' : 'Export CSV'}</span>
            </button>
            <button
              onClick={onOpenBBPolicy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'bn' ? 'বিবি নীতিমালা' : 'BB Policy'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Primary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'নাম্বার, TrxID বা নাম খুঁজুন...' : 'Search TrxID, Phone, Name...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>

          {/* Gateway Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 appearance-none font-medium text-slate-700"
            >
              <option value="all">{lang === 'bn' ? 'সব পেমেন্ট গেটওয়ে (All Types)' : 'All Gateways & Types'}</option>
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Rocket">Rocket (রকেট)</option>
              <option value="NPSB Bank">NPSB Direct Bank (এনপিএসবি)</option>
              <option value="Mobile Recharge">{lang === 'bn' ? 'মোবাইল রিচার্জ' : 'Mobile Recharge'}</option>
              <option value="Bangla QR">{lang === 'bn' ? 'বাংলা কিউআর' : 'Bangla QR'}</option>
              <option value="GURU Exchange">{lang === 'ru' ? 'GURU FIN TECH (Без KYC)' : lang === 'bn' ? 'GURU Exchange (কেওয়াইসি ছাড়া)' : 'GURU Exchange (No KYC)'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 appearance-none font-medium text-slate-700"
            >
              <option value="all">{lang === 'bn' ? 'সব স্ট্যাটাস (All Status)' : 'All Statuses'}</option>
              <option value="completed">{lang === 'bn' ? 'সফল (Completed)' : 'Completed'}</option>
              <option value="pending">{lang === 'bn' ? 'অপেক্ষমান / রিভার্সাল (Pending 2-3 Days)' : 'Pending (Invalid/Held)'}</option>
              <option value="failed">{lang === 'bn' ? 'ব্যর্থ (Failed)' : 'Failed'}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 appearance-none font-medium text-slate-700"
            >
              <option value="newest">{lang === 'bn' ? 'নতুন লেনদেন আগে (Newest First)' : 'Sort: Newest First'}</option>
              <option value="oldest">{lang === 'bn' ? 'পুরাতন লেনদেন আগে (Oldest First)' : 'Sort: Oldest First'}</option>
              <option value="amount-high">{lang === 'bn' ? 'সর্বোচ্চ টাকা আগে (Amount: High to Low)' : 'Amount: High to Low'}</option>
              <option value="amount-low">{lang === 'bn' ? 'সর্বনিম্ন টাকা আগে (Amount: Low to High)' : 'Amount: Low to High'}</option>
            </select>
          </div>
        </div>

        {/* Date Filter Quick Pills (Interactive Tabs) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'তারিখ ফিল্টার:' : 'Date Filter:'}
          </span>
          {[
            { id: 'all', label: lang === 'bn' ? 'সব তারিখ' : 'All Time' },
            { id: 'today', label: lang === 'bn' ? 'আজ (Today)' : 'Today' },
            { id: 'yesterday', label: lang === 'bn' ? 'গতকাল' : 'Yesterday' },
            { id: 'week', label: lang === 'bn' ? 'চলতি মাস (Nov 2026)' : 'November 2026' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDateRange(d.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                dateRange === d.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}

          {/* Quick Counter */}
          <div className="ml-auto text-xs text-slate-500">
            {lang === 'bn' 
              ? `মোট পাওয়া গেছে: ${filteredTransactions.length} টি লেনদেন` 
              : `Showing ${filteredTransactions.length} transactions`}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">
              {lang === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions matched your filters'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'bn' ? 'অনুগ্রহ করে সার্চ বা ফিল্টারের ধরন পরিবর্তন করুন।' : 'Try clearing your search or resetting filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedStatus('all');
                setDateRange('all');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const isPending = txn.status === 'pending';

            return (
              <div 
                key={txn.id}
                className={`p-4 sm:p-5 transition-colors ${
                  isPending 
                    ? 'bg-amber-50/50 hover:bg-amber-50/80 border-l-4 border-amber-500' 
                    : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Direction + Gateway Icon + Details */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      txn.direction === 'in' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : isPending 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {getGatewayIcon(txn.type)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {txn.senderReceiver.name}
                        </span>
                        <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {txn.senderReceiver.number}
                        </span>
                        {txn.senderReceiver.bankName && (
                          <span className="text-xs text-blue-700 font-medium">
                            · {txn.senderReceiver.bankName}
                          </span>
                        )}
                        {txn.senderReceiver.operator && (
                          <span className="text-xs text-emerald-700 font-medium">
                            · {txn.senderReceiver.operator}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">{txn.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{txn.trxId}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono-num">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {txn.date}, {txn.time}
                        </span>
                        {txn.reference && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-600 italic">"{txn.reference}"</span>
                          </>
                        )}
                      </div>

                      {/* Foreign currency and Russian No-KYC details */}
                      {txn.foreignDetails && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                            🇷🇺 {txn.foreignDetails.noKyc ? 'БЕЗ KYC / NO KYC' : 'KYC Verified'}
                          </span>
                          <span className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                            {txn.foreignDetails.foreignAmount.toLocaleString()} {txn.foreignDetails.currency}
                          </span>
                          <span className="text-blue-700 font-semibold underline">
                            {txn.foreignDetails.website}
                          </span>
                          {lang === 'ru' && (
                            <span className="text-slate-600 block w-full mt-0.5">{txn.foreignDetails.noteRu}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Status Badge & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className={`text-base font-bold font-mono-num flex items-center sm:justify-end gap-1 ${
                        txn.direction === 'in'
                          ? 'text-emerald-700'
                          : isPending
                            ? 'text-amber-800'
                            : 'text-slate-900'
                      }`}>
                        {txn.direction === 'in' ? (
                          <ArrowDownLeft className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        {txn.direction === 'in' ? '+' : '-'}৳ {txn.amount.toFixed(2)}
                      </span>
                      {txn.fee > 0 && (
                        <span className="text-[11px] text-slate-400 block font-mono-num">
                          {lang === 'bn' ? `চার্জ: ৳${txn.fee.toFixed(2)}` : `Fee: ৳${txn.fee.toFixed(2)}`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(txn.status)}
                      <button
                        onClick={() => onSelectTransaction(txn)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 ml-1"
                      >
                        {lang === 'bn' ? 'রসিদ / স্লিপ' : 'View Slip'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specific Pending Transaction Reason Callout (Prompt Required) */}
                {isPending && txn.pendingReason && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80 bg-amber-100/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-950 leading-snug">
                          {txn.pendingReason}
                        </p>
                        <p className="text-[11px] text-amber-900 mt-0.5">
                          {lang === 'bn'
                            ? `সিস্টেম: ${txn.delayDetails?.system || 'bKash MFS & NPSB Switch'} | সম্ভাব্য রিভার্সাল টাইমলাইন: ${txn.delayDetails?.expectedTimeline || '২-৩ কার্যদিবস'}`
                            : `Gateway System: ${txn.delayDetails?.system} | Resolution Window: ${txn.delayDetails?.expectedTimeline}`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectTransaction(txn)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-2xs whitespace-nowrap self-start sm:self-center"
                    >
                      {lang === 'bn' ? 'বাংলাদেশ ব্যাংক রিভার্সাল ট্র্যাকিং' : 'Track BB Reversal'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
