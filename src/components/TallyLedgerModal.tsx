import React, { useState } from 'react';
import { X, BookOpen, Plus, Send, Search, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { TALLY_CUSTOMERS } from '../data/mockData';
import { LanguageType } from '../types';

interface TallyLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
}

export const TallyLedgerModal: React.FC<TallyLedgerModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  const [customers, setCustomers] = useState(TALLY_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDue, setNewDue] = useState('');
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const totalDues = customers.reduce((acc, c) => acc + c.dueAmount, 0);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    const newEntry = {
      id: `tc-${Date.now()}`,
      name: newName,
      phone: newPhone,
      dueAmount: parseFloat(newDue) || 0,
      advanceAmount: 0,
      lastDate: 'Today'
    };
    setCustomers([newEntry, ...customers]);
    setNewName('');
    setNewPhone('');
    setNewDue('');
    setShowAddForm(false);
  };

  const handleSendReminder = (name: string, phone: string, amount: number) => {
    setReminderSent(phone);
    setTimeout(() => setReminderSent(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {lang === 'bn' ? 'ট্যালি পে ডিজিটাল খাতা (বাকি ও দেনা-পাওনা)' : 'TallyPay Digital Due Ledger'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'bn' ? 'দোকানের কাস্টমারদের বাকি ও পেমেন্ট রিমাইন্ডার' : 'Customer dues, receivables, and instant payment links'}
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

        {/* Total Summary */}
        <div className="p-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-purple-900 font-medium block">
              {lang === 'bn' ? 'বাজারে মোট পাওনা বাকি' : 'Total Receivables (Dues)'}
            </span>
            <span className="text-xl font-bold font-mono-num text-purple-950">
              ৳ {totalDues.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'নতুন কাস্টমার বাকি যোগ' : 'Add New Customer'}</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddCustomer} className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Customer Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Due Amount (BDT)"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'কাস্টমারের নাম বা নাম্বার খুঁজুন...' : 'Search customer...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="p-4 divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {filtered.map(c => (
            <div key={c.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{c.phone} · {c.lastDate}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-bold font-mono-num text-rose-700 block">
                    ৳ {c.dueAmount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'bn' ? 'বাকি' : 'Due'}
                  </span>
                </div>

                <button
                  onClick={() => handleSendReminder(c.name, c.phone, c.dueAmount)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                  title="Send SMS Payment Link"
                >
                  {reminderSent === c.phone ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{lang === 'bn' ? 'লিংক প্রেরিত' : 'Sent!'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'তাগাদা SMS' : 'SMS Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
