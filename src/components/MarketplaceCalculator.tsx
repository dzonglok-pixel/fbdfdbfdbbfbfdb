import React, { useState, useMemo, useEffect } from 'react';
import {
  GAMES_DATA,
  DELIVERY_METHODS,
  STANDOFF2_DELIVERY_METHODS,
  BLACK_RUSSIA_SELL_METHODS,
  STANDOFF2_SELL_METHODS
} from '../data/mockData';
import { GameId, MarketplaceMode } from '../types';
import { calculateOrderPrice, calculateSellPayout } from '../utils/calculator';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Coins,
  Search,
  Check,
  Wallet,
  Clock,
  Sparkles
} from 'lucide-react';

interface MarketplaceCalculatorProps {
  onStartOrderSimulation: (params: {
    gameId: GameId;
    mode: MarketplaceMode;
    server: string;
    amount: number;
    totalRub: number;
    deliveryMethodId: string;
    payoutMethod?: string;
    payoutRequisites?: string;
  }) => void;
  onOpenBanInspectorWithParams: (gameId: GameId, amount: number, methodId: string) => void;
  externalSelect?: {
    gameId: GameId;
    server: string;
    mode?: MarketplaceMode;
  };
}

export const MarketplaceCalculator: React.FC<MarketplaceCalculatorProps> = ({
  onStartOrderSimulation,
  onOpenBanInspectorWithParams,
  externalSelect
}) => {
  const { user, openAuthModal } = useAuth();
  const [mode, setMode] = useState<MarketplaceMode>('buy');
  const [selectedGameId, setSelectedGameId] = useState<GameId>('black_russia');
  const [serverSearch, setServerSearch] = useState('');
  const [selectedServer, setSelectedServer] = useState('23 — MOSCOW');
  const [amount, setAmount] = useState<number>(10); // 10kk for BR, or 1000 Gold for SO2
  const [selectedMethodId, setSelectedMethodId] = useState<string>('bank_transfer');

  // Payout details for sell mode
  const [payoutGateway, setPayoutGateway] = useState<'sbp' | 'card' | 'tinkoff' | 'usdt'>('sbp');
  const [payoutRequisites, setPayoutRequisites] = useState<string>('');

  // Handle external selection from server table or hero
  useEffect(() => {
    if (externalSelect) {
      setSelectedGameId(externalSelect.gameId);
      setSelectedServer(externalSelect.server);
      if (externalSelect.mode) {
        setMode(externalSelect.mode);
      }
      if (externalSelect.gameId === 'standoff2') {
        setSelectedMethodId(externalSelect.mode === 'sell' ? 'so2_sell_market_skin' : 'so2_market_skin');
        setAmount(1000);
      } else {
        setSelectedMethodId(externalSelect.mode === 'sell' ? 'br_sell_bank' : 'bank_transfer');
        setAmount(10);
      }
    }
  }, [externalSelect]);

  const currentGame = useMemo(() => {
    return GAMES_DATA.find((g) => g.id === selectedGameId) || GAMES_DATA[0];
  }, [selectedGameId]);

  // Delivery methods depending on game and mode
  const activeDeliveryMethods = useMemo(() => {
    if (mode === 'sell') {
      return selectedGameId === 'standoff2' ? STANDOFF2_SELL_METHODS : BLACK_RUSSIA_SELL_METHODS;
    }
    return selectedGameId === 'standoff2' ? STANDOFF2_DELIVERY_METHODS : DELIVERY_METHODS;
  }, [selectedGameId, mode]);

  // Filter all servers (without arbitrary slice)
  const filteredServers = useMemo(() => {
    if (!serverSearch.trim()) return currentGame.allServers;
    const q = serverSearch.toLowerCase().trim();
    return currentGame.allServers.filter((s) => s.toLowerCase().includes(q));
  }, [currentGame, serverSearch]);

  const handleGameChange = (gameId: GameId) => {
    setSelectedGameId(gameId);
    setServerSearch('');
    const game = GAMES_DATA.find((g) => g.id === gameId);
    if (game && game.allServers.length > 0) {
      setSelectedServer(game.allServers[0]);
    }
    if (gameId === 'standoff2') {
      setSelectedMethodId(mode === 'sell' ? 'so2_sell_market_skin' : 'so2_market_skin');
      setAmount(1000);
    } else {
      setSelectedMethodId(mode === 'sell' ? 'br_sell_bank' : 'bank_transfer');
      setAmount(10);
    }
  };

  const handleModeChange = (newMode: MarketplaceMode) => {
    setMode(newMode);
    if (selectedGameId === 'standoff2') {
      setSelectedMethodId(newMode === 'sell' ? 'so2_sell_market_skin' : 'so2_market_skin');
    } else {
      setSelectedMethodId(newMode === 'sell' ? 'br_sell_bank' : 'bank_transfer');
    }
  };

  const isStandoff = selectedGameId === 'standoff2';
  const isSellMode = mode === 'sell';

  // Buy calculation (discounts completely removed)
  const buyCalculation = useMemo(() => {
    return calculateOrderPrice(selectedGameId, amount, currentGame.defaultRateRub);
  }, [selectedGameId, amount, currentGame]);

  const finalPayableRub = buyCalculation.finalPriceRub;

  // Sell calculation
  const sellCalculation = useMemo(() => {
    return calculateSellPayout(selectedGameId, amount);
  }, [selectedGameId, amount]);

  const selectedDeliveryMethod = useMemo(() => {
    const found = activeDeliveryMethods.find((m) => m.id === selectedMethodId);
    return found || activeDeliveryMethods[0];
  }, [selectedMethodId, activeDeliveryMethods]);

  // Presets for quick click
  const presets = isStandoff ? [100, 500, 1000, 2500, 5000, 10000] : [5, 10, 20, 50, 100];

  return (
    <section id="calculator" className="py-8 bg-[#080A0F] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Bar: Game switcher & Mode switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-950/40">
          {/* Game Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => handleGameChange('black_russia')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGameId === 'black_russia'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Black Russia</span>
              <span className="font-mono text-[11px] opacity-90">(80 ₽ / 1кк)</span>
            </button>
            <button
              onClick={() => handleGameChange('standoff2')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGameId === 'standoff2'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Standoff 2</span>
              <span className="font-mono text-[11px] opacity-90">(80 ₽ / 100 G)</span>
            </button>
          </div>

          {/* Mode Switcher: Купить vs Продать */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => handleModeChange('buy')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                !isSellMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Купить валюту</span>
            </button>
            <button
              onClick={() => handleModeChange('sell')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                isSellMode
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Сдать (Скупка)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Configurator (Left) + Order Box (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Fast 3-Step Configurator */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Step 1: Server */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-950/40">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Сервер: <span className="text-rose-400 normal-case">{selectedServer}</span>
                </label>
                <div className="relative w-48">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={serverSearch}
                    onChange={(e) => setServerSearch(e.target.value)}
                    placeholder="Быстрый поиск..."
                    className="w-full pl-7 pr-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Server Chips List */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {filteredServers.map((server) => {
                  const isSelected = server === selectedServer;
                  return (
                    <button
                      key={server}
                      type="button"
                      onClick={() => setSelectedServer(server)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                        isSelected
                          ? isSellMode
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-rose-600 text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {server}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Amount with quick buttons */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-950/40">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Количество: {isStandoff ? `${amount} Gold` : `${amount}кк (${amount} 000 000 ₽)`}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={isStandoff ? 100 : 1}
                    max={isStandoff ? 100000 : 500}
                    step={isStandoff ? 100 : 1}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                    className="w-24 px-2 py-1 text-xs font-bold font-mono text-center bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-rose-500"
                  />
                  <span className="text-xs text-slate-400">{isStandoff ? 'G' : 'кк'}</span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`flex-1 min-w-[60px] py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      amount === p
                        ? isSellMode
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    {isStandoff ? `${p} G` : `${p}кк`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Delivery Method */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-950/40">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                3. Способ передачи (Безопасность)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeDeliveryMethods.map((m) => {
                  const isSelected = m.id === selectedMethodId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethodId(m.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? isSellMode
                            ? 'bg-emerald-950/40 border-emerald-500 text-white'
                            : 'bg-rose-950/40 border-rose-500 text-white'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate">{m.name.split('(')[0]}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">{m.safetyScore}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{m.shortDesc}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">⏱ {m.estimatedTimeMin}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requisites input (only for sell mode) */}
            {isSellMode && (
              <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-950/40 space-y-2">
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Реквизиты для выплаты средств
                </label>
                <div className="flex gap-2">
                  {(['sbp', 'card', 'usdt'] as const).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setPayoutGateway(gw)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase ${
                        payoutGateway === gw
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {gw === 'sbp' ? 'СБП' : gw === 'card' ? 'Карта РФ' : 'USDT TRC-20'}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={payoutRequisites}
                  onChange={(e) => setPayoutRequisites(e.target.value)}
                  placeholder={
                    payoutGateway === 'sbp'
                      ? '+7 (999) 000-00-00, Название банка'
                      : payoutGateway === 'card'
                      ? 'Номер карты 16 или 18 цифр'
                      : 'Адрес кошелька TRC-20'
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>
            )}

          </div>

          {/* Right Column: Compact Checkout Summary */}
          <div className="lg:col-span-5 sticky top-20">
            <div className={`p-5 rounded-2xl bg-slate-900/90 border shadow-xl space-y-4 ${
              isSellMode ? 'border-emerald-950/60' : 'border-rose-950/60'
            }`}>
              
              <div>
                <span className={`text-[11px] font-mono uppercase tracking-wider block font-bold ${
                  isSellMode ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isSellMode ? 'Смета выплаты' : 'Смета заказа'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {currentGame.name} • {selectedServer}
                </h3>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                {isSellMode ? (
                  <>
                    <div className="flex justify-between text-slate-400">
                      <span>Объем сдачи:</span>
                      <span className="font-mono text-white font-bold">
                        {isStandoff ? `${amount} Gold` : `${amount}кк виртов`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Тариф скупки:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {isStandoff ? '45 ₽ / 100 G' : '35 ₽ / 1кк'}
                      </span>
                    </div>

                    {/* Final Payout */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Вы получите на руки:</span>
                        <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                          {sellCalculation.finalPayoutRub.toLocaleString('ru-RU')} <span className="text-emerald-400 text-lg">₽</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 font-mono">
                        <div>~${sellCalculation.usd} USD</div>
                        <div>~{sellCalculation.kzt} ₸ KZT</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-400">
                      <span>Объем покупки:</span>
                      <span className="font-mono text-white font-bold">
                        {isStandoff ? `${amount.toLocaleString('ru-RU')} Gold` : `${amount}кк (${amount} 000 000 ₽)`}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Тариф:</span>
                      <span className="font-mono text-rose-400 font-bold">
                        {isStandoff ? '80 ₽ / 100 G' : '80 ₽ / 1кк'}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Способ передачи:</span>
                      <span className="text-slate-200">
                        {selectedDeliveryMethod.name.split('(')[0]}
                      </span>
                    </div>

                    {/* Final Price */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Итого к оплате:</span>
                        <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                          {finalPayableRub.toLocaleString('ru-RU')} <span className="text-rose-500 text-lg">₽</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 font-mono">
                        <div>~${Math.round(finalPayableRub / 92)} USD</div>
                        <div>~{Math.round(finalPayableRub * 5.2)} ₸ KZT</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Order Button */}
              <button
                onClick={() =>
                  onStartOrderSimulation({
                    gameId: selectedGameId,
                    mode,
                    server: selectedServer,
                    amount,
                    totalRub: isSellMode ? sellCalculation.finalPayoutRub : finalPayableRub,
                    deliveryMethodId: selectedMethodId,
                    payoutMethod: isSellMode ? payoutGateway : undefined,
                    payoutRequisites: isSellMode ? payoutRequisites : undefined
                  })
                }
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 ${
                  isSellMode
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/60'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/60'
                }`}
              >
                <span>
                  {isSellMode
                    ? `Сдать валюту (получите ${sellCalculation.finalPayoutRub.toLocaleString('ru-RU')} ₽)`
                    : `Оформить заказ (${finalPayableRub.toLocaleString('ru-RU')} ₽)`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 3 concise guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Защита от бана</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Выдача 5-15 мин</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span>СБП и Карты</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
