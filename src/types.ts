export type GatewayType = 
  | 'bKash' 
  | 'Nagad' 
  | 'Rocket' 
  | 'Upay' 
  | 'NPSB Bank' 
  | 'Mobile Recharge' 
  | 'Bangla QR' 
  | 'Settlement'
  | 'GURU Exchange';

export type LanguageType = 'bn' | 'en' | 'ru';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'disputed';

export type OperatorType = 'Grameenphone' | 'Banglalink' | 'Robi' | 'Airtel' | 'Teletalk' | 'Skitto';

export interface Transaction {
  id: string;
  trxId: string;
  type: GatewayType;
  direction: 'in' | 'out'; // 'in' = payment received from customer, 'out' = payout/recharge/transfer
  amount: number;
  fee: number;
  date: string;
  time: string;
  isToday: boolean;
  senderReceiver: {
    name: string;
    number: string;
    accountType: 'Personal' | 'Merchant' | 'Agent' | 'Bank A/C';
    bankName?: string;
    accountNo?: string;
    operator?: OperatorType;
  };
  status: TransactionStatus;
  pendingReason?: string;
  delayDetails?: {
    system: string;
    expectedTimeline: string;
    regulatoryNotice: string;
    referenceNumber: string;
    disputeCaseId: string;
    disputeStatus: string;
    disputeStep: number; // 1 to 4
    disputeLoggedAt: string;
    estimatedRefundDate: string;
  };
  foreignDetails?: {
    currency: 'RUB' | 'USDT' | 'USD';
    foreignAmount: number;
    exchangeRate: number;
    platform: string;
    website: string;
    noKyc: boolean;
    noteRu: string;
  };
  reference?: string;
  channel: string;
}

export interface RechargePackage {
  id: string;
  operator: OperatorType;
  title: string;
  data: string;
  validity: string;
  price: number;
  cashback: number;
  category: 'Internet' | 'Bundle' | 'Voice' | 'Special';
}

export interface BankInfo {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  npsbActive: boolean;
  routingNo: string;
}

export interface MerchantProfile {
  name: string;
  nameBn: string;
  businessName: string;
  businessNameBn: string;
  merchantId: string;
  balance: number;
  holdBalance: number;
  dailyInflow: number;
  dailyOutflow: number;
  monthlyVolume: number;
  phone: string;
  verified: boolean;
  tier: string;
}
