/* Regras de produto em cima do motor TRI: notas do aluno, corte por modalidade/plano, chance por opção. */
import { AREAS, curso, modalidade, plano, QUESTOES, RANK, SIGMA_CORTE } from "./dados";
import { eap, notaArea, notaCurso, probAprovacao } from "./tri";
import type { AreaOuRed, Curso, NotaArea, OpcaoCurso, Questao } from "./tipos";
import type { Estado } from "@/state/estado";

export type Notas = Record<AreaOuRed, NotaArea>;

export function notas(s: Estado): Notas {
  const o = {} as Notas;
  for (const a of AREAS) o[a.id] = notaArea(s.resp[a.id], s.prior);
  o.RED = { nota: s.red, se: s.redSe, n: 0 };
  return o;
}

export const cursoAtual = (s: Estado): Curso => curso(s.curso)!;
export const pago = (s: Estado) => RANK[s.plano] >= 1;
export const temCota = (s: Estado) => RANK[s.plano] >= 3;

/** Opções visíveis no plano atual, com o índice original */
export function opcoesVisiveis(s: Estado): [number, OpcaoCurso][] {
  const c = cursoAtual(s);
  return s.ops.map((i) => [i, c.opcoes[i]] as [number, OpcaoCurso]).slice(0, plano(s.plano).maxOpcoes);
}
export const opcaoPrincipal = (s: Estado) => opcoesVisiveis(s)[0][1];

export function corte(s: Estado, op: OpcaoCurso): number {
  return op.corte * (temCota(s) ? modalidade(s.mod).fator : 1);
}

export interface Chance {
  p: number;
  nota: number;
  se: number;
  corte: number;
  falta: number;
}

export function chance(s: Estado, op: OpcaoCurso, ns: Notas = notas(s)): Chance {
  const nc = notaCurso(ns, cursoAtual(s).pesos);
  const C = corte(s, op);
  return { p: probAprovacao(nc.nota, nc.se, C, SIGMA_CORTE), nota: nc.nota, se: nc.se, corte: C, falta: C - nc.nota };
}

/** Área em que +20 pontos mais aumentam a chance */
export function melhorArea(s: Estado, op: OpcaoCurso): { k: AreaOuRed; g: number } {
  const base = chance(s, op).p;
  let best: { k: AreaOuRed; g: number } | null = null;
  for (const k of ["LC", "CH", "CN", "MT", "RED"] as AreaOuRed[]) {
    const ns = notas(s);
    ns[k] = { ...ns[k], nota: ns[k].nota + 20 };
    const g = chance(s, op, ns).p - base;
    if (!best || g > best.g) best = { k, g };
  }
  if (best!.g < 0.005) {
    const p = cursoAtual(s).pesos;
    const k = (["CN", "MT", "LC", "CH", "RED"] as AreaOuRed[]).reduce((x, y) => (p[y] > p[x] ? y : x));
    best = { k, g: best!.g };
  }
  return best!;
}

export type Tom = "bad" | "warn" | "good";
export const faixa = (p: number): [string, Tom] => (p < 0.25 ? ["baixa", "bad"] : p < 0.6 ? ["média", "warn"] : ["alta", "good"]);
export const corChance = (p: number) => (p < 0.25 ? "var(--bad)" : p < 0.6 ? "var(--warn)" : "var(--good)");

export function totalRespondidas(s: Estado) {
  return Object.values(s.resp).reduce((t, l) => t + l.length, 0);
}
export function precisao(s: Estado): [string, Tom] {
  const n = totalRespondidas(s);
  return n < 12 ? ["baixa", "bad"] : n < 60 ? ["média", "warn"] : ["alta", "good"];
}

/** Próxima questão: entre as não respondidas, as 3 com dificuldade mais próxima da proficiência atual */
export function proximaQuestao(s: Estado, respondidas: number[]): Questao {
  let pool = QUESTOES.filter((q) => !respondidas.includes(q.id));
  if (!pool.length) pool = [...QUESTOES];
  const est = Object.fromEntries(AREAS.map((a) => [a.id, eap(s.resp[a.id], s.prior).m]));
  pool.sort((x, y) => Math.abs(x.b - est[x.area]) - Math.abs(y.b - est[y.area]));
  const top = pool.slice(0, 3);
  return top[Math.floor(Math.random() * top.length)];
}

export function dificuldade(b: number) {
  return b < -0.5 ? "fácil" : b < 0.7 ? "média" : "difícil";
}
