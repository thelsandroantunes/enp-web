"use client";

import { useEffect, useState } from "react";
import { msgAcerto, msgCombo, msgErro, TAMANHO_BATERIA, XP_ACERTO, XP_ERRO } from "@/lib/feedback";
import { QUESTOES, plano } from "@/lib/dados";
import { chance, opcaoPrincipal, proximaQuestao } from "@/lib/motor";
import type { Questao } from "@/lib/tipos";
import { useApp } from "@/state/AppState";

export interface Retorno {
  acertou: boolean;
  msg: string;
  combo: string | null;
  xp: number;
}

export interface Resumo {
  acertos: number;
  total: number;
  xp: number;
  melhorCombo: number;
  chanceAntes: number;
  limiteAtingido: boolean;
}

/** Fluxo de prática compartilhado entre o layout de celular e o de desktop, em baterias de 10 questões */
export function useQuestao() {
  const { s, set, registrar } = useApp();
  const [q, setQ] = useState<Questao | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [feito, setFeito] = useState(false);
  const [retorno, setRetorno] = useState<Retorno | null>(null);
  const [bateria, setBateria] = useState<boolean[]>([]);
  const [comboMax, setComboMax] = useState(0);
  const [chanceInicio, setChanceInicio] = useState<number | null>(null);
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    setQ(proximaQuestao(s, s.respondidas));
    setChanceInicio(chance(s, opcaoPrincipal(s)).p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limite = plano(s.plano).limiteDiario;
  const bloqueado = limite !== null && s.hoje >= limite && !feito && !resumo;

  const responder = () => {
    if (!q || sel === null) return;
    const acertou = sel === q.correta;
    const combo = acertou ? s.combo + 1 : 0;
    setFeito(true);
    setBateria((b) => [...b, acertou]);
    setComboMax((m) => Math.max(m, combo));
    setRetorno({ acertou, msg: acertou ? msgAcerto() : msgErro(), combo: acertou ? msgCombo(combo) : null, xp: acertou ? XP_ACERTO : XP_ERRO });
    set((p) => ({ ...p, hoje: p.hoje + 1, respondidas: [...p.respondidas, q.id] }));
    registrar(q, acertou);
  };

  const fimDeBateria = bateria.length >= TAMANHO_BATERIA || (limite !== null && s.hoje >= limite);

  const proxima = () => {
    if (fimDeBateria && bateria.length) {
      const acertos = bateria.filter(Boolean).length;
      setResumo({
        acertos, total: bateria.length, xp: acertos * XP_ACERTO + (bateria.length - acertos) * XP_ERRO,
        melhorCombo: comboMax, chanceAntes: chanceInicio ?? 0, limiteAtingido: limite !== null && s.hoje >= limite,
      });
      return;
    }
    const reiniciar = s.respondidas.length >= QUESTOES.length;
    if (reiniciar) set((p) => ({ ...p, respondidas: [] }));
    setQ(proximaQuestao(s, reiniciar ? [] : s.respondidas));
    setSel(null);
    setFeito(false);
    setRetorno(null);
  };

  /** começa nova bateria depois do resumo */
  const novaBateria = () => {
    setResumo(null);
    setBateria([]);
    setComboMax(0);
    setChanceInicio(chance(s, opcaoPrincipal(s)).p);
    setQ(proximaQuestao(s, s.respondidas));
    setSel(null);
    setFeito(false);
    setRetorno(null);
  };

  return { s, q, sel, setSel, feito, limite, bloqueado, responder, proxima, retorno, bateria, fimDeBateria, resumo, novaBateria };
}
