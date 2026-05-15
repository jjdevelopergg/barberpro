"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  providerData: { providerId: string }[];
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string; phone?: string }) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
    const accounts = JSON.parse(localStorage.getItem("bp-accounts") || "[]");
    const account = accounts.find((a: { email: string; password: string }) => a.email === email && a.password === password);

    if (!account) {
      throw { code: "auth/invalid-credential" };
    }

    setUser({
      uid: "u-" + email.replace(/[^a-z0-9]/g, ""),
      email: account.email,
      displayName: account.name || email.split("@")[0],
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
      providerData: [{ providerId: "password" }],
    });
  };

  const signInWithGoogle = async () => {
    setUser({
      uid: "g-" + Date.now(),
      email: "usuario@gmail.com",
      displayName: "Usuário",
      providerData: [{ providerId: "google.com" }],
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("bp-session");
  };

  const resetPassword = async (email: string) => {
    const accounts = JSON.parse(localStorage.getItem("bp-accounts") || "[]");
    if (!accounts.find((a: { email: string }) => a.email === email)) {
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
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout, resetPassword, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
