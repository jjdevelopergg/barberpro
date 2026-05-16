export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  service: string;
  servicePrice: string;
  serviceDuration: string;
  barber: string;
  barberName: string;
  date: string;
  time: string;
  dayOfWeek: string;
  status: "confirmado" | "cancelado" | "concluido";
  createdAt: string;
  canceledAt?: string;
}

const STORAGE_KEY = "barberpro-appointments";

function getAll(): Appointment[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function save(appointments: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export function getAppointmentsByUser(userId: string): Appointment[] {
  return getAll()
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
}

export function getAllAppointments(): Appointment[] {
  return getAll().sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
}

export function getBookedSlots(date: string, barber: string): string[] {
  return getAll()
    .filter((a) => a.date === date && a.barber === barber && a.status === "confirmado")
    .map((a) => a.time);
}

export function createAppointment(data: Omit<Appointment, "id" | "createdAt" | "status">): Appointment {
  const appointments = getAll();
  const newAppointment: Appointment = {
    ...data,
    id: "apt-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    status: "confirmado",
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  save(appointments);
  return newAppointment;
}

export function cancelAppointment(id: string): boolean {
  const appointments = getAll();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return false;

  const apt = appointments[index];
  const aptTime = new Date(`${apt.date}T${apt.time}`);
  const now = new Date();
  const diffHours = (aptTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Não permite cancelar com menos de 1 hora de antecedência
  if (diffHours < 1) {
    return false;
  }

  appointments[index].status = "cancelado";
  appointments[index].canceledAt = new Date().toISOString();
  save(appointments);
  return true;
}

export function isUpcoming(date: string, time: string): boolean {
  return new Date(`${date}T${time}`) > new Date();
}

export function getTimeUntilAppointment(date: string, time: string): string {
  const aptTime = new Date(`${date}T${time}`);
  const now = new Date();
  const diffMs = aptTime.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Passado";
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `Em ${days} dia${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) return `Em ${hours}h ${minutes}min`;
  return `Em ${minutes}min`;
}
