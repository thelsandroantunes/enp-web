"use client";

import { mensagemSimulado } from "@/lib/feedback";
import { Confete } from "./Confete";

/** Mensagem de apoio no resultado do simulado */
export function ApoioSimulado({ acertos, total, piorArea }: { acertos: number; total: number; piorArea: string }) {
  const m = mensagemSimulado(total ? acertos / total : 0, piorArea);
  return (
    <div className={`fb-resumo ${m.tom}`} style={{ marginBottom: 14 }}>
      {m.tom === "top" && <Confete n={44} />}
      <div className="fb-emoji">{m.emoji}</div>
      <h3>{m.titulo}</h3>
      <p>{m.texto}</p>
      <div className="fb-stats" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 320, marginInline: "auto" }}>
        <div><b>{acertos}/{total}</b><span>acertos</span></div>
        <div><b>{Math.round((acertos / Math.max(1, total)) * 100)}%</b><span>de aproveitamento</span></div>
      </div>
    </div>
  );
}
