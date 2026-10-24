import React from 'react';
import { Calculator, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreCalculator: () => void;
  onExploreRisks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCalculator, onExploreRisks }) => {
  return (
    <section className="relative pt-6 pb-8 border-b border-rose-950/40 bg-[#080A0F] overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-rose-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Punchy, zero-fluff headline & rates */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>NetBanaSHOP</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Маркет виртов и голды</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2.5">
              Игровая валюта по выгодному курсу без риска бана
            </h1>

            <p className="text-sm text-slate-300 leading-normal mb-4">
              Моментальная покупка и скупка для <strong className="text-white">Black Russia</strong> (курс 1кк = 80 ₽) и <strong className="text-white">Standoff 2</strong> (100 G = 80 ₽ со 100% покрытием комиссии). Безопасная передача за 5–15 минут.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onExploreCalculator}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shadow-md shadow-rose-950/50 active:scale-98 border border-rose-500/30"
              >
                <Calculator className="w-4 h-4" />
                <span>Рассчитать и заказать</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onExploreRisks}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer active:scale-98"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Гарантии безопасности</span>
              </button>
            </div>
          </div>

          {/* Right: Compact Live Rates Strip */}
          <div className="w-full lg:w-auto shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 max-w-md lg:max-w-sm">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-950/50">
              <span className="block text-[11px] text-slate-400 font-medium">Black Russia (Вирты)</span>
              <span className="text-sm font-bold text-rose-400 font-mono">1кк = 80 ₽</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Все 90+ серверов</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-950/50">
              <span className="block text-[11px] text-slate-400 font-medium">Standoff 2 (Голда)</span>
              <span className="text-sm font-bold text-amber-400 font-mono">100 G = 80 ₽</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Комиссия 20% включена</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-950/50">
              <span className="block text-[11px] text-slate-400 font-medium">Скупка (Продажа)</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">Выплата за 3 мин</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">СБП, Карты, USDT</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-950/50">
              <span className="block text-[11px] text-slate-400 font-medium">Безопасность</span>
              <span className="text-sm font-bold text-slate-200 font-mono">0 банов за 2 года</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Скрытые каналы ЦР</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
