"use client";

import { useRouter } from "next/navigation";
import { CURSOS, MODALIDADES } from "@/lib/dados";
import { num2 } from "@/lib/formato";
import { chance, opcaoPrincipal } from "@/lib/motor";
import { curso as cursoPorId } from "@/lib/dados";
import { useApp } from "@/state/AppState";

const ETAPAS = ["Curso", "Universidades", "Modalidade e nível"];

export function OnboardingWeb() {
  const { s, set } = useApp();
  const router = useRouter();
  const passo = s.curso ? Math.min(s.onb, 2) : 0;
  const c = cursoPorId(s.curso);

  const concluir = () => {
    set((p) => ({ ...p, onb: 3, hist: [chance(p, opcaoPrincipal(p)).p] }));
    router.push("/inicio");
  };
  const toggle = (i: number) =>
    set((p) => ({ ...p, ops: p.ops.includes(i) ? p.ops.filter((x) => x !== i) : p.ops.length < 5 ? [...p.ops, i] : p.ops }));

  return (
    <div className="d-layout">
      <aside className="d-card d-sticky">
        <span className="d-pill hl">Configuração · 1 minuto</span>
        <h2 className="d-h2" style={{ marginTop: 12 }}>Onde você quer passar?</h2>
        <p className="d-mut d-small">Com isso calculamos sua chance em cada opção desde a primeira questão.</p>
        <div className="d-steps d-mt">
          {ETAPAS.map((e, i) => <div key={e} className={i < passo ? "done" : i === passo ? "on" : ""}>{i + 1}. {e}</div>)}
        </div>
        {c && <p className="d-small d-mut d-mt">Curso: <b style={{ color: "var(--d-ink)" }}>{c.nome}</b>{s.ops.length ? ` · ${s.ops.length} opção(ões)` : ""}</p>}
      </aside>

      <section className="d-card">
        {passo === 0 && (
          <>
            <h3 className="d-h3">1. Escolha o curso</h3>
            <div className="d-row d-mt">
              {CURSOS.map((x) => (
                <button key={x.id} className={`d-chip ${s.curso === x.id ? "on" : ""}`} onClick={() => set((p) => ({ ...p, curso: x.id, ops: [] }))}>
                  {x.nome}{x.top && <span className="t">TOP</span>}
                </button>
              ))}
            </div>
            <div className="d-mt" style={{ marginTop: 24 }}>
              <button className="d-btn" disabled={!s.curso} onClick={() => set((p) => ({ ...p, onb: 1 }))}>Continuar →</button>
            </div>
          </>
        )}

        {passo === 1 && c && (
          <>
            <h3 className="d-h3">2. Escolha até 5 universidades — {c.nome}</h3>
            <p className="d-small d-mut">No plano Grátis você acompanha 1; nos pagos, até 5.</p>
            <table className="d-table d-mt">
              <thead><tr><th></th><th>Universidade</th><th>Nota de corte</th><th>Fonte</th></tr></thead>
              <tbody>
                {c.opcoes.map((o, i) => (
                  <tr key={i} onClick={() => toggle(i)} style={{ cursor: "pointer" }}>
                    <td style={{ width: 36 }}><input type="checkbox" readOnly checked={s.ops.includes(i)} /></td>
                    <td>{o.universidade}</td>
                    <td><b>{num2(o.corte)}</b></td>
                    <td>{o.real ? <span className="d-pill good">Sisu 2026</span> : <span className="d-pill">ilustrativa</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {c.faixa && <p className="d-small d-mut">{c.faixa}. As demais notas são ilustrativas.</p>}
            <div className="d-row" style={{ marginTop: 20 }}>
              <button className="d-btn ghost" onClick={() => set((p) => ({ ...p, onb: 0 }))}>← Voltar</button>
              <button className="d-btn" disabled={!s.ops.length} onClick={() => set((p) => ({ ...p, onb: 2 }))}>Continuar →</button>
            </div>
          </>
        )}

        {passo === 2 && (
          <>
            <h3 className="d-h3">3. Como você vai concorrer?</h3>
            <p className="d-small d-mut">A modalidade muda a nota de corte. A chance por cota é liberada a partir do plano Pro.</p>
            <div className="d-row d-mt">
              {MODALIDADES.map((m) => (
                <button key={m.id} className={`d-chip ${s.mod === m.id ? "on" : ""}`} onClick={() => set((p) => ({ ...p, mod: m.id }))}>{m.nome}</button>
              ))}
            </div>
            <div className="d-grid d-g2" style={{ marginTop: 22 }}>
              <div>
                <div className="d-between"><span className="d-small">Seu nível hoje nas provas objetivas</span><b>{s.prior}</b></div>
                <input type="range" min={400} max={800} step={10} value={s.prior} onChange={(e) => set((p) => ({ ...p, prior: +e.target.value }))} />
                <div className="d-small d-mut">Média do último ENEM ou simulado; se não souber, deixe 550.</div>
              </div>
              <div>
                <div className="d-between"><span className="d-small">Sua redação hoje (estimativa)</span><b>{s.red}</b></div>
                <input type="range" min={300} max={960} step={20} value={s.red} onChange={(e) => set((p) => ({ ...p, red: +e.target.value }))} />
                <div className="d-small d-mut">Ajuste depois que corrigir uma redação.</div>
              </div>
            </div>
            <div className="d-row" style={{ marginTop: 24 }}>
              <button className="d-btn ghost" onClick={() => set((p) => ({ ...p, onb: 1 }))}>← Voltar</button>
              <button className="d-btn hl" onClick={concluir}>Ver minha chance →</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
