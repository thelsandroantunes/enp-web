/* Motor TRI (3PL) + chance de aprovação. Funções puras — portáveis para a API (Etapa F). */
import type { AreaOuRed, NotaArea, Resp } from "./tipos";

const GRID: number[] = [];
for (let t = -4; t <= 4.0001; t += 0.05) GRID.push(+t.toFixed(2));
const D = 1.0;

/** Probabilidade de acerto no modelo logístico de 3 parâmetros */
export function p3(theta: number, a: number, b: number, c: number): number {
  return c + (1 - c) / (1 + Math.exp(-D * a * (theta - b)));
}

/** Estimativa EAP da proficiência (escala θ) com prior normal centrado na nota informada */
export function eap(lista: Resp[], priorNota: number): { m: number; sd: number } {
  let num = 0, den = 0, num2 = 0;
  const mu = (priorNota - 500) / 100;
  for (const t of GRID) {
    let w = Math.exp(-((t - mu) * (t - mu)) / 2);
    for (const r of lista) {
      const p = p3(t, r.a, r.b, r.c);
      w *= r.u ? p : 1 - p;
    }
    num += t * w;
    num2 += t * t * w;
    den += w;
  }
  const m = num / den;
  const v = Math.max(num2 / den - m * m, 1e-6);
  return { m, sd: Math.sqrt(v) };
}

/** Nota na escala ENEM (média 500, dp 100) e erro padrão */
export function notaArea(lista: Resp[], priorNota: number): NotaArea {
  const e = eap(lista, priorNota);
  return { nota: 500 + 100 * e.m, se: 100 * e.sd, n: lista.length };
}

function erf(x: number): number {
  const s = Math.sign(x);
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}

/** CDF da normal padrão */
export const Phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

const CHAVES: AreaOuRed[] = ["LC", "CH", "CN", "MT", "RED"];

/** Média ponderada pelos pesos do curso, com propagação do erro padrão */
export function notaCurso(ns: Record<AreaOuRed, NotaArea>, pesos: Record<AreaOuRed, number>) {
  const W = CHAVES.reduce((s, k) => s + pesos[k], 0);
  let N = 0, V = 0;
  for (const k of CHAVES) {
    const w = pesos[k] / W;
    N += w * ns[k].nota;
    V += w * w * ns[k].se * ns[k].se;
  }
  return { nota: N, se: Math.sqrt(V) };
}

/** P(aprovação) = Φ((nota − corte) / √(σ²nota + σ²corte)) */
export function probAprovacao(nota: number, se: number, corte: number, sigmaCorte: number): number {
  return Phi((nota - corte) / Math.sqrt(se * se + sigmaCorte * sigmaCorte));
}
