"use client";

import Link from "next/link";
import { AreasWeb } from "@/components/desktop/Areas";
import { AreaChip } from "@/components/feedback/AreaChip";
import { BarraXP } from "@/components/feedback/BarraXP";
import { ResumoBateria } from "@/components/feedback/ResumoBateria";
import { RetornoResposta } from "@/components/feedback/RetornoResposta";
import { useQuestao } from "@/hooks/useQuestao";
import { TAMANHO_BATERIA } from "@/lib/feedback";
import { curto, pct, pp } from "@/lib/formato";
import { chance, corChance, cursoAtual, dificuldade, faixa, notas, opcaoPrincipal, pago } from "@/lib/motor";
import { useToast } from "./WebShell";

const LETRAS = "ABCDE";

export function QuestoesWeb() {
  const { s, q, sel, setSel, feito, limite, bloqueado, responder, proxima, retorno, bateria, fimDeBateria, resumo, novaBateria } = useQuestao();
  const toast = useToast();
  const op = opcaoPrincipal(s);
  const ch = chance(s, op);
  const pg = pago(s);

  return (
    <>
      <div className="d-between" style={{ alignItems: "flex-end" }}>
        <div>
          <h2 className="d-h2" style={{ margin: 0 }}>Questões</h2>
          <div className="d-mut d-small">Baterias de {TAMANHO_BATERIA} · {cursoAtual(s).nome} · {limite !== null ? `${limite} por dia no Grátis` : "ilimitadas"}</div>
        </div>
        <div className="d-small d-mut">Hoje: <b>{s.hoje}</b>{limite !== null ? `/${limite}` : ""} · 🔥 {s.streak} dias</div>
      </div>

      <div className="d-layout d-mt">
        <aside className="d-grid d-sticky">
          <div className="d-card"><BarraXP xp={s.xp} />
            {s.combo >= 2 && <div className="d-small" style={{ marginTop: 10, fontWeight: 800, color: "var(--fb-fogo)" }}>🔥 {s.combo} acertos seguidos</div>}
          </div>
          <div className="d-card">
            <div className="d-mut d-small">Sua chance em {curto(op.universidade)}</div>
            <div className="d-big" style={{ color: corChance(ch.p), margin: "6px 0" }}>{pg ? pct(ch.p) : faixa(ch.p)[0]}</div>
            {pg && s.ultimoDelta !== null && <div className="d-small">Última questão: <span className={Math.abs(s.ultimoDelta) < 0.0005 ? "" : s.ultimoDelta > 0 ? "d-up" : "d-down"}>{pp(s.ultimoDelta)}</span></div>}
            {!pg && <div className="d-small d-mut">Veja a % exata no <Link className="d-hl" href="/planos">Essencial</Link></div>}
            <div className="d-small d-mut" style={{ marginTop: 8 }}>Nota {ch.nota.toFixed(0)} ± {ch.se.toFixed(0)} · corte {ch.corte.toFixed(0)}</div>
          </div>
          <div className="d-card"><h3 className="d-h3">Notas por área</h3><AreasWeb ns={notas(s)} /></div>
        </aside>

        <div>
          {resumo ? (
            <ResumoBateria r={resumo} chanceAgora={ch.p} pago={pg} onNova={novaBateria} />
          ) : bloqueado ? (
            <div className="fb-resumo base">
              <div className="fb-emoji">⏰</div>
              <h3>Suas {limite} questões de hoje acabaram</h3>
              <p>Elas renovam amanhã. Volte para manter sua sequência de {s.streak} dias 🔥, ou continue agora com questões ilimitadas no Essencial.</p>
              <div className="fb-acoes"><Link className="fb-btn" href="/planos">Continuar agora</Link><Link className="fb-btn claro" href="/simulado">Fazer um simulado</Link></div>
            </div>
          ) : q && (
            <div className="d-card">
              <div className="d-between">
                <div className="d-row"><AreaChip id={q.area} /><span className="d-pill">{dificuldade(q.b)}</span></div>
                <span className="d-small d-mut">Questão {Math.min(bateria.length + (feito ? 0 : 1), TAMANHO_BATERIA)} de {TAMANHO_BATERIA}</span>
              </div>
              <div className="d-dots" style={{ marginTop: 12 }}>
                {Array.from({ length: TAMANHO_BATERIA }, (_, k) => <i key={k} className={k < bateria.length ? (bateria[k] ? "ok" : "bad") : ""} style={{ flex: 1 }} />)}
              </div>
              <p className="d-stem">{q.enunciado}</p>
              {q.alternativas.map((t, i) => {
                let cls = "";
                if (feito) cls = i === q.correta ? "ok" : i === sel ? "bad" : "";
                else if (i === sel) cls = "sel";
                return (
                  <button key={i} className={`d-opt ${cls}`} disabled={feito} onClick={() => setSel(i)}>
                    <span className="L">{LETRAS[i]}</span><span style={{ alignSelf: "center" }}>{t}</span>
                  </button>
                );
              })}
              {feito && retorno ? (
                <>
                  <RetornoResposta r={retorno} letraCorreta={LETRAS[q.correta]} explicacao={q.explicacao} />
                  <div className="d-row">
                    <button className="d-btn" onClick={proxima}>{fimDeBateria ? "Ver meu resultado 🎉" : "Próxima questão →"}</button>
                    <a href="#" className="d-small d-mut" onClick={(e) => { e.preventDefault(); toast("Valeu! Erro reportado para revisão 🙏"); }}>Reportar erro</a>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 14 }}><button className="d-btn" disabled={sel === null} onClick={responder}>Confirmar resposta</button></div>
              )}
            </div>
          )}
          <p className="d-small d-mut">Questões de exemplo escritas para o protótipo. No produto: provas oficiais do Inep com parâmetros TRI dos microdados + questões inéditas calibradas.</p>
        </div>
      </div>
    </>
  );
}
