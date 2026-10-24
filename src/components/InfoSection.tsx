import React from 'react';
import { Send, ShieldCheck, ExternalLink, Headphones, Radio, AlertTriangle } from 'lucide-react';

export const InfoSection: React.FC = () => {
  return (
    <section id="info" className="py-10 bg-[#080A0F] text-slate-100 border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 mb-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>Информация и связь</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Официальные ресурсы</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Информация и официальные контакты
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md sm:text-right">
            Все официальные каналы связи NetBanaSHOP в Telegram. Без посредников и поддельных аккаунтов.
          </p>
        </div>

        {/* 3 Main Official Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          
          {/* Card 1: Official Channel */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold">
                  Официальный канал
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>Канал NetBanaSHOP</span>
              </h3>
              <p className="text-xs font-mono text-rose-400 font-semibold mb-2.5">
                @netbanashop
              </p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Ежедневные курсы валют Black Russia и Standoff 2, анонсы скидок, раздачи виртов, новости и подтверждённые отзывы клиентов.
              </p>
            </div>

            <a
              href="https://t.me/netbanashop"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-950/40 active:scale-98"
            >
              <span>Перейти в канал @netbanashop</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Official Manager */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Сделки онлайн
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>Менеджер по сделкам</span>
              </h3>
              <p className="text-xs font-mono text-sky-400 font-semibold mb-2.5">
                @NetBanaManager
              </p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Приём и подтверждение заказов, скупка игровой валюты, координация курьеров на всех 90+ серверах и проведение быстрых выплат.
              </p>
            </div>

            <a
              href="https://t.me/NetBanaManager"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-950/40 active:scale-98"
            >
              <span>Написать @NetBanaManager</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Support & Security */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Поддержка 24/7
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>Служба безопасности</span>
              </h3>
              <p className="text-xs font-mono text-emerald-400 font-semibold mb-2.5">
                @NetBanaSupport
              </p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Верификация курьеров перед передачей, круглосуточная консультация, решение спорных ситуаций и контроль протокола Zero-Ban.
              </p>
            </div>

            <a
              href="https://t.me/NetBanaSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 active:scale-98"
            >
              <span>Чат с @NetBanaSupport</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Anti-Scam Notice */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Остерегайтесь мошенников:</strong> администрация NetBanaSHOP никогда не пишет первой в личные сообщения с предложениями о сделках. Всегда сверяйте юзернеймы: менеджер — <strong className="text-white">@NetBanaManager</strong>, поддержка — <strong className="text-white">@NetBanaSupport</strong>, канал — <strong className="text-white">@netbanashop</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-slate-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Верифицированная сеть</span>
          </div>
        </div>

      </div>
    </section>
  );
};
