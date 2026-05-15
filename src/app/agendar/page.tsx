"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createAppointment, getBookedSlots } from "@/lib/appointments";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiCheck, FiArrowRight, FiArrowLeft, FiUser } from "react-icons/fi";

const services = [
  { id: "corte", name: "Corte de Cabelo", duration: "30 min", price: "R$ 45" },
  { id: "barba", name: "Barba", duration: "20 min", price: "R$ 30" },
  { id: "corte-barba", name: "Corte + Barba", duration: "50 min", price: "R$ 65" },
  { id: "degrade", name: "Degradê", duration: "40 min", price: "R$ 55" },
  { id: "pigmentacao", name: "Pigmentação", duration: "45 min", price: "R$ 80" },
  { id: "hidratacao", name: "Hidratação", duration: "30 min", price: "R$ 50" },
  { id: "sobrancelha", name: "Sobrancelha", duration: "15 min", price: "R$ 25" },
  { id: "combo-vip", name: "Combo VIP", duration: "1h 20min", price: "R$ 120" },
];

const barbers = [
  { id: "profissional-1", name: "Profissional 1", specialty: "Cortes Modernos" },
  { id: "profissional-2", name: "Profissional 2", specialty: "Barba & Pigmentação" },
  { id: "profissional-3", name: "Profissional 3", specialty: "Cortes Clássicos" },
  { id: "profissional-4", name: "Profissional 4", specialty: "Tratamentos" },
];

const timeSlots = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"];

export default function AgendarPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)).filter((d) => d.getDay() !== 0);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Faça login para agendar.");
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setBookedSlots(getBookedSlots(dateStr, selectedBarber));
    }
  }, [selectedDate, selectedBarber]);

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedBarber || !selectedDate || !selectedTime) return;
    setSubmitting(true);

    try {
      createAppointment({
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        service: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.duration,
        barber: selectedBarber,
        barberName: barbers.find((b) => b.id === selectedBarber)?.name || selectedBarber,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        dayOfWeek: format(selectedDate, "EEEE", { locale: ptBR }),
      });
      toast.success("Agendamento confirmado!");
      router.push("/meus-agendamentos");
    } catch {
      toast.error("Erro ao agendar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "24px", height: "24px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;
  if (!user) return null;

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "40px" }} className="animate-fade-up">
          <span className="section-label">Agendamento</span>
          <h1 className="section-title">Escolha seu <span>horário</span></h1>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "48px" }} className="animate-fade-up-delay-1">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, backgroundColor: step >= s ? "#fff" : "transparent", color: step >= s ? "#000" : "#333", border: step >= s ? "none" : "1px solid #222", transition: "all 0.3s" }}>
                {step > s ? <FiCheck size={13} /> : s}
              </div>
              {s < 4 && <div style={{ width: "40px", height: "1px", backgroundColor: step > s ? "#fff" : "#1a1a1a", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#444" }}>01</span> Serviço
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="grid-responsive-2">
              {services.map((s) => (
                <button key={s.id} onClick={() => setSelectedService(s)} style={{ padding: "18px", textAlign: "left", cursor: "pointer", backgroundColor: "#0a0a0a", border: selectedService?.id === s.id ? "1px solid #fff" : "1px solid #1a1a1a", borderRadius: "12px", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 500, fontSize: "13px" }}>{s.name}</div>
                      <div style={{ color: "#444", fontSize: "11px", marginTop: "4px" }}>{s.duration}</div>
                    </div>
                    <span style={{ color: "#888", fontWeight: 600, fontSize: "13px" }}>{s.price}</span>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "28px" }}>
              <button onClick={() => selectedService && setStep(2)} disabled={!selectedService} className="btn-primary">Próximo <FiArrowRight size={13} /></button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#444" }}>02</span> Profissional
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="grid-responsive-2">
              {barbers.map((b) => (
                <button key={b.id} onClick={() => setSelectedBarber(b.id)} style={{ padding: "18px", textAlign: "left", cursor: "pointer", backgroundColor: "#0a0a0a", border: selectedBarber === b.id ? "1px solid #fff" : "1px solid #1a1a1a", borderRadius: "12px", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: "#111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1a1a1a" }}>
                      <FiUser size={13} color="#666" />
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 500, fontSize: "13px" }}>{b.name}</div>
                      <div style={{ color: "#444", fontSize: "11px" }}>{b.specialty}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
              <button onClick={() => setStep(1)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "13px" }}><FiArrowLeft size={13} /> Voltar</button>
              <button onClick={() => selectedBarber && setStep(3)} disabled={!selectedBarber} className="btn-primary">Próximo <FiArrowRight size={13} /></button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#444" }}>03</span> Data e horário
            </h2>

            <p style={{ color: "#444", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Dia</p>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "12px" }}>
              {availableDates.map((date) => (
                <button key={date.toISOString()} onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                  style={{ flexShrink: 0, width: "64px", padding: "14px 0", borderRadius: "10px", textAlign: "center", cursor: "pointer", backgroundColor: "#0a0a0a", border: selectedDate?.toDateString() === date.toDateString() ? "1px solid #fff" : "1px solid #1a1a1a", transition: "all 0.2s" }}>
                  <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase" }}>{format(date, "EEE", { locale: ptBR })}</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>{format(date, "dd")}</div>
                  <div style={{ fontSize: "10px", color: "#333" }}>{format(date, "MMM", { locale: ptBR })}</div>
                </button>
              ))}
            </div>

            {selectedDate && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ color: "#444", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}><FiClock size={11} /> Horário</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }} className="grid-responsive-2">
                  {timeSlots.map((time) => {
                    const booked = bookedSlots.includes(time);
                    return (
                      <button key={time} onClick={() => !booked && setSelectedTime(time)} disabled={booked}
                        style={{ padding: "11px 0", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: booked ? "not-allowed" : "pointer", textDecoration: booked ? "line-through" : "none", backgroundColor: "#0a0a0a", border: selectedTime === time ? "1px solid #fff" : "1px solid #1a1a1a", color: booked ? "#222" : selectedTime === time ? "#fff" : "#666", transition: "all 0.2s" }}>
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
              <button onClick={() => setStep(2)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "13px" }}><FiArrowLeft size={13} /> Voltar</button>
              <button onClick={() => selectedDate && selectedTime && setStep(4)} disabled={!selectedDate || !selectedTime} className="btn-primary">Próximo <FiArrowRight size={13} /></button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#444" }}>04</span> Confirmação
            </h2>

            <div className="card" style={{ padding: "28px" }}>
              {[
                { label: "Serviço", value: selectedService?.name },
                { label: "Valor", value: selectedService?.price },
                { label: "Duração", value: selectedService?.duration },
                { label: "Profissional", value: barbers.find((b) => b.id === selectedBarber)?.name },
                { label: "Data", value: selectedDate ? format(selectedDate, "dd/MM/yyyy") : "" },
                { label: "Dia", value: selectedDate ? format(selectedDate, "EEEE", { locale: ptBR }) : "" },
                { label: "Horário", value: selectedTime },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 6 ? "1px solid #111" : "none" }}>
                  <span style={{ color: "#555", fontSize: "13px" }}>{item.label}</span>
                  <span style={{ color: "#fff", fontWeight: 500, fontSize: "13px", textTransform: "capitalize" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "14px 16px", marginTop: "16px" }}>
              <p style={{ color: "#888", fontSize: "12px" }}>⚠️ Cancelamento permitido até 1 hora antes do horário agendado.</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
              <button onClick={() => setStep(3)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "13px" }}><FiArrowLeft size={13} /> Voltar</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? "Confirmando..." : "Confirmar"} <FiCheck size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
