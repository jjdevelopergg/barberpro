"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Conta demo para quando Firebase não está configurado
const DEMO_USER = {
  uid: "demo-user-001",
  email: "admin@barberpro.com",
  displayName: "Admin Demo",
  providerData: [{ providerId: "password" }],
} as unknown as User;

const DEMO_PASSWORD = "admin123";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Verifica se Firebase está configurado com credenciais reais
function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(apiKey && apiKey !== "your_api_key_here" && apiKey.length > 10);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    // Verifica se há sessão demo salva no localStorage
    if (!firebaseReady) {
      const savedDemo = typeof window !== "undefined" && localStorage.getItem("demo-session");
      if (savedDemo) {
        setUser(DEMO_USER);
        setIsDemo(true);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseReady]);

  const signIn = async (email: string, password: string) => {
    // Modo demo: aceita credenciais demo sem Firebase
    if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
      if (!firebaseReady) {
        setUser(DEMO_USER);
        setIsDemo(true);
        localStorage.setItem("demo-session", "true");
        return;
      }
    }

    if (!firebaseReady) {
      // Se Firebase não está configurado e não é conta demo
      if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
        setUser(DEMO_USER);
        setIsDemo(true);
        localStorage.setItem("demo-session", "true");
        return;
      }
      throw { code: "auth/demo-mode", message: "Use a conta demo: admin@barberpro.com / admin123" };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // Se Firebase falhar com a conta demo, usa modo demo
      if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
        setUser(DEMO_USER);
        setIsDemo(true);
        localStorage.setItem("demo-session", "true");
        return;
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!firebaseReady) {
      // Modo demo: simula criação de conta
      const demoNewUser = {
        ...DEMO_USER,
        email,
        displayName: name,
        uid: "demo-" + Date.now(),
      } as unknown as User;
      setUser(demoNewUser);
      setIsDemo(true);
      localStorage.setItem("demo-session", "true");
      return;
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    try {
      await setDoc(doc(db, "users", result.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        phone: "",
      });
    } catch {
      // Firestore pode não estar configurado
    }
  };

  const signInWithGoogle = async () => {
    if (!firebaseReady) {
      // Modo demo: simula login Google
      const googleDemoUser = {
        ...DEMO_USER,
        displayName: "Usuário Google",
        email: "usuario@gmail.com",
        uid: "demo-google-" + Date.now(),
      } as unknown as User;
      setUser(googleDemoUser);
      setIsDemo(true);
      localStorage.setItem("demo-session", "true");
      return;
    }

    const result = await signInWithPopup(auth, googleProvider);
    try {
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          createdAt: new Date().toISOString(),
          phone: "",
        });
      }
    } catch {
      // Firestore pode não estar configurado
    }
  };

  const logout = async () => {
    if (isDemo) {
      setUser(null);
      setIsDemo(false);
      localStorage.removeItem("demo-session");
      return;
    }
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!firebaseReady) {
      // Simula envio em modo demo
      return;
    }
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
