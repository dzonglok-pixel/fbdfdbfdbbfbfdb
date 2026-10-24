import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  ShieldCheck,
  Award,
  Wallet,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
  Gamepad2,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { user, profileModalOpen, closeProfileModal, logout, updateProfile, orderHistory } = useAuth();
  const [brNickname, setBrNickname] = useState(user?.brNickname || '');
  const [so2Nickname, setSo2Nickname] = useState(user?.so2Nickname || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when modal opens
  React.useEffect(() => {
    if (user) {
      setBrNickname(user.brNickname || user.username || '');
      setSo2Nickname(user.so2Nickname || user.username || '');
      setSavedSuccess(false);
    }
  }, [user, profileModalOpen]);

  if (!profileModalOpen || !user) return null;

  const handleSaveGameProfiles = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      brNickname: brNickname.trim(),
      so2Nickname: so2Nickname.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={closeProfileModal} />

      <div className="relative w-full max-w-2xl bg-[#0D1117] border border-rose-950/60 rounded-2xl shadow-2xl shadow-rose-950/50 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500" />

        {/* Top Header */}
        <div className="p-6 border-b border-rose-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-rose-950/50 border border-rose-400/30">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight font-display">
                  {user.username}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                  Клиент NetBana
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Зарегистрирован: {formattedDate} • Вход по логину без почты
              </p>
            </div>
          </div>
          <button
            onClick={closeProfileModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* User statistics badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Статус аккаунта</p>
                <p className="text-sm font-extrabold text-emerald-400 font-display">
                  Верифицирован
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Кэшбэк бонусы</p>
                <p className="text-lg font-extrabold text-rose-400 font-display">
                  {user.cashbackPoints || 0} ₽
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Успешных сделок</p>
                <p className="text-lg font-extrabold text-emerald-400 font-display">
                  {user.totalOrdersCount || orderHistory.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Game Nickname auto-fill settings */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-rose-950/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Сохраненные игровые профили
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Автоподстановка в калькулятор и симулятор
              </span>
            </div>

            {savedSuccess && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Игровые данные успешно сохранены в профиле!</span>
              </div>
            )}

            <form onSubmit={handleSaveGameProfiles} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Никнейм в Black Russia
                  </label>
                  <input
                    type="text"
                    value={brNickname}
                    onChange={(e) => setBrNickname(e.target.value)}
                    placeholder="Пример: Alex_Romanov"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 focus:border-rose-500 rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Никнейм / ID в Standoff 2
                  </label>
                  <input
                    type="text"
                    value={so2Nickname}
                    onChange={(e) => setSo2Nickname(e.target.value)}
                    placeholder="Пример: Cyber_Ghost (ID: 18492014)"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 focus:border-rose-500 rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-rose-950/40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Сохранить игровые ники</span>
                </button>
              </div>
            </form>
          </div>

          {/* Orders / Simulations History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-white tracking-wide">
                  История заказов и симуляций
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                Всего: {orderHistory.length}
              </span>
            </div>

            {orderHistory.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400">
                <Award className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-medium">У вас пока нет оформленных заказов.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Запустите «Тест сделки» или калькулятор — они автоматически сохранятся в вашем профиле с начислением кэшбэка!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-rose-900/60 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold">
                        {order.gameId === 'black_russia' ? 'BR' : 'SO2'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {order.server}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {order.amount} {order.gameId === 'black_russia' ? 'кк виртов' : 'G голды'} • {order.nickname}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400 font-mono">
                        {order.totalRub.toLocaleString('ru-RU')} ₽
                      </p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Выполнен
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-rose-950/40 bg-slate-950/60 flex items-center justify-between shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Выйти из профиля</span>
          </button>

          <button
            onClick={closeProfileModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
