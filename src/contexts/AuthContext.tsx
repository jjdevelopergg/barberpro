"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
  providerData: { providerId: string }[];
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string; phone?: string }) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Conta admin fixa
const ADMIN_ACCOUNT = { email: "admin@admin.com", password: "admin123", name: "Administrador" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const saved = localStorage.getItem("bp-session");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem("bp-session"); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("bp-session", JSON.stringify(user));
  }, [user]);

  const signIn = async (email: string, password: string) => {
    // Check admin account
    if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
      setUser({
        uid: "admin-001",
        email: ADMIN_ACCOUNT.email,
        displayName: ADMIN_ACCOUNT.name,
        role: "admin",
        providerData: [{ providerId: "password" }],
      });
      return;
    }

    // Check regular accounts
    const accounts = JSON.parse(localStorage.getItem("bp-accounts") || "[]");
    const account = accounts.find((a: { email: string; password: string }) => a.email === email && a.password === password);

    if (!account) {
      throw { code: "auth/invalid-credential" };
    }

    setUser({
      uid: "u-" + email.replace(/[^a-z0-9]/g, ""),
      email: account.email,
      displayName: account.name || email.split("@")[0],
      role: "user",
      providerData: [{ providerId: "password" }],
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    const accounts = JSON.parse(localStorage.getItem("bp-accounts") || "[]");
    if (accounts.find((a: { email: string }) => a.email === email)) {
      throw { code: "auth/email-already-in-use" };
    }

    accounts.push({ email, password, name });
    localStorage.setItem("bp-accounts", JSON.stringify(accounts));

    setUser({
      uid: "u-" + email.replace(/[^a-z0-9]/g, ""),
      email,
      displayName: name,
      role: "user",
      providerData: [{ providerId: "password" }],
    });
  };

  const signInWithGoogle = async () => {
    setUser({
      uid: "g-" + Date.now(),
      email: "usuario@gmail.com",
      displayName: "Usuário",
      role: "user",
      providerData: [{ providerId: "google.com" }],
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("bp-session");
  };

  const resetPassword = async (email: string) => {
    const accounts = JSON.parse(localStorage.getItem("bp-accounts") || "[]");
    if (!accounts.find((a: { email: string }) => a.email === email) && email !== ADMIN_ACCOUNT.email) {
      throw { code: "auth/user-not-found" };
    }
  };

  const updateUserProfile = (data: { displayName?: string; phone?: string }) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("bp-session", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signInWithGoogle, logout, resetPassword, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
