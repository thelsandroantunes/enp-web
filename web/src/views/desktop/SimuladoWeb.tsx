"use client";

import Link from "next/link";
import { AreasWeb } from "@/components/desktop/Areas";
import { ApoioSimulado } from "@/components/feedback/ApoioSimulado";
import { AreaChip } from "@/components/feedback/AreaChip";
import { useSimulado } from "@/hooks/useSimulado";
import { AREAS } from "@/lib/dados";
import { curto, pct, tempo } from "@/lib/formato";
import { chance, corChance, faixa, notas, opcaoPrincipal, pago } from "@/lib/motor";

const LETRAS = "ABCDE";
const areaNome = (id: string) => AREAS.find((a) => a.id === id)!.nome;

export function SimuladoWeb() {
  const { s, sim, piorArea, limite, esgotado, setEsgotado, iniciar, marcar, irPara, avancar, entregar, sair } = useSimulado();

  if (!sim) {
    return (
      <>
        <h2 className="d-h2">Simulado</h2>
        <div className="d-grid d-g2" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
          <div className="d-card">
            <span className="d-pill hl">Simulado rápido TRI</span>
            <h3 className="d-h3" style={{ marginTop: 12, fontSize: 22 }}>8 questões · 2 por área · 24 minutos</h3>
            <p className="d-mut">Responda na ordem que quiser pelo cartão-resposta. A correção é feita no final, como na prova, e você vê a nota por área e quanto a chance mudou.</p>
            <button className="d-btn hl" onClick={iniciar}>Começar simulado →</button>
          </div>
          <div className="d-card">
            <div className="d-mut d-small">Simulados usados este mês</div>
            <div className="d-kpi">{s.simUsados}{limite !== null ? ` / ${limite}` : ""}</div>
            <div className="d-small d-mut">{limite !== null ? "Ilimitados a partir do Plus." : "Ilimitados no seu plano."}</div>
            <p className="d-small d-mut" style={{ marginTop: 14 }}>No produto: simulado completo de 180 questões (2 dias) e simulados por área, com a mesma régua TRI do Inep.</p>
          </div>
        </div>
        {esgotado && (
          <div className="d-modal" onClick={(e) => e.target === e.currentTarget && setEsgotado(false)}>
            <div className="d-card">
              <h3 className="d-h3">Simulados do mês esgotados</h3>
              <p className="d-small d-mut">Seu plano inclui {limite} simulado(s) por mês. No Plus eles são ilimitados.</p>
              <div className="d-row"><Link className="d-btn sm" href="/planos">Ver planos</Link><button className="d-btn ghost sm" onClick={() => setEsgotado(false)}>Agora não</button></div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (sim.fim) {
    const op = opcaoPrincipal(s);
    const dep = chance(s, op).p;
    const ac = sim.acertos.filter(Boolean).length;
    return (
      <>
        <div className="d-between"><h2 className="d-h2" style={{ margin: 0 }}>Resultado do simulado</h2>
          <button className="d-btn ghost sm" onClick={sair}>Novo simulado</button></div>
        <div className="d-mt"><ApoioSimulado acertos={ac} total={sim.qs.length} piorArea={piorArea} /></div>
        <div className="d-grid d-g3 d-mt">
          <div className="d-card"><div className="d-mut d-small">Acertos</div><div className="d-kpi">{ac} / {sim.qs.length}</div>
            <div className="d-small d-mut">{sim.t === 0 ? "tempo esgotado" : `sobraram ${tempo(sim.t)}`}</div></div>
          <div className="d-card"><div className="d-mut d-small">Chance em {curto(op.universidade)}</div>
            <div className="d-kpi" style={{ color: corChance(dep) }}>{pago(s) ? `${pct(sim.antes)} → ${pct(dep)}` : faixa(dep)[0]}</div></div>
          <div className="d-card"><div className="d-mut d-small">Por que a nota mudou assim?</div>
            <div className="d-small">Acertar questões difíceis pesa mais que acertar fáceis: é a TRI do ENEM.</div></div>
        </div>
        <div className="d-grid d-g2 d-mt">
          <div className="d-card"><h3 className="d-h3">Notas por área</h3><AreasWeb ns={notas(s)} antes={sim.notasAntes} /></div>
          <div className="d-card"><h3 className="d-h3">Gabarito</h3>
            <table className="d-table"><thead><tr><th>#</th><th>Área</th><th>Sua</th><th>Certa</th><th></th></tr></thead>
              <tbody>{sim.qs.map((q, k) => (
                <tr key={k}><td>{k + 1}</td><td>{areaNome(q.area)}</td>
                  <td>{sim.marcadas[k] === null ? "—" : LETRAS[sim.marcadas[k]!]}</td><td>{LETRAS[q.correta]}</td>
                  <td>{sim.acertos[k] ? <span className="d-up">✓ 🎉</span> : <span className="d-down">✗</span>}</td></tr>
              ))}</tbody></table>
          </div>
        </div>
        <div className="d-mt"><Link className="d-btn" href="/chances" onClick={sair}>Ver todas as chances →</Link></div>
      </>
    );
  }

  const q = sim.qs[sim.i];
  const marcadas = sim.marcadas.filter((m) => m !== null).length;
  return (
    <div className="d-layout">
      <aside className="d-card d-sticky">
        <div className="d-mut d-small">Tempo restante</div>
        <div className="d-timer" style={{ color: sim.t < 120 ? "var(--bad)" : undefined }}>{tempo(sim.t)}</div>
        <h3 className="d-h3" style={{ marginTop: 16 }}>Cartão-resposta</h3>
        <div className="d-gab">
          {sim.qs.map((x, k) => (
            <button key={k} className={`${k === sim.i ? "cur" : ""} ${sim.marcadas[k] !== null ? "m" : ""}`} onClick={() => irPara(k)}>
              {k + 1}<small>{sim.marcadas[k] !== null ? LETRAS[sim.marcadas[k]!] : x.area}</small>
            </button>
          ))}
        </div>
        <p className="d-small d-mut">{marcadas} de {sim.qs.length} marcadas</p>
        <button className="d-btn full" onClick={entregar}>Entregar simulado</button>
      </aside>
      <div className="d-card">
        <div className="d-between"><b>Questão {sim.i + 1} de {sim.qs.length}</b><AreaChip id={q.area} /></div>
        <p className="d-stem">{q.enunciado}</p>
        {q.alternativas.map((t, i) => (
          <button key={i} className={`d-opt ${sim.marcadas[sim.i] === i ? "sel" : ""}`} onClick={() => marcar(i)}>
            <span className="L">{LETRAS[i]}</span><span>{t}</span>
          </button>
        ))}
        <div className="d-row" style={{ marginTop: 14 }}>
          <button className="d-btn ghost sm" disabled={sim.i === 0} onClick={() => irPara(sim.i - 1)}>← Anterior</button>
          <button className="d-btn sm" onClick={avancar}>{sim.i < sim.qs.length - 1 ? "Próxima →" : "Finalizar"}</button>
        </div>
      </div>
    </div>
  );
}
