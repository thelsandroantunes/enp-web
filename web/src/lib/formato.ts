export const pct = (p: number) => Math.round(p * 100) + "%";
export const pp = (d: number) =>
  (Math.abs(d) < 0.0005 ? "±" : d > 0 ? "+" : "−") + Math.abs(d * 100).toFixed(1).replace(".", ",") + " pp";
export const brl = (v: number) => (v === 0 ? "R$ 0" : "R$ " + v.toFixed(2).replace(".", ","));
export const num2 = (v: number) => v.toFixed(2).replace(".", ",");
export const tempo = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const curto = (universidade: string) => universidade.split(" — ")[0];
