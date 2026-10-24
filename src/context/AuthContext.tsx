import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  username: string; // Used for login (no email needed)
  passwordHash: string;
  createdAt: string;
  balanceRub: number;
  cashbackPoints: number;
  discountPercent: number;
  totalOrdersCount: number;
  brNickname?: string;
  so2Nickname?: string;
  canLeaveReviews?: boolean; // Approved by admin to write reviews
  role?: 'admin' | 'user';
}

export interface UserSession {
  username: string;
  loggedInAt: string;
}

export interface UserOrderHistoryItem {
  id: string;
  username: string;
  gameId: 'black_russia' | 'standoff2';
  server: string;
  amount: number;
  totalRub: number;
  nickname: string;
  date: string;
  status: 'completed' | 'in_progress' | 'cancelled' | 'pending';
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  profileModalOpen: boolean;
  adminPanelOpen: boolean;
  orderHistory: UserOrderHistoryItem[];
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addOrderToHistory: (order: Omit<UserOrderHistoryItem, 'id' | 'username' | 'date'>) => void;
  getAllUsers: () => UserProfile[];
  toggleUserReviewPermission: (username: string, allowed: boolean) => void;
}

const STORAGE_USERS_KEY = 'netbana_users_v1';
const STORAGE_SESSION_KEY = 'netbana_session_v1';
const STORAGE_ORDERS_KEY = 'netbana_user_orders_v1';

// Helper to hash password using SHA-256 with Web Crypto API
async function hashPassword(plainText: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`netbana_salt_${plainText.trim()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple hash if crypto.subtle is unavailable
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
      hash |= 0;
    }
    return `fb_${Math.abs(hash)}`;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [orderHistory, setOrderHistory] = useState<UserOrderHistoryItem[]>([]);

  const [adminPanelOpen, setAdminPanelOpen] = useState<boolean>(false);

  // Load registered users from storage
  const getStoredUsers = (): Record<string, UserProfile> => {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveUsers = (users: Record<string, UserProfile>) => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users database', e);
    }
  };

  // Seed demo account and Administrator account
  const initializeSeedUsers = async () => {
    const users = getStoredUsers();
    let hasChanges = false;

    // 1. Seed official Administrator account (login: Администратор, pass: qwert12345)
    const adminKey = 'администратор';
    const adminHash = await hashPassword('qwert12345');
    if (!users[adminKey] || users[adminKey].passwordHash !== adminHash) {
      users[adminKey] = {
        username: 'Администратор',
        passwordHash: adminHash,
        createdAt: '2026-01-01T00:00:00.000Z',
        balanceRub: 999999,
        cashbackPoints: 9999,
        discountPercent: 10,
        totalOrdersCount: 99,
        brNickname: 'Admin_NetBana',
        so2Nickname: 'Admin_NetBana',
        canLeaveReviews: true,
        role: 'admin'
      };
      hasChanges = true;
    }

    // 2. Seed verified trader demo account
    if (!users['trader_bana']) {
      const demoHash = await hashPassword('123456');
      users['trader_bana'] = {
        username: 'Trader_Bana',
        passwordHash: demoHash,
        createdAt: '2026-03-15T12:00:00.000Z',
        balanceRub: 1250,
        cashbackPoints: 480,
        discountPercent: 0,
        totalOrdersCount: 8,
        brNickname: 'Bana_Chief',
        so2Nickname: 'BanaGod_ID772',
        canLeaveReviews: true,
        role: 'user'
      };
      hasChanges = true;
    } else if (users['trader_bana'].canLeaveReviews === undefined) {
      users['trader_bana'].canLeaveReviews = true;
      hasChanges = true;
    }

    if (hasChanges) {
      saveUsers(users);
    }
  };

  // Load session from localStorage on app boot
  useEffect(() => {
    const initSession = async () => {
      await initializeSeedUsers();
      try {
        const sessionRaw = localStorage.getItem(STORAGE_SESSION_KEY) || sessionStorage.getItem(STORAGE_SESSION_KEY);
        if (sessionRaw) {
          const session: UserSession = JSON.parse(sessionRaw);
          const users = getStoredUsers();
          const found = users[session.username.toLowerCase()];
          if (found) {
            setUser(found);
            loadUserOrders(found.username);
          } else {
            localStorage.removeItem(STORAGE_SESSION_KEY);
            sessionStorage.removeItem(STORAGE_SESSION_KEY);
          }
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const loadUserOrders = (username: string) => {
    try {
      const allOrdersRaw = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (allOrdersRaw) {
        const allOrders: UserOrderHistoryItem[] = JSON.parse(allOrdersRaw);
        setOrderHistory(allOrders.filter(o => o.username.toLowerCase() === username.toLowerCase()));
      } else {
        setOrderHistory([]);
      }
    } catch {
      setOrderHistory([]);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const register = async (
    usernameInput: string,
    passwordInput: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanNick = usernameInput.trim();
    if (!cleanNick) {
      return { success: false, error: 'Введите желаемый логин / никнейм' };
    }
    if (cleanNick.length < 3 || cleanNick.length > 20) {
      return { success: false, error: 'Логин должен содержать от 3 до 20 символов' };
    }
    if (!/^[a-zA-Z0-9_а-яА-ЯёЁ]+$/.test(cleanNick)) {
      return { success: false, error: 'Логин может содержать только буквы, цифры и символ _' };
    }
    if (!passwordInput || passwordInput.length < 4) {
      return { success: false, error: 'Пароль должен содержать не менее 4 символов' };
    }

    const users = getStoredUsers();
    const key = cleanNick.toLowerCase();
    if (users[key]) {
      return { success: false, error: 'Пользователь с таким логином уже существует. Войдите в аккаунт.' };
    }

    const passwordHash = await hashPassword(passwordInput);
    const newUser: UserProfile = {
      username: cleanNick,
      passwordHash,
      createdAt: new Date().toISOString(),
      balanceRub: 0,
      cashbackPoints: 50, // Welcome bonus points!
      discountPercent: 0,
      totalOrdersCount: 0,
      brNickname: cleanNick,
      so2Nickname: cleanNick,
      canLeaveReviews: false, // Requires Administrator approval!
      role: 'user'
    };

    users[key] = newUser;
    saveUsers(users);

    // Save session with persistence
    const session: UserSession = {
      username: cleanNick,
      loggedInAt: new Date().toISOString()
    };

    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }

    setUser(newUser);
    loadUserOrders(cleanNick);
    setAuthModalOpen(false);

    return { success: true };
  };

  const login = async (
    usernameInput: string,
    passwordInput: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanNick = usernameInput.trim();
    if (!cleanNick || !passwordInput) {
      return { success: false, error: 'Укажите логин и пароль' };
    }

    const users = getStoredUsers();
    const key = cleanNick.toLowerCase();
    const foundUser = users[key];

    if (!foundUser) {
      return { success: false, error: 'Профиль с таким логином не найден. Зарегистрируйтесь.' };
    }

    const inputHash = await hashPassword(passwordInput);
    if (foundUser.passwordHash !== inputHash) {
      return { success: false, error: 'Неверный пароль. Проверьте правильность ввода.' };
    }

    const session: UserSession = {
      username: foundUser.username,
      loggedInAt: new Date().toISOString()
    };

    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }

    setUser(foundUser);
    loadUserOrders(foundUser.username);
    setAuthModalOpen(false);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
    setOrderHistory([]);
    setProfileModalOpen(false);
    setAdminPanelOpen(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const users = getStoredUsers();
    const key = user.username.toLowerCase();
    const updatedUser = { ...user, ...updates };

    users[key] = updatedUser;
    saveUsers(users);
    setUser(updatedUser);
  };

  const addOrderToHistory = (orderData: Omit<UserOrderHistoryItem, 'id' | 'username' | 'date'>) => {
    if (!user) return;
    const newOrder: UserOrderHistoryItem = {
      ...orderData,
      id: `NB-${Date.now().toString().slice(-6)}`,
      username: user.username,
      date: new Date().toISOString()
    };

    try {
      const allOrdersRaw = localStorage.getItem(STORAGE_ORDERS_KEY);
      const allOrders: UserOrderHistoryItem[] = allOrdersRaw ? JSON.parse(allOrdersRaw) : [];
      const updatedList = [newOrder, ...allOrders];
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updatedList));
      setOrderHistory(prev => [newOrder, ...prev]);

      // Grant loyalty bonus points & order count
      const bonusEarned = Math.round(orderData.totalRub * 0.03);
      updateProfile({
        totalOrdersCount: (user.totalOrdersCount || 0) + 1,
        cashbackPoints: (user.cashbackPoints || 0) + bonusEarned,
        discountPercent: Math.min(10, 2 + Math.floor(((user.totalOrdersCount || 0) + 1) / 2))
      });
    } catch (e) {
      console.error('Error adding order to history', e);
    }
  };

  // Only user "Администратор" is admin
  const isAdmin = user?.username.toLowerCase() === 'администратор';

  const openAdminPanel = () => {
    if (isAdmin) setAdminPanelOpen(true);
  };

  const closeAdminPanel = () => {
    setAdminPanelOpen(false);
  };

  const getAllUsers = (): UserProfile[] => {
    const usersMap = getStoredUsers();
    return Object.values(usersMap).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const toggleUserReviewPermission = (targetUsername: string, allowed: boolean) => {
    const users = getStoredUsers();
    const key = targetUsername.toLowerCase();
    if (users[key]) {
      users[key].canLeaveReviews = allowed;
      saveUsers(users);
      if (user && user.username.toLowerCase() === key) {
        setUser({ ...user, canLeaveReviews: allowed });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        authModalOpen,
        authModalMode,
        profileModalOpen,
        adminPanelOpen,
        orderHistory,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        openAdminPanel,
        closeAdminPanel,
        login,
        register,
        logout,
        updateProfile,
        addOrderToHistory,
        getAllUsers,
        toggleUserReviewPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
