import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Barbearia | Agendamento Online",
  description: "Sistema de agendamento online para barbearias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: "#000", color: "#fff", fontFamily: "Inter, system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#111", color: "#fff", border: "1px solid #1a1a1a", fontSize: "13px" },
              success: { iconTheme: { primary: "#fff", secondary: "#000" } },
            }}
          />
          <Navbar />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
