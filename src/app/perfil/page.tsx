"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from "react-icons/fi";

export default function PerfilPage() {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) {
      setName(user.displayName || "");
      const savedPhone = localStorage.getItem(`barberpro-phone-${user.uid}`);
      if (savedPhone) setPhone(savedPhone);
    }
  }, [user, authLoading, router]);

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    updateUserProfile({ displayName: name });
    localStorage.setItem(`barberpro-phone-${user.uid}`, phone);
    setTimeout(() => {
      toast.success("Perfil atualizado!");
      setSaving(false);
    }, 500);
  };

  const handleChangePassword = () => {
    toast.success("Funcionalidade disponível com Firebase configurado.");
  };

  if (authLoading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "24px", height: "24px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;
  if (!user) return null;

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "40px" }} className="animate-fade-up">
          <span className="section-label">Conta</span>
          <h1 className="section-title">Meu <span>perfil</span></h1>
        </div>

        <div className="card animate-fade-up-delay-1" style={{ padding: "32px", marginBottom: "12px" }}>
          <h2 style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><FiUser size={14} color="#666" /> Informações</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "#555", fontSize: "12px", marginBottom: "6px" }}>Nome</label>
              <div style={{ position: "relative" }}><FiUser size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444" }} /><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field input-with-icon" /></div>
            </div>
            <div>
              <label style={{ display: "block", color: "#555", fontSize: "12px", marginBottom: "6px" }}>Email</label>
              <div style={{ position: "relative" }}><FiMail size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444" }} /><input type="email" value={user.email || ""} disabled className="input-field input-with-icon" style={{ opacity: 0.4 }} /></div>
            </div>
            <div>
              <label style={{ display: "block", color: "#555", fontSize: "12px", marginBottom: "6px" }}>Telefone</label>
              <div style={{ position: "relative" }}><FiPhone size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444" }} /><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="input-field input-with-icon" /></div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ alignSelf: "flex-start" }}><FiSave size={13} /> {saving ? "Salvando..." : "Salvar"}</button>
          </div>
        </div>

        {user.providerData[0]?.providerId === "password" && (
          <div className="card animate-fade-up-delay-2" style={{ padding: "32px" }}>
            <h2 style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><FiLock size={14} color="#666" /> Segurança</h2>
            <p style={{ color: "#555", fontSize: "13px", marginBottom: "16px" }}>Para alterar a senha, configure o Firebase Authentication.</p>
            <button onClick={handleChangePassword} className="btn-secondary" style={{ alignSelf: "flex-start" }}><FiLock size={13} /> Alterar senha</button>
          </div>
        )}
      </div>
    </div>
  );
}
