"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function ServicosPage() {
  const services = [
    { title: "Corte de Cabelo", description: "Cortes modernos e clássicos com acabamento perfeito", price: "R$ 45", duration: "30 min", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80" },
    { title: "Barba", description: "Modelagem com navalha e toalha quente", price: "R$ 30", duration: "20 min", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80" },
    { title: "Corte + Barba", description: "Combo completo em uma única sessão", price: "R$ 65", duration: "50 min", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
    { title: "Degradê", description: "Transição suave com acabamento impecável", price: "R$ 55", duration: "40 min", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80" },
    { title: "Pigmentação", description: "Preenchimento capilar profissional", price: "R$ 80", duration: "45 min", image: "https://images.unsplash.com/photo-1634302086887-13b95f4d07e3?w=400&q=80" },
    { title: "Hidratação", description: "Tratamento profundo para cabelos", price: "R$ 50", duration: "30 min", image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&q=80" },
  ];

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "64px" }} className="animate-fade-up">
          <span className="section-label">Catálogo</span>
          <h1 className="section-title">Nossos <span>serviços</span></h1>
          <p style={{ color: "#555", marginTop: "12px", fontSize: "14px", maxWidth: "400px" }}>
            Cada serviço executado com excelência e produtos de alta qualidade.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="grid-responsive-2">
          {services.map((service, i) => (
            <div key={i} className={`card animate-fade-up-delay-${Math.min(i + 1, 4)}`} style={{ overflow: "hidden" }}>
              <div className="img-hover" style={{ height: "200px", borderRadius: "16px 16px 0 0" }}>
                <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "15px", letterSpacing: "-0.3px" }}>{service.title}</h3>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{service.price}</span>
                </div>
                <p style={{ color: "#555", fontSize: "12px", marginTop: "6px", lineHeight: "1.5" }}>{service.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #111" }}>
                  <span style={{ color: "#333", fontSize: "11px" }}>{service.duration}</span>
                  <Link href="/agendar" style={{ color: "#888", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                    Agendar <FiArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
