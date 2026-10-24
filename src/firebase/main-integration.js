// ==============================================================================
// main-integration.js — Пример связки UI + Auth + Orders + Reviews
// ==============================================================================
import { initAuthListener, loginWithNickname, registerWithNickname, logoutUser } from "./auth.js";
import { createOrderAndGoToTelegram } from "./orders.js";
import { getEligibleOrdersForReview, submitOrderReview, fetchPublicReviews } from "./reviews.js";

// Текущее состояние в памяти
let currentUserState = null; // { uid, nickname } или null

// ==============================================================================
// 1. Инициализация слушателя сессии при запуске страницы
// ==============================================================================
window.addEventListener("DOMContentLoaded", () => {
  // Слушаем статус авторизации (localStorage сохраняет сессию автоматически)
  initAuthListener(async (user) => {
    currentUserState = user;
    updateHeaderAuthUI(user);
    await syncReviewFormState();
  });

  // Загружаем список реальных отзывов из Firestore
  loadAndRenderReviews();
});

// ==============================================================================
// 2. Обновление шапки (Ник + Выйти / Войти + Регистрация)
// ==============================================================================
function updateHeaderAuthUI(user) {
  const guestZone = document.getElementById("guest-zone");
  const userZone = document.getElementById("user-zone");
  const nickDisplay = document.getElementById("user-display-nickname");

  if (user) {
    if (guestZone) guestZone.classList.add("hidden");
    if (userZone) {
      userZone.classList.remove("hidden");
      userZone.classList.add("flex");
    }
    if (nickDisplay) nickDisplay.textContent = user.nickname;
  } else {
    if (guestZone) guestZone.classList.remove("hidden");
    if (userZone) {
      userZone.classList.add("hidden");
      userZone.classList.remove("flex");
    }
  }
}

// ==============================================================================
// 3. Обработка форм входа и регистрации
// ==============================================================================
window.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const nickname = document.getElementById("login-nickname").value;
  const password = document.getElementById("login-password").value;
  const errorBox = document.getElementById("login-error");

  try {
    errorBox.classList.add("hidden");
    await loginWithNickname(nickname, password);
    closeModal("modal-login");
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
};

window.handleRegisterSubmit = async function(e) {
  e.preventDefault();
  const nickname = document.getElementById("reg-nickname").value;
  const password = document.getElementById("reg-password").value;
  const errorBox = document.getElementById("register-error");

  try {
    errorBox.classList.add("hidden");
    await registerWithNickname(nickname, password);
    closeModal("modal-register");
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
};

window.handleUserLogout = async function() {
  await logoutUser();
};

// ==============================================================================
// 4. Оформление заказа и переход в Telegram
// ==============================================================================
window.handleBuyClick = async function(orderParams) {
  if (!currentUserState) {
    alert("Пожалуйста, войдите в аккаунт или зарегистрируйтесь перед покупкой!");
    openModal("modal-login");
    return;
  }

  try {
    const { orderId, telegramUrl } = await createOrderAndGoToTelegram(orderParams, currentUserState.nickname);
    // Открываем Telegram для оплаты и передачи валюты
    window.open(telegramUrl, "_blank");
  } catch (err) {
    alert("Ошибка оформления заказа: " + err.message);
  }
};

// ==============================================================================
// 5. Синхронизация формы отзыва (проверка completed-заказов)
// ==============================================================================
async function syncReviewFormState() {
  const guestBanner = document.getElementById("review-guest-banner");
  const lockedBanner = document.getElementById("review-locked-banner");
  const formWrapper = document.getElementById("review-form-wrapper");
  const orderSelect = document.getElementById("review-order-select");

  if (!guestBanner || !lockedBanner || !formWrapper) return;

  if (!currentUserState) {
    guestBanner.classList.remove("hidden");
    lockedBanner.classList.add("hidden");
    formWrapper.classList.add("hidden");
    return;
  }

  guestBanner.classList.add("hidden");

  // Запрашиваем выполненные заказы без отзыва
  const eligibleOrders = await getEligibleOrdersForReview();

  if (eligibleOrders.length === 0) {
    lockedBanner.classList.remove("hidden");
    formWrapper.classList.add("hidden");
  } else {
    lockedBanner.classList.add("hidden");
    formWrapper.classList.remove("hidden");

    // Заполняем выпадающий список доступных заказов
    if (orderSelect) {
      orderSelect.innerHTML = eligibleOrders.map(o => 
        `<option value="${o.orderId}">Заказ №${o.orderId} — ${o.game} (${o.server}, ${o.amount})</option>`
      ).join("");
    }
  }
}

// ==============================================================================
// 6. Отправка отзыва
// ==============================================================================
window.handleReviewSubmit = async function(e) {
  e.preventDefault();
  const orderId = document.getElementById("review-order-select").value;
  const rating = document.getElementById("review-rating").value;
  const text = document.getElementById("review-text").value;

  try {
    await submitOrderReview({
      orderId,
      rating,
      text,
      userNickname: currentUserState.nickname
    });

    alert("Спасибо! Ваш отзыв успешно проверен и опубликован.");
    document.getElementById("review-text").value = "";
    
    // Обновляем форму и список отзывов
    await syncReviewFormState();
    await loadAndRenderReviews();
  } catch (err) {
    alert("Ошибка отправки отзыва: " + err.message);
  }
};

// ==============================================================================
// 7. Рендеринг отзывов
// ==============================================================================
async function loadAndRenderReviews() {
  const container = document.getElementById("reviews-list-container");
  if (!container) return;

  const reviews = await fetchPublicReviews(20);

  if (reviews.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center text-xs text-slate-500 py-6">Пока нет отзывов. Станьте первым покупателем!</div>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs flex items-center justify-center font-mono">
              ${(r.nickname || "P")[0].toUpperCase()}
            </div>
            <div>
              <div class="text-xs font-bold text-white flex items-center gap-1">
                ${escapeHtml(r.nickname)}
                <span class="text-[10px] text-emerald-400 font-normal">✓ Заказ №${escapeHtml(r.orderId)}</span>
              </div>
              <div class="text-[10px] text-slate-500">${escapeHtml(r.server || "")}</div>
            </div>
          </div>
          <div class="text-yellow-400 text-xs">${"★".repeat(r.rating || 5)}</div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(r.text)}</p>
      </div>
      <div class="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <span>Проверенная покупка</span>
        <span>${escapeHtml(r.date)}</span>
      </div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// Вспомогательные функции для модальных окон
window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("hidden");
};
window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("hidden");
};
window.switchModals = function(fromId, toId) {
  closeModal(fromId);
  openModal(toId);
};
