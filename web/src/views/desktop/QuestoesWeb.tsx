"use client";

import Link from "next/link";
import { useState } from "react";
import { AreasWeb } from "@/components/desktop/Areas";
import { useQuestao } from "@/hooks/useQuestao";
import { AREAS } from "@/lib/dados";
import { curto, pct, pp } from "@/lib/formato";
import { chance, corChance, cursoAtual, dificuldade, faixa, notas, opcaoPrincipal, pago } from "@/lib/motor";
import { useToast } from "./WebShell";

const LETRAS = "ABCDE";

export function QuestoesWeb() {
  const { s, q, sel, setSel, feito, limite, bloqueado, responder, proxima } = useQuestao();
  const toast = useToast();
  const [sessao, setSessao] = useState<boolean[]>([]);
  const op = opcaoPrincipal(s);
  const ch = chance(s, op);
  const pg = pago(s);

  const confirmar = () => {
    if (!q || sel === null) return;
    setSessao((x) => [...x, sel === q.correta]);
    responder();
  };

  return (
    <>
      <div className="d-between" style={{ alignItems: "flex-end" }}>
        <div>
          <h2 className="d-h2" style={{ margin: 0 }}>Questões</h2>
          <div className="d-mut d-small">Prática adaptativa · {cursoAtual(s).nome} · {limite !== null ? `${limite} por dia no Grátis` : "ilimitadas"}</div>
        </div>
        <div className="d-small d-mut">Hoje: <b>{s.hoje}</b>{limite !== null ? `/${limite}` : ""} · 🔥 {s.streak} dias</div>
      </div>

      <div className="d-layout d-mt">
        <aside className="d-grid d-sticky">
          <div className="d-card">
            <div className="d-mut d-small">Sua chance em {curto(op.universidade)}</div>
            <div className="d-big" style={{ color: corChance(ch.p), margin: "6px 0" }}>{pg ? pct(ch.p) : faixa(ch.p)[0]}</div>
            {pg && s.ultimoDelta !== null && <div className="d-small">Última questão: <span className={Math.abs(s.ultimoDelta) < 0.0005 ? "" : s.ultimoDelta > 0 ? "d-up" : "d-down"}>{pp(s.ultimoDelta)}</span></div>}
            {!pg && <div className="d-small d-mut">Veja a % exata no <Link className="d-hl" href="/planos">Essencial</Link></div>}
            <div className="d-small d-mut" style={{ marginTop: 8 }}>Nota {ch.nota.toFixed(0)} ± {ch.se.toFixed(0)} · corte {ch.corte.toFixed(0)}</div>
          </div>
          <div className="d-card">
            <h3 className="d-h3">Notas por área</h3>
            <AreasWeb ns={notas(s)} />
          </div>
        </aside>

        <div>
          <div className="d-dots">{sessao.map((r, k) => <i key={k} className={r ? "ok" : "bad"} />)}</div>

          {bloqueado ? (
            <div className="d-card d-lock" style={{ minHeight: 340 }}>
              <div className="blur">
                <span className="d-pill">Natureza</span>
                <p className="d-stem">Um objeto é lançado verticalmente para cima com velocidade inicial de 20 m/s. Desprezando a resistência do ar...</p>
                <div className="d-opt">A) ...</div><div className="d-opt">B) ...</div><div className="d-opt">C) ...</div>
              </div>
              <div className="over">
                <h3 className="d-h3">Você concluiu as {limite} questões grátis de hoje</h3>
                <p className="d-small d-mut">No Essencial (R$ 9,90/mês) as questões são ilimitadas e você vê a chance em %.</p>
                <Link className="d-btn sm" href="/planos">Desbloquear</Link>
              </div>
            </div>
          ) : q && (
            <div className="d-card">
              <div className="d-row">
                <span className="d-pill hl">{AREAS.find((a) => a.id === q.area)!.nome}</span>
                <span className="d-pill">dificuldade {dificuldade(q.b)}</span>
                <span className="d-small d-mut">ENEM · exemplo</span>
              </div>
              <p className="d-stem">{q.enunciado}</p>
              {q.alternativas.map((t, i) => {
                let cls = "";
                if (feito) cls = i === q.correta ? "ok" : i === sel ? "bad" : "";
                else if (i === sel) cls = "sel";
                return (
                  <button key={i} className={`d-opt ${cls}`} disabled={feito} onClick={() => setSel(i)}>
                    <span className="L">{LETRAS[i]}</span><span>{t}</span>
                  </button>
                );
              })}
              {feito ? (
                <div className="d-exp">
                  {sel === q.correta ? "✅ Correta. " : `❌ Incorreta — resposta ${LETRAS[q.correta]}. `}{q.explicacao}
                  <div className="d-row" style={{ marginTop: 12 }}>
                    <button className="d-btn sm" onClick={proxima}>Próxima questão →</button>
                    <a href="#" className="d-small d-mut" onClick={(e) => { e.preventDefault(); toast("Erro reportado para revisão."); }}>Reportar erro</a>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 14 }}>
                  <button className="d-btn" disabled={sel === null} onClick={confirmar}>Confirmar resposta</button>
                </div>
              )}
            </div>
          )}
          <p className="d-small d-mut">Questões de exemplo escritas para o protótipo. No produto: provas oficiais do Inep com parâmetros TRI dos microdados + questões inéditas calibradas.</p>
        </div>
      </div>
    </>
  );
}
