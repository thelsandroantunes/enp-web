const FASES: [string, string, string][] = [
  ["A. Fundação", "Contas dev/prod, alertas de orçamento, CDK (Python), deploy pelo GitHub Actions com OIDC, domínio", "push na main faz deploy em dev sem chave salva"],
  ["B. Dados", "Aurora Serverless v2 + Data API, migrações, buckets S3", "schema criado por script; buckets privados"],
  ["C. Pipeline de questões", "Coleta Inep/Sisu, conversão, extração e classificação com Bedrock, Step Functions", "2 edições com 95%+ das questões corretas"],
  ["D. API + login", "Cognito, API Gateway, FastAPI, limite diário por plano", "aluno bloqueado ao atingir o limite do Grátis"],
  ["E. App web", "Next.js a partir deste protótipo, PWA; visual web e visual celular", "cadastro → objetivo → prática → desempenho"],
  ["F. Simulados + chance", "Simulado por área e completo, nota TRI, cortes e pesos por curso/modalidade", "chance com faixa de confiança e explicação"],
  ["G. Pagamento + e-mail", "Pix/cartão com webhook, escada de planos, SES", "plano muda sozinho pelo webhook"],
  ["H. Monitor + atualização", "Novas provas, gabaritos, anulações e notas de corte; recálculo das chances", "questão anulada sai da prática sem ação manual"],
  ["I. Produção", "WAF, backups, termos e privacidade (LGPD, menores de 18)", "checklist de segurança e LGPD aprovado"],
];

export function EtapasWeb() {
  return (
    <>
      <h2 className="d-h2">Etapas do projeto</h2>
      <div className="d-card">
        <h3 className="d-h3">Fluxo das questões</h3>
        <div className="d-pipe" style={{ marginTop: 10 }}>
          <span>Coleta<em>provas e gabaritos Inep</em></span>→<span>Conversão<em>PDF → texto e imagens</em></span>→
          <span>Extração<em>IA: enunciado, alternativas</em></span>→<span>Classificação<em>área, habilidade, assunto</em></span>→
          <span>Parâmetros TRI<em>microdados Inep</em></span>→<span>Prática e simulados<em>por nível</em></span>→<span>Monitor<em>anulações e cortes</em></span>
        </div>
        <p className="d-small d-mut">Cada prova é processada uma vez e serve a todos os alunos. Notas de corte e pesos vêm do Sisu, por curso, universidade e modalidade.</p>
      </div>

      <div className="d-card d-mt">
        <h3 className="d-h3">Plano de implantação</h3>
        <table className="d-table">
          <thead><tr><th>Etapa</th><th>O que construir</th><th>Pronto quando</th></tr></thead>
          <tbody>{FASES.map(([e, o, p]) => <tr key={e}><td><b>{e}</b></td><td className="d-mut">{o}</td><td>{p}</td></tr>)}</tbody>
        </table>
      </div>

      <h2 className="d-h2" style={{ marginTop: 36 }}>Arquitetura na AWS</h2>
      <p className="d-mut">Serverless: custo perto de zero sem usuários e escala com a demanda.</p>
      <div className="d-grid d-g3">
        <div className="d-card"><h3 className="d-h3">🌐 App e acesso</h3><table className="d-table"><tbody>
          <tr><td>CloudFront + S3</td><td className="d-mut">app web (Next.js)</td></tr>
          <tr><td>Cognito</td><td className="d-mut">login e-mail e Google</td></tr>
          <tr><td>API Gateway + Lambda</td><td className="d-mut">API (FastAPI)</td></tr></tbody></table></div>
        <div className="d-card"><h3 className="d-h3">🗄️ Dados</h3><table className="d-table"><tbody>
          <tr><td>Aurora Serverless v2</td><td className="d-mut">PostgreSQL, pausa no dev</td></tr>
          <tr><td>S3 provas</td><td className="d-mut">PDFs e gabaritos</td></tr>
          <tr><td>S3 imagens</td><td className="d-mut">figuras das questões</td></tr></tbody></table></div>
        <div className="d-card"><h3 className="d-h3">⚙️ Processamento</h3><table className="d-table"><tbody>
          <tr><td>Step Functions</td><td className="d-mut">orquestra o pipeline</td></tr>
          <tr><td>Bedrock (Claude)</td><td className="d-mut">extração e classificação</td></tr>
          <tr><td>EventBridge</td><td className="d-mut">monitor diário</td></tr>
          <tr><td>SES</td><td className="d-mut">e-mails e alertas</td></tr></tbody></table></div>
      </div>
    </>
  );
}
