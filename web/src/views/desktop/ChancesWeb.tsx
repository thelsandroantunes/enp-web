"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoAluno } from "@/hooks/useDemoAluno";
import { modalidade, MODALIDADES, plano, PLANOS, SIGMA_CORTE } from "@/lib/dados";
import { pct } from "@/lib/formato";
import { chance, corChance, cursoAtual, faixa, pago, temCota } from "@/lib/motor";
import { useApp } from "@/state/AppState";

export function ChancesWeb() {
  const { s, set } = useApp();
  const { simularAluno, zerar } = useDemoAluno();
  const [nivel, setNivel] = useState(700);
  const c = cursoAtual(s);
  const lim = plano(s.plano).maxOpcoes;
  const pg = pago(s);
  const cota = temCota(s);
  const outras = c.opcoes.map((o, i) => [i, o] as const).filter(([i]) => !s.ops.includes(i));
  const planoQueLibera = (k: number) => PLANOS.find((p) => p.maxOpcoes > k)!.nome;

  return (
    <>
      <div className="d-between" style={{ alignItems: "flex-end" }}>
        <div>
          <h2 className="d-h2" style={{ margin: 0 }}>Suas chances · {c.nome}</h2>
          <div className="d-mut d-small">{cota ? modalidade(s.mod).nome : "Ampla concorrência"}{!cota && s.mod !== "ampla" && " · chance por cota no Pro"}</div>
        </div>
        {cota && (
          <div className="d-toggle">
            {MODALIDADES.map((m) => <button key={m.id} className={s.mod === m.id ? "on" : ""} onClick={() => set((p) => ({ ...p, mod: m.id }))}>{m.nome}</button>)}
          </div>
        )}
      </div>

      <div className="d-grid d-mt" style={{ gridTemplateColumns: "1fr 340px", alignItems: "start" }}>
        <div className="d-card">
          <table className="d-table">
            <thead><tr><th>#</th><th>Universidade</th><th>Corte</th><th>Sua nota</th><th>Diferença</th><th style={{ width: "28%" }}>Chance</th><th></th></tr></thead>
            <tbody>
              {s.ops.map((i, k) => {
                const op = c.opcoes[i];
                const ch = chance(s, op);
                const [fx, ft] = faixa(ch.p);
                const travada = k >= lim;
                return (
                  <tr key={i} style={travada ? { opacity: 0.55 } : undefined}>
                    <td>{k + 1}ª</td>
                    <td>{op.universidade}<div className="d-small d-mut">{op.real ? "Sisu 2026" : "corte ilustrativo"}</div></td>
                    {travada ? (
                      <td colSpan={4}><span className="d-small">🔒 Disponível no <Link className="d-hl" href="/planos">{planoQueLibera(k)}</Link></span></td>
                    ) : (
                      <>
                        <td>{ch.corte.toFixed(0)}</td>
                        <td>{ch.nota.toFixed(0)} <span className="d-small d-mut">± {ch.se.toFixed(0)}</span></td>
                        <td className={ch.falta > 0 ? "d-down" : "d-up"}>{ch.falta > 0 ? `−${ch.falta.toFixed(0)}` : `+${(-ch.falta).toFixed(0)}`}</td>
                        <td><div className="d-row" style={{ flexWrap: "nowrap" }}>
                          <div className="d-barw" style={{ flex: 1 }}><b style={{ width: `${pg ? ch.p * 100 : fx === "baixa" ? 20 : fx === "média" ? 50 : 85}%`, background: corChance(ch.p) }} /></div>
                          {pg ? <b style={{ width: 44, textAlign: "right" }}>{pct(ch.p)}</b> : <span className={`d-pill ${ft}`}>{fx}</span>}
                        </div></td>
                      </>
                    )}
                    <td><button className="d-small d-mut" style={{ background: "none", border: 0, cursor: "pointer" }} title="Remover"
                      disabled={s.ops.length === 1} onClick={() => set((p) => ({ ...p, ops: p.ops.filter((x) => x !== i) }))}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {s.ops.length < 5 && outras.length > 0 && (
            <div className="d-row d-mt">
              <select className="d-sel" value="" onChange={(e) => e.target.value !== "" && set((p) => ({ ...p, ops: [...p.ops, +e.target.value] }))}>
                <option value="">+ Adicionar universidade…</option>
                {outras.map(([i, o]) => <option key={i} value={i}>{o.universidade} · corte {o.corte.toFixed(0)}</option>)}
              </select>
            </div>
          )}
          <p className="d-small d-mut">Cortes marcados “Sisu 2026” são reais (ampla concorrência); os demais e os pesos são ilustrativos. Redutor de cota ilustrativo. Incerteza do corte entre edições: ±{SIGMA_CORTE} pontos.</p>
        </div>

        <aside className="d-grid">
          <div className="d-card">
            <h3 className="d-h3">Pesos de {c.nome}</h3>
            <table className="d-table"><tbody>
              {(["LC", "CH", "CN", "MT", "RED"] as const).map((k) => (
                <tr key={k}><td>{{ LC: "Linguagens", CH: "Humanas", CN: "Natureza", MT: "Matemática", RED: "Redação" }[k]}</td><td style={{ textAlign: "right" }}><b>{c.pesos[k]}</b></td></tr>
              ))}
            </tbody></table>
          </div>
          <div className="d-card">
            <h3 className="d-h3">Demonstração: simular aluno</h3>
            <p className="d-small d-mut">Gera respostas de um aluno com nível real escolhido, para ver a estimativa e a chance convergirem.</p>
            <div className="d-between"><span className="d-small">Nível real</span><b>{nivel}</b></div>
            <input type="range" min={400} max={850} step={10} value={nivel} onChange={(e) => setNivel(+e.target.value)} />
            <div className="d-row" style={{ marginTop: 10 }}>
              <button className="d-btn sm" onClick={() => simularAluno(20, nivel)}>+20</button>
              <button className="d-btn ghost sm" onClick={() => simularAluno(100, nivel)}>+100</button>
              <button className="d-btn ghost sm" onClick={zerar}>Zerar</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
