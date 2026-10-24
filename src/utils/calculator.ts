import { GameId } from '../types';

export interface CalculationResult {
  rawPrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPriceRub: number;
  officialPriceRub: number;
  savingsRub: number;
  savingsPercent: number;
  usd: string;
  kzt: string;
}

export interface SellCalculationResult {
  amount: number;
  basePayoutRub: number;
  bonusPercent: number;
  bonusRub: number;
  finalPayoutRub: number;
  ratePerUnit: number;
  rateLabel: string;
  usd: string;
  kzt: string;
}

export function calculateOrderPrice(
  gameId: GameId,
  amount: number, // In millions for Black Russia, or in total Gold for Standoff 2
  ratePerUnit: number
): CalculationResult {
  let rawPrice = 0;
  let discountPercent = 0;
  let officialPriceRub = 0;

  if (gameId === 'black_russia') {
    rawPrice = amount * ratePerUnit; // e.g. 10 * 80 = 800
    discountPercent = 0; // Discounts completely removed per user request
    officialPriceRub = Math.round(amount * 1000); // 1kk = 1 000 ₽ in official launcher
  } else {
    // Standoff 2: amount is the actual Gold count (e.g. 1000 Gold)
    const hundredGoldUnits = amount / 100;
    rawPrice = Math.round(hundredGoldUnits * ratePerUnit); // 100 G = 80 ₽
    discountPercent = 0; // Discounts completely removed per user request
    officialPriceRub = Math.round(hundredGoldUnits * 165); // 100G = ~165 ₽ in official in-app store
  }

  const discountAmount = 0;
  const finalPriceRub = rawPrice;
  const savingsRub = Math.max(0, officialPriceRub - finalPriceRub);
  const savingsPercent = officialPriceRub > 0 ? Math.round((savingsRub / officialPriceRub) * 100) : 0;

  return {
    rawPrice,
    discountPercent,
    discountAmount,
    finalPriceRub,
    officialPriceRub,
    savingsRub,
    savingsPercent,
    usd: (finalPriceRub / 92).toFixed(2),
    kzt: Math.round(finalPriceRub * 5.1).toLocaleString('ru-RU')
  };
}

/**
 * Calculates buyback (скупка) payout for users selling currency to NetBana.
 * - Black Russia: 1kk = 35 ₽
 * - Standoff 2: 100 Gold = 45 ₽
 */
export function calculateSellPayout(
  gameId: GameId,
  amount: number // in millions for Black Russia, or in total Gold for Standoff 2
): SellCalculationResult {
  let basePayoutRub = 0;
  let bonusPercent = 0;
  let ratePerUnit = 0;
  let rateLabel = '';

  if (gameId === 'black_russia') {
    ratePerUnit = 35; // 35 ₽ per 1kk
    rateLabel = '35 ₽ / 1кк';
    basePayoutRub = Math.round(amount * ratePerUnit);

    // Wholesale volume incentive for sellers
    if (amount >= 100) bonusPercent = 5;
    else if (amount >= 50) bonusPercent = 3;
    else bonusPercent = 0;
  } else {
    // Standoff 2: 100 Gold = 45 ₽
    ratePerUnit = 45; // 45 ₽ per 100 Gold
    rateLabel = '45 ₽ / 100 G';
    const hundredGoldUnits = amount / 100;
    basePayoutRub = Math.round(hundredGoldUnits * ratePerUnit);

    // Wholesale volume incentive for gold sellers
    if (amount >= 10000) bonusPercent = 5;
    else if (amount >= 5000) bonusPercent = 3;
    else bonusPercent = 0;
  }

  const bonusRub = Math.round(basePayoutRub * (bonusPercent / 100));
  const finalPayoutRub = basePayoutRub + bonusRub;

  return {
    amount,
    basePayoutRub,
    bonusPercent,
    bonusRub,
    finalPayoutRub,
    ratePerUnit,
    rateLabel,
    usd: (finalPayoutRub / 92).toFixed(2),
    kzt: Math.round(finalPayoutRub * 5.1).toLocaleString('ru-RU')
  };
}
