"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/servicos", label: "Serviços" },
    { href: "/sobre", label: "Sobre" },
    { href: "/agendar", label: "Agendar" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <nav className="glass-nav">
      {/* Banner de demonstração */}
      <div style={{ backgroundColor: "#111", borderBottom: "1px solid #1a1a1a", padding: "10px 24px", textAlign: "center" }}>
        <p style={{ color: "#999", fontSize: "12px", lineHeight: "1.5" }}>
          Este projeto é apenas para <strong style={{ color: "#fff" }}>demonstração e portfólio</strong> — sem valor comercial. Deseja um site assim para seu estabelecimento?{" "}
          <a href="https://github.com/jjdevelopergg" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>Entre em contato</a>
        </p>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#fff", fontWeight: 300, fontSize: "14px", letterSpacing: "2px" }}></span>
          </Link>

          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: "#888", fontSize: "13px", fontWeight: 400, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                  <div style={{ width: "32px", height: "32px", backgroundColor: "#1a1a1a", border: "1px solid #222", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FiUser size={13} color="#fff" />
                  </div>
                </button>
                {showUserMenu && (
                  <div style={{ position: "absolute", right: 0, marginTop: "8px", width: "200px", backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
                    <Link href="/meus-agendamentos" onClick={() => setShowUserMenu(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", fontSize: "13px", color: "#999", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <FiCalendar size={14} /> Meus Agendamentos
                    </Link>
                    <Link href="/perfil" onClick={() => setShowUserMenu(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", fontSize: "13px", color: "#999", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <FiUser size={14} /> Perfil
                    </Link>
                    <button onClick={() => { logout(); setShowUserMenu(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "14px 16px", fontSize: "13px", color: "#999", background: "none", border: "none", borderTop: "1px solid #1a1a1a", cursor: "pointer", textAlign: "left" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <FiLogOut size={14} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                  Entrar
                </Link>
                <Link href="/agendar" className="btn-primary" style={{ padding: "10px 20px", fontSize: "12px", textDecoration: "none" }}>
                  Agendar
                </Link>
              </>
            )}
          </div>

          <button className="hidden-desktop" onClick={() => setIsOpen(!isOpen)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "8px" }}>
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="hidden-desktop" style={{ backgroundColor: "#000", borderTop: "1px solid #111", padding: "24px" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} style={{ display: "block", color: "#888", fontSize: "14px", padding: "12px 0", textDecoration: "none", borderBottom: "1px solid #0a0a0a" }}>
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #111" }}>
            {user ? (
              <button onClick={() => { logout(); setIsOpen(false); }} style={{ color: "#666", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}>Sair</button>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>Entrar</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
