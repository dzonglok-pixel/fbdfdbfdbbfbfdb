import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#080A0F] text-slate-400 text-xs border-t border-rose-950/40 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-950/40">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Shield className="w-3.5 h-3.5 fill-rose-500/20" />
            </div>
            <span className="font-display font-extrabold text-white text-sm">
              NETBANA<span className="text-rose-500 font-semibold ml-0.5">SHOP</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] text-slate-400">Безопасный маркет игровой валюты</span>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => onNavigate('calculator')}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Калькулятор
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Безопасность
            </button>
            <button
              onClick={() => onNavigate('reviews')}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Отзывы & FAQ
            </button>
            <button
              onClick={() => onNavigate('info')}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Информация
            </button>
            <a
              href="https://t.me/netbanashop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-rose-400 transition-colors font-medium flex items-center gap-1"
            >
              Канал (@netbanashop)
            </a>
            <a
              href="https://t.me/NetBanaManager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-rose-400 transition-colors font-medium flex items-center gap-1"
            >
              Менеджер (@NetBanaManager)
            </a>
            <a
              href="https://t.me/NetBanaSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-sky-400 transition-colors font-medium flex items-center gap-1"
            >
              Поддержка (@NetBanaSupport)
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} NetBanaSHOP. Все права защищены.</p>
          <p>Выдача заказов через защищенные внутриигровые каналы.</p>
        </div>

      </div>
    </footer>
  );
};
