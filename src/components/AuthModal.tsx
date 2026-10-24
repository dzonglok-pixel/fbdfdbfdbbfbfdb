import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode);
      setErrorMessage(null);
      setRegistrationSuccess(false);
      setPassword('');
      setConfirmPassword('');
    }
  }, [authModalOpen, authModalMode]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanNick = username.trim();
    if (!cleanNick) {
      setErrorMessage('Пожалуйста, укажите ваш никнейм / логин');
      return;
    }

    if (!password) {
      setErrorMessage('Пожалуйста, введите пароль');
      return;
    }

    if (mode === 'register') {
      if (password.length < 4) {
        setErrorMessage('Пароль должен содержать минимум 4 символа');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Введённые пароли не совпадают');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(cleanNick, password, rememberMe);
        if (!res.success) {
          setErrorMessage(res.error || 'Ошибка входа');
        }
      } else {
        const res = await register(cleanNick, password, rememberMe);
        if (!res.success) {
          setErrorMessage(res.error || 'Ошибка при регистрации');
        } else {
          setRegistrationSuccess(true);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Непредвиденная ошибка авторизации');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('Trader_Bana');
    setPassword('123456');
    setMode('login');
    setErrorMessage(null);
  };

  const handleFillAdmin = () => {
    setUsername('Администратор');
    setPassword('qwert12345');
    setMode('login');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Background click overlay */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md bg-[#0D1117] border border-rose-950/60 rounded-2xl shadow-2xl shadow-rose-950/40 overflow-hidden z-10 transition-all">
        {/* Top glowing accent line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500" />

        {/* Header bar */}
        <div className="p-6 pb-4 border-b border-rose-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide font-display">
                {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация профиля'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login'
                  ? 'Войдите по логину без подтверждения почты'
                  : 'Создайте личный профиль без email за 5 секунд'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Вход vs Регистрация */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Вход</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Регистрация</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration success feedback */}
        {registrationSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>Профиль успешно зарегистрирован! Добро пожаловать в NetBanaSHOP.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username / Никнейм */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Логин или Игровой никнейм
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Например: Alex_Romanov"
                maxLength={24}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Почта не требуется — вход осуществляется только по этому логину.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Ваш пароль' : 'Придумайте пароль (от 4 знаков)'}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (only for register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Повторите пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль для проверки"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 accent-rose-600"
              />
              <span className="text-xs text-slate-300 font-medium">Запомнить меня на этом устройстве</span>
            </label>
            <span className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Сессия защищена
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{mode === 'login' ? 'Войти в аккаунт' : 'Завершить регистрацию'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Account Quick Access Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 bg-slate-950/40 text-center space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Быстрый вход для проверки
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleFillAdmin}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all font-medium cursor-pointer"
            >
              👑 Администратор (qwert12345)
            </button>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-all font-medium cursor-pointer"
            >
              👤 Trader_Bana (123456)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
