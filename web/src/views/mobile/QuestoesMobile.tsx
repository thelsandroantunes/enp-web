"use client";

import Link from "next/link";
import { Alternativas, letra } from "@/components/Alternativas";
import { Badge } from "@/components/Badge";
import { Delta } from "@/components/Delta";
import { useQuestao } from "@/hooks/useQuestao";
import { AREAS } from "@/lib/dados";
import { curto, pct } from "@/lib/formato";
import { chance, dificuldade, faixa, opcaoPrincipal, pago } from "@/lib/motor";

export function QuestoesMobile() {
  const { s, q, sel, setSel, feito, limite, bloqueado, responder, proxima } = useQuestao();

  if (bloqueado) {
    return (
      <div className="card">
        <div className="h">Limite diário atingido</div>
        <p className="sub">No plano grátis são {limite} questões por dia. No Essencial (R$ 9,90/mês) elas são ilimitadas.</p>
        <Link className="btn" href="/planos">Ver planos</Link>
      </div>
    );
  }
  if (!q) return null;
  const op = opcaoPrincipal(s);
  const ch = chance(s, op);

  return (
    <>
      <div className="between">
        <Badge tom="pri">{AREAS.find((a) => a.id === q.area)!.nome}</Badge>
        <span className="sub">Hoje: {s.hoje}{limite !== null ? `/${limite}` : ""} · dificuldade {dificuldade(q.b)}</span>
      </div>
      <div className="q-stem">{q.enunciado}</div>
      <Alternativas alternativas={q.alternativas} selecionada={sel} onSelect={setSel} correta={feito ? q.correta : undefined} />
      {feito ? (
        <>
          <div className="expl"><b>{sel === q.correta ? "Acertou!" : `Resposta: ${letra(q.correta)}`}</b> {q.explicacao}</div>
          <div className="card" style={{ padding: 12 }}>
            <div className="between">
              <span className="sub">Sua chance em {curto(op.universidade)}</span>
              {pago(s) ? (
                <span><b>{pct(ch.p)}</b> {s.ultimoDelta !== null && <>(<Delta d={s.ultimoDelta} />)</>}</span>
              ) : (
                <Badge tom={faixa(ch.p)[1]}>{faixa(ch.p)[0]}</Badge>
              )}
            </div>
          </div>
          <button className="btn" onClick={proxima}>Próxima questão</button>
        </>
      ) : (
        <button className="btn" disabled={sel === null} onClick={responder}>Confirmar resposta</button>
      )}
      <p className="note">Questões de exemplo escritas para o protótipo. No produto: provas oficiais do Inep com parâmetros TRI dos microdados + questões inéditas calibradas.</p>
    </>
  );
}
