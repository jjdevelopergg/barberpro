"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend, FiMapPin } from "react-icons/fi";

export default function ContatoPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Mensagem enviada com sucesso!");
    setFormData({ name: "", email: "", message: "" });
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "64px" }} className="animate-fade-up">
          <span className="section-label">Contato</span>
          <h1 className="section-title">Fale <span>conosco</span></h1>
          <p style={{ color: "#555", marginTop: "12px", fontSize: "14px", lineHeight: "1.7", maxWidth: "400px" }}>
            Envie uma mensagem ou visite nossa localização no mapa abaixo.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="grid-responsive">
          {/* Form */}
          <form onSubmit={handleSubmit} className="card animate-fade-up-delay-1" style={{ padding: "40px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>Nome</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Seu nome" required className="input-field" />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" required className="input-field" />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>Mensagem</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Sua mensagem..." required rows={5} className="input-field" style={{ resize: "none" }} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <FiSend size={14} /> {loading ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>

          {/* Map */}
          <div className="animate-fade-up-delay-2" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", backgroundColor: "#111", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FiMapPin size={14} color="#888" />
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>Localização</p>
                <p style={{ color: "#555", fontSize: "12px", marginTop: "2px" }}>Visualize no mapa abaixo</p>
              </div>
            </div>

            <div className="card" style={{ overflow: "hidden", flex: 1, minHeight: "380px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975870299827!2d-46.65342708502156!3d-23.56507298468041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px", borderRadius: "16px", filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização no mapa"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
