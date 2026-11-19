import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { AppStateProvider } from "@/state/AppState";
import "./globals.css";
import "./web.css";
import "./feedback.css";

const fonte = Nunito({ subsets: ["latin"], variable: "--font-app", weight: ["400", "600", "700", "800", "900"] });

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "ENP — Questões ENEM e chance de aprovação",
  description: "Pratique questões do ENEM e acompanhe sua chance de aprovação no curso e na universidade que você quer.",
  manifest: `${base}/manifest.webmanifest`,
  icons: { icon: `${base}/icon.svg`, apple: `${base}/icon.svg` },
};

export const viewport: Viewport = { themeColor: "#7c3aed", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fonte.variable}>
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
