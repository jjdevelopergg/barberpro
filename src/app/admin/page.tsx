"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getAllAppointments, cancelAppointment, isUpcoming, Appointment } from "@/lib/appointments";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiUser, FiTrash2, FiFilter } from "react-icons/fi";

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
  }).sort((a, b) => {
    // Ordena por data e horário (próximos primeiro)
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Agrupa por dia
  const groupedByDay: Record<string, typeof filtered> = {};
  filtered.forEach((apt) => {
    if (!groupedByDay[apt.date]) groupedByDay[apt.date] = [];
    groupedByDay[apt.date].push(apt);
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
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {Object.entries(groupedByDay).map(([date, dayAppointments]) => {
              const dateObj = new Date(date + "T12:00:00");
              const isToday = new Date().toDateString() === dateObj.toDateString();
              
              return (
                <div key={date}>
                  {/* Day Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid #111" }}>
                    <span style={{ color: isToday ? "#fff" : "#888", fontSize: "13px", fontWeight: 600 }}>
                      {isToday ? "Hoje" : format(dateObj, "EEEE", { locale: undefined }).charAt(0).toUpperCase() + format(dateObj, "EEEE").slice(1)}
                    </span>
                    <span style={{ color: "#444", fontSize: "12px" }}>{format(dateObj, "dd/MM/yyyy")}</span>
                    <span style={{ backgroundColor: "#1a1a1a", color: "#888", fontSize: "10px", padding: "2px 8px", borderRadius: "4px" }}>{dayAppointments.length} agendamento{dayAppointments.length > 1 ? "s" : ""}</span>
                  </div>

                  {/* Day Appointments */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {dayAppointments.map((apt) => {
                      const upcoming = apt.status === "confirmado" && isUpcoming(apt.date, apt.time);
                      const barber = barberData[apt.barber];

                      return (
                        <div key={apt.id} className="card" style={{ padding: "16px 20px", opacity: apt.status === "cancelado" ? 0.4 : 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                            {/* Time + Client */}
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              <div style={{ minWidth: "50px", textAlign: "center" }}>
                                <div style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>{apt.time}</div>
                              </div>
                              <div style={{ width: "1px", height: "32px", backgroundColor: "#1a1a1a" }} />
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>{apt.userName}</span>
                                  <span style={{ color: "#444", fontSize: "11px" }}>• {apt.service}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                  <span style={{ color: "#555", fontSize: "11px" }}>{apt.userEmail}</span>
                                  {barber && (
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                      <img src={barber.image} alt="" style={{ width: "14px", height: "14px", borderRadius: "50%", objectFit: "cover" }} />
                                      <span style={{ color: "#666", fontSize: "10px" }}>{barber.name}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Price + Actions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ color: "#888", fontWeight: 600, fontSize: "13px" }}>{apt.servicePrice}</span>
                              {apt.status === "cancelado" ? (
                                <span style={{ color: "#ef4444", fontSize: "10px", fontWeight: 500, padding: "3px 8px", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: "4px" }}>Cancelado</span>
                              ) : upcoming ? (
                                <button onClick={() => handleCancel(apt.id)} style={{ background: "none", border: "1px solid #1a1a1a", color: "#555", cursor: "pointer", padding: "4px 8px", borderRadius: "5px", display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", transition: "all 0.2s" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#555"; }}>
                                  <FiTrash2 size={10} />
                                </button>
                              ) : (
                                <span style={{ color: "#444", fontSize: "10px", padding: "3px 8px", backgroundColor: "#111", borderRadius: "4px" }}>✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
