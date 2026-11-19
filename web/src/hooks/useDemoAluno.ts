"use client";

import { AREAS } from "@/lib/dados";
import { chance, opcaoPrincipal } from "@/lib/motor";
import { eap, p3 } from "@/lib/tri";
import type { Resp } from "@/lib/tipos";
import { useApp } from "@/state/AppState";

function randn() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Demonstração: gera respostas sintéticas de um aluno com nível real escolhido, para ver a estimativa convergir */
export function useDemoAluno() {
  const { set } = useApp();

  const simularAluno = (n: number, nivel: number) =>
    set((p) => {
      const th = (nivel - 500) / 100;
      const resp = { LC: [...p.resp.LC], CH: [...p.resp.CH], CN: [...p.resp.CN], MT: [...p.resp.MT] };
      for (let k = 0; k < n; k++) {
        const a = AREAS[k % 4].id;
        const est = eap(resp[a], p.prior).m;
        const it: Resp = { a: 1.2 + Math.random() * 0.9, b: est + randn() * 0.6, c: 0.2, u: 0 };
        it.u = Math.random() < p3(th, it.a, it.b, it.c) ? 1 : 0;
        resp[a].push(it);
      }
      const next = { ...p, resp };
      return { ...next, hist: [...p.hist, chance(next, opcaoPrincipal(next)).p] };
    });

  const zerar = () =>
    set((p) => {
      const next = { ...p, resp: { LC: [], CH: [], CN: [], MT: [] }, respondidas: [], ultimoDelta: null };
      return { ...next, hist: [chance(next, opcaoPrincipal(next)).p] };
    });

  return { simularAluno, zerar };
}
