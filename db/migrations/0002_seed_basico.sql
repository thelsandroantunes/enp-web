-- Dados de referência mínimos
INSERT INTO area (codigo, nome) VALUES
 ('LC', 'Linguagens, Códigos e suas Tecnologias'),
 ('CH', 'Ciências Humanas e suas Tecnologias'),
 ('CN', 'Ciências da Natureza e suas Tecnologias'),
 ('MT', 'Matemática e suas Tecnologias'),
 ('RED', 'Redação')
ON CONFLICT DO NOTHING;

-- Planos provisórios (preços e limites definidos na Etapa G)
INSERT INTO plano (codigo, nome, preco_mensal_centavos, limite_diario_questoes, max_cursos_alvo, ordem) VALUES
 ('gratis', 'Grátis', 0, 10, 1, 0)
ON CONFLICT DO NOTHING;
