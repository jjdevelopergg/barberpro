"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await resetPassword(email); setSent(true); toast.success("Email enviado!"); }
    catch { toast.error("Erro ao enviar."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 60px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }} className="animate-fade-up">
        <div className="card" style={{ padding: "44px 36px" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <FiCheck size={20} color="#fff" />
              </div>
              <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>Email enviado</h1>
              <p style={{ color: "#555", fontSize: "13px", marginTop: "8px", lineHeight: "1.6" }}>
                Link de recuperação enviado para <strong style={{ color: "#fff" }}>{email}</strong>
              </p>
              <div style={{ marginTop: "28px" }}>
                <button onClick={() => setSent(false)} style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff", padding: "13px", borderRadius: "10px", fontSize: "13px", cursor: "pointer", marginBottom: "12px" }}>Enviar novamente</button>
                <Link href="/login" style={{ display: "block", textAlign: "center", color: "#666", fontSize: "13px", textDecoration: "none" }}>Voltar ao login</Link>
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "36px" }}>
                <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Recuperar senha</h1>
                <p style={{ color: "#555", fontSize: "13px", marginTop: "6px" }}>Enviaremos um link para redefinição</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", color: "#666", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>Email</label>
                  <div style={{ position: "relative" }}>
                    <FiMail size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="input-field input-with-icon" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  {loading ? "Enviando..." : "Enviar link"}
                </button>
              </form>
              <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#555", fontSize: "13px", textDecoration: "none", marginTop: "28px" }}>
                <FiArrowLeft size={13} /> Voltar ao login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
