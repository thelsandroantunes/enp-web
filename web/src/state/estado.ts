import type { Area, ModalidadeId, PlanoId, Resp } from "@/lib/tipos";

export interface Estado {
  onb: 0 | 1 | 2 | 3;
  curso: string | null;
  ops: number[];
  mod: ModalidadeId;
  plano: PlanoId;
  ciclo: "m" | "a";
  resp: Record<Area, Resp[]>;
  red: number;
  redSe: number;
  prior: number;
  /** chance da 1ª opção após cada resposta */
  hist: number[];
  respondidas: number[];
  ultimoDelta: number | null;
  simUsados: number;
  streak: number;
  /** pontos de experiência (gamificação) */
  xp: number;
  /** acertos seguidos na prática */
  combo: number;
  hoje: number;
}

export const ESTADO_INICIAL: Estado = {
  onb: 0,
  curso: null,
  ops: [],
  mod: "ampla",
  plano: "free",
  ciclo: "m",
  resp: { LC: [], CH: [], CN: [], MT: [] },
  red: 600,
  redSe: 80,
  prior: 550,
  hist: [],
  respondidas: [],
  ultimoDelta: null,
  simUsados: 0,
  streak: 3,
  xp: 0,
  combo: 0,
  hoje: 0,
};
