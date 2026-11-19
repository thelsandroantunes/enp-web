import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppStateProvider } from "@/state/AppState";
import "./globals.css";
import "./web.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ENP — Questões ENEM e chance de aprovação",
  description: "Pratique questões do ENEM e acompanhe sua chance de aprovação no curso e na universidade que você quer.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#2f5bea", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
