"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { NavInferior, NavTopo } from "@/components/Navegacao";
import { useDesktop } from "@/hooks/useDesktop";
import { plano } from "@/lib/dados";
import { WebShell } from "@/views/desktop/WebShell";
import { useApp } from "@/state/AppState";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { s, pronto } = useApp();
  const desktop = useDesktop();
  const router = useRouter();
  const path = usePathname();
  // No web, Planos é público (visitante pode ver antes de configurar o objetivo)
  const publica = desktop && path === "/planos";

  useEffect(() => {
    if (pronto && s.onb < 3 && !publica) router.replace("/onboarding");
  }, [pronto, s.onb, publica, router]);

  const pronto3 = pronto && (s.onb >= 3 || publica);

  if (desktop) return <WebShell>{pronto3 ? children : <div className="d-mut">Carregando…</div>}</WebShell>;
  if (!pronto3) return <div className="carregando">Carregando…</div>;

  return (
    <>
      <div className="aviso">Protótipo · dados ilustrativos · pagamentos simulados</div>
      <header className="top">
        <div className="top-in">
          <Link href="/inicio" className="brand">EN<span>P</span></Link>
          <NavTopo />
          <Link href="/planos" className={`plan-pill ${s.plano === "top" ? "top" : ""}`}>Plano {plano(s.plano).nome}</Link>
        </div>
      </header>
      <main className="screen">{children}</main>
      <NavInferior />
    </>
  );
}
