"use client";

export default function SobrePage() {
  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", marginBottom: "120px" }} className="grid-responsive">
          <div className="animate-fade-up">
            <span className="section-label">Sobre o projeto</span>
            <h1 className="section-title" style={{ marginTop: "12px" }}>
              Design <span>premium</span>
            </h1>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.8" }}>
                Este é um sistema completo de agendamento para barbearias, desenvolvido com as melhores tecnologias do mercado.
              </p>
              <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.8" }}>
                O projeto demonstra um fluxo completo de autenticação, agendamento em tempo real, gerenciamento de horários e interface responsiva com design minimalista.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                {[
                  { label: "Framework", value: "Next.js 16" },
                  { label: "Auth", value: "Firebase" },
                  { label: "Database", value: "Firestore" },
                  { label: "Styling", value: "CSS Custom" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "16px", backgroundColor: "#0a0a0a", border: "1px solid #111", borderRadius: "10px" }}>
                    <div style={{ color: "#444", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fade-up-delay-2">
            <div className="img-hover" style={{ borderRadius: "16px", overflow: "hidden", height: "500px" }}>
              <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80" alt="Barbearia" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ borderTop: "1px solid #0a0a0a", paddingTop: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span className="section-label">Recursos</span>
            <h2 className="section-title">Funcionalidades <span>implementadas</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: "#111", borderRadius: "16px", overflow: "hidden" }} className="grid-responsive">
            {[
              { title: "Autenticação completa", desc: "Login com email/senha e Google OAuth. Recuperação de senha por email." },
              { title: "Agendamento em etapas", desc: "Fluxo intuitivo: serviço → profissional → data/hora → confirmação." },
              { title: "Gestão de horários", desc: "Visualização de agendamentos, cancelamento e histórico completo." },
              { title: "Design responsivo", desc: "Interface adaptável para desktop, tablet e mobile." },
              { title: "Tempo real", desc: "Verificação de disponibilidade em tempo real via Firestore." },
              { title: "Perfil do usuário", desc: "Edição de dados pessoais e alteração de senha." },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: "#000", padding: "36px 28px" }}>
                <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, letterSpacing: "-0.3px" }}>{item.title}</h3>
                <p style={{ color: "#555", fontSize: "12px", marginTop: "8px", lineHeight: "1.7" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
