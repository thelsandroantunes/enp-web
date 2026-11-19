"use client";

import { useEffect, useState } from "react";
import { QUESTOES, plano } from "@/lib/dados";
import { proximaQuestao } from "@/lib/motor";
import type { Questao } from "@/lib/tipos";
import { useApp } from "@/state/AppState";

/** Fluxo de prática compartilhado entre o layout de celular e o de desktop */
export function useQuestao() {
  const { s, set, registrar } = useApp();
  const [q, setQ] = useState<Questao | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [feito, setFeito] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setQ(proximaQuestao(s, s.respondidas)), []);

  const limite = plano(s.plano).limiteDiario;
  const bloqueado = limite !== null && s.hoje >= limite && !feito;

  const responder = () => {
    if (!q || sel === null) return;
    setFeito(true);
    set((p) => ({ ...p, hoje: p.hoje + 1, respondidas: [...p.respondidas, q.id] }));
    registrar(q, sel === q.correta);
  };

  const proxima = () => {
    const reiniciar = s.respondidas.length >= QUESTOES.length;
    if (reiniciar) set((p) => ({ ...p, respondidas: [] }));
    setQ(proximaQuestao(s, reiniciar ? [] : s.respondidas));
    setSel(null);
    setFeito(false);
  };

  return { s, q, sel, setSel, feito, limite, bloqueado, responder, proxima };
}
