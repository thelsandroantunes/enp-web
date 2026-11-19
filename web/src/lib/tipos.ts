export type Area = "LC" | "CH" | "CN" | "MT";
export type AreaOuRed = Area | "RED";
export type ModalidadeId = "ampla" | "ep" | "epr";
export type PlanoId = "free" | "ess" | "plus" | "pro" | "top";

export interface Questao {
  id: number;
  area: Area;
  /** parâmetros TRI: a = discriminação, b = dificuldade, c = acerto casual */
  a: number;
  b: number;
  c: number;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

export interface OpcaoCurso {
  universidade: string;
  corte: number;
  /** nota de corte real (Sisu); false = ilustrativa */
  real?: boolean;
}

export interface Curso {
  id: string;
  nome: string;
  top?: boolean;
  pesos: Record<AreaOuRed, number>;
  faixa?: string;
  opcoes: OpcaoCurso[];
}

export interface Modalidade {
  id: ModalidadeId;
  nome: string;
  fator: number;
}

export interface Plano {
  id: PlanoId;
  nome: string;
  mensal: number;
  anual: number;
  maxOpcoes: number;
  limiteDiario: number | null;
  simuladosMes: number | null;
  para: string;
  itens: string[];
  social?: string;
}

/** Resposta registrada para o motor TRI (u = 1 acertou, 0 errou) */
export interface Resp {
  a: number;
  b: number;
  c: number;
  u: 0 | 1;
}

export interface NotaArea {
  nota: number;
  se: number;
  n: number;
}
