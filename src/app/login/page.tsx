"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Login realizado!");
      router.push("/agendar");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/demo-mode") {
        toast.error(err.message || "Use a conta demo.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        toast.error("Email ou senha incorretos.");
      } else {
        toast.error("Erro ao fazer login. Verifique suas credenciais.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Login realizado!");
      router.push("/agendar");
    } catch {
      toast.error("Erro ao conectar com Google.");
    }
  };

  const fillDemo = () => {
    setEmail("admin@barberpro.com");
    setPassword("admin123");
    toast.success("Credenciais demo preenchidas!");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 60px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }} className="animate-fade-up">
        <div className="card" style={{ padding: "44px 36px" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Entrar</h1>
            <p style={{ color: "#555", fontSize: "13px", marginTop: "6px" }}>Acesse sua conta para agendar</p>
          </div>

          {/* Demo notice */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "14px 16px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <FiInfo size={14} color="#666" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>
                Conta demo disponível para teste:
              </p>
              <p style={{ color: "#fff", fontSize: "12px", marginTop: "4px", fontFamily: "monospace" }}>
                admin@barberpro.com / admin123
              </p>
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignIn} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff", padding: "13px", borderRadius: "10px", fontSize: "13px", cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}>
            <FcGoogle size={18} /> Continuar com Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#111" }} />
            <span style={{ color: "#333", fontSize: "11px" }}>ou</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#111" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>Email</label>
              <div style={{ position: "relative" }}>
                <FiMail size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="input-field input-with-icon" />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>Senha</label>
              <div style={{ position: "relative" }}>
                <FiLock size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="input-field input-with-icon" style={{ paddingRight: "42px" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#444", cursor: "pointer" }}>
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <button type="button" onClick={fillDemo} style={{ background: "none", border: "1px solid #1a1a1a", color: "#888", fontSize: "11px", cursor: "pointer", padding: "6px 12px", borderRadius: "6px", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#888"; }}>
                Usar demo
              </button>
              <Link href="/recuperar-senha" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#444", fontSize: "13px", marginTop: "28px" }}>
            Não tem conta?{" "}
            <Link href="/cadastro" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
