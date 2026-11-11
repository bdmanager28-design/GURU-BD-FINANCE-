import React from 'react';
import { ShieldCheck, Globe, ArrowUpRight, HelpCircle, Zap } from 'lucide-react';
import { MerchantProfile, LanguageType } from '../types';

interface HeaderProps {
  merchant: MerchantProfile;
  lang: LanguageType;
  setLang: (lang: LanguageType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTransfer: () => void;
  onOpenBBPolicy: () => void;
  onOpenGuruExchange: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  merchant,
  lang,
  setLang,
  activeTab,
  setActiveTab,
  onOpenTransfer,
  onOpenBBPolicy,
  onOpenGuruExchange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
                ৳
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-none">
                  TallyPay <span className="text-emerald-600 font-semibold text-sm">Merchant</span>
                </span>
                <span className="text-[11px] text-slate-500 whitespace-nowrap flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {lang === 'bn' ? 'বাংলাদেশ ব্যাংক অনুমোদিত MFS' : lang === 'ru' ? 'Лицензия Банка Бангладеш' : 'BB Authorized MFS Partner'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'dashboard' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              {lang === 'bn' ? 'ড্যাশবোর্ড' : lang === 'ru' ? 'Панель' : 'Dashboard'}
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'transactions' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              {lang === 'bn' ? 'লেনদেন হিস্ট্রি' : lang === 'ru' ? 'История операций' : 'Transaction History'}
            </button>

            <button
              onClick={() => setActiveTab('recharge')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'recharge' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              {lang === 'bn' ? 'মোবাইল রিচার্জ' : lang === 'ru' ? 'Пополнение связи' : 'Mobile Recharge'}
            </button>

            <button
              onClick={() => setActiveTab('gateways')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'gateways' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              {lang === 'bn' ? 'গেটওয়ে ও NPSB ব্যাংক' : lang === 'ru' ? 'Шлюзы и NPSB' : 'Gateways & NPSB'}
            </button>

            <button
              onClick={onOpenGuruExchange}
              className="text-blue-700 hover:text-blue-800 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 font-medium"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>GURU FIN TECH (Без KYC)</span>
            </button>

            <button
              onClick={onOpenBBPolicy}
              className="text-amber-700 hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 font-medium"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              {lang === 'bn' ? 'বিবি নীতিমালা' : lang === 'ru' ? 'Регламент ЦБ' : 'BB Regulations'}
            </button>
          </nav>

          {/* Zone 3: Primary action + 3-Way language toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language toggle dropdown/pills */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setLang('bn')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  lang === 'bn' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  lang === 'en' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  lang === 'ru' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Русский язык / Без KYC"
              >
                РУС
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenTransfer}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{lang === 'bn' ? 'পেমেন্ট / ট্রান্সফার' : lang === 'ru' ? 'Перевод' : 'New Transfer'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
