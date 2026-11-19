-- ENP — schema inicial
-- Uma instrução por bloco terminado em ';' (a Data API executa uma de cada vez). Sem funções/DO $$.

-- ========== Conteúdo ENEM ==========
CREATE TABLE area (
    codigo      VARCHAR(3) PRIMARY KEY,           -- LC, CH, CN, MT, RED
    nome        TEXT NOT NULL
);

CREATE TABLE competencia (
    id          SERIAL PRIMARY KEY,
    area        VARCHAR(3) NOT NULL REFERENCES area(codigo),
    numero      SMALLINT NOT NULL,
    descricao   TEXT NOT NULL,
    UNIQUE (area, numero)
);

CREATE TABLE habilidade (
    id              SERIAL PRIMARY KEY,
    area            VARCHAR(3) NOT NULL REFERENCES area(codigo),
    competencia_id  INT REFERENCES competencia(id),
    codigo          VARCHAR(4) NOT NULL,          -- H1..H30
    descricao       TEXT NOT NULL,
    UNIQUE (area, codigo)
);

CREATE TABLE assunto (
    id          SERIAL PRIMARY KEY,
    area        VARCHAR(3) NOT NULL REFERENCES area(codigo),
    nome        TEXT NOT NULL,
    pai_id      INT REFERENCES assunto(id),
    UNIQUE (area, nome)
);

CREATE TABLE prova (
    id          SERIAL PRIMARY KEY,
    ano         SMALLINT NOT NULL,
    aplicacao   VARCHAR(20) NOT NULL DEFAULT 'regular',   -- regular | reaplicacao | digital
    dia         SMALLINT NOT NULL,                         -- 1 | 2
    caderno     VARCHAR(20) NOT NULL,                      -- azul, amarelo...
    pdf_key     TEXT,
    gabarito_key TEXT,
    fonte_url   TEXT,
    UNIQUE (ano, aplicacao, dia, caderno)
);

CREATE TABLE questao (
    id              BIGSERIAL PRIMARY KEY,
    prova_id        INT NOT NULL REFERENCES prova(id),
    numero          SMALLINT NOT NULL,
    area            VARCHAR(3) NOT NULL REFERENCES area(codigo),
    habilidade_id   INT REFERENCES habilidade(id),
    lingua          VARCHAR(10),                  -- ingles | espanhol (só LC 1-5)
    texto_base      TEXT,
    enunciado       TEXT NOT NULL,
    imagens         JSONB NOT NULL DEFAULT '[]',  -- chaves S3
    gabarito        CHAR(1),
    anulada         BOOLEAN NOT NULL DEFAULT FALSE,
    tri_a           NUMERIC(8,5),                 -- parâmetros TRI (microdados INEP)
    tri_b           NUMERIC(8,5),
    tri_c           NUMERIC(8,5),
    dificuldade     SMALLINT,                     -- 1..5 (estimada)
    status          VARCHAR(20) NOT NULL DEFAULT 'extraida',  -- extraida | revisada | publicada | rejeitada
    confianca       NUMERIC(4,3),                 -- confiança da extração (0..1)
    criada_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizada_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (prova_id, numero, lingua)
);
CREATE INDEX ix_questao_area_hab ON questao (area, habilidade_id) WHERE status = 'publicada' AND NOT anulada;

CREATE TABLE alternativa (
    questao_id  BIGINT NOT NULL REFERENCES questao(id) ON DELETE CASCADE,
    letra       CHAR(1) NOT NULL,
    texto       TEXT,
    imagem_key  TEXT,
    PRIMARY KEY (questao_id, letra)
);

CREATE TABLE questao_assunto (
    questao_id  BIGINT NOT NULL REFERENCES questao(id) ON DELETE CASCADE,
    assunto_id  INT NOT NULL REFERENCES assunto(id),
    PRIMARY KEY (questao_id, assunto_id)
);

-- ========== Cursos e notas de corte ==========
CREATE TABLE instituicao (
    id          SERIAL PRIMARY KEY,
    codigo_inep INT UNIQUE,
    sigla       TEXT,
    nome        TEXT NOT NULL,
    uf          CHAR(2)
);

CREATE TABLE curso (
    id              SERIAL PRIMARY KEY,
    instituicao_id  INT NOT NULL REFERENCES instituicao(id),
    codigo_sisu     BIGINT UNIQUE,
    nome            TEXT NOT NULL,
    campus          TEXT,
    cidade          TEXT,
    grau            TEXT,                         -- bacharelado | licenciatura | tecnologico
    turno           TEXT,
    peso_lc NUMERIC(4,2) DEFAULT 1, peso_ch NUMERIC(4,2) DEFAULT 1,
    peso_cn NUMERIC(4,2) DEFAULT 1, peso_mt NUMERIC(4,2) DEFAULT 1,
    peso_red NUMERIC(4,2) DEFAULT 1,
    nota_minima     NUMERIC(6,2)
);
CREATE INDEX ix_curso_nome ON curso (nome);

CREATE TABLE nota_corte (
    curso_id        INT NOT NULL REFERENCES curso(id),
    ano             SMALLINT NOT NULL,
    edicao          SMALLINT NOT NULL DEFAULT 1,
    modalidade      TEXT NOT NULL,                -- ampla concorrência, cotas...
    nota            NUMERIC(6,2) NOT NULL,
    vagas           INT,
    PRIMARY KEY (curso_id, ano, edicao, modalidade)
);

-- ========== Planos e usuários ==========
CREATE TABLE plano (
    codigo                  VARCHAR(20) PRIMARY KEY,   -- gratis, basico, ..., topo
    nome                    TEXT NOT NULL,
    preco_mensal_centavos   INT NOT NULL DEFAULT 0,
    limite_diario_questoes  INT,                       -- NULL = ilimitado
    max_cursos_alvo         SMALLINT NOT NULL DEFAULT 1,
    recursos                JSONB NOT NULL DEFAULT '{}',
    ativo                   BOOLEAN NOT NULL DEFAULT TRUE,
    ordem                   SMALLINT NOT NULL
);

CREATE TABLE usuario (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_sub             TEXT UNIQUE NOT NULL,
    email                   TEXT UNIQUE NOT NULL,
    nome                    TEXT,
    plano                   VARCHAR(20) NOT NULL DEFAULT 'gratis' REFERENCES plano(codigo),
    menor_idade             BOOLEAN,
    consentimento_resp_em   TIMESTAMPTZ,            -- LGPD art. 14
    termos_aceitos_em       TIMESTAMPTZ,
    criado_em               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE objetivo (
    usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    curso_id    INT NOT NULL REFERENCES curso(id),
    modalidade  TEXT NOT NULL DEFAULT 'ampla',
    prioridade  SMALLINT NOT NULL DEFAULT 1,
    PRIMARY KEY (usuario_id, curso_id)
);

CREATE TABLE assinatura (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    plano           VARCHAR(20) NOT NULL REFERENCES plano(codigo),
    status          VARCHAR(20) NOT NULL,          -- pendente | ativa | cancelada | inadimplente
    gateway         VARCHAR(30),
    gateway_id      TEXT,
    inicio          TIMESTAMPTZ,
    fim             TIMESTAMPTZ,
    criada_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gateway, gateway_id)
);

-- ========== Prática e simulados ==========
CREATE TABLE simulado (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tipo            VARCHAR(20) NOT NULL,          -- area | dia1 | dia2 | completo
    area            VARCHAR(3) REFERENCES area(codigo),
    iniciado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
    finalizado_em   TIMESTAMPTZ,
    notas           JSONB                          -- nota estimada por área
);

CREATE TABLE resposta (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    questao_id      BIGINT NOT NULL REFERENCES questao(id),
    simulado_id     BIGINT REFERENCES simulado(id) ON DELETE CASCADE,
    letra           CHAR(1),
    correta         BOOLEAN NOT NULL,
    tempo_ms        INT,
    respondida_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_resposta_usuario ON resposta (usuario_id, respondida_em DESC);

CREATE TABLE uso_diario (
    usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    dia         DATE NOT NULL,
    questoes    INT NOT NULL DEFAULT 0,
    PRIMARY KEY (usuario_id, dia)
);

CREATE TABLE chance_aprovacao (
    usuario_id      UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    curso_id        INT NOT NULL REFERENCES curso(id),
    modalidade      TEXT NOT NULL,
    nota_estimada   NUMERIC(6,2),
    chance          NUMERIC(4,3),                  -- 0..1
    faixa_min       NUMERIC(4,3),
    faixa_max       NUMERIC(4,3),
    calculada_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (usuario_id, curso_id, modalidade)
);

-- ========== Pipeline ==========
CREATE TABLE pipeline_execucao (
    id              BIGSERIAL PRIMARY KEY,
    tipo            VARCHAR(30) NOT NULL,          -- coleta_prova | extracao | notas_corte | monitor
    referencia      TEXT,
    status          VARCHAR(20) NOT NULL,
    detalhes        JSONB,
    iniciada_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
    finalizada_em   TIMESTAMPTZ
);
