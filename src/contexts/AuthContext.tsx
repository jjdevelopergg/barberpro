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

const DEMO_ACCOUNTS = [
  { email: "admin@barberpro.com", password: "admin123", name: "Administrador" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sessão do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("barberpro-user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("barberpro-user");
      }
    }
    setLoading(false);
  }, []);

  // Salvar sessão quando user muda
  useEffect(() => {
    if (user) {
      localStorage.setItem("barberpro-user", JSON.stringify(user));
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    // Verificar contas registradas no localStorage
    const accounts = JSON.parse(localStorage.getItem("barberpro-accounts") || "[]");
    const allAccounts = [...DEMO_ACCOUNTS, ...accounts];
    
    const account = allAccounts.find(
      (a: { email: string; password: string }) => a.email === email && a.password === password
    );

    if (!account) {
      throw { code: "auth/invalid-credential", message: "Email ou senha incorretos." };
    }

    const userData: UserData = {
      uid: "user-" + email.replace(/[^a-z0-9]/g, ""),
      email: account.email,
      displayName: account.name || email.split("@")[0],
      providerData: [{ providerId: "password" }],
    };

    setUser(userData);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const accounts = JSON.parse(localStorage.getItem("barberpro-accounts") || "[]");
    
    if (accounts.find((a: { email: string }) => a.email === email) || DEMO_ACCOUNTS.find(a => a.email === email)) {
      throw { code: "auth/email-already-in-use" };
    }

    accounts.push({ email, password, name });
    localStorage.setItem("barberpro-accounts", JSON.stringify(accounts));

    const userData: UserData = {
      uid: "user-" + email.replace(/[^a-z0-9]/g, ""),
      email,
      displayName: name,
      providerData: [{ providerId: "password" }],
    };

    setUser(userData);
  };

  const signInWithGoogle = async () => {
    const userData: UserData = {
      uid: "google-user-" + Date.now(),
      email: "usuario@gmail.com",
      displayName: "Usuário Google",
      providerData: [{ providerId: "google.com" }],
    };
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("barberpro-user");
  };

  const resetPassword = async (email: string) => {
    // Simula envio de email
    const accounts = JSON.parse(localStorage.getItem("barberpro-accounts") || "[]");
    const exists = accounts.find((a: { email: string }) => a.email === email) || DEMO_ACCOUNTS.find(a => a.email === email);
    if (!exists) {
      throw { code: "auth/user-not-found" };
    }
  };

  const updateUserProfile = (data: { displayName?: string; phone?: string }) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("barberpro-user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout, resetPassword, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
