"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { PLANOS } from "@/lib/dados";
import type { PlanoId } from "@/lib/tipos";
import { useApp } from "@/state/AppState";

const NAV = [
  { href: "/", rotulo: "Início" },
  { href: "/inicio", rotulo: "Painel" },
  { href: "/questoes", rotulo: "Questões" },
  { href: "/simulado", rotulo: "Simulado" },
  { href: "/chances", rotulo: "Chances" },
  { href: "/planos", rotulo: "Planos" },
  { href: "/etapas", rotulo: "Etapas" },
];

type Tema = "dark" | "light";
const ToastCtx = createContext<(m: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

/** Moldura do visual web: cabeçalho com abas, tema escuro/claro, seletor de plano (simulação) e rodapé */
export function WebShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { s, set } = useApp();
  const [tema, setTema] = useState<Tema>("dark");
  const [toast, setToast] = useState<string | null>(null);
  const h = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("enp-tema");
      if (t === "light" || t === "dark") setTema(t);
    } catch { /* ignora */ }
  }, []);

  const trocarTema = () => {
    const t: Tema = tema === "dark" ? "light" : "dark";
    setTema(t);
    try { localStorage.setItem("enp-tema", t); } catch { /* ignora */ }
  };

  const mostrar = useCallback((m: string) => {
    setToast(m);
    if (h.current) clearTimeout(h.current);
    h.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={mostrar}>
      <div className="d-root" data-theme={tema}>
        <header className="d-head">
          <div className="d-bar">
            <Link className="d-logo" href="/">EN<i>P</i></Link>
            <nav className="d-nav">
              {NAV.map((n) => <Link key={n.href} href={n.href} className={path === n.href ? "on" : ""}>{n.rotulo}</Link>)}
            </nav>
            <div className="d-right">
              <button className="d-tog" onClick={trocarTema}>{tema === "dark" ? "☀ Claro" : "☾ Escuro"}</button>
              <span>Simular:</span>
              <select className="d-sel" value={s.plano} onChange={(e) => {
                const id = e.target.value as PlanoId;
                set((p) => ({ ...p, plano: id }));
                mostrar(`Simulando: plano ${PLANOS.find((x) => x.id === id)!.nome}`);
              }}>
                {PLANOS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>
        </header>
        <main className="d-main">{children}</main>
        <footer className="d-foot">ENP · protótipo de demonstração · questões, cortes ilustrativos e pagamentos simulados</footer>
        {toast && <div className="d-toast">{toast}</div>}
      </div>
    </ToastCtx.Provider>
  );
}
