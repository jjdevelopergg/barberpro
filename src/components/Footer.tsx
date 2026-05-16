"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#000", borderTop: "1px solid #0a0a0a", padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
          <div>
            <div style={{ marginBottom: "12px" }}></div>
            <p style={{ color: "#333", fontSize: "12px", maxWidth: "280px", lineHeight: "1.6" }}>
              Sistema de agendamento online para barbearias.
            </p>
          </div>

          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <h4 style={{ color: "#444", fontSize: "11px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Navegação</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[{ href: "/", label: "Início" }, { href: "/servicos", label: "Serviços" }, { href: "/agendar", label: "Agendar" }, { href: "/contato", label: "Contato" }].map((l) => (
                  <Link key={l.href} href={l.href} style={{ color: "#444", fontSize: "12px", textDecoration: "none" }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ color: "#444", fontSize: "11px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Conta</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link href="/login" style={{ color: "#444", fontSize: "12px", textDecoration: "none" }}>Entrar</Link>
                <Link href="/cadastro" style={{ color: "#444", fontSize: "12px", textDecoration: "none" }}>Criar conta</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #0a0a0a" }}>
          <p style={{ color: "#222", fontSize: "11px" }}>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
