"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/Badge";
import { modalidade, MODALIDADES, plano, SIGMA_CORTE } from "@/lib/dados";
import { pct } from "@/lib/formato";
import { chance, corChance, cursoAtual, faixa, pago, temCota } from "@/lib/motor";
import { useDemoAluno } from "@/hooks/useDemoAluno";
import { useApp } from "@/state/AppState";

export function ChancesMobile() {
  const { s, set } = useApp();
  const [nivel, setNivel] = useState(700);
  const c = cursoAtual(s);
  const lim = plano(s.plano).maxOpcoes;
  const pg = pago(s);
  const cota = temCota(s);
  const outras = c.opcoes.map((o, i) => [i, o] as const).filter(([i]) => !s.ops.includes(i));

  const { simularAluno, zerar } = useDemoAluno();

  return (
    <>
      <div className="h">Suas chances</div>
      <p className="sub">
        {c.nome} · {cota ? modalidade(s.mod).nome : "Ampla concorrência"}{" "}
        {!cota && s.mod !== "ampla" && <Badge tom="top">cota no Pro</Badge>}
      </p>
      <div className="espaco" />

      {s.ops.map((i, k) => {
        const op = c.opcoes[i];
        const ch = chance(s, op);
        const [fx, ft] = faixa(ch.p);
        const corpo = (
          <>
            <div className="between">
              <div>
                <b>{op.universidade}</b>
                <div className="sub">Corte {ch.corte.toFixed(0)}{op.real ? " (Sisu 2026)" : " (ilustr.)"} · sua nota {ch.nota.toFixed(0)} ± {ch.se.toFixed(0)}</div>
              </div>
              {pg ? <b style={{ fontSize: 18 }}>{pct(ch.p)}</b> : <Badge tom={ft}>{fx}</Badge>}
            </div>
            <div className="bar" style={{ marginTop: 8 }}>
              <i style={{ width: `${pg ? ch.p * 100 : fx === "baixa" ? 20 : fx === "média" ? 50 : 85}%`, background: corChance(ch.p) }} />
            </div>
          </>
        );
        return k >= lim ? (
          <div className="card lock" key={i}>
            <div className="blur">{corpo}</div>
            <div className="cta"><Link className="btn small" href="/planos">Liberar {k + 1}ª opção</Link></div>
          </div>
        ) : (
          <div className="card" key={i}>{corpo}</div>
        );
      })}

      {s.ops.length < 5 && outras.length > 0 && (
        <div className="card">
          <div className="k" style={{ marginBottom: 8 }}>Adicionar opção</div>
          <select className="sel-native" value="" onChange={(e) => e.target.value !== "" && set((p) => ({ ...p, ops: [...p.ops, +e.target.value] }))}>
            <option value="">Escolher universidade…</option>
            {outras.map(([i, o]) => <option key={i} value={i}>{o.universidade}</option>)}
          </select>
        </div>
      )}

      {cota && (
        <div className="card">
          <div className="k" style={{ marginBottom: 8 }}>Modalidade</div>
          <div className="chips">
            {MODALIDADES.map((m) => (
              <button key={m.id} className={`chip ${s.mod === m.id ? "on" : ""}`} onClick={() => set((p) => ({ ...p, mod: m.id }))}>{m.nome}</button>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="k">Demonstração: simular aluno</div>
        <p className="sub" style={{ margin: "4px 0 8px" }}>Gera respostas de um aluno com nível real escolhido, usando itens sintéticos, para ver a estimativa e a chance convergirem.</p>
        <div className="between"><span className="sub">Nível real nas 4 áreas</span><b>{nivel}</b></div>
        <input type="range" min={400} max={850} step={10} value={nivel} onChange={(e) => setNivel(+e.target.value)} />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn small" onClick={() => simularAluno(20, nivel)}>+20 questões</button>
          <button className="btn small ghost" onClick={() => simularAluno(100, nivel)}>+100 questões</button>
          <button className="btn small ghost" onClick={zerar}>Zerar</button>
        </div>
      </div>
      <p className="note">Notas de corte marcadas “Sisu 2026” são reais (ampla concorrência); as demais e os pesos são ilustrativos. Redutor de cota ilustrativo. Incerteza do corte entre edições: ±{SIGMA_CORTE} pontos.</p>
    </>
  );
}
