// ==============================================================================
// orders.js — Order Creation in Firestore & Telegram Redirection
// ==============================================================================
import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "./firebase-config.js";

// Telegram operator or bot username for payment & delivery coordination
const TELEGRAM_OPERATOR_USERNAME = "netbana_support";

/**
 * Creates an order record in Firestore with "pending" status and generates a Telegram link.
 * @param {Object} orderData - Order payload { game, server, amount, price, deliveryMethod, recipientTag }
 * @param {string} userNickname - Current authenticated user nickname
 * @returns {Promise<{orderId: string, telegramUrl: string}>}
 */
export async function createOrderAndGoToTelegram(orderData, userNickname) {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error("You must be logged in to create an order.");
  }

  // Generate unique human-readable order ID: e.g. ORD-182940-529
  const timestamp = Date.now();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const orderId = `ORD-${timestamp.toString().slice(-6)}-${randomSuffix}`;

  // Target Firestore document in the 'orders' collection
  const orderDocRef = doc(db, "orders", orderId);

  const newOrder = {
    orderId: orderId,
    userId: currentUser.uid,
    nickname: userNickname || currentUser.email.split("@")[0],
    game: orderData.game || "Black Russia",
    server: orderData.server || "77 — MOSCOW",
    amount: orderData.amount || "1 000 000",
    price: orderData.price || "80 ₽",
    deliveryMethod: orderData.deliveryMethod || "Банковский перевод (/bank)",
    recipientTag: orderData.recipientTag || "Not specified",
    status: "pending", // Initial status — requires admin manual completion in Firestore
    reviewed: false,   // Flag preventing duplicate reviews
    createdAt: serverTimestamp()
  };

  // Persist order in Firestore
  await setDoc(orderDocRef, newOrder);

  // Compose formatted pre-filled message for Telegram support
  const messageText = 
`Hello! I placed an order on the NetBanaSHOP website:
📋 Order ID: ${orderId}
👤 Account Nickname: ${newOrder.nickname}
🎮 Game: ${newOrder.game}
🌐 Server / Region: ${newOrder.server}
💰 Currency Amount: ${newOrder.amount}
💵 Total Price: ${newOrder.price}
📦 Delivery Method: ${newOrder.deliveryMethod}
🏷️ In-Game Nickname / Tag: ${newOrder.recipientTag}`;

  const telegramUrl = `https://t.me/${TELEGRAM_OPERATOR_USERNAME}?text=${encodeURIComponent(messageText)}`;

  return { orderId, telegramUrl };
}
