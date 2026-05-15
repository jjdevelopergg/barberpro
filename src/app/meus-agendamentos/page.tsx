"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getAppointmentsByUser, cancelAppointment, isUpcoming, getTimeUntilAppointment, Appointment } from "@/lib/appointments";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiTrash2, FiUser, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

export default function MeusAgendamentosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) {
      setAppointments(getAppointmentsByUser(user.uid));
      setLoading(false);
    }
  }, [user, authLoading, router]);

  const handleCancel = (id: string, date: string, time: string) => {
    const aptTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffHours = (aptTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      toast.error("Não é possível cancelar com menos de 1 hora de antecedência.");
      return;
    }

    if (!confirm(`Cancelar este agendamento?\n\nPolítica: Cancelamentos devem ser feitos com pelo menos 1 hora de antecedência.`)) return;

    const success = cancelAppointment(id);
    if (success) {
      setAppointments(getAppointmentsByUser(user!.uid));
      toast.success("Agendamento cancelado.");
    } else {
      toast.error("Não foi possível cancelar. Verifique o horário.");
    }
  };

  if (authLoading || loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "24px", height: "24px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;

  const upcoming = appointments.filter(a => a.status === "confirmado" && isUpcoming(a.date, a.time));
  const past = appointments.filter(a => a.status !== "confirmado" || !isUpcoming(a.date, a.time));

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "40px" }} className="animate-fade-up">
          <span className="section-label">Seus horários</span>
          <h1 className="section-title">Meus <span>agendamentos</span></h1>
        </div>

        {appointments.length === 0 ? (
          <div className="animate-fade-up-delay-1" style={{ textAlign: "center", padding: "80px 0" }}>
            <FiCalendar size={32} color="#222" style={{ margin: "0 auto 16px", display: "block" }} />
            <p style={{ color: "#444", fontSize: "14px" }}>Nenhum agendamento encontrado</p>
            <Link href="/agendar" className="btn-primary" style={{ marginTop: "24px", display: "inline-flex", textDecoration: "none" }}>Agendar agora</Link>
          </div>
        ) : (
          <div>
            {/* Próximos */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ color: "#666", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Próximos</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {upcoming.map((apt, i) => {
                    const timeUntil = getTimeUntilAppointment(apt.date, apt.time);
                    const aptTime = new Date(`${apt.date}T${apt.time}`);
                    const diffHours = (aptTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
                    const canCancel = diffHours >= 1;

                    return (
                      <div key={apt.id} className={`card animate-fade-up-delay-${Math.min(i + 1, 4)}`} style={{ padding: "20px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>{apt.service}</span>
                              <span style={{ backgroundColor: "#1a1a1a", color: "#888", fontSize: "10px", padding: "3px 8px", borderRadius: "4px" }}>{timeUntil}</span>
                            </div>
                            <div style={{ display: "flex", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "12px" }}><FiCalendar size={11} /> {format(new Date(apt.date + "T12:00:00"), "dd/MM/yyyy")} • <span style={{ textTransform: "capitalize" }}>{apt.dayOfWeek}</span></span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "12px" }}><FiClock size={11} /> {apt.time}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "12px" }}><FiUser size={11} /> {apt.barberName}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ color: "#888", fontWeight: 600, fontSize: "13px" }}>{apt.servicePrice}</span>
                            {canCancel ? (
                              <button onClick={() => handleCancel(apt.id, apt.date, apt.time)} style={{ background: "none", border: "1px solid #1a1a1a", color: "#555", cursor: "pointer", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", transition: "all 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#555"; }}>
                                <FiTrash2 size={12} /> Cancelar
                              </button>
                            ) : (
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#666", fontSize: "11px" }}>
                                <FiAlertCircle size={11} /> &lt;1h
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Histórico */}
            {past.length > 0 && (
              <div>
                <h3 style={{ color: "#666", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Histórico</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {past.map((apt) => (
                    <div key={apt.id} className="card" style={{ padding: "16px 24px", opacity: 0.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ color: "#fff", fontWeight: 500, fontSize: "13px" }}>{apt.service}</span>
                          <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                            <span style={{ color: "#444", fontSize: "11px" }}>{format(new Date(apt.date + "T12:00:00"), "dd/MM/yyyy")} • {apt.time}</span>
                          </div>
                        </div>
                        <span style={{ color: apt.status === "cancelado" ? "#ef4444" : "#444", fontSize: "11px", textTransform: "capitalize" }}>
                          {apt.status === "cancelado" ? "Cancelado" : "Concluído"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
