"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createAppointment, getBookedSlots } from "@/lib/appointments";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiCheck, FiArrowRight, FiArrowLeft, FiUser, FiInfo, FiX } from "react-icons/fi";

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
  { id: "profissional-1", name: "Profissional 1", specialty: "Cortes Modernos", years: 8, bio: "Especialista em degradê e cortes contemporâneos. Formação internacional.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&crop=face" },
  { id: "profissional-2", name: "Profissional 2", specialty: "Barba & Pigmentação", years: 5, bio: "Expert em modelagem de barba e técnicas de pigmentação capilar.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&fit=crop&crop=face" },
  { id: "profissional-3", name: "Profissional 3", specialty: "Cortes Clássicos", years: 12, bio: "Veterano com mais de uma década de experiência em cortes tradicionais.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop&crop=face" },
  { id: "profissional-4", name: "Profissional 4", specialty: "Tratamentos", years: 4, bio: "Focado em tratamentos capilares, hidratação e cuidados especiais.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&fit=crop&crop=face" },
];

const timeSlots = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"];

export default function AgendarPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [showBarberInfo, setShowBarberInfo] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Gera datas no cliente para usar timezone local
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates: Date[] = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) { // Pula domingos
        dates.push(d);
      }
    }
    setAvailableDates(dates);
  }, []);

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
                    <img src={b.image} alt={b.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid #222" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: 500, fontSize: "13px" }}>{b.name}</div>
                      <div style={{ color: "#666", fontSize: "11px" }}>{b.specialty}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowBarberInfo(b.id); }}
                      style={{ background: "none", border: "1px solid #222", borderRadius: "6px", padding: "4px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <FiInfo size={12} color="#666" />
                    </button>
                  </div>
                </button>
              ))}
            </div>

            {/* Barber Info Modal */}
            {showBarberInfo && (() => {
              const b = barbers.find(x => x.id === showBarberInfo);
              if (!b) return null;
              return (
                <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }} onClick={() => setShowBarberInfo(null)}>
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }} />
                  <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%" }}>
                    <button onClick={() => setShowBarberInfo(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#666", cursor: "pointer" }}>
                      <FiX size={18} />
                    </button>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <img src={b.image} alt={b.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #222", marginBottom: "16px" }} />
                      <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>{b.name}</h3>
                      <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>{b.specialty}</p>
                      <div style={{ display: "flex", gap: "24px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1a1a1a", width: "100%", justifyContent: "center" }}>
                        <div>
                          <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>{b.years}</div>
                          <div style={{ color: "#666", fontSize: "11px" }}>anos exp.</div>
                        </div>
                        <div>
                          <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>4.9</div>
                          <div style={{ color: "#666", fontSize: "11px" }}>avaliação</div>
                        </div>
                      </div>
                      <p style={{ color: "#aaa", fontSize: "13px", marginTop: "16px", lineHeight: "1.6" }}>{b.bio}</p>
                      <button onClick={() => { setSelectedBarber(b.id); setShowBarberInfo(null); }} className="btn-primary" style={{ marginTop: "20px", width: "100%", justifyContent: "center" }}>
                        Selecionar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

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

            <p style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              {selectedDate ? format(selectedDate, "MMMM yyyy", { locale: ptBR }) : format(new Date(), "MMMM yyyy", { locale: ptBR })}
            </p>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "12px" }}>
              {availableDates.map((date, i) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const now = new Date();
                const isToday = date.toDateString() === now.toDateString();
                const prevDate = i > 0 ? availableDates[i - 1] : null;
                const showMonthDivider = prevDate && prevDate.getMonth() !== date.getMonth();

                return (
                  <div key={date.toISOString()} style={{ display: "flex", alignItems: "center" }}>
                    {showMonthDivider && (
                      <div style={{ width: "1px", height: "40px", backgroundColor: "#222", margin: "0 6px", flexShrink: 0 }} />
                    )}
                    <button onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                      style={{ flexShrink: 0, width: "72px", padding: "14px 0", borderRadius: "12px", textAlign: "center", cursor: "pointer", backgroundColor: isSelected ? "#fff" : "#0a0a0a", border: isSelected ? "1px solid #fff" : isToday ? "1px solid #444" : "1px solid #1a1a1a", transition: "all 0.2s" }}>
                      <div style={{ fontSize: "9px", color: isSelected ? "#000" : "#666", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>{format(date, "EEEE", { locale: ptBR }).slice(0, 3)}</div>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: isSelected ? "#000" : "#fff", marginTop: "4px" }}>{format(date, "dd")}</div>
                      <div style={{ fontSize: "9px", color: isSelected ? "#333" : "#444", marginTop: "2px", textTransform: "capitalize" }}>{format(date, "MMM", { locale: ptBR })}</div>
                      {isToday && <div style={{ fontSize: "8px", color: isSelected ? "#000" : "#888", marginTop: "4px", fontWeight: 600 }}>HOJE</div>}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedDate && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}><FiClock size={11} /> Horário disponível</p>
                
                <p style={{ color: "#555", fontSize: "10px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Manhã</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }} className="grid-responsive-2">
                  {timeSlots.filter(t => parseInt(t) < 13).map((time) => {
                    const booked = bookedSlots.includes(time);
                    return (
                      <button key={time} onClick={() => !booked && setSelectedTime(time)} disabled={booked}
                        style={{ padding: "11px 0", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: booked ? "not-allowed" : "pointer", textDecoration: booked ? "line-through" : "none", backgroundColor: selectedTime === time ? "#fff" : "#0a0a0a", border: selectedTime === time ? "1px solid #fff" : "1px solid #1a1a1a", color: booked ? "#333" : selectedTime === time ? "#000" : "#aaa", transition: "all 0.2s" }}>
                        {time}
                      </button>
                    );
                  })}
                </div>

                <p style={{ color: "#555", fontSize: "10px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Tarde</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }} className="grid-responsive-2">
                  {timeSlots.filter(t => parseInt(t) >= 13).map((time) => {
                    const booked = bookedSlots.includes(time);
                    return (
                      <button key={time} onClick={() => !booked && setSelectedTime(time)} disabled={booked}
                        style={{ padding: "11px 0", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: booked ? "not-allowed" : "pointer", textDecoration: booked ? "line-through" : "none", backgroundColor: selectedTime === time ? "#fff" : "#0a0a0a", border: selectedTime === time ? "1px solid #fff" : "1px solid #1a1a1a", color: booked ? "#333" : selectedTime === time ? "#000" : "#aaa", transition: "all 0.2s" }}>
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

            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "16px 20px", marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>
                Cancelamentos devem ser realizados com no mínimo <strong style={{ color: "#ccc" }}>1 hora</strong> de antecedência ao horário agendado.
              </p>
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
