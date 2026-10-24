import React, { useState, useEffect } from 'react';
import { GameId, MarketplaceMode } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  GAMES_DATA,
  DELIVERY_METHODS,
  STANDOFF2_DELIVERY_METHODS,
  BLACK_RUSSIA_SELL_METHODS,
  STANDOFF2_SELL_METHODS
} from '../data/mockData';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Coins,
  ShoppingCart,
  Send,
  Copy,
  Check,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface OrderSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: {
    gameId: GameId;
    mode?: MarketplaceMode;
    server: string;
    amount: number;
    totalRub: number;
    deliveryMethodId: string;
    payoutMethod?: string;
    payoutRequisites?: string;
  };
}

export const OrderSimulatorModal: React.FC<OrderSimulatorModalProps> = ({
  isOpen,
  onClose,
  initialParams
}) => {
  const { user, addOrderToHistory } = useAuth();
  const isInitialStandoff = initialParams?.gameId === 'standoff2';
  const initialMode = initialParams?.mode || 'buy';

  const [mode, setMode] = useState<MarketplaceMode>(initialMode);
  const [nickname, setNickname] = useState(() => {
    if (user) {
      return isInitialStandoff
        ? (user.so2Nickname || user.username)
        : (user.brNickname || user.username);
    }
    return isInitialStandoff ? 'Cyber_Ghost (ID: 18492014)' : 'Alex_Romanov';
  });
  const [selectedGameId, setSelectedGameId] = useState<GameId>(initialParams?.gameId || 'black_russia');
  const [selectedServer, setSelectedServer] = useState(initialParams?.server || '23 — MOSCOW');
  const [amount, setAmount] = useState(initialParams?.amount || 10);
  const [deliveryMethodId, setDeliveryMethodId] = useState(initialParams?.deliveryMethodId || 'bank_transfer');
  const [payoutRequisites, setPayoutRequisites] = useState<string>(initialParams?.payoutRequisites || '+7 (999) 456-78-90 (СБП)');
  
  // Submitted state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (initialParams) {
      setMode(initialParams.mode || 'buy');
      setSelectedGameId(initialParams.gameId);
      setSelectedServer(initialParams.server);
      setAmount(initialParams.amount);
      setDeliveryMethodId(initialParams.deliveryMethodId);
      if (initialParams.payoutRequisites) {
        setPayoutRequisites(initialParams.payoutRequisites);
      }
      if (user) {
        setNickname(
          initialParams.gameId === 'standoff2'
            ? (user.so2Nickname || user.username)
            : (user.brNickname || user.username)
        );
      } else {
        if (initialParams.gameId === 'standoff2') {
          setNickname('Cyber_Ghost (ID: 18492014)');
        } else {
          setNickname('Alex_Romanov');
        }
      }
    } else if (user) {
      setNickname(
        selectedGameId === 'standoff2'
          ? (user.so2Nickname || user.username)
          : (user.brNickname || user.username)
      );
    }
    // Reset submission when modal opens with fresh params
    setIsSubmitted(false);
    setErrorMsg('');
  }, [initialParams, user, selectedGameId, isOpen]);

  if (!isOpen) return null;

  const isSellMode = mode === 'sell';
  const game = GAMES_DATA.find((g) => g.id === selectedGameId) || GAMES_DATA[0];

  const allMethods = isSellMode
    ? selectedGameId === 'standoff2' ? STANDOFF2_SELL_METHODS : BLACK_RUSSIA_SELL_METHODS
    : selectedGameId === 'standoff2' ? STANDOFF2_DELIVERY_METHODS : DELIVERY_METHODS;

  const method = allMethods.find((m) => m.id === deliveryMethodId) || allMethods[0];
  const isStandoff = selectedGameId === 'standoff2';

  // Calculate default price/payout if totalRub wasn't provided
  const baseRub = initialParams?.totalRub || (
    isSellMode
      ? isStandoff ? Math.round((amount / 100) * 45) : amount * 35
      : isStandoff ? Math.round((amount / 100) * 80) : amount * 80
  );
  const totalRub = baseRub;

  const formattedAmount = isStandoff
    ? `${amount.toLocaleString('ru-RU')} Gold`
    : `${amount} 000 000 ₽ (${amount}кк)`;

  // Generate Telegram message text
  const generateTelegramMessage = (orderId: string) => {
    if (isSellMode) {
      return (
        `Здравствуйте! Хочу сдать валюту в NetBanaSHOP:\n` +
        `📋 Заявка: #${orderId}\n` +
        `🎮 Игра: ${game.name}\n` +
        `🌐 Сервер: ${selectedServer}\n` +
        `💰 Объем: ${formattedAmount}\n` +
        `💳 К выплате: ${totalRub.toLocaleString('ru-RU')} ₽\n` +
        `📦 Способ передачи: ${method.name}\n` +
        `👤 Мой ник в игре: ${nickname.trim()}\n` +
        `💳 Реквизиты для выплаты: ${payoutRequisites.trim()}`
      );
    }
    return (
      `Здравствуйте! Хочу купить валюту в NetBanaSHOP:\n` +
      `📋 Заказ: #${orderId}\n` +
      `🎮 Игра: ${game.name}\n` +
      `🌐 Сервер: ${selectedServer}\n` +
      `💰 Объем: ${formattedAmount}\n` +
      `💵 Сумма к оплате: ${totalRub.toLocaleString('ru-RU')} ₽\n` +
      `📦 Способ передачи: ${method.name}\n` +
      `👤 Мой ник в игре: ${nickname.trim()}`
    );
  };

  const getTelegramUrl = (orderId: string) => {
    const text = generateTelegramMessage(orderId);
    return `https://t.me/NetBanaManager?text=${encodeURIComponent(text)}`;
  };

  const handleSubmitOrder = () => {
    if (!nickname.trim()) {
      setErrorMsg('Пожалуйста, укажите ваш игровой Nick_Name');
      return;
    }
    if (isSellMode && !payoutRequisites.trim()) {
      setErrorMsg('Пожалуйста, укажите реквизиты для выплаты (СБП / Карта)');
      return;
    }

    const orderId = `NB-${Date.now().toString().slice(-6)}`;
    setCreatedOrderId(orderId);

    // Save order in user history
    if (user) {
      addOrderToHistory({
        gameId: selectedGameId,
        server: selectedServer,
        amount: amount,
        totalRub: totalRub,
        nickname: nickname.trim(),
        status: 'pending'
      });
    }

    setIsSubmitted(true);

    // Direct transition to @NetBanaManager
    const telegramUrl = getTelegramUrl(orderId);
    // Open in a new tab/window
    const link = document.createElement('a');
    link.href = telegramUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyOrder = () => {
    const text = generateTelegramMessage(createdOrderId);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#10141E] border border-rose-950/60 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-rose-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isSellMode ? 'bg-emerald-400' : 'bg-rose-500'
            }`} />
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Заказ оформлен</span>
                </>
              ) : isSellMode ? (
                <>
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>Оформление заявки на скупку</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-rose-500" />
                  <span>Оформление заказа валюты</span>
                </>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {isSubmitted ? (
            /* Successful Order Submission & Direct Telegram Transition */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-white">
                  Заказ #{createdOrderId} успешно сформирован!
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  Для оплаты и моментального получения игровой валюты перейдите в чат к нашему официальному менеджеру <strong className="text-white">@NetBanaManager</strong>.
                </p>
              </div>

              {/* Order summary card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Игра и сервер:</span>
                  <span className="font-semibold text-white">{game.name} · {selectedServer}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Объем:</span>
                  <span className="font-bold text-rose-400">{formattedAmount}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">
                    {isSellMode ? 'К выплате:' : 'Сумма к оплате:'}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {totalRub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Никнейм в игре:</span>
                  <span className="font-semibold text-white">{nickname}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Способ передачи:</span>
                  <span className="text-slate-200">{method.name.split('(')[0]}</span>
                </div>
              </div>

              {/* Big primary button to open @NetBanaManager */}
              <div className="space-y-2.5 pt-1">
                <a
                  href={getTelegramUrl(createdOrderId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 via-rose-600 to-rose-700 hover:from-sky-400 hover:via-rose-500 hover:to-rose-600 shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Перейти к менеджеру @NetBanaManager</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyOrder}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопировать заказ</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Закрыть
                  </button>
                </div>
              </div>

              {/* Support note */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Вопросы по сделке или гарантиям?</span>
                <a
                  href="https://t.me/NetBanaSupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>@NetBanaSupport</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            /* Order Placement Form (No Simulation) */
            <div className="space-y-4">
              
              {/* Order summary pill */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Игра и сервер:</span>
                  <span className="font-semibold text-white">{game.name} · {selectedServer}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Количество:</span>
                  <span className="font-bold text-rose-400">{formattedAmount}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Способ передачи:</span>
                  <span className="text-slate-200">{method.name.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 font-medium">
                    {isSellMode ? 'К выплате вам:' : 'Итого к оплате:'}
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    {totalRub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              {/* Nickname input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Игровой Nick_Name (как на сервере {game.name})
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={isStandoff ? 'Например: Cyber_Ghost (ID: 18492014)' : 'Например: Alex_Romanov'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Для передачи валюты требуется только никнейм. Пароли в NetBana никогда не запрашиваются.
                </p>
              </div>

              {/* Requisites if selling */}
              {isSellMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Реквизиты для выплаты (СБП, номер карты или USDT)
                  </label>
                  <input
                    type="text"
                    value={payoutRequisites}
                    onChange={(e) => {
                      setPayoutRequisites(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="+7 (999) 000-00-00 (СБП, Т-Банк/Сбер)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Выплата отправляется сразу после передачи валюты курьеру.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Redirect notice */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  После нажатия кнопки вы будете перенаправлены на официальный аккаунт менеджера <strong className="text-white">@NetBanaManager</strong> в Telegram для согласования передачи и проведения сделки.
                </span>
              </div>

              {/* Primary Submit Button */}
              <button
                onClick={handleSubmitOrder}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 ${
                  isSellMode
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/60'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/60'
                }`}
              >
                <span>
                  {isSellMode
                    ? `Сдать валюту менеджеру @NetBanaManager`
                    : `Оформить заказ у менеджера @NetBanaManager`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
