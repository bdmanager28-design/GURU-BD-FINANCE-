import { Transaction, MerchantProfile, RechargePackage, BankInfo } from '../types';

export const INITIAL_MERCHANT: MerchantProfile = {
  name: 'Md Tanvir',
  nameBn: 'মোঃ তানভীর',
  businessName: 'Tanvir Enterprise',
  businessNameBn: 'তানভীর এন্টারপ্রাইজ',
  merchantId: 'TP-M-88294107',
  balance: 23739.00,
  holdBalance: 24000.00,
  dailyInflow: 18450.00,
  dailyOutflow: 24000.00,
  monthlyVolume: 489450.00,
  phone: '01712-345678',
  verified: true,
  tier: 'Gold Merchant'
};

export const BANGLADESH_BANKS: BankInfo[] = [
  { id: 'bb-city', name: 'The City Bank Ltd', nameBn: 'দি সিটি ব্যাংক', code: 'CBL', npsbActive: true, routingNo: '225272635' },
  { id: 'bb-brac', name: 'BRAC Bank PLC', nameBn: 'ব্র্যাক ব্যাংক', code: 'BBL', npsbActive: true, routingNo: '060261376' },
  { id: 'bb-dbbl', name: 'Dutch-Bangla Bank Ltd', nameBn: 'ডাচ-বাংলা ব্যাংক', code: 'DBBL', npsbActive: true, routingNo: '090263345' },
  { id: 'bb-ebl', name: 'Eastern Bank PLC', nameBn: 'ইস্টার্ন ব্যাংক', code: 'EBL', npsbActive: true, routingNo: '095262723' },
  { id: 'bb-islami', name: 'Islami Bank Bangladesh Ltd', nameBn: 'ইসলামী ব্যাংক বাংলাদেশ', code: 'IBBL', npsbActive: true, routingNo: '125272333' },
  { id: 'bb-prime', name: 'Prime Bank PLC', nameBn: 'প্রাইম ব্যাংক', code: 'PBL', npsbActive: true, routingNo: '170262109' },
  { id: 'bb-ucb', name: 'United Commercial Bank (UCB)', nameBn: 'ইউনাইটেড কমার্শিয়াল ব্যাংক', code: 'UCBL', npsbActive: true, routingNo: '245271882' },
  { id: 'bb-sonali', name: 'Sonali Bank PLC', nameBn: 'সোনালী ব্যাংক', code: 'SBL', npsbActive: true, routingNo: '200262441' }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-9021',
    trxId: 'BKP8932001',
    type: 'bKash',
    direction: 'out',
    amount: 24000.00,
    fee: 0.00,
    date: '11 Nov 2026',
    time: '12:06 AM',
    isToday: true,
    senderReceiver: {
      name: 'Unverified / Invalid Beneficiary',
      number: '000',
      accountType: 'Personal'
    },
    status: 'pending',
    pendingReason: 'Payment pending for invalid account বা অন্য কিছু বেক আসতে ২-৩ দিন লাগতে পারে বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী',
    delayDetails: {
      system: 'bKash MFS & NPSB Switch Core',
      expectedTimeline: '2-3 Working Days (২-৩ কার্যদিবস)',
      regulatoryNotice: 'বাংলাদেশ ব্যাংক পেমেন্ট সিস্টেমস ডিপার্টমেন্ট (PSD) সার্কুলার ০৪/২০২১ ও NPSB ইন্টার-অপারেবল নীতি অনুযায়ী ভুল/অকার্যকর একাউন্টে আটকে থাকা ফান্ড ২-৩ কার্যদিবসের মধ্যে স্বয়ংক্রিয়ভাবে মূল মার্চেন্ট একাউন্টে রিভার্স/বেক হবে।',
      referenceNumber: 'BB-NPSB-DISPUTE-881920',
      disputeCaseId: 'DISP-2026-11-00045',
      disputeStatus: 'Settlement Reversal in Progress (রিভার্সাল প্রক্রিয়াধীন)',
      disputeStep: 2,
      disputeLoggedAt: 'Today at 12:08 AM',
      estimatedRefundDate: '13 Nov 2026 - 14 Nov 2026'
    },
    reference: 'Merchant Outward Payout',
    channel: 'bKash Gateway'
  },
  {
    id: 'TXN-9020A',
    trxId: 'GURU992104',
    type: 'GURU Exchange',
    direction: 'in',
    amount: 15250.00,
    fee: 0.00,
    date: '11 Nov 2026',
    time: '11:15 AM',
    isToday: true,
    senderReceiver: {
      name: 'GURU P2P Exchange (guru-exchange.xo.je)',
      number: 'RU-SBER-884021',
      accountType: 'Personal'
    },
    status: 'completed',
    foreignDetails: {
      currency: 'RUB',
      foreignAmount: 11800,
      exchangeRate: 1.292,
      platform: 'GURU - FIN TECH World',
      website: 'guru-exchange.xo.je',
      noKyc: true,
      noteRu: 'Мгновенный обмен без верификации KYC (11,800 ₽ → ৳ 15,250 BDT) через платформу guru-exchange.xo.je'
    },
    reference: 'GURU Exchange: 11,800 ₽ to ৳ 15,250 BDT (Без KYC)',
    channel: 'GURU - FIN TECH World'
  },
  {
    id: 'TXN-9020',
    trxId: 'NPSB773120',
    type: 'NPSB Bank',
    direction: 'out',
    amount: 12000.00,
    fee: 10.00,
    date: '11 Nov 2026',
    time: '10:45 AM',
    isToday: true,
    senderReceiver: {
      name: 'Tanvir Wholesale Supplier A/C',
      number: '1501203498217001',
      accountType: 'Bank A/C',
      bankName: 'BRAC Bank PLC',
      accountNo: '1501203498217001'
    },
    status: 'completed',
    reference: 'Inventory Settlement via NPSB',
    channel: 'NPSB Instant'
  },
  {
    id: 'TXN-9019',
    trxId: 'BKP7712390',
    type: 'bKash',
    direction: 'in',
    amount: 3250.00,
    fee: 0.00,
    date: '11 Nov 2026',
    time: '09:20 AM',
    isToday: true,
    senderReceiver: {
      name: 'Farhana Akhter',
      number: '01711-987654',
      accountType: 'Personal'
    },
    status: 'completed',
    reference: 'Store Purchase Invoice #5821',
    channel: 'bKash QR Merchant'
  },
  {
    id: 'TXN-9018',
    trxId: 'RCH554091',
    type: 'Mobile Recharge',
    direction: 'out',
    amount: 500.00,
    fee: 0.00,
    date: '11 Nov 2026',
    time: '08:15 AM',
    isToday: true,
    senderReceiver: {
      name: 'Customer Flexi',
      number: '01712-445566',
      accountType: 'Personal',
      operator: 'Grameenphone'
    },
    status: 'completed',
    reference: 'GP 40GB 30Days Pack',
    channel: 'TallyPay AutoRecharge'
  },
  {
    id: 'TXN-9017',
    trxId: 'NGD443901',
    type: 'Nagad',
    direction: 'in',
    amount: 5800.00,
    fee: 0.00,
    date: '10 Nov 2026',
    time: '06:40 PM',
    isToday: false,
    senderReceiver: {
      name: 'Karim Rahman',
      number: '01819-234567',
      accountType: 'Personal'
    },
    status: 'completed',
    reference: 'Payment for Electronics Part',
    channel: 'Nagad Direct'
  },
  {
    id: 'TXN-9016',
    trxId: 'RCK338210',
    type: 'Rocket',
    direction: 'in',
    amount: 1400.00,
    fee: 0.00,
    date: '10 Nov 2026',
    time: '03:12 PM',
    isToday: false,
    senderReceiver: {
      name: 'Shahidul Islam',
      number: '01911-345678-4',
      accountType: 'Personal'
    },
    status: 'completed',
    reference: 'Counter Sale Bill #5818',
    channel: 'Rocket Pay'
  },
  {
    id: 'TXN-9015',
    trxId: 'UPY110293',
    type: 'Upay',
    direction: 'out',
    amount: 2200.00,
    fee: 0.00,
    date: '10 Nov 2026',
    time: '01:05 PM',
    isToday: false,
    senderReceiver: {
      name: 'Sultana Traders',
      number: '01552-998877',
      accountType: 'Merchant'
    },
    status: 'completed',
    reference: 'Shop Utility Payment',
    channel: 'Upay Merchant'
  },
  {
    id: 'TXN-9014',
    trxId: 'BQR884129',
    type: 'Bangla QR',
    direction: 'in',
    amount: 7900.00,
    fee: 0.00,
    date: '09 Nov 2026',
    time: '07:22 PM',
    isToday: false,
    senderReceiver: {
      name: 'EBL Visa Debit Cardholder',
      number: 'Card **4910',
      accountType: 'Bank A/C'
    },
    status: 'completed',
    reference: 'Bangla QR Inter-operable Scan',
    channel: 'Bangla QR Gateway'
  },
  {
    id: 'TXN-9013',
    trxId: 'NPSB662910',
    type: 'NPSB Bank',
    direction: 'out',
    amount: 8500.00,
    fee: 10.00,
    date: '09 Nov 2026',
    time: '11:30 AM',
    isToday: false,
    senderReceiver: {
      name: 'City Bank Account',
      number: '1102938475001',
      accountType: 'Bank A/C',
      bankName: 'The City Bank Ltd',
      accountNo: '1102938475001'
    },
    status: 'completed',
    reference: 'Weekly Merchant Auto-Settlement',
    channel: 'NPSB Settlement'
  },
  {
    id: 'TXN-9012',
    trxId: 'RCH551029',
    type: 'Mobile Recharge',
    direction: 'out',
    amount: 198.00,
    fee: 0.00,
    date: '08 Nov 2026',
    time: '04:55 PM',
    isToday: false,
    senderReceiver: {
      name: 'Customer BL',
      number: '01912-887766',
      accountType: 'Personal',
      operator: 'Banglalink'
    },
    status: 'completed',
    reference: 'Banglalink 10GB 7Days Offer',
    channel: 'TallyPay AutoRecharge'
  },
  {
    id: 'TXN-9011',
    trxId: 'BKP551003',
    type: 'bKash',
    direction: 'out',
    amount: 1500.00,
    fee: 0.00,
    date: '08 Nov 2026',
    time: '02:10 PM',
    isToday: false,
    senderReceiver: {
      name: 'Temporary Inactive Wallet',
      number: '01799-000000',
      accountType: 'Personal'
    },
    status: 'failed',
    pendingReason: 'Transaction cancelled by MFS core switch: Destination account non-existent or blocked.',
    reference: 'Manual Payout',
    channel: 'bKash Gateway'
  }
];

export const RECHARGE_PACKAGES: RechargePackage[] = [
  { id: 'gp-1', operator: 'Grameenphone', title: 'Power Pack 40GB + 800 Min', data: '40 GB', validity: '30 Days', price: 699, cashback: 35, category: 'Bundle' },
  { id: 'gp-2', operator: 'Grameenphone', title: 'Internet Dhamaka 15GB', data: '15 GB', validity: '7 Days', price: 198, cashback: 12, category: 'Internet' },
  { id: 'gp-3', operator: 'Grameenphone', title: 'Voice 450 Minutes', data: 'None', validity: '30 Days', price: 307, cashback: 15, category: 'Voice' },
  { id: 'bl-1', operator: 'Banglalink', title: 'Super Giga 35GB + 700 Min', data: '35 GB', validity: '30 Days', price: 598, cashback: 40, category: 'Bundle' },
  { id: 'bl-2', operator: 'Banglalink', title: 'All Rounder 12GB', data: '12 GB', validity: '7 Days', price: 169, cashback: 10, category: 'Internet' },
  { id: 'rb-1', operator: 'Robi', title: 'Bondho SIM / Special 50GB', data: '50 GB', validity: '30 Days', price: 549, cashback: 30, category: 'Special' },
  { id: 'rb-2', operator: 'Robi', title: 'Weekly Combo 8GB + 200 Min', data: '8 GB', validity: '7 Days', price: 179, cashback: 15, category: 'Bundle' },
  { id: 'art-1', operator: 'Airtel', title: 'Friends Pack 30GB + 500 Min', data: '30 GB', validity: '30 Days', price: 498, cashback: 25, category: 'Bundle' },
  { id: 'tt-1', operator: 'Teletalk', title: 'Bijoy Bundle 25GB', data: '25 GB', validity: '30 Days', price: 349, cashback: 20, category: 'Internet' }
];

export const TALLY_CUSTOMERS = [
  { id: 'tc-1', name: 'Md Rafiqul Islam', phone: '01711-223344', dueAmount: 3450, advanceAmount: 0, lastDate: '10 Nov 2026' },
  { id: 'tc-2', name: 'Anwar Hossain (Mayer Doa)', phone: '01819-556677', dueAmount: 8200, advanceAmount: 0, lastDate: '09 Nov 2026' },
  { id: 'tc-3', name: 'Zahirul Trading', phone: '01912-778899', dueAmount: 0, advanceAmount: 1500, lastDate: '11 Nov 2026' },
  { id: 'tc-4', name: 'Kamal Electric Store', phone: '01623-112233', dueAmount: 4900, advanceAmount: 0, lastDate: '08 Nov 2026' }
];
