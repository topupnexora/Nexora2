import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  fillDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'nexora_auth_user_v1';
const USERS_DB_KEY = 'nexora_registered_users_db_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user session', e);
    }
  }, [user]);

  const getUsersDB = (): Record<string, { user: User; pass: string }> => {
    try {
      const dbStr = localStorage.getItem(USERS_DB_KEY);
      if (dbStr) return JSON.parse(dbStr);
    } catch {
      // ignore
    }
    // Seed default demo user
    const defaultDb = {
      'gamer@nexora.gg': {
        user: {
          id: 'usr-demo-01',
          name: 'Shakib Gamer',
          email: 'gamer@nexora.gg',
          phone: '01712345678',
          createdAt: new Date().toISOString(),
        },
        pass: 'nexora123'
      }
    };
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultDb));
    } catch {
      // ignore
    }
    return defaultDb;
  };

  const login = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const db = getUsersDB();
    const account = db[trimmedEmail];

    if (!account) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (account.pass !== pass) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setUser(account.user);
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const db = getUsersDB();

    if (db[trimmedEmail]) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    db[trimmedEmail] = {
      user: newUser,
      pass,
    };

    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to update users DB', e);
    }

    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const refreshed: User = { ...user, ...updated };
    setUser(refreshed);

    const db = getUsersDB();
    if (db[user.email]) {
      db[user.email].user = refreshed;
      try {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
      } catch {
        // ignore
      }
    }
  };

  const fillDemoUser = () => {
    const demo: User = {
      id: 'usr-demo-01',
      name: 'Shakib Gamer',
      email: 'gamer@nexora.gg',
      phone: '01712345678',
      createdAt: new Date().toISOString(),
    };
    setUser(demo);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, fillDemoUser }}>
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
