export type GameId = 'black_russia' | 'standoff2';
export type MarketplaceMode = 'buy' | 'sell';

export interface GameInfo {
  id: GameId;
  name: string;
  tagline: string;
  currencyName: string;
  currencyUnit: string; // e.g. "1 000 000 ₽" or "100 Gold"
  defaultRateRub: number; // RUB per unit for buying (e.g. 80 for BR, 80 for SO2)
  buybackRateRub: number; // RUB per unit for selling/buyback (35 for BR, 45 for SO2)
  buybackUnit: string;
  minAmount: number; // in units (e.g. 1M)
  maxAmount: number;
  stepAmount: number;
  popularServers: string[];
  allServers: string[];
  officialDonateRatio: string; // e.g. "1 рубль = 1 000 руб в игре"
  riskLevel: 'Высокий' | 'Критический' | 'Средний' | 'Низкий';
  description: string;
  imagePath: string;
  bannerPath?: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  safetyScore: number; // 0 - 100
  riskLevel: 'Низкий' | 'Средний' | 'Высокий' | 'Критический';
  estimatedTimeMin: string;
  recommendation: string;
  adminLogRisk: string;
  mode?: 'buy' | 'sell' | 'both';
}

export interface ServerRate {
  id: string;
  gameId: GameId;
  serverName: string;
  pricePerMillion: number;
  stockMillions: number;
  demand: 'Высокий' | 'Средний' | 'Умеренный';
  adminActivity: 'Высокая' | 'Средняя' | 'Низкая';
  deliveryAvgMinutes: number;
  rateDisplay?: string;
  buybackRateDisplay?: string;
  stockDisplay?: string;
  securityDisplay?: string;
}

export interface CommunityReview {
  id: string;
  author: string;
  authorUsername?: string;
  game: string;
  server: string;
  rating: number; // 1-5
  date: string;
  verified: boolean;
  comment: string;
  outcome: string;
  amountPurchased: string;
  status: 'pending' | 'approved';
  createdAt?: string;
}

export interface OrderState {
  orderId: string;
  gameId: GameId;
  mode?: MarketplaceMode;
  server: string;
  amount: number;
  totalRub: number;
  nickname: string;
  deliveryMethodId: string;
  paymentMethod: string;
  payoutMethod?: string;
  payoutRequisites?: string;
  status: 'created' | 'matching' | 'in_game' | 'completed' | 'cancelled';
  progressStep: number;
  timestamp: string;
}
