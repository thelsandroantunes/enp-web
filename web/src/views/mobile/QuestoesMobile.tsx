"use client";

import Link from "next/link";
import { Alternativas, letra } from "@/components/Alternativas";
import { AreaChip } from "@/components/feedback/AreaChip";
import { ResumoBateria } from "@/components/feedback/ResumoBateria";
import { RetornoResposta } from "@/components/feedback/RetornoResposta";
import { useQuestao } from "@/hooks/useQuestao";
import { TAMANHO_BATERIA } from "@/lib/feedback";
import { curto, pct } from "@/lib/formato";
import { chance, dificuldade, faixa, opcaoPrincipal, pago } from "@/lib/motor";

export function QuestoesMobile() {
  const { s, q, sel, setSel, feito, limite, bloqueado, responder, proxima, retorno, bateria, fimDeBateria, resumo, novaBateria } = useQuestao();
  const op = opcaoPrincipal(s);
  const ch = chance(s, op);

  if (resumo) return <ResumoBateria r={resumo} chanceAgora={ch.p} pago={pago(s)} onNova={novaBateria} />;

  if (bloqueado) {
    return (
      <div className="fb-resumo base">
        <div className="fb-emoji">⏰</div>
        <h3>Suas {limite} questões de hoje acabaram</h3>
        <p>Elas renovam amanhã. Volte para manter sua sequência de {s.streak} dias 🔥 ou continue agora com questões ilimitadas.</p>
        <div className="fb-acoes"><Link className="fb-btn" href="/planos">Continuar agora</Link><Link className="fb-btn claro" href="/chances">Ver minhas chances</Link></div>
      </div>
    );
  }
  if (!q) return null;

  return (
    <>
      <div className="between">
        <AreaChip id={q.area} />
        <span className="sub">Bateria {Math.min(bateria.length + (feito ? 0 : 1), TAMANHO_BATERIA)}/{TAMANHO_BATERIA} · {dificuldade(q.b)}</span>
      </div>
      <div className="progress">{Array.from({ length: TAMANHO_BATERIA }, (_, k) => (
        <i key={k} style={k < bateria.length ? { background: bateria[k] ? "var(--good)" : "var(--bad)" } : undefined} />
      ))}</div>
      {s.combo >= 3 && !feito && <div className="sub" style={{ fontWeight: 800, color: "var(--fb-fogo)" }}>🔥 {s.combo} seguidas! Continue assim</div>}
      <div className="q-stem">{q.enunciado}</div>
      <Alternativas alternativas={q.alternativas} selecionada={sel} onSelect={setSel} correta={feito ? q.correta : undefined} />
      {feito && retorno ? (
        <>
          <RetornoResposta r={retorno} letraCorreta={letra(q.correta)} explicacao={q.explicacao} />
          <div className="card" style={{ padding: 12 }}>
            <div className="between">
              <span className="sub">Sua chance em {curto(op.universidade)}</span>
              {pago(s) ? <b>{pct(ch.p)}</b> : <span className={`badge b-${faixa(ch.p)[1]}`}>{faixa(ch.p)[0]}</span>}
            </div>
          </div>
          <button className="btn" onClick={proxima}>{fimDeBateria ? "Ver meu resultado 🎉" : "Próxima questão"}</button>
        </>
      ) : (
        <button className="btn" disabled={sel === null} onClick={responder}>Confirmar resposta</button>
      )}
      <p className="note">Questões de exemplo escritas para o protótipo. No produto: provas oficiais do Inep + questões inéditas calibradas.</p>
    </>
  );
}
