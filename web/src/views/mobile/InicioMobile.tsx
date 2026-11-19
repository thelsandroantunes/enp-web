"use client";

import Link from "next/link";
import { Badge } from "@/components/Badge";
import { BarraXP } from "@/components/feedback/BarraXP";
import { Delta } from "@/components/Delta";
import { NotasPorArea } from "@/components/NotasPorArea";
import { Ring } from "@/components/Ring";
import { modalidade, nomeArea } from "@/lib/dados";
import { pct, pp } from "@/lib/formato";
import { chance, corChance, cursoAtual, faixa, melhorArea, notas, opcaoPrincipal, pago, precisao, totalRespondidas } from "@/lib/motor";
import { useApp } from "@/state/AppState";

export function InicioMobile() {
  const { s } = useApp();
  const c = cursoAtual(s);
  const op = opcaoPrincipal(s);
  const ch = chance(s, op);
  const ns = notas(s);
  const pg = pago(s);
  const [fx] = faixa(ch.p);
  const [pr, pt] = precisao(s);
  const best = melhorArea(s, op);
  const hist = s.hist.slice(-20);

  return (
    <>
      <div className="sub">Olá! Seu objetivo</div>
      <div className="h">{c.nome}</div>
      <div className="sub" style={{ marginBottom: 12 }}>{op.universidade} · {modalidade(s.mod).nome}</div>

      <div className="card" style={{ padding: 12 }}><BarraXP xp={s.xp} /></div>
      <div className="card">
        <div className="row" style={{ gap: 14, flexWrap: "nowrap" }}>
          <Ring p={ch.p} cor={corChance(ch.p)}>
            {pg ? <><div className="p">{pct(ch.p)}</div><div className="l">chance estimada</div></>
              : <><div className="p txt">{fx}</div><div className="l">chance</div></>}
          </Ring>
          <div style={{ flex: 1 }}>
            <div className="k">Sua nota no curso</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {ch.nota.toFixed(0)} <span className="sub" style={{ fontWeight: 500 }}>± {ch.se.toFixed(0)}</span>
            </div>
            <div className="sub">
              Corte: {ch.corte.toFixed(0)} ·{" "}
              {ch.falta > 0 ? <>faltam <b>{ch.falta.toFixed(0)}</b> pts</> : <b style={{ color: "var(--good)" }}>{(-ch.falta).toFixed(0)} pts acima</b>}
            </div>
            <div style={{ marginTop: 6 }} className="row">
              <Badge tom={pt}>Precisão {pr}</Badge>
              {!pg && <Badge tom="pri">% no Essencial</Badge>}
            </div>
          </div>
        </div>
        {s.ultimoDelta !== null && pg && (
          <p className="sub" style={{ margin: "10px 0 0" }}>Última questão: <Delta d={s.ultimoDelta} /></p>
        )}
      </div>

      <div className="tip">
        {best.g >= 0.005 ? (
          <>Próximo passo: <b>{nomeArea(best.k)}</b> é a área que mais move sua chance em {c.nome} (+20 pontos nela ≈ <b>{pp(best.g)}</b>).</>
        ) : (
          <>Você está a <b>{Math.max(0, ch.falta).toFixed(0)} pontos</b> do corte. Em {c.nome}, <b>{nomeArea(best.k)}</b> tem o maior peso: é por onde a nota sobe mais rápido. Veja também opções com corte menor em Chances.</>
        )}
      </div>

      <Link href="/questoes" className="btn">Bora treinar! 10 questões 💪</Link>
      <div className="espaco" />

      <div className="grid2">
        <div className="card">
          <div className="between"><div className="k">Notas por área (TRI)</div><span className="sub">{totalRespondidas(s)} questões</span></div>
          <NotasPorArea ns={ns} curso={c} red={s.red} />
        </div>
        <div className="card">
          <div className="between"><div className="k">Evolução da chance</div><span className="sub">🔥 {s.streak} dias seguidos</span></div>
          {hist.length > 1 ? (
            <div className="spark">{hist.map((p, i) => <i key={i} style={{ height: `${Math.max(4, p * 100)}%` }} />)}</div>
          ) : (
            <p className="sub">Responda questões para ver sua curva.</p>
          )}
        </div>
      </div>
    </>
  );
}
