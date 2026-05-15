"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#000", borderTop: "1px solid #0a0a0a", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }} className="grid-responsive">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", backgroundColor: "#fff", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#000", fontWeight: 900, fontSize: "11px" }}>BP</span>
              </div>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>BarberPro</span>
            </div>
            <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.7", maxWidth: "300px" }}>
              Sistema de agendamento online para barbearias. Design premium, experiência simplificada.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: "#666", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Navegação</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[{ href: "/", label: "Início" }, { href: "/servicos", label: "Serviços" }, { href: "/agendar", label: "Agendar" }, { href: "/contato", label: "Contato" }].map((l) => (
                <Link key={l.href} href={l.href} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ color: "#666", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Conta Demo</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ color: "#555", fontSize: "12px" }}>Email: admin@barberpro.com</p>
              <p style={{ color: "#555", fontSize: "12px" }}>Senha: admin123</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #0a0a0a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#333", fontSize: "12px" }}>© BarberPro. Projeto de demonstração.</p>
          <p style={{ color: "#333", fontSize: "12px" }}>Next.js • Firebase • TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
