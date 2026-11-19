/* Dados ILUSTRATIVOS do protótipo. No produto vêm da API (Etapas C e D). */
import type { Area, Curso, Modalidade, Plano, PlanoId, Questao } from "./tipos";

/** Cada área tem cor e emoji próprios (chips, barras e cartão-resposta) */
export const AREAS: { id: Area; nome: string; cor: string; emoji: string }[] = [
  { id: "LC", nome: "Linguagens", cor: "#ec4899", emoji: "📚" },
  { id: "CH", nome: "Humanas", cor: "#f97316", emoji: "🌎" },
  { id: "CN", nome: "Natureza", cor: "#10b981", emoji: "🧪" },
  { id: "MT", nome: "Matemática", cor: "#3b82f6", emoji: "📐" },
];
export const area = (id: string) => AREAS.find((a) => a.id === id)!;

const op = (universidade: string, corte: number, real = false) => ({ universidade, corte, real });

export const CURSOS: Curso[] = [
  { id: "med", nome: "Medicina", top: true, pesos: { LC: 1, CH: 1, CN: 3, MT: 2, RED: 2 },
    faixa: "Sisu 2026 real: 779,72 a 865,30 (ampla)",
    opcoes: [op("Unilab — Redenção (CE)", 865.3, true), op("UFMG — Belo Horizonte", 818), op("UFRJ — Rio de Janeiro", 815),
      op("UFPE — Recife", 812), op("UFBA — Salvador", 808), op("UFPA — Belém", 790)] },
  { id: "dir", nome: "Direito", top: true, pesos: { LC: 3, CH: 3, CN: 1, MT: 1, RED: 3 },
    faixa: "Sisu 2026 real: 689,66 a 802,97 (ampla)",
    opcoes: [op("UFMS — Campo Grande", 802.97, true), op("UFPR — Curitiba", 770), op("UFPE — Recife", 765),
      op("UnB — Brasília", 760), op("UFBA — Salvador", 745), op("UFNT — Araguaína", 689.66, true)] },
  { id: "cc", nome: "Ciência da Computação", top: true, pesos: { LC: 1, CH: 1, CN: 2, MT: 4, RED: 1 },
    faixa: "Sisu 2026 real: 645,60 a 817,04 (ampla)",
    opcoes: [op("UFPE — Recife", 817.04, true), op("UFMG — Belo Horizonte", 790), op("UFRJ — Rio de Janeiro", 780),
      op("UFSC — Florianópolis", 760), op("UFC — Fortaleza", 750), op("UFPB — João Pessoa", 645.6, true)] },
  { id: "eng", nome: "Engenharia Civil", top: true, pesos: { LC: 1, CH: 1, CN: 3, MT: 4, RED: 1 },
    opcoes: [op("UFMG — Belo Horizonte", 765), op("UFRJ — Rio de Janeiro", 760), op("UFPR — Curitiba", 745),
      op("UFC — Fortaleza", 735), op("UFPA — Belém", 700)] },
  { id: "enf", nome: "Enfermagem", pesos: { LC: 1, CH: 1, CN: 2, MT: 1, RED: 1 },
    opcoes: [op("UFMG — Belo Horizonte", 740), op("UFRJ — Rio de Janeiro", 735), op("UFBA — Salvador", 715),
      op("UFPA — Belém", 690), op("UFPI — Teresina", 680)] },
  { id: "psi", nome: "Psicologia", pesos: { LC: 2, CH: 2, CN: 2, MT: 1, RED: 2 },
    opcoes: [op("UFMG — Belo Horizonte", 760), op("UFRJ — Rio de Janeiro", 755), op("UFC — Fortaleza", 735),
      op("UFPB — João Pessoa", 720)] },
  { id: "adm", nome: "Administração", pesos: { LC: 2, CH: 2, CN: 1, MT: 2, RED: 1 },
    opcoes: [op("UFMG — Belo Horizonte", 750), op("UFRJ — Rio de Janeiro", 745), op("UFPE — Recife", 725),
      op("UFBA — Salvador", 710), op("UFPA — Belém", 680)] },
  { id: "ped", nome: "Pedagogia", pesos: { LC: 2, CH: 2, CN: 1, MT: 1, RED: 2 },
    opcoes: [op("UFMG — Belo Horizonte", 690), op("UFRJ — Rio de Janeiro", 680), op("UFC — Fortaleza", 665),
      op("UFPA — Belém", 640)] },
];

export const MODALIDADES: Modalidade[] = [
  { id: "ampla", nome: "Ampla concorrência", fator: 1 },
  { id: "ep", nome: "Escola pública", fator: 0.955 },
  { id: "epr", nome: "Escola pública + baixa renda", fator: 0.93 },
];

/** Incerteza da nota de corte entre edições (pontos) */
export const SIGMA_CORTE = 18;

export const QUESTOES: Questao[] = [
  { id: 1, area: "LC", a: 1.4, b: -0.8, c: 0.2, enunciado: "Em uma campanha publicitária, a frase “Economize hoje, sorria amanhã” utiliza predominantemente a função da linguagem:", alternativas: ["referencial", "conativa (apelativa)", "metalinguística", "fática", "poética"], correta: 1, explicacao: "O verbo no imperativo (“economize”, “sorria”) busca convencer o leitor: função conativa." },
  { id: 2, area: "LC", a: 1.6, b: 0.2, c: 0.2, enunciado: "Em “O silêncio gritava na sala vazia”, a figura de linguagem predominante é a:", alternativas: ["metonímia", "eufemismo", "personificação (prosopopeia)", "hipérbato", "pleonasmo"], correta: 2, explicacao: "Atribui-se uma ação humana (gritar) a algo inanimado (o silêncio): personificação." },
  { id: 3, area: "LC", a: 1.2, b: -1.2, c: 0.2, enunciado: "Um texto que apresenta tese, argumentos e proposta de intervenção pertence ao tipo:", alternativas: ["narrativo", "descritivo", "dissertativo-argumentativo", "injuntivo", "expositivo"], correta: 2, explicacao: "Tese + argumentos + proposta de intervenção é a estrutura da redação dissertativo-argumentativa do ENEM." },
  { id: 4, area: "LC", a: 1.8, b: 0.9, c: 0.2, enunciado: "Em “Embora chovesse, o jogo continuou”, a conjunção destacada estabelece relação de:", alternativas: ["causa", "concessão", "condição", "finalidade", "conclusão"], correta: 1, explicacao: "“Embora” introduz um fato contrário que não impede o outro: concessão." },
  { id: 5, area: "CH", a: 1.3, b: -1.3, c: 0.2, enunciado: "A Lei Áurea, assinada em 1888, está diretamente associada a qual processo histórico brasileiro?", alternativas: ["Independência", "Abolição da escravidão", "Proclamação da República", "Era Vargas", "Inconfidência Mineira"], correta: 1, explicacao: "A Lei Áurea extinguiu formalmente a escravidão no Brasil em 13 de maio de 1888." },
  { id: 6, area: "CH", a: 1.5, b: 0.0, c: 0.2, enunciado: "O conceito de Estado de bem-estar social está associado principalmente:", alternativas: ["à ausência de intervenção estatal na economia", "à garantia, pelo Estado, de direitos como saúde, educação e previdência", "à economia planificada sem propriedade privada", "ao poder absoluto do monarca", "à organização feudal da produção"], correta: 1, explicacao: "O Estado de bem-estar social amplia políticas públicas e direitos sociais garantidos pelo Estado." },
  { id: 7, area: "CH", a: 1.4, b: 0.4, c: 0.2, enunciado: "A urbanização brasileira na segunda metade do século XX foi marcada principalmente por:", alternativas: ["êxodo rural acelerado e crescimento de periferias", "planejamento urbano que evitou desigualdades", "redução da população das capitais", "migração das cidades para o campo", "estagnação industrial"], correta: 0, explicacao: "A industrialização atraiu migrantes do campo, e as cidades cresceram rápido, com periferias sem infraestrutura." },
  { id: 8, area: "CH", a: 1.7, b: 1.1, c: 0.2, enunciado: "Para Max Weber, a dominação baseada em regras impessoais e hierarquia de cargos é chamada:", alternativas: ["carismática", "tradicional", "racional-legal", "patrimonialista", "teocrática"], correta: 2, explicacao: "A dominação racional-legal se apoia em normas impessoais, típica da burocracia moderna." },
  { id: 9, area: "CN", a: 1.3, b: -1.0, c: 0.2, enunciado: "Um carro percorre 120 km em 1,5 h. Sua velocidade média é:", alternativas: ["60 km/h", "80 km/h", "90 km/h", "100 km/h", "180 km/h"], correta: 1, explicacao: "v = Δs/Δt = 120 / 1,5 = 80 km/h." },
  { id: 10, area: "CN", a: 1.4, b: -0.5, c: 0.2, enunciado: "A principal função das mitocôndrias na célula é:", alternativas: ["síntese de proteínas", "respiração celular e produção de ATP", "fotossíntese", "armazenamento do DNA nuclear", "digestão intracelular"], correta: 1, explicacao: "Na mitocôndria ocorre a respiração celular aeróbica, que produz a maior parte do ATP." },
  { id: 11, area: "CN", a: 1.6, b: 0.5, c: 0.2, enunciado: "Ao diluir 100 mL de uma solução 2 mol/L até 400 mL, a nova concentração é:", alternativas: ["0,25 mol/L", "0,5 mol/L", "1 mol/L", "4 mol/L", "8 mol/L"], correta: 1, explicacao: "C₁V₁ = C₂V₂ → 2 × 100 = C₂ × 400 → C₂ = 0,5 mol/L." },
  { id: 12, area: "CN", a: 1.9, b: 1.3, c: 0.2, enunciado: "Numa população em equilíbrio de Hardy-Weinberg, a frequência do alelo recessivo é 0,3. A frequência de heterozigotos é:", alternativas: ["0,09", "0,21", "0,42", "0,49", "0,70"], correta: 2, explicacao: "p = 0,7 e q = 0,3; heterozigotos = 2pq = 2 × 0,7 × 0,3 = 0,42." },
  { id: 13, area: "MT", a: 1.3, b: -1.1, c: 0.2, enunciado: "Um produto de R$ 80,00 recebe desconto de 15%. O preço final é:", alternativas: ["R$ 65,00", "R$ 68,00", "R$ 70,00", "R$ 72,00", "R$ 75,00"], correta: 1, explicacao: "15% de 80 = 12; 80 − 12 = R$ 68,00." },
  { id: 14, area: "MT", a: 1.5, b: -0.4, c: 0.2, enunciado: "A média aritmética de 6, 8, 10 e x é 9. O valor de x é:", alternativas: ["9", "10", "11", "12", "14"], correta: 3, explicacao: "Soma = 4 × 9 = 36; 6 + 8 + 10 = 24; x = 12." },
  { id: 15, area: "MT", a: 1.7, b: 0.6, c: 0.2, enunciado: "Uma caixa tem 3 bolas vermelhas e 5 azuis. Retirando 2 sem reposição, a probabilidade de ambas serem azuis é:", alternativas: ["5/14", "25/64", "5/8", "1/4", "3/14"], correta: 0, explicacao: "(5/8) × (4/7) = 20/56 = 5/14." },
  { id: 16, area: "MT", a: 1.8, b: 1.0, c: 0.2, enunciado: "Se f(x) = 2ˣ e f(a) = 32, então f(a − 2) vale:", alternativas: ["4", "8", "16", "30", "64"], correta: 1, explicacao: "2ᵃ = 32 → a = 5; f(3) = 2³ = 8." },
];

export const PLANOS: Plano[] = [
  { id: "free", nome: "Grátis", mensal: 0, anual: 0, maxOpcoes: 1, limiteDiario: 20, simuladosMes: 1, para: "Todos, porta de entrada",
    itens: ["20 questões por dia", "1 objetivo (curso + universidade)", "Chance em faixa: baixa, média ou alta", "1 simulado rápido por mês"] },
  { id: "ess", nome: "Essencial", mensal: 9.9, anual: 89, maxOpcoes: 2, limiteDiario: null, simuladosMes: 2, para: "Baixa renda, volume",
    itens: ["Questões ilimitadas", "Chance em % com margem", "2 opções de curso/universidade", "2 simulados TRI por mês"],
    social: "Essencial Social: R$ 4,90/mês para escola pública (via parceria)" },
  { id: "plus", nome: "Plus", mensal: 19.9, anual: 179, maxOpcoes: 5, limiteDiario: null, simuladosMes: null, para: "A maioria dos cursos",
    itens: ["Tudo do Essencial", "5 opções monitoradas", "Simulados ilimitados", "Plano de estudos adaptativo", "4 redações corrigidas por IA/mês"] },
  { id: "pro", nome: "Pro", mensal: 34.9, anual: 299, maxOpcoes: 5, limiteDiario: null, simuladosMes: null, para: "Cursos concorridos",
    itens: ["Tudo do Plus", "Chance por modalidade de cota", "Ranking entre concorrentes do mesmo curso", "12 redações por IA/mês"] },
  { id: "top", nome: "Top", mensal: 59.9, anual: 499, maxOpcoes: 5, limiteDiario: null, simuladosMes: null, para: "Medicina, Direito, Computação, Engenharias",
    itens: ["Tudo do Pro", "Trilha de alta concorrência", "Questões de alta dificuldade", "Redação ilimitada", "Mentoria com IA"] },
];

export const RANK: Record<PlanoId, number> = { free: 0, ess: 1, plus: 2, pro: 3, top: 4 };

export const plano = (id: PlanoId) => PLANOS.find((p) => p.id === id)!;
export const curso = (id: string | null) => CURSOS.find((c) => c.id === id);
export const modalidade = (id: string) => MODALIDADES.find((m) => m.id === id)!;
export const nomeArea = (k: string) => (k === "RED" ? "Redação" : AREAS.find((a) => a.id === k)!.nome);
