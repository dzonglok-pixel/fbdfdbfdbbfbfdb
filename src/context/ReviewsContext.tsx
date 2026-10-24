import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommunityReview } from '../types';
import { COMMUNITY_REVIEWS } from '../data/mockData';
import { useAuth } from './AuthContext';

interface ReviewsContextType {
  reviews: CommunityReview[];
  allReviewsForAdmin: CommunityReview[];
  pendingReviewsCount: number;
  addReview: (data: {
    author: string;
    game: string;
    server: string;
    rating: number;
    comment: string;
    amountPurchased?: string;
  }) => { success: boolean; error?: string };
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
}

const STORAGE_REVIEWS_KEY = 'netbana_community_reviews_v2';

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState<CommunityReview[]>([]);

  // Load reviews from localStorage or initialize with seed data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_REVIEWS_KEY);
      if (stored) {
        const parsed: CommunityReview[] = JSON.parse(stored);
        setAllReviews(parsed);
      } else {
        localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(COMMUNITY_REVIEWS));
        setAllReviews(COMMUNITY_REVIEWS);
      }
    } catch (e) {
      console.error('Error loading reviews from localStorage:', e);
      setAllReviews(COMMUNITY_REVIEWS);
    }
  }, []);

  const saveReviews = (newList: CommunityReview[]) => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(newList));
      setAllReviews(newList);
    } catch (e) {
      console.error('Error saving reviews to storage:', e);
    }
  };

  const addReview = (data: {
    author: string;
    game: string;
    server: string;
    rating: number;
    comment: string;
    amountPurchased?: string;
  }): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: 'Для отправки отзыва необходимо авторизоваться' };
    }
    if (!user.canLeaveReviews) {
      return { success: false, error: 'Ваш аккаунт ещё не одобрен администрацией для публикации отзывов' };
    }
    if (!data.author.trim() || !data.comment.trim()) {
      return { success: false, error: 'Пожалуйста, заполните все обязательные поля' };
    }

    const newReview: CommunityReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: data.author.trim(),
      authorUsername: user.username.toLowerCase(),
      game: data.game,
      server: data.server,
      rating: Math.max(1, Math.min(5, data.rating)),
      date: 'Сегодня',
      verified: true,
      comment: data.comment.trim(),
      outcome: 'Успешно без бана',
      amountPurchased: data.amountPurchased?.trim() || '15 000 000 ₽',
      status: 'pending', // Pending moderation until Administrator approves!
      createdAt: new Date().toISOString()
    };

    const updated = [newReview, ...allReviews];
    saveReviews(updated);
    return { success: true };
  };

  const approveReview = (id: string) => {
    const updated = allReviews.map((r) =>
      r.id === id ? { ...r, status: 'approved' as const } : r
    );
    saveReviews(updated);
  };

  const deleteReview = (id: string) => {
    const updated = allReviews.filter((r) => r.id !== id);
    saveReviews(updated);
  };

  // Filter for regular users: show all approved reviews, PLUS the current user's own pending reviews
  const currentUsernameLower = user?.username.toLowerCase();
  const visibleReviews = allReviews.filter((r) => {
    if (r.status === 'approved') return true;
    if (currentUsernameLower && r.authorUsername === currentUsernameLower) return true;
    return false;
  });

  const pendingReviewsCount = allReviews.filter((r) => r.status === 'pending').length;

  return (
    <ReviewsContext.Provider
      value={{
        reviews: visibleReviews,
        allReviewsForAdmin: allReviews,
        pendingReviewsCount,
        addReview,
        approveReview,
        deleteReview
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
