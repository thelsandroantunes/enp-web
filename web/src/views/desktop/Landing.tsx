"use client";

import Link from "next/link";
import { Ring } from "@/components/Ring";
import { useApp } from "@/state/AppState";

const PASSOS = [
  { ic: "🎯", t: "1. Seu objetivo", d: "Escolha o curso, até 5 universidades e a modalidade (ampla ou cotas)." },
  { ic: "🧠", t: "2. Questões no seu nível", d: "Questões do ENEM escolhidas pela dificuldade que mais informa sobre você." },
  { ic: "📈", t: "3. Nota pela TRI", d: "Estimamos sua nota por área na mesma régua do Inep, com margem de erro." },
  { ic: "🏁", t: "4. Chance por opção", d: "Comparamos com a nota de corte e os pesos de cada curso, e mostramos onde focar." },
];

const FAQ = [
  ["A chance é garantia de aprovação?", "Não. É uma estimativa: sua nota provável (com margem de erro) comparada com as notas de corte anteriores, que também variam entre edições. Quanto mais você pratica, mais precisa ela fica."],
  ["De onde vêm as questões?", "No produto, de provas oficiais do ENEM publicadas pelo Inep, com os parâmetros TRI dos microdados, e de questões inéditas calibradas. Neste protótipo, as questões são exemplos."],
  ["Por que acertar uma difícil vale mais?", "É assim que a TRI funciona: o acerto em questão difícil, somado a acertos coerentes nas fáceis, indica proficiência mais alta. O motor reproduz esse cálculo."],
  ["Serve para cotas?", "Sim. A partir do plano Pro a chance é calculada para a sua modalidade de concorrência."],
  ["Preciso pagar para testar?", "Não. O plano Grátis tem 20 questões por dia e mostra sua chance em faixa (baixa, média ou alta)."],
];

export function Landing() {
  const { s } = useApp();
  const destino = s.onb < 3 ? "/onboarding" : "/inicio";
  return (
    <>
      <section className="d-hero">
        <div>
          <span className="d-pill hl">ENEM 2027 · Sisu</span>
          <h1 className="d-h1">Saiba sua chance de passar. <span className="d-hl">E o que fazer para aumentar.</span></h1>
          <p className="d-lead">Escolha o curso e as universidades. A cada questão que você resolve, recalculamos sua nota pela TRI e sua chance em cada opção.</p>
          <div className="d-row d-mt">
            <Link className="d-btn" href={destino}>{s.onb < 3 ? "Calcular minha chance grátis →" : "Ir para o meu painel →"}</Link>
            <Link className="d-btn ghost" href="/planos">Ver planos</Link>
          </div>
          <div className="d-trust"><span>✓ Sem cartão</span><span>✓ 20 questões grátis por dia</span><span>✓ Chance por curso, universidade e cota</span></div>
        </div>
        <div className="d-mock" aria-label="Exemplo de painel">
          <div className="d-between"><b>Medicina · UFMG</b><span className="d-pill">exemplo</span></div>
          <div className="d-row d-mt" style={{ gap: 18, flexWrap: "nowrap" }}>
            <Ring p={0.34} cor="var(--warn)"><div style={{ fontSize: 28, fontWeight: 850 }}>34%</div><div className="d-small d-mut">chance</div></Ring>
            <div style={{ flex: 1 }}>
              <div className="r"><span>Sua nota no curso</span><b>802 ± 21</b></div>
              <div className="r"><span>Nota de corte</span><b>818</b></div>
              <div className="r"><span>Faltam</span><b>16 pontos</b></div>
              <div className="r"><span>Onde focar</span><b className="d-hl">Natureza</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="d-block">
        <div className="d-grid d-g3">
          <div><div className="d-big">180</div><div className="d-mut d-small">questões objetivas no ENEM, em 4 áreas, além da redação</div></div>
          <div><div className="d-big">TRI</div><div className="d-mut d-small">a nota não é número de acertos: depende de quais questões você acerta</div></div>
          <div><div className="d-big">1 corte</div><div className="d-mut d-small">por curso, universidade e modalidade, cada um com seus pesos por área</div></div>
        </div>
      </section>

      <section className="d-block">
        <h2 className="d-h2">Estudar muito não basta.<br /><span className="d-mut">É preciso saber onde cada ponto vale mais.</span></h2>
        <div className="d-grid d-g2 d-vs d-mt">
          <div className="d-card"><h3 className="d-h3 d-mut">Sem o ENP</h3><ul className="d-mut">
            <li>Você conta acertos, mas o ENEM usa TRI</li><li>Não sabe quão longe está do corte do seu curso</li>
            <li>Estuda todas as áreas igual, ignorando os pesos</li><li>Descobre a nota só no resultado</li></ul></div>
          <div className="d-card" style={{ borderColor: "var(--d-hl)" }}><h3 className="d-h3">Com o ENP</h3><ul>
            <li>Nota estimada por área, com margem de erro</li><li>Chance em cada opção, atualizada a cada questão</li>
            <li>A área que mais move a sua chance, pelos pesos do curso</li><li>Simulados com a mesma régua do Inep</li></ul></div>
        </div>
      </section>

      <section className="d-block">
        <h2 className="d-h2">Como funciona</h2>
        <div className="d-grid d-g4 d-mt">
          {PASSOS.map((p) => (
            <div className="d-card" key={p.t}><div className="d-ic">{p.ic}</div><h3 className="d-h3">{p.t}</h3><p className="d-small d-mut" style={{ margin: 0 }}>{p.d}</p></div>
          ))}
        </div>
      </section>

      <section className="d-block">
        <div className="d-grid d-g2" style={{ alignItems: "center" }}>
          <div>
            <span className="d-pill hl">Transparente</span>
            <h2 className="d-h2" style={{ marginTop: 12 }}>Como a chance é calculada</h2>
            <p className="d-mut">Nota por área estimada pela TRI (3 parâmetros) → média ponderada pelos pesos do curso → comparação com a nota de corte, considerando a sua margem de erro e a variação do corte entre edições.</p>
            <p className="d-mut">Com poucas respostas a incerteza é alta e a chance fica perto do meio. Ela fica mais firme conforme você pratica.</p>
          </div>
          <div className="d-card" style={{ fontFamily: "ui-monospace, monospace", fontSize: 14 }}>
            <div className="d-mut">P(aprovação) =</div>
            <div style={{ fontSize: 20, margin: "8px 0" }}>Φ( (nota − corte) / √(σ²<sub>nota</sub> + σ²<sub>corte</sub>) )</div>
            <div className="d-mut d-small">Φ = distribuição normal acumulada</div>
          </div>
        </div>
      </section>

      <section className="d-block">
        <h2 className="d-h2">Perguntas frequentes</h2>
        {FAQ.map(([q, r]) => <details key={q}><summary>{q}</summary><p>{r}</p></details>)}
      </section>

      <div className="d-cta">
        <h2 className="d-h2">O ENEM tem data. Sua chance também tem número.</h2>
        <p style={{ opacity: 0.8 }}>Comece grátis e veja sua chance mudar a cada questão.</p>
        <Link className="d-btn" href={destino}>Começar agora</Link>
      </div>
    </>
  );
}
