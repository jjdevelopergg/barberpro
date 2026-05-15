"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiTrash2, FiUser } from "react-icons/fi";
import Link from "next/link";

interface Appointment { id: string; service: string; servicePrice: string; barber: string; date: string; time: string; dayOfWeek: string; }

export default function MeusAgendamentosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    const fetch = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Appointment[];
        data.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
        setAppointments(data);
      } catch { toast.error("Erro ao carregar."); }
      finally { setLoading(false); }
    };
    if (user) fetch();
  }, [user, authLoading, router]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancelar este agendamento?")) return;
    try { await deleteDoc(doc(db, "appointments", id)); setAppointments((p) => p.filter((a) => a.id !== id)); toast.success("Cancelado."); }
    catch { toast.error("Erro."); }
  };

  if (authLoading || loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "24px", height: "24px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;

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
            <Link href="/agendar" className="btn-primary" style={{ marginTop: "24px", display: "inline-flex" }}>Agendar agora</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {appointments.map((apt, i) => {
              const upcoming = new Date(`${apt.date}T${apt.time}`) > new Date();
              return (
                <div key={apt.id} className={`card animate-fade-up-delay-${Math.min(i + 1, 4)}`} style={{ padding: "20px 24px", opacity: upcoming ? 1 : 0.4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>{apt.service}</div>
                      <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "11px" }}><FiCalendar size={10} /> {format(new Date(apt.date + "T12:00:00"), "dd/MM/yyyy")}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "11px" }}><FiClock size={10} /> {apt.time}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "11px" }}><FiUser size={10} /> {apt.barber}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "#888", fontWeight: 600, fontSize: "13px" }}>{apt.servicePrice}</span>
                      {upcoming && (
                        <button onClick={() => handleCancel(apt.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", padding: "6px" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}>
                          <FiTrash2 size={14} />
                        </button>
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
