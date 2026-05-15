import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BarberPro | Barbearia Premium",
  description: "A melhor experiência em barbearia. Agende seu horário online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: "#0a0a0a", color: "#ffffff", fontFamily: "Inter, system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid #333",
                fontSize: "13px",
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#fff" },
              },
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
