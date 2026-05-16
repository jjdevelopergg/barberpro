"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  secureStorage,
  checkRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  sanitizeEmail,
  sanitizeName,
  validatePassword,
  validateEmail,
  generateSessionToken,
} from "@/lib/security";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
  sessionToken: string;
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

const ADMIN_ACCOUNT = { email: "admin@admin.com", password: "admin123", name: "Administrador" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  // Restore session
  useEffect(() => {
    const saved = secureStorage.get<UserData>("bp-session");
    if (saved && saved.sessionToken) {
      setUser(saved);
    }
    setLoading(false);
  }, []);

  // Save session
  useEffect(() => {
    if (user) {
      secureStorage.set("bp-session", user);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const cleanEmail = sanitizeEmail(email);

    // Rate limiting
    const rateCheck = checkRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      throw { code: "auth/too-many-requests", message: `Muitas tentativas. Aguarde ${Math.ceil(rateCheck.waitSeconds / 60)} minutos.` };
    }

    // Validate
    if (!validateEmail(cleanEmail)) {
      throw { code: "auth/invalid-email", message: "Email inválido." };
    }

    // Check admin
    if (cleanEmail === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
      resetLoginAttempts(cleanEmail);
      setUser({
        uid: "admin-001",
        email: ADMIN_ACCOUNT.email,
        displayName: ADMIN_ACCOUNT.name,
        role: "admin",
        sessionToken: generateSessionToken(),
        providerData: [{ providerId: "password" }],
      });
      return;
    }

    // Check accounts
    const accounts = secureStorage.get<{ email: string; password: string; name: string }[]>("bp-accounts") || [];
    const account = accounts.find((a) => a.email === cleanEmail && a.password === password);

    if (!account) {
      recordFailedLogin(cleanEmail);
      throw { code: "auth/invalid-credential" };
    }

    resetLoginAttempts(cleanEmail);
    setUser({
      uid: "u-" + cleanEmail.replace(/[^a-z0-9]/g, ""),
      email: account.email,
      displayName: account.name || cleanEmail.split("@")[0],
      role: "user",
      sessionToken: generateSessionToken(),
      providerData: [{ providerId: "password" }],
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeName(name);

    if (!validateEmail(cleanEmail)) {
      throw { code: "auth/invalid-email", message: "Email inválido." };
    }

    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      throw { code: "auth/weak-password", message: passCheck.message };
    }

    if (!cleanName || cleanName.length < 2) {
      throw { code: "auth/invalid-name", message: "Nome inválido." };
    }

    const accounts = secureStorage.get<{ email: string; password: string; name: string }[]>("bp-accounts") || [];
    if (accounts.find((a) => a.email === cleanEmail)) {
      throw { code: "auth/email-already-in-use" };
    }

    accounts.push({ email: cleanEmail, password, name: cleanName });
    secureStorage.set("bp-accounts", accounts);

    setUser({
      uid: "u-" + cleanEmail.replace(/[^a-z0-9]/g, ""),
      email: cleanEmail,
      displayName: cleanName,
      role: "user",
      sessionToken: generateSessionToken(),
      providerData: [{ providerId: "password" }],
    });
  };

  const signInWithGoogle = async () => {
    setUser({
      uid: "g-" + Date.now(),
      email: "usuario@gmail.com",
      displayName: "Usuário",
      role: "user",
      sessionToken: generateSessionToken(),
      providerData: [{ providerId: "google.com" }],
    });
  };

  const logout = async () => {
    setUser(null);
    secureStorage.remove("bp-session");
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = sanitizeEmail(email);
    if (!validateEmail(cleanEmail)) {
      throw { code: "auth/invalid-email" };
    }
    const accounts = secureStorage.get<{ email: string }[]>("bp-accounts") || [];
    if (!accounts.find((a) => a.email === cleanEmail) && cleanEmail !== ADMIN_ACCOUNT.email) {
      throw { code: "auth/user-not-found" };
    }
  };

  const updateUserProfile = (data: { displayName?: string; phone?: string }) => {
    if (!user) return;
    const updated = { ...user };
    if (data.displayName) updated.displayName = sanitizeName(data.displayName);
    setUser(updated);
    secureStorage.set("bp-session", updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signInWithGoogle, logout, resetPassword, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
