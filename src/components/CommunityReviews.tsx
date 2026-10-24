import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import {
  Star,
  MessageSquarePlus,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Lock,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export const CommunityReviews: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, isAdmin, openAdminPanel } = useAuth();
  const { reviews, addReview, pendingReviewsCount } = useReviews();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formGame, setFormGame] = useState('Black Russia (CRMP)');
  const [formServer, setFormServer] = useState('23 — MOSCOW');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formAmount, setFormAmount] = useState('10 000 000 ₽');
  
  // Feedback status after submit
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleOpenReviewModal = () => {
    setErrorMsg('');
    setSubmitSuccess(false);
    setIsModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Необходимо авторизоваться в аккаунте');
      return;
    }

    if (!user.canLeaveReviews) {
      setErrorMsg('Ваш аккаунт ещё не одобрен администрацией для публикации отзывов');
      return;
    }

    if (!formComment.trim()) {
      setErrorMsg('Пожалуйста, напишите ваш отзыв');
      return;
    }

    const authorDisplayName = user.brNickname || user.so2Nickname || user.username;

    const res = addReview({
      author: authorDisplayName,
      game: formGame,
      server: formServer,
      rating: formRating,
      comment: formComment.trim(),
      amountPurchased: formAmount.trim() || '10 000 000 ₽'
    });

    if (res.success) {
      setSubmitSuccess(true);
      setFormComment('');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <section id="reviews" className="py-8 bg-[#080A0F] text-slate-100 border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Отзывы покупателей
              </h2>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.9 / 5.0</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Только подтверждённые сделки от верифицированных пользователей NetBanaSHOP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && pendingReviewsCount > 0 && (
              <button
                onClick={openAdminPanel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer shadow-sm"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>На модерации ({pendingReviewsCount})</span>
              </button>
            )}

            <button
              onClick={handleOpenReviewModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer self-start sm:self-auto shadow-sm active:scale-98"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Оставить отзыв</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {reviews.map((rev) => {
            const isPending = rev.status === 'pending';

            return (
              <div
                key={rev.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isPending
                    ? 'bg-amber-950/25 border-amber-500/40 relative overflow-hidden'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                {isPending && (
                  <div className="mb-2 px-2 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>На модерации (виден только вам)</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {rev.author}
                    </span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mb-2">
                    <span className="truncate max-w-[110px]">{rev.server}</span>
                    <span>·</span>
                    <span className="text-emerald-400 shrink-0">Без бана</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug line-clamp-3">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>{rev.amountPurchased}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for adding review with permission checks */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0D1117] border border-rose-950/70 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Публикация отзыва о сделке
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Case 1: Not authenticated */}
              {!isAuthenticated ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Требуется авторизация</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Отзывы на NetBanaSHOP могут оставлять только зарегистрированные пользователи, одобренные администрацией.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Войти в аккаунт
                  </button>
                </div>
              ) : !user?.canLeaveReviews ? (
                /* Case 2: Authenticated, but NOT approved by administration */
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ожидает одобрения администрацией</h4>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[11px] font-mono font-semibold my-2">
                      <Clock className="w-3 h-3" />
                      <span>Статус: Проверка аккаунта</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed text-left">
                      Пользователь <strong className="text-white">@{user?.username}</strong> пока не получил разрешение на публикацию отзывов. Согласно политике безопасности NetBana, администратор одобряет участников индивидуально в панели управления после успешных сделок.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Понятно
                  </button>
                </div>
              ) : submitSuccess ? (
                /* Success message */
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Отзыв отправлен на модерацию!</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Администратор сайта проверит ваш отзыв. Сразу после одобрения он станет доступен всем посетителям витрины.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Отлично
                  </button>
                </div>
              ) : (
                /* Case 3: Authenticated AND Approved by Admin */
                <form onSubmit={handleSubmitReview} className="space-y-3.5">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ваш аккаунт одобрен администрацией для публикации отзывов.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-semibold">Игра</label>
                      <select
                        value={formGame}
                        onChange={(e) => setFormGame(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-rose-500"
                      >
                        <option value="Black Russia (CRMP)">Black Russia (CRMP)</option>
                        <option value="Standoff 2">Standoff 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-semibold">Оценка</label>
                      <div className="flex items-center gap-1 py-1.5 px-2 bg-slate-900 border border-slate-700 rounded-xl">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setFormRating(starVal)}
                            className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                starVal <= formRating ? 'fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-semibold">Сервер</label>
                      <input
                        type="text"
                        value={formServer}
                        onChange={(e) => setFormServer(e.target.value)}
                        placeholder="Например: 23 — MOSCOW"
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-semibold">Объем сделки</label>
                      <input
                        type="text"
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="Например: 15кк или 2500 G"
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-semibold">Текст отзыва</label>
                    <textarea
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      rows={3}
                      placeholder="Опишите, как прошла передача виртов или голды курьером..."
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-rose-500 leading-relaxed"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-normal">
                    После отправки отзыв попадет в очередь модерации администратора сайта.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-rose-950/50"
                  >
                    Отправить отзыв на модерацию
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
