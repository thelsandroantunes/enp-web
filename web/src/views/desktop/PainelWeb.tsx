"use client";

import Link from "next/link";
import { AreasWeb } from "@/components/desktop/Areas";
import { BarraXP } from "@/components/feedback/BarraXP";
import { GraficoChance } from "@/components/desktop/Grafico";
import { modalidade, nomeArea, plano } from "@/lib/dados";
import { curto, pct, pp } from "@/lib/formato";
import { chance, corChance, cursoAtual, faixa, melhorArea, notas, opcaoPrincipal, opcoesVisiveis, pago, precisao, totalRespondidas } from "@/lib/motor";
import { useApp } from "@/state/AppState";

export function PainelWeb() {
  const { s } = useApp();
  const c = cursoAtual(s);
  const op = opcaoPrincipal(s);
  const ch = chance(s, op);
  const pg = pago(s);
  const [fx] = faixa(ch.p);
  const [pr, pt] = precisao(s);
  const best = melhorArea(s, op);
  const total = totalRespondidas(s);
  const acertos = Object.values(s.resp).flat().filter((r) => r.u).length;
  const visiveis = opcoesVisiveis(s);

  return (
    <>
      <div className="d-between" style={{ alignItems: "flex-end" }}>
        <div>
          <h2 className="d-h2" style={{ margin: 0 }}>Painel de preparação</h2>
          <div className="d-mut d-small">{c.nome} · {modalidade(s.mod).nome} · plano {plano(s.plano).nome}</div>
        </div>
        <div className="d-small d-mut">🔥 <b>{s.streak}</b> dias seguidos · hoje <b>{s.hoje}</b> questões</div>
      </div>

      <div className="d-card d-mt" style={{ padding: 16 }}><BarraXP xp={s.xp} /></div>

      <div className="d-grid d-g4 d-mt">
        <div className="d-card">
          <div className="d-mut d-small">Chance em {curto(op.universidade)}</div>
          {pg ? <div className="d-kpi" style={{ color: corChance(ch.p) }}>{pct(ch.p)}</div>
            : <div className="d-kpi" style={{ color: corChance(ch.p) }}>{fx}</div>}
          <div className="d-small d-mut">{pg ? (s.ultimoDelta !== null ? <>última questão: <span className={Math.abs(s.ultimoDelta) < 0.0005 ? "" : s.ultimoDelta > 0 ? "d-up" : "d-down"}>{pp(s.ultimoDelta)}</span></> : "responda para ver a variação") : <Link href="/planos">% exata no Essencial</Link>}</div>
        </div>
        <div className="d-card">
          <div className="d-mut d-small">Sua nota no curso</div>
          <div className="d-kpi">{ch.nota.toFixed(0)} <span className="d-small d-mut">± {ch.se.toFixed(0)}</span></div>
          <div className="d-small d-mut">corte {ch.corte.toFixed(0)} · {ch.falta > 0 ? `faltam ${ch.falta.toFixed(0)}` : <span className="d-up">{(-ch.falta).toFixed(0)} acima</span>}</div>
        </div>
        <div className="d-card">
          <div className="d-mut d-small">Questões respondidas</div>
          <div className="d-kpi">{total}</div>
          <div className="d-small d-mut">{total ? `${Math.round((acertos / total) * 100)}% de acerto` : "comece pelas questões"}</div>
        </div>
        <div className="d-card">
          <div className="d-mut d-small">Precisão da estimativa</div>
          <div className="d-kpi" style={{ textTransform: "capitalize" }}>{pr}</div>
          <span className={`d-pill ${pt}`}>{total < 60 ? `${60 - Math.min(60, total)} questões para “alta”` : "estimativa firme"}</span>
        </div>
      </div>

      <div className="d-alert d-mt">
        {best.g >= 0.005
          ? <>🎯 <b>Próximo passo:</b> {nomeArea(best.k)} é a área que mais move sua chance em {c.nome}: +20 pontos nela ≈ <b>{pp(best.g)}</b>.</>
          : <>🎯 Você está a <b>{Math.max(0, ch.falta).toFixed(0)} pontos</b> do corte. Em {c.nome}, <b>{nomeArea(best.k)}</b> tem o maior peso: é por onde a nota sobe mais rápido.</>}
        {" "}<Link href="/questoes" style={{ fontWeight: 900, textDecoration: "underline" }}>Bora treinar →</Link>
      </div>

      <div className="d-grid d-g2 d-mt" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="d-card">
          <div className="d-between"><h3 className="d-h3">Evolução da chance</h3><span className="d-small d-mut">{curto(op.universidade)}</span></div>
          {s.hist.length > 1 ? <GraficoChance pontos={s.hist.slice(-40)} /> : <p className="d-mut d-small">Responda questões para ver sua curva.</p>}
        </div>
        <div className="d-card">
          <div className="d-between"><h3 className="d-h3">Notas por área (TRI)</h3><span className="d-small d-mut">p = peso no curso</span></div>
          <AreasWeb ns={notas(s)} curso={c} />
        </div>
      </div>

      <div className="d-card d-mt">
        <div className="d-between"><h3 className="d-h3">Suas opções</h3><Link className="d-small d-hl" href="/chances">Ver detalhes →</Link></div>
        <table className="d-table">
          <thead><tr><th>Universidade</th><th>Corte</th><th>Diferença</th><th style={{ width: "34%" }}>Chance</th></tr></thead>
          <tbody>
            {visiveis.map(([i, o]) => {
              const x = chance(s, o);
              const [f] = faixa(x.p);
              return (
                <tr key={i}>
                  <td>{o.universidade}</td>
                  <td>{x.corte.toFixed(0)}</td>
                  <td className={x.falta > 0 ? "d-down" : "d-up"}>{x.falta > 0 ? `−${x.falta.toFixed(0)}` : `+${(-x.falta).toFixed(0)}`}</td>
                  <td><div className="d-row" style={{ flexWrap: "nowrap" }}>
                    <div className="d-barw" style={{ flex: 1 }}><b style={{ width: `${pg ? x.p * 100 : f === "baixa" ? 20 : f === "média" ? 50 : 85}%`, background: corChance(x.p) }} /></div>
                    <b style={{ width: 48, textAlign: "right" }}>{pg ? pct(x.p) : f}</b></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {s.ops.length > visiveis.length && <p className="d-small d-mut">+{s.ops.length - visiveis.length} opção(ões) bloqueada(s) no seu plano. <Link className="d-hl" href="/planos">Liberar</Link></p>}
      </div>
    </>
  );
}
