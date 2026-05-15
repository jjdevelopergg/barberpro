"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from "react-icons/fi";

function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(apiKey && apiKey !== "your_api_key_here" && apiKey.length > 10);
}

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    const fetch = async () => {
      if (!user) return;
      setName(user.displayName || "");
      if (!isFirebaseConfigured()) return;
      try {
        const d = await getDoc(doc(db, "users", user.uid));
        if (d.exists()) setPhone(d.data().phone || "");
      } catch { /* Firebase not configured */ }
    };
    if (user) fetch();
  }, [user, authLoading, router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (isFirebaseConfigured()) {
        await updateProfile(user, { displayName: name });
        await updateDoc(doc(db, "users", user.uid), { name, phone });
      }
      toast.success("Salvo!");
    } catch { toast.error("Erro."); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    if (newPassword !== confirmNewPassword) { toast.error("Senhas não coincidem."); return; }
    if (newPassword.length < 6) { toast.error("Mínimo 6 caracteres."); return; }
    setChangingPassword(true);
    try {
      if (isFirebaseConfigured()) {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
        await updatePassword(user, newPassword);
      }
      toast.success("Senha alterada!"); setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch { toast.error("Senha atual incorreta."); }
    finally { setChangingPassword(false); }
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
            <h2 style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><FiLock size={14} color="#666" /> Alterar senha</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div><label style={{ display: "block", color: "#555", fontSize: "12px", marginBottom: "6px" }}>Senha atual</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="input-field" /></div>
              <div><label style={{ display: "block", color: "#555", fontSize: "12px", marginBottom: "6px" }}>Nova senha</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="input-field" /></div>
              <div><label style={{ display: "block", color: "#555", fontSize: "12px", marginBottom: "6px" }}>Confirmar</label><input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Repita" className="input-field" /></div>
              <button onClick={handleChangePassword} disabled={changingPassword || !currentPassword || !newPassword} className="btn-secondary" style={{ alignSelf: "flex-start" }}><FiLock size={13} /> {changingPassword ? "Alterando..." : "Alterar"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
