# web — app Next.js do ENP

Protótipo navegável portado de [`docs/prototipo/index.html`](../docs/prototipo/index.html) para Next.js (App Router + TypeScript).
Dados ilustrativos e pagamentos simulados; o progresso fica no navegador até a API (Etapa D) existir.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm test           # testes do motor TRI
npm run build
GITHUB_PAGES=true npm run build   # (Git Bash) site estático em out/, servido em /enp-web
```

Publicação: o workflow `.github/workflows/pages.yml` gera o site estático e publica em https://thelsandroantunes.github.io/enp-web/.

## Dois visuais

O mesmo app tem **dois visuais**, escolhidos pela largura da tela (`hooks/useDesktop.ts`, corte em 1024px):

| | Celular (< 1024px) | Web (≥ 1024px) |
|---|---|---|
| Modelo | app com barra de navegação inferior | site com cabeçalho e abas, mesmo visual jovem do celular |
| Tema | claro, roxo→rosa | claro (padrão) e escuro, com botão no cabeçalho |
| Início `/` | vai direto para o app | página de apresentação (landing) |
| Telas | uma coluna, cartões empilhados | grade larga: painel com indicadores, tabelas, painel lateral fixo |
| Simulado | uma questão por vez | cartão-resposta lateral, navegação livre, entrega no final |
| Extras | — | seletor “Simular plano” no cabeçalho, página Etapas, Planos público |

A lógica é uma só (`hooks/` e `lib/`); só as telas (`views/mobile` e `views/desktop`) mudam.

## Motivação (feedback emocional)

Regras e mensagens em `lib/feedback.ts`; componentes em `components/feedback/`; estilos em `app/feedback.css` (prefixo `fb-`).

- **Acerto:** cartão verde, confete, mensagem de comemoração, +10 XP e sequência de acertos (🔥 a partir de 3).
- **Erro:** cartão coral com leve tremida e mensagem de acolhimento, +2 XP por tentar, explicação sempre visível.
- **Bateria de 10 questões:** resumo com acertos, XP, maior sequência e variação da chance + mensagem para continuar (ou voltar amanhã, se o limite grátis acabou).
- **Simulado:** mensagem de apoio pelo aproveitamento (🏆 / 😄 / 💪 / 🫂), sugerindo a área mais fraca.
- **Nível:** a cada 100 XP. Animações respeitam “reduzir movimento” do sistema.

## Estrutura

```
src/
  app/                    rotas (cada page.tsx escolhe a view de celular ou web)
    layout.tsx            raiz: fonte, manifest PWA, estado, globals.css + web.css
    page.tsx              web: landing · celular: redireciona
    onboarding/  etapas/
    (app)/                área do aluno: inicio (painel), questoes, simulado, chances, planos
    globals.css           visual celular
    web.css               visual web (classes com prefixo d-)
  views/
    mobile/               telas do celular
    desktop/              telas do web + WebShell (cabeçalho, tema, simular plano, rodapé)
  hooks/                  useDesktop, useQuestao, useSimulado, useDemoAluno (lógica compartilhada)
  components/             Ring, Badge, Alternativas, NotasPorArea, Navegacao; desktop/ (Gráfico, Áreas)
  lib/
    tipos.ts  dados.ts    tipos e dados ILUSTRATIVOS (virão da API)
    tri.ts                motor TRI 3PL + EAP + chance (funções puras, com testes)
    motor.ts              regras de produto: corte por modalidade/plano, chance por opção, próxima questão
    formato.ts
  state/                  estado do protótipo (React context + localStorage)
public/                   manifest.webmanifest e ícone
```

## Rotas

| Rota | Tela |
|---|---|
| `/` | Web: apresentação (hero, como funciona, cálculo da chance, FAQ) · celular: redireciona |
| `/etapas` | Etapas do projeto e arquitetura (visual web) |
| `/onboarding` | Escolha de curso, universidades (até 5), modalidade, nível e redação |
| `/inicio` | Painel: chance na 1ª opção, nota no curso, próximo passo, notas por área e evolução |
| `/questoes` | Prática adaptativa com explicação e variação da chance a cada resposta |
| `/simulado` | Simulado rápido TRI (8 questões, cronômetro) |
| `/chances` | Chance por universidade, modalidade (Pro+) e demonstração “simular aluno” |
| `/planos` | Escada de planos (Grátis → Top), mensal/anual, assinatura simulada |

Regras de plano reproduzidas: Grátis vê a chance em faixa e tem 20 questões/dia; Essencial libera % e 2 opções;
Plus libera 5 opções e simulados ilimitados; Pro libera chance por cota.
