"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{d}</svg>
);

export const ITENS: { href: string; rotulo: string; icone: ReactNode }[] = [
  { href: "/inicio", rotulo: "Início", icone: svg(<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />) },
  { href: "/questoes", rotulo: "Questões", icone: svg(<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>) },
  { href: "/simulado", rotulo: "Simulado", icone: svg(<><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6" /></>) },
  { href: "/chances", rotulo: "Chances", icone: svg(<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />) },
  { href: "/planos", rotulo: "Planos", icone: svg(<path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16.6 6.5 19.5l1-6.3L3 8.9 9 8z" />) },
];

/** Barra inferior (celular) */
export function NavInferior() {
  const path = usePathname();
  return (
    <nav className="nav">
      {ITENS.map((i) => (
        <Link key={i.href} href={i.href} className={path === i.href ? "on" : ""}>{i.icone}{i.rotulo}</Link>
      ))}
    </nav>
  );
}

/** Abas no topo (desktop) */
export function NavTopo() {
  const path = usePathname();
  return (
    <nav className="nav-top">
      {ITENS.map((i) => (
        <Link key={i.href} href={i.href} className={path === i.href ? "on" : ""}>{i.rotulo}</Link>
      ))}
    </nav>
  );
}
