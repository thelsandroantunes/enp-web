"use client";

import { useState } from "react";
import { plano as planoPorId, PLANOS, RANK } from "@/lib/dados";
import { brl } from "@/lib/formato";
import { cursoAtual } from "@/lib/motor";
import type { PlanoId } from "@/lib/tipos";
import { useApp } from "@/state/AppState";
import { useToast } from "./WebShell";

export function PlanosWeb() {
  const { s, set, reiniciar } = useApp();
  const toast = useToast();
  const [assinando, setAssinando] = useState<PlanoId | null>(null);
  const [meio, setMeio] = useState("Pix");
  const c = s.curso ? cursoAtual(s) : null;
  const rec: PlanoId = c?.top ? "top" : "plus";
  const pa = assinando ? planoPorId(assinando) : null;

  const escolher = (id: PlanoId) => {
    if (id === "free") { set((p) => ({ ...p, plano: "free" })); toast("Plano Grátis ativado."); return; }
    setAssinando(id);
  };
  const confirmar = () => {
    set((p) => ({ ...p, plano: assinando! }));
    toast(`Simulação: plano ${pa!.nome} ativado (${meio}).`);
    setAssinando(null);
  };

  return (
    <>
      <div className="d-center">
        <h2 className="d-h2">Escolha o seu degrau</h2>
        <p className="d-mut">Comece grátis. Suba conforme a concorrência do curso que você quer.</p>
        <div className="d-toggle" style={{ marginTop: 8 }}>
          <button className={s.ciclo === "m" ? "on" : ""} onClick={() => set((p) => ({ ...p, ciclo: "m" }))}>Mensal</button>
          <button className={s.ciclo === "a" ? "on" : ""} onClick={() => set((p) => ({ ...p, ciclo: "a" }))}>Anual · até o ENEM</button>
        </div>
      </div>

      <div className="d-grid d-g5" style={{ marginTop: 24, alignItems: "stretch" }}>
        {PLANOS.map((p) => {
          const cur = s.plano === p.id;
          const best = rec === p.id;
          return (
            <div key={p.id} className={`d-card d-plan ${best ? "best" : ""} ${cur ? "cur" : ""}`}>
              <div className="d-row">
                <span className={`d-pill ${best ? "hl" : ""}`}>{p.nome}{best && c ? ` · p/ ${c.nome}` : ""}</span>
                {cur && <span className="d-pill good">atual</span>}
              </div>
              <div className="d-price">
                {p.mensal === 0 ? "R$ 0" : s.ciclo === "m" ? <>{brl(p.mensal)}<small>/mês</small></> : <>{brl(p.anual)}<small> à vista</small></>}
              </div>
              <div className="d-small d-mut">{p.mensal === 0 ? "para sempre" : s.ciclo === "a" ? `${brl(p.anual / 12)}/mês até o ENEM` : p.para}</div>
              <ul>{p.itens.map((i) => <li key={i}>{i}</li>)}</ul>
              {p.social && <p className="d-small d-hl" style={{ marginTop: 0 }}>{p.social}</p>}
              {cur ? <button className="d-btn ghost sm full" disabled>Plano atual</button>
                : <button className={`d-btn sm full ${best ? "hl" : RANK[p.id] > RANK[s.plano] ? "" : "ghost"}`} onClick={() => escolher(p.id)}>
                    {RANK[p.id] > RANK[s.plano] ? `Assinar ${p.nome}` : `Mudar para ${p.nome}`}
                  </button>}
            </div>
          );
        })}
      </div>

      <div className="d-card d-mt">
        <div className="d-between">
          <div className="d-small d-mut">Pix (inclusive Pix Automático) ou cartão no web; nas lojas, cobrança pelo Google Play/App Store. Protótipo: a troca de plano é simulada, sem cobrança.</div>
          <button className="d-btn ghost sm" onClick={() => { reiniciar(); toast("Protótipo reiniciado."); }}>Reiniciar protótipo</button>
        </div>
      </div>

      {pa && (
        <div className="d-modal" onClick={(e) => e.target === e.currentTarget && setAssinando(null)}>
          <div className="d-card">
            <h3 className="d-h3">Assinar {pa.nome}</h3>
            <p className="d-small d-mut">{s.ciclo === "m" ? `${brl(pa.mensal)} por mês` : `${brl(pa.anual)} à vista até o ENEM`}</p>
            <div className="d-row" style={{ margin: "12px 0" }}>
              {["Pix", "Pix Automático", "Cartão"].map((m) => <button key={m} className={`d-chip ${meio === m ? "on" : ""}`} onClick={() => setMeio(m)}>{m}</button>)}
            </div>
            <p className="d-small d-mut">Simulação: nenhum pagamento é feito no protótipo.</p>
            <div className="d-row"><button className="d-btn sm" onClick={confirmar}>Confirmar (simulado)</button><button className="d-btn ghost sm" onClick={() => setAssinando(null)}>Cancelar</button></div>
          </div>
        </div>
      )}
    </>
  );
}
