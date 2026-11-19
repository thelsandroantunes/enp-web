# ENP — Plano de construção (Web primeiro)

Android e iOS vêm depois, reaproveitando a API (Etapa D) e o motor de chance (Etapa F).

| Etapa | O que construir | Pronto quando |
|---|---|---|
| **A. Fundação** | Contas AWS dev e prod, alertas de orçamento, CDK (Python), deploy pelo GitHub Actions sem chave fixa (OIDC), domínio | `git push` na `main` faz deploy em dev sem nenhuma access key salva no GitHub |
| **B. Dados** | Aurora Serverless v2 (PostgreSQL) + Data API, migrações a partir do `db/migrations`, buckets S3 (provas em PDF, imagens das questões) | `python db/migrate.py --stage dev` cria todo o schema; buckets criados e privados |
| **C. Pipeline de questões** | Lambdas de coleta (provas e gabaritos do INEP, notas de corte do SISU), conversão (PDF → página/imagem), extração (enunciado, texto-base, alternativas, figuras) e classificação (área, habilidade da Matriz, assunto, dificuldade), orquestradas pelo Step Functions, com Bedrock | 2 edições completas do ENEM (180 questões cada) com 95%+ das questões corretas (enunciado, alternativas, imagem e gabarito batendo com o INEP) |
| **D. API + login** | Cognito, API Gateway, FastAPI (Lambda), limite diário de questões por plano | Aluno cria conta, responde questões e é bloqueado ao atingir o limite do plano grátis |
| **E. App web** | Next.js a partir do protótipo, PWA (instalável, offline básico) | Fluxo completo: cadastro → escolher cursos/universidades → praticar → ver desempenho |
| **F. Simulados + chance de aprovação** | Simulado por área e completo, nota estimada por área (aproximação da TRI), comparação com notas de corte por curso/universidade/modalidade, com os pesos de cada curso | Chance exibida para cada curso-alvo, com faixa de confiança e explicação de como foi calculada |
| **G. Pagamento + e-mail** | Gateway Pix/cartão com webhook, escada de planos (do acessível ao topo para Medicina, Direito, Computação…), SES | Assinatura muda de plano automaticamente pelo webhook; e-mails de boas-vindas, cobrança e recibo |
| **H. Monitor + atualização** | Verificação diária de novas provas, gabaritos, erratas/anulações e notas de corte; recálculo das chances quando algo muda; alertas | Questão anulada pelo INEP some da prática e as chances são recalculadas sem intervenção manual |
| **I. Produção** | WAF, backups, termos de uso e privacidade (LGPD, com atenção a alunos menores de 18 — consentimento do responsável) | Checklist de segurança e LGPD aprovado antes de abrir para o público |

## Status (19/11/2026)

- [x] Estrutura do repositório `enp-web` (infra CDK, banco, backend, web, CI/deploy)
- [x] Etapa A em código: OIDC, orçamento, domínio — falta preencher `cdk.json` e subir na AWS
- [x] Etapa B em código: Aurora + Data API, S3, migrações (schema com 20 tabelas validado em Postgres 16)
- [x] Protótipo web em Next.js (`web/`), com motor TRI testado
- [x] Visual web próprio (estrutura de site: landing, painel, cartão-resposta, planos em colunas, tema claro/escuro); celular mantém o visual de app
- [x] Repaginada jovem (web e celular): roxo→rosa, fonte Nunito, cores por área, XP e níveis, sequência de acertos, confete no acerto, acolhimento no erro, apoio após simulado e resumo motivador a cada bateria de 10 questões

## Repositórios

- `enp-web` (este) — infraestrutura (CDK), banco, pipeline, API e app web.
- Mobile (Android/iOS) — repositório próprio, criado depois, consumindo a mesma API.

## Etapa A — checklist

1. [ ] Criar as contas AWS `enp-dev` e `enp-prod` (de preferência numa AWS Organization).
2. [ ] Preencher `infra/cdk.json` (contas, região, e-mail de alerta, limite de orçamento, dono/nome do repo, domínio).
3. [ ] `cdk bootstrap` em cada conta (uma vez, com credenciais locais).
4. [ ] Deploy manual, uma vez por conta, da stack `Enp-<stage>-GithubOidc` (cria o provedor OIDC e o papel de deploy).
5. [ ] Cadastrar no GitHub as variáveis `AWS_ROLE_DEV` e `AWS_ROLE_PROD` (ARNs do passo 4 — não são segredos).
6. [ ] Criar o environment `prod` no GitHub com aprovação obrigatória.
7. [ ] Registrar o domínio e apontar os NS para a hosted zone criada pela stack de Fundação em prod.
8. [ ] Push na `main` → deploy automático em dev funcionando.
