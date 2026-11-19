"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { chance, opcaoPrincipal } from "@/lib/motor";
import type { Questao } from "@/lib/tipos";
import { ESTADO_INICIAL, type Estado } from "./estado";

const CHAVE = "enp-prototipo-v1";

interface Ctx {
  s: Estado;
  pronto: boolean;
  set: (fn: (s: Estado) => Estado) => void;
  /** registra a resposta no motor e atualiza o histórico de chance */
  registrar: (q: Questao, acertou: boolean) => void;
  reiniciar: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Estado>(ESTADO_INICIAL);
  const [pronto, setPronto] = useState(false);

  // Protótipo: guarda o progresso no navegador. No produto, isso vem da API.
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) setS({ ...ESTADO_INICIAL, ...JSON.parse(salvo) });
    } catch {
      /* armazenamento indisponível: segue em memória */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(s));
    } catch {
      /* ignora */
    }
  }, [s, pronto]);

  const set = useCallback((fn: (s: Estado) => Estado) => setS(fn), []);

  const registrar = useCallback((q: Questao, acertou: boolean) => {
    setS((prev) => {
      const op = opcaoPrincipal(prev);
      const antes = chance(prev, op).p;
      const next: Estado = {
        ...prev,
        resp: { ...prev.resp, [q.area]: [...prev.resp[q.area], { a: q.a, b: q.b, c: q.c, u: acertou ? 1 : 0 }] },
      };
      const depois = chance(next, op).p;
      return { ...next, ultimoDelta: depois - antes, hist: [...prev.hist, depois] };
    });
  }, []);

  const reiniciar = useCallback(() => setS(ESTADO_INICIAL), []);

  const value = useMemo(() => ({ s, pronto, set, registrar, reiniciar }), [s, pronto, set, registrar, reiniciar]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp fora do AppStateProvider");
  return c;
}
