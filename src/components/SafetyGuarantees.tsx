import React from 'react';
import { ShieldCheck, Zap, Lock, CheckCircle2 } from 'lucide-react';

export const SafetyGuarantees: React.FC = () => {
  return (
    <section id="safety" className="py-8 bg-[#080A0F] text-slate-100 border-t border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Безопасность NetBana</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Zero-Ban Защита</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Гарантии защиты от блокировок
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md sm:text-right">
            Курьеры используют легитимные внутриигровые каналы и маскируют передачу под обычные игровые активности.
          </p>
        </div>

        {/* 3 Compact Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-950/40">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">1. Защита от логов администрации</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Передача виртов через банк (/bank) или трейд (/trade) частями с диалогами в чате. Сделка выглядит как обычный возврат долга или подарок другу.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-950/40">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">2. 100% Чистая валюта</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Валюта добыта легальным путем: бизнесы, перепродажи и ивенты. Мы никогда не используем вирты с взломанных аккаунтов или стороннего софта.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-950/40">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">3. Покрытие 20% комиссии</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              При покупке голды Standoff 2 мы полностью оплачиваем комиссию рынка Axlebolt. Вы получаете на баланс ровно то количество Gold, за которое заплатили.
            </p>
          </div>
        </div>



        {/* Express Interactive Ban Safety Bar */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Статус протокола Zero-Ban:</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  98.6% Безопасность
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                За последние 60 дней не зафиксировано ни одной блокировки у покупателей NetBanaSHOP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
            <span>✓ Без передачи паролей</span>
            <span>✓ Защищенный протокол</span>
          </div>
        </div>

      </div>
    </section>
  );
};
