"use client";

import Link from "next/link";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

export default function Home() {
  const services = [
    { title: "Corte", description: "Técnicas modernas e clássicas", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80" },
    { title: "Barba", description: "Modelagem e alinhamento", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80" },
    { title: "Tratamento", description: "Hidratação e cuidados", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1585747860036-4cb4e2e43a35?w=1920&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)" }} />
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "140px 24px 100px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="animate-fade-up">
              <p style={{ color: "#555", fontSize: "12px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "24px" }}>
                Agendamento Online
              </p>
            </div>

            <h1 className="animate-fade-up-delay-1" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-3px", color: "#fff" }}>
              Seu horário,<br />
              <span style={{ color: "#666", fontWeight: 300, fontStyle: "italic" }}>sua escolha</span>
            </h1>

            <p className="animate-fade-up-delay-2" style={{ color: "#555", marginTop: "28px", fontSize: "15px", lineHeight: "1.8", maxWidth: "480px" }}>
              Escolha o serviço, profissional, data e horário. Tudo em poucos cliques, sem filas e sem espera.
            </p>

            <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: "12px", marginTop: "40px", flexWrap: "wrap" }}>
              <Link href="/agendar" className="btn-primary" style={{ textDecoration: "none" }}>
                Agendar agora <FiArrowRight size={14} />
              </Link>
              <Link href="/servicos" className="btn-secondary" style={{ textDecoration: "none" }}>
                Ver serviços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section style={{ padding: "120px 24px", backgroundColor: "#000" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="animate-fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
            <div>
              <span className="section-label">Serviços</span>
              <h2 className="section-title">O que oferecemos</h2>
            </div>
            <Link href="/servicos" style={{ color: "#666", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}>
              Ver todos <FiArrowUpRight size={13} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="grid-responsive">
            {services.map((service, i) => (
              <div key={i} className={`img-hover animate-fade-up-delay-${i + 1}`} style={{ position: "relative", height: "400px", borderRadius: "16px", overflow: "hidden" }}>
                <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: "24px", left: "24px" }}>
                  <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>{service.title}</h3>
                  <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "120px 24px", borderTop: "1px solid #0a0a0a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span className="section-label">Como funciona</span>
            <h2 className="section-title">Simples e <span>rápido</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: "#111", borderRadius: "16px", overflow: "hidden" }} className="grid-responsive-2">
            {[
              { step: "01", title: "Escolha o serviço", desc: "Selecione entre corte, barba, tratamentos e combos" },
              { step: "02", title: "Profissional", desc: "Escolha o profissional de sua preferência" },
              { step: "03", title: "Data e horário", desc: "Veja a disponibilidade em tempo real" },
              { step: "04", title: "Confirmação", desc: "Receba a confirmação instantaneamente" },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: "#000", padding: "40px 28px" }}>
                <span style={{ color: "#222", fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>{item.step}</span>
                <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.3px" }}>{item.title}</h3>
                <p style={{ color: "#555", fontSize: "13px", marginTop: "8px", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 24px", borderTop: "1px solid #0a0a0a" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
            Pronto para agendar?
          </h2>
          <p style={{ color: "#555", marginTop: "16px", fontSize: "14px", lineHeight: "1.7" }}>
            Crie sua conta e agende seu próximo horário em segundos.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
            <Link href="/agendar" className="btn-primary" style={{ textDecoration: "none" }}>
              Começar agora <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
