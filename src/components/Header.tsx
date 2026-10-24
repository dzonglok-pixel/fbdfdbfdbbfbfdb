import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowRight, User, LogOut, ChevronDown, Sparkles, Wallet, Check, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onNavigate, onOpenSimulator }) => {
  const { isAdmin, openAdminPanel } = useAuth();
  const { pendingReviewsCount } = useReviews();
  return (
    <header className="sticky top-0 z-40 bg-[#080A0F]/90 backdrop-blur-md border-b border-rose-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home"
          onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 group-hover:border-rose-400 group-hover:bg-rose-500/20 transition-all shadow-sm">
            <Shield className="w-4 h-4 fill-rose-500/20" />
          </div>
          <span className="font-display tracking-wider font-extrabold text-slate-100">
            NETBANA<span className="text-rose-500 font-semibold ml-0.5">SHOP</span>
          </span>
        </a>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('calculator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${activeTab === 'calculator' ? 'text-rose-400 font-semibold' : 'hover:text-white'}`}
          >
            Калькулятор
          </button>
          <button
            onClick={() => onNavigate('safety')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${activeTab === 'safety' ? 'text-rose-400 font-semibold' : 'hover:text-white'}`}
          >
            Безопасность
          </button>
          <button
            onClick={() => onNavigate('reviews')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${activeTab === 'reviews' ? 'text-rose-400 font-semibold' : 'hover:text-white'}`}
          >
            Отзывы & FAQ
          </button>
          <button
            onClick={() => onNavigate('info')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${activeTab === 'info' ? 'text-rose-400 font-semibold' : 'hover:text-white'}`}
          >
            Информация
          </button>
        </nav>

        {/* Zone 3: Actions & Top-Right Authorization */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAdmin && (
            <button
              onClick={openAdminPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 rounded-lg transition-all border border-rose-500/50 shadow-md shadow-rose-950/50 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Админ-панель</span>
              {pendingReviewsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white font-extrabold animate-pulse">
                  {pendingReviewsCount}
                </span>
              )}
            </button>
          )}

          <a
            href="https://t.me/NetBanaManager"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-98 border border-slate-700/80 hover:border-rose-500/50"
          >
            <span>Менеджер @NetBanaManager</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
          </a>

          {/* Top-Right Authorization Module (No Email, Remembered Session) */}
          <AuthHeaderWidget />
        </div>

      </div>
    </header>
  );
};

const AuthHeaderWidget: React.FC = () => {
  const { user, isAuthenticated, isAdmin, openAuthModal, openProfileModal, openAdminPanel, logout } = useAuth();
  const { pendingReviewsCount } = useReviews();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => openAuthModal('login')}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-md shadow-rose-950/60 border border-rose-500/40 transition-all cursor-pointer active:scale-98"
          title="Вход или быстрая регистрация по логину"
        >
          <User className="w-3.5 h-3.5" />
          <span>Войти</span>
        </button>
      </div>
    );
  }

  // Authenticated state: user chip with avatar, username, and dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800/90 border border-rose-900/40 hover:border-rose-500/50 rounded-xl transition-all cursor-pointer shadow-sm group"
      >
        {/* Avatar initial with online green dot */}
        <div className="relative">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white text-xs font-extrabold uppercase shadow-inner">
            {user.username.charAt(0)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#080A0F]" />
        </div>

        {/* User name & status */}
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors max-w-[120px] truncate">
              {user.username}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">
            {user.cashbackPoints || 0} бонусов
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#0D1117] border border-rose-950/70 rounded-xl shadow-2xl shadow-rose-950/60 py-1.5 z-50 animate-fadeIn text-xs">
          <div className="px-3.5 py-2.5 border-b border-rose-950/40">
            <p className="font-bold text-white truncate">{user.username}</p>
            <p className="text-[11px] text-slate-400">Авторизован с запоминанием</p>
          </div>

          <div className="p-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                openProfileModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Личный кабинет & Никнеймы</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                openProfileModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>Кэшбэк & Бонусы</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {user.cashbackPoints || 0} ₽
              </span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openAdminPanel();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left cursor-pointer font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Панель администратора</span>
                </div>
                {pendingReviewsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="p-1 border-t border-rose-950/40">
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left cursor-pointer font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
