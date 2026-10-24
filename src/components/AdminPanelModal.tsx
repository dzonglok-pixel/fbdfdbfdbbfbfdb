import React, { useState } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import {
  ShieldAlert,
  X,
  Users,
  MessageSquare,
  Check,
  Trash2,
  Search,
  Star,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';

export const AdminPanelModal: React.FC = () => {
  const { isAdmin, adminPanelOpen, closeAdminPanel, getAllUsers, toggleUserReviewPermission } = useAuth();
  const { allReviewsForAdmin, approveReview, deleteReview } = useReviews();

  const [activeTab, setActiveTab] = useState<'reviews' | 'users'>('reviews');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [userSearch, setUserSearch] = useState('');

  if (!isAdmin || !adminPanelOpen) return null;

  const allUsers = getAllUsers();
  const filteredUsers = allUsers.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase().trim();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.brNickname && u.brNickname.toLowerCase().includes(q)) ||
      (u.so2Nickname && u.so2Nickname.toLowerCase().includes(q))
    );
  });

  const pendingCount = allReviewsForAdmin.filter((r) => r.status === 'pending').length;
  const approvedCount = allReviewsForAdmin.filter((r) => r.status === 'approved').length;

  const filteredReviews = allReviewsForAdmin.filter((r) => {
    if (reviewFilter === 'pending') return r.status === 'pending';
    if (reviewFilter === 'approved') return r.status === 'approved';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-[#0D1117] border border-rose-600/40 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Admin Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-rose-950/60 bg-gradient-to-r from-rose-950/40 via-slate-900 to-[#0D1117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Панель администратора NetBanaSHOP
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold uppercase tracking-wider">
                  Root Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Авторизован как Администратор · Полный доступ к модерации и участникам
              </p>
            </div>
          </div>

          <button
            onClick={closeAdminPanel}
            className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Модерация отзывов</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {pendingCount} новых
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Участники сайта</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 font-semibold">
              {allUsers.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ================= TAB 1: REVIEWS MODERATION ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              
              {/* Reviews Sub-filters */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                  <button
                    onClick={() => setReviewFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      reviewFilter === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ожидают модерации ({pendingCount})
                  </button>
                  <button
                    onClick={() => setReviewFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      reviewFilter === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Одобренные ({approvedCount})
                  </button>
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      reviewFilter === 'all'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Все отзывы ({allReviewsForAdmin.length})
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Только одобренные отзывы отображаются в публичной витрине сайта.
                </p>
              </div>

              {/* Reviews List */}
              {filteredReviews.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                  <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-300">
                    {reviewFilter === 'pending'
                      ? 'Нет отзывов, ожидающих проверки'
                      : 'В данном фильтре нет отзывов'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Все поступившие отзывы обработаны администратором.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-xl border transition-all ${
                        rev.status === 'pending'
                          ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-950/20'
                          : 'bg-slate-900/70 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {rev.author}
                          </span>
                          {rev.authorUsername && (
                            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              @{rev.authorUsername}
                            </span>
                          )}
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-slate-300 font-medium">
                            {rev.game} ({rev.server})
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          {rev.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                              <Clock className="w-3 h-3" />
                              На модерации
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                              <Check className="w-3 h-3" />
                              Одобрен
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-200 leading-relaxed mb-3">
                        "{rev.comment}"
                      </p>

                      {/* Metadata and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                        <div className="text-[11px] text-slate-400 flex items-center gap-3 font-mono">
                          <span>Объем: {rev.amountPurchased}</span>
                          <span>·</span>
                          <span>Дата: {rev.date}</span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {rev.status === 'pending' && (
                            <button
                              onClick={() => approveReview(rev.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-98"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Одобрить</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-medium text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Удалить</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 2: USERS MANAGEMENT ================= */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* Search & Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Поиск по логину или игровому нику..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="text-xs text-slate-400">
                  Всего участников: <span className="font-bold text-white">{allUsers.length}</span>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-2.5">
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = u.username.toLowerCase() === 'администратор';
                  const isReviewApproved = !!u.canLeaveReviews;

                  return (
                    <div
                      key={u.username}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold uppercase shadow-sm ${
                          isCurrentAdmin
                            ? 'bg-gradient-to-br from-rose-600 to-rose-800 text-white'
                            : 'bg-slate-800 text-slate-200'
                        }`}>
                          {u.username.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {u.username}
                            </span>
                            {isCurrentAdmin ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold">
                                Администратор
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                Участник
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                            <span>Заказов: {u.totalOrdersCount || 0}</span>
                            <span>·</span>
                            <span>Бонусы: {u.cashbackPoints || 0} ₽</span>
                            {u.brNickname && (
                              <>
                                <span>·</span>
                                <span>BR: {u.brNickname}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Review Permission Status & Action */}
                      <div className="flex items-center gap-3 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          {isReviewApproved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                              <UserCheck className="w-3 h-3" />
                              Одобрен для отзывов
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              <UserX className="w-3 h-3" />
                              Ожидает допуска
                            </span>
                          )}
                        </div>

                        {!isCurrentAdmin && (
                          <button
                            onClick={() => toggleUserReviewPermission(u.username, !isReviewApproved)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-98 flex items-center gap-1.5 ${
                              isReviewApproved
                                ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {isReviewApproved ? (
                              <span>Отозвать право</span>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Одобрить для отзывов</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
