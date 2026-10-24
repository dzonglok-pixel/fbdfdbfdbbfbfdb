import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPrice, calculateSellPayout } from './calculator';

test('Black Russia: calculates buy price without discounts correctly', () => {
  // 10kk at 80 RUB/kk
  const res10 = calculateOrderPrice('black_russia', 10, 80);
  assert.equal(res10.rawPrice, 800);
  assert.equal(res10.discountPercent, 0);
  assert.equal(res10.discountAmount, 0);
  assert.equal(res10.finalPriceRub, 800);
  assert.equal(res10.officialPriceRub, 10000);
  assert.equal(res10.savingsRub, 9200);

  // 50kk at 80 RUB/kk
  const res50 = calculateOrderPrice('black_russia', 50, 80);
  assert.equal(res50.rawPrice, 4000);
  assert.equal(res50.discountPercent, 0);
  assert.equal(res50.discountAmount, 0);
  assert.equal(res50.finalPriceRub, 4000);
});

test('Standoff 2: calculates Gold buy pricing correctly without Black Russia units', () => {
  // 1000 Gold at 80 RUB per 100G
  const res1000G = calculateOrderPrice('standoff2', 1000, 80);
  assert.equal(res1000G.rawPrice, 800);
  assert.equal(res1000G.discountPercent, 0);
  assert.equal(res1000G.discountAmount, 0);
  assert.equal(res1000G.finalPriceRub, 800);
  assert.equal(res1000G.officialPriceRub, 1650);

  // 5000 Gold at 80 RUB per 100G
  const res5000G = calculateOrderPrice('standoff2', 5000, 80);
  assert.equal(res5000G.rawPrice, 4000);
  assert.equal(res5000G.discountPercent, 0);
  assert.equal(res5000G.discountAmount, 0);
  assert.equal(res5000G.finalPriceRub, 4000);
});

test('Black Russia buyback (скупка): 1kk = 35 RUB rate', () => {
  // 1kk at 35 RUB
  const res1 = calculateSellPayout('black_russia', 1);
  assert.equal(res1.ratePerUnit, 35);
  assert.equal(res1.basePayoutRub, 35);
  assert.equal(res1.finalPayoutRub, 35);

  // 10kk at 35 RUB
  const res10 = calculateSellPayout('black_russia', 10);
  assert.equal(res10.ratePerUnit, 35);
  assert.equal(res10.basePayoutRub, 350);
  assert.equal(res10.finalPayoutRub, 350);

  // 50kk at 35 RUB with 3% volume bonus
  const res50 = calculateSellPayout('black_russia', 50);
  assert.equal(res50.basePayoutRub, 1750);
  assert.equal(res50.bonusPercent, 3);
  assert.equal(res50.bonusRub, 53); // Math.round(1750 * 0.03) = 53
  assert.equal(res50.finalPayoutRub, 1803);
});

test('Standoff 2 buyback (скупка): 100 Gold = 45 RUB rate', () => {
  // 100 Gold at 45 RUB
  const res100 = calculateSellPayout('standoff2', 100);
  assert.equal(res100.ratePerUnit, 45);
  assert.equal(res100.basePayoutRub, 45);
  assert.equal(res100.finalPayoutRub, 45);

  // 1000 Gold at 45 RUB
  const res1000 = calculateSellPayout('standoff2', 1000);
  assert.equal(res1000.ratePerUnit, 45);
  assert.equal(res1000.basePayoutRub, 450);
  assert.equal(res1000.finalPayoutRub, 450);

  // 5000 Gold at 45 RUB with 3% volume bonus
  const res5000 = calculateSellPayout('standoff2', 5000);
  assert.equal(res5000.basePayoutRub, 2250);
  assert.equal(res5000.bonusPercent, 3);
  assert.equal(res5000.bonusRub, 68); // Math.round(2250 * 0.03) = 68
  assert.equal(res5000.finalPayoutRub, 2318);
});
