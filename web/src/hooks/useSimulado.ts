"use client";

import { useEffect, useRef, useState } from "react";
import { AREAS, plano, QUESTOES } from "@/lib/dados";
import { chance, notas, opcaoPrincipal, type Notas } from "@/lib/motor";
import type { Questao } from "@/lib/tipos";
import { useApp } from "@/state/AppState";

export interface Sim {
  qs: Questao[];
  i: number;
  /** resposta marcada em cada questão (null = em branco) */
  marcadas: (number | null)[];
  antes: number;
  notasAntes: Notas;
  t: number;
  fim: boolean;
  acertos: boolean[];
}

/** Simulado rápido: 2 questões por área, 3 min cada. Corrige tudo no final, como na prova. */
export function useSimulado() {
  const { s, set, registrar } = useApp();
  const [sim, setSim] = useState<Sim | null>(null);
  const [esgotado, setEsgotado] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const limite = plano(s.plano).simuladosMes;

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const finalizar = (x: Sim): Sim => {
    if (timer.current) clearInterval(timer.current);
    const acertos = x.qs.map((q, k) => x.marcadas[k] === q.correta);
    x.qs.forEach((q, k) => x.marcadas[k] !== null && registrar(q, acertos[k]));
    return { ...x, fim: true, acertos };
  };

  const iniciar = () => {
    if (limite !== null && s.simUsados >= limite) return setEsgotado(true);
    const qs = AREAS.flatMap((a) => QUESTOES.filter((q) => q.area === a.id).sort(() => Math.random() - 0.5).slice(0, 2));
    setSim({ qs, i: 0, marcadas: qs.map(() => null), antes: chance(s, opcaoPrincipal(s)).p, notasAntes: notas(s),
      t: qs.length * 180, fim: false, acertos: [] });
    set((p) => ({ ...p, simUsados: p.simUsados + 1 }));
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setSim((x) => (!x || x.fim ? x : x.t <= 1 ? finalizar({ ...x, t: 0 }) : { ...x, t: x.t - 1 }));
    }, 1000);
  };

  const marcar = (alt: number) => sim && setSim({ ...sim, marcadas: sim.marcadas.map((m, k) => (k === sim.i ? alt : m)) });
  const irPara = (i: number) => sim && setSim({ ...sim, i });
  const avancar = () => {
    if (!sim) return;
    if (sim.i < sim.qs.length - 1) setSim({ ...sim, i: sim.i + 1 });
    else setSim(finalizar(sim));
  };
  const entregar = () => sim && setSim(finalizar(sim));
  const sair = () => setSim(null);

  return { s, sim, limite, esgotado, setEsgotado, iniciar, marcar, irPara, avancar, entregar, sair };
}
