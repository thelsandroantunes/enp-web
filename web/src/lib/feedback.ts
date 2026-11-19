/* Mensagens e regras de motivação: acerto = festa, erro = acolhimento, fim de bateria = incentivo. */

export const XP_ACERTO = 10;
/** errar também conta: o aluno ganha por tentar */
export const XP_ERRO = 2;
export const TAMANHO_BATERIA = 10;

const sortear = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];

const ACERTO = [
  "Mandou bem! 🎉", "Isso aí! 🚀", "Acertou em cheio! 🎯", "Arrasou! ✨",
  "Tá voando! 🔥", "Boa! Um passo mais perto da aprovação 💜", "Craque demais! 🤩",
];
const ERRO = [
  "Quase! Errar no treino é o que evita errar na prova 💪",
  "Não foi dessa vez, bora entender o porquê 👇",
  "Respira: cada erro mostra exatamente o que revisar 🧠",
  "Tudo bem! Até os aprovados erraram essa um dia 😉",
  "Faz parte! Lê a explicação com calma que ela gruda 📌",
];

export const msgAcerto = () => sortear(ACERTO);
export const msgErro = () => sortear(ERRO);

export function msgCombo(n: number): string | null {
  if (n >= 7) return `${n} seguidas! Ninguém te segura 🔥🔥🔥`;
  if (n >= 5) return `${n} acertos seguidos! Imparável 🔥🔥`;
  if (n >= 3) return `${n} seguidas! Tá pegando fogo 🔥`;
  return null;
}

/** Nível a cada 100 XP */
export function nivel(xp: number) {
  return { n: Math.floor(xp / 100) + 1, progresso: (xp % 100) / 100, falta: 100 - (xp % 100) };
}

export type Tom = "top" | "bom" | "base" | "abraço";

export interface Mensagem {
  emoji: string;
  titulo: string;
  texto: string;
  tom: Tom;
}

/** Mensagem de apoio após o simulado, pela taxa de acerto */
export function mensagemSimulado(taxa: number, piorArea: string): Mensagem {
  if (taxa >= 0.75) return { emoji: "🏆", tom: "top", titulo: "Que simulado!",
    texto: "Você está no ritmo de aprovação. Mantenha a constância: é ela que transforma esse resultado em vaga." };
  if (taxa >= 0.5) return { emoji: "😄", tom: "bom", titulo: "Mandou bem!",
    texto: `Mais da metade certa! Revise os erros e reforce ${piorArea}: o próximo simulado vem ainda melhor.` };
  if (taxa >= 0.25) return { emoji: "💪", tom: "base", titulo: "Você está construindo sua base",
    texto: `Simulado é treino. Cada erro de hoje é um ponto a mais no ENEM. Que tal 10 questões de ${piorArea} agora?` };
  return { emoji: "🫂", tom: "abraço", titulo: "Calma, faz parte do caminho",
    texto: `Todo mundo começa de algum lugar, e você já sabe onde focar: ${piorArea}. Um pouquinho por dia muda tudo. A gente tá junto!` };
}

/** Mensagem ao fim de uma bateria de questões, para incentivar a voltar */
export function mensagemBateria(acertos: number, total: number, limiteAtingido: boolean): Mensagem {
  const taxa = total ? acertos / total : 0;
  const base: Mensagem = taxa >= 0.7
    ? { emoji: "🌟", tom: "top", titulo: "Bateria concluída com estilo!", texto: "Você está mandando muito bem." }
    : taxa >= 0.4
      ? { emoji: "🎯", tom: "bom", titulo: "Bateria concluída!", texto: "Bom treino! Sua estimativa ficou mais precisa." }
      : { emoji: "🌱", tom: "base", titulo: "Bateria concluída!", texto: "Treino difícil é o que mais ensina. Revise as explicações e volte mais forte." };
  base.texto += limiteAtingido
    ? " Suas questões grátis renovam amanhã: volte para não perder a sequência 🔥"
    : " Quem treina todo dia sobe a nota mais rápido. Mais uma bateria?";
  return base;
}
