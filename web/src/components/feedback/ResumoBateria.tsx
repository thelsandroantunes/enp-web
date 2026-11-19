"use client";

import Link from "next/link";
import type { Resumo } from "@/hooks/useQuestao";
import { mensagemBateria } from "@/lib/feedback";
import { pct, pp } from "@/lib/formato";
import { Confete } from "./Confete";

interface Props {
  r: Resumo;
  chanceAgora: number;
  pago: boolean;
  onNova: () => void;
}

/** Fim da bateria: placar + mensagem que incentiva a voltar e continuar */
export function ResumoBateria({ r, chanceAgora, pago, onNova }: Props) {
  const m = mensagemBateria(r.acertos, r.total, r.limiteAtingido);
  const d = chanceAgora - r.chanceAntes;
  return (
    <div className={`fb-resumo ${m.tom}`}>
      {m.tom === "top" && <Confete n={40} />}
      <div className="fb-emoji">{m.emoji}</div>
      <h3>{m.titulo}</h3>
      <p>{m.texto}</p>
      <div className="fb-stats">
        <div><b>{r.acertos}/{r.total}</b><span>acertos</span></div>
        <div><b>+{r.xp}</b><span>XP</span></div>
        <div><b>{r.melhorCombo}🔥</b><span>maior sequência</span></div>
        <div><b>{pago ? pp(d) : d >= 0 ? "↑" : "↓"}</b><span>{pago ? `chance: ${pct(chanceAgora)}` : "sua chance"}</span></div>
      </div>
      <div className="fb-acoes">
        {r.limiteAtingido ? (
          <>
            <Link className="fb-btn" href="/planos">Continuar agora (Essencial)</Link>
            <Link className="fb-btn claro" href="/chances">Ver minhas chances</Link>
          </>
        ) : (
          <>
            <button className="fb-btn" onClick={onNova}>Mais 10 questões 💪</button>
            <Link className="fb-btn claro" href="/simulado">Fazer um simulado</Link>
            <Link className="fb-btn claro" href="/chances">Ver minhas chances</Link>
          </>
        )}
      </div>
    </div>
  );
}
