"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#050505", borderTop: "1px solid #1a1a1a", padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
          <div>
            <p style={{ color: "#888", fontSize: "13px", maxWidth: "280px", lineHeight: "1.6" }}>
              Sistema de agendamento online para barbearias.
            </p>
          </div>

          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <h4 style={{ color: "#aaa", fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>Navegação</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[{ href: "/", label: "Início" }, { href: "/servicos", label: "Serviços" }, { href: "/agendar", label: "Agendar" }, { href: "/contato", label: "Contato" }].map((l) => (
                  <Link key={l.href} href={l.href} style={{ color: "#777", fontSize: "13px", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ color: "#aaa", fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>Conta</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/login" style={{ color: "#777", fontSize: "13px", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}>
                  Entrar
                </Link>
                <Link href="/cadastro" style={{ color: "#777", fontSize: "13px", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}>
                  Criar conta
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #1a1a1a" }}>
          <p style={{ color: "#666", fontSize: "12px" }}>© João Pedro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
