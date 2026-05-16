"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getAllAppointments, cancelAppointment, isUpcoming, Appointment } from "@/lib/appointments";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiUser, FiTrash2, FiMail, FiFilter } from "react-icons/fi";

const barberData: Record<string, { name: string; image: string }> = {
  "profissional-1": { name: "Carlos Silva", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face" },
  "profissional-2": { name: "Rafael Santos", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80&fit=crop&crop=face" },
  "profissional-3": { name: "Lucas Oliveira", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=face" },
  "profissional-4": { name: "Pedro Costa", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&fit=crop&crop=face" },
};

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<"todos" | "proximos" | "cancelados">("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setAppointments(getAllAppointments());
    }
  }, [user, loading, router]);

  const handleCancel = (id: string) => {
    if (!confirm("Cancelar este agendamento?")) return;
    cancelAppointment(id);
    setAppointments(getAllAppointments());
    toast.success("Agendamento cancelado.");
  };

  const filtered = appointments.filter((apt) => {
    if (filter === "proximos") return apt.status === "confirmado" && isUpcoming(apt.date, apt.time);
    if (filter === "cancelados") return apt.status === "cancelado";
    return true;
  }).filter((apt) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return apt.userName.toLowerCase().includes(s) || apt.userEmail.toLowerCase().includes(s) || apt.service.toLowerCase().includes(s);
  });

  const stats = {
    total: appointments.length,
    proximos: appointments.filter(a => a.status === "confirmado" && isUpcoming(a.date, a.time)).length,
    cancelados: appointments.filter(a => a.status === "cancelado").length,
    hoje: appointments.filter(a => a.date === format(new Date(), "yyyy-MM-dd") && a.status === "confirmado").length,
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "24px", height: "24px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;
  if (!user) return null;

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }} className="animate-fade-up">
          <span className="section-label">Administração</span>
          <h1 className="section-title">Painel <span>admin</span></h1>
          <p style={{ color: "#666", fontSize: "13px", marginTop: "8px" }}>Gerencie todos os agendamentos dos clientes.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }} className="grid-responsive-2 animate-fade-up-delay-1">
          {[
            { label: "Total", value: stats.total },
            { label: "Próximos", value: stats.proximos },
            { label: "Hoje", value: stats.hoje },
            { label: "Cancelados", value: stats.cancelados },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: "24px", fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: "#666", fontSize: "11px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }} className="animate-fade-up-delay-2">
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <FiFilter size={13} color="#666" />
            {(["todos", "proximos", "cancelados"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, cursor: "pointer", backgroundColor: filter === f ? "#fff" : "#0a0a0a", color: filter === f ? "#000" : "#888", border: filter === f ? "none" : "1px solid #1a1a1a", textTransform: "capitalize", transition: "all 0.2s" }}>
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou serviço..."
            className="input-field"
            style={{ maxWidth: "300px", padding: "8px 14px", fontSize: "12px" }}
          />
        </div>

        {/* Appointments List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#444", fontSize: "14px" }}>Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map((apt, i) => {
              const upcoming = apt.status === "confirmado" && isUpcoming(apt.date, apt.time);
              const barber = barberData[apt.barber];

              return (
                <div key={apt.id} className={`card animate-fade-up-delay-${Math.min(i + 1, 4)}`} style={{ padding: "20px 24px", opacity: apt.status === "cancelado" ? 0.5 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                    {/* Client Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ width: "32px", height: "32px", backgroundColor: "#111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1a1a1a" }}>
                          <FiUser size={13} color="#888" />
                        </div>
                        <div>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{apt.userName}</div>
                          <div style={{ color: "#555", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}><FiMail size={10} /> {apt.userEmail}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "10px" }}>
                        <span style={{ color: "#ccc", fontSize: "12px", fontWeight: 500 }}>{apt.service}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#666", fontSize: "11px" }}><FiCalendar size={10} /> {format(new Date(apt.date + "T12:00:00"), "dd/MM/yyyy")} • <span style={{ textTransform: "capitalize" }}>{apt.dayOfWeek}</span></span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#666", fontSize: "11px" }}><FiClock size={10} /> {apt.time}</span>
                      </div>

                      {barber && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                          <img src={barber.image} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />
                          <span style={{ color: "#888", fontSize: "11px" }}>{barber.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <span style={{ color: "#888", fontWeight: 600, fontSize: "14px" }}>{apt.servicePrice}</span>
                      {apt.status === "cancelado" ? (
                        <span style={{ color: "#ef4444", fontSize: "10px", fontWeight: 500, padding: "3px 8px", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: "4px" }}>Cancelado</span>
                      ) : upcoming ? (
                        <button onClick={() => handleCancel(apt.id)} style={{ background: "none", border: "1px solid #1a1a1a", color: "#555", cursor: "pointer", padding: "5px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#555"; }}>
                          <FiTrash2 size={11} /> Cancelar
                        </button>
                      ) : (
                        <span style={{ color: "#444", fontSize: "10px", padding: "3px 8px", backgroundColor: "#111", borderRadius: "4px" }}>Concluído</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
