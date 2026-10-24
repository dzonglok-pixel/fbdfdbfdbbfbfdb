// ==============================================================================
// reviews.js — Review Rights Verification, Submission & Rendering
// ==============================================================================
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  runTransaction 
} from "firebase/firestore";
import { auth, db } from "./firebase-config.js";

/**
 * Retrieves completed orders belonging to the user that have not yet been reviewed.
 * Condition: status === 'completed' && reviewed === false
 * @returns {Promise<Array<{orderId: string, game: string, server: string, amount: string}>>}
 */
export async function getEligibleOrdersForReview() {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  // Query completed orders for current authenticated user
  const q = query(
    collection(db, "orders"),
    where("userId", "==", currentUser.uid),
    where("status", "==", "completed")
  );

  const querySnapshot = await getDocs(q);
  const eligibleOrders = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    // Exclude orders that have already been reviewed
    if (!data.reviewed) {
      eligibleOrders.push({
        orderId: data.orderId || docSnap.id,
        game: data.game,
        server: data.server,
        amount: data.amount,
        createdAt: data.createdAt
      });
    }
  });

  return eligibleOrders;
}

/**
 * Submits an authentic review for a verified completed order.
 * Uses an atomic transaction to ensure single review per completed order.
 * @param {Object} reviewData { orderId, rating, text, userNickname }
 * @returns {Promise<{success: boolean, reviewId: string}>}
 */
export async function submitOrderReview({ orderId, rating, text, userNickname }) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Only authenticated users can leave reviews.");
  }

  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    throw new Error("Rating must be between 1 and 5 stars.");
  }

  const cleanText = (text || "").trim();
  if (cleanText.length < 5) {
    throw new Error("Review text must be at least 5 characters long.");
  }

  const orderRef = doc(db, "orders", orderId);
  const reviewRef = doc(collection(db, "reviews"));

  // Atomic transaction verifying order ownership, completion status, and review state
  await runTransaction(db, async (transaction) => {
    const orderSnap = await transaction.get(orderRef);

    if (!orderSnap.exists()) {
      throw new Error("Order not found.");
    }

    const orderData = orderSnap.data();

    // 1. Verify that order belongs to current user
    if (orderData.userId !== currentUser.uid) {
      throw new Error("You can only review your own personal orders.");
    }

    // 2. Verify that administrator has marked the order as completed
    if (orderData.status !== "completed") {
      throw new Error("Reviews are only allowed after the order is completed by an administrator.");
    }

    // 3. Verify that review has not already been submitted
    if (orderData.reviewed === true) {
      throw new Error("A review has already been submitted for this order.");
    }

    // Write review document
    transaction.set(reviewRef, {
      reviewId: reviewRef.id,
      orderId: orderId,
      userId: currentUser.uid,
      nickname: userNickname || orderData.nickname || "Verified Buyer",
      game: orderData.game || "Gaming Currency",
      server: orderData.server || "Global",
      rating: numRating,
      text: cleanText,
      verified: true, // Marked as verified purchase
      createdAt: serverTimestamp()
    });

    // Mark order as reviewed to prevent subsequent reviews
    transaction.update(orderRef, {
      reviewed: true,
      reviewId: reviewRef.id
    });
  });

  return { success: true, reviewId: reviewRef.id };
}

/**
 * Loads recent verified reviews from Firestore for public display.
 * @param {number} maxCount - Maximum number of reviews to fetch
 * @returns {Promise<Array>}
 */
export async function fetchPublicReviews(maxCount = 20) {
  try {
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc"),
      limit(maxCount)
    );
    const snap = await getDocs(q);
    const list = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        ...d,
        date: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString("ru-RU") : "Recently"
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching public reviews:", err);
    return [];
  }
}
