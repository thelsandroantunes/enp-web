# ENP Web

App de questões do ENEM com chance de aprovação por curso/universidade.
Este repositório contém infraestrutura (AWS CDK em Python), banco, pipeline de questões, API (FastAPI) e o app web (Next.js).

Plano completo por etapas: [docs/PLANO.md](docs/PLANO.md)

## Estrutura

```
.github/workflows/   CI e deploy (OIDC, sem chave fixa)
docs/
  PLANO.md           plano por etapas (A–I)
  prototipo/         protótipo original em HTML único (referência)
infra/               AWS CDK (Python): OIDC do GitHub, fundação (orçamento, domínio), dados (Aurora + S3)
db/
  migrations/        SQL versionado (0001_init, 0002_seed_basico…)
  migrate.py         aplica as migrações via Data API
backend/             API FastAPI (Lambda) — Etapa D
web/                 app Next.js (protótipo navegável) — Etapa E, ver web/README.md
```

## Demonstração

Protótipo web publicado pelo GitHub Pages: **https://thelsandroantunes.github.io/enp-web/**
(abra numa tela larga para o visual web; no celular, o visual de app). Atualiza sozinho a cada push em `web/`.

## Rodar o web localmente

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

## Criar o repositório no GitHub (manual)

1. No GitHub, crie o repositório **vazio** `enp-web` (privado, sem README, sem .gitignore, sem licença).
2. Nesta pasta:
   ```bash
   git init -b main
   git add .
   git commit -m "Etapa A: estrutura inicial"
   git remote add origin https://github.com/<seu-usuario-ou-org>/enp-web.git
   git push -u origin main
   ```
3. Em **Settings → Environments**, crie `dev` e `prod` (em `prod`, ative *Required reviewers*).
4. Em **Settings → Secrets and variables → Actions → Variables**, crie `AWS_ROLE_DEV` e `AWS_ROLE_PROD` depois do passo de OIDC abaixo.

## Etapa A — primeira subida na AWS

```bash
cd infra
python -m venv .venv && . .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
npm i -g aws-cdk

# Preencha infra/cdk.json (contas, região, e-mail, orçamento, github.owner, domínio)

# Uma vez por conta, com credenciais locais (perfil SSO):
cdk bootstrap --profile enp-dev
cdk deploy Enp-dev-GithubOidc --profile enp-dev     # saída: ARN do papel -> AWS_ROLE_DEV
cdk bootstrap --profile enp-prod
cdk deploy Enp-prod-GithubOidc --profile enp-prod   # saída: ARN do papel -> AWS_ROLE_PROD
```

Daí em diante:
- push na `main` → deploy automático em **dev**;
- *Actions → Deploy → Run workflow* com `prod` → deploy em **prod** (com aprovação).

## Etapa B — migrações

```bash
pip install boto3
python db/migrate.py --stage dev --profile enp-dev
```
