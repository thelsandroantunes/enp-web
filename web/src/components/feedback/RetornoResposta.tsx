"use client";

import type { Retorno } from "@/hooks/useQuestao";
import { Confete } from "./Confete";

/** Cartão logo após responder: festa no acerto, acolhimento no erro, sempre com a explicação */
export function RetornoResposta({ r, letraCorreta, explicacao }: { r: Retorno; letraCorreta: string; explicacao: string }) {
  return (
    <div className={`fb-card ${r.acertou ? "ok" : "no"}`} role="status" aria-live="polite">
      {r.acertou && <Confete />}
      <div className="fb-top">
        <div className="fb-emoji">{r.acertou ? "🥳" : "🫶"}</div>
        <div>
          <div className="fb-tit">{r.msg}</div>
          {!r.acertou && <div className="fb-sub">A resposta certa é a <b>{letraCorreta}</b>.</div>}
        </div>
      </div>
      <div className="fb-tags">
        <span className="fb-tag xp">+{r.xp} XP</span>
        {r.combo && <span className="fb-tag fogo">{r.combo}</span>}
      </div>
      <div className="fb-exp"><b>Por quê?</b> {explicacao}</div>
    </div>
  );
}
