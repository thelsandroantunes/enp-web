"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/Badge";
import { Sheet } from "@/components/Sheet";
import { plano as planoPorId, PLANOS, RANK } from "@/lib/dados";
import { brl } from "@/lib/formato";
import { cursoAtual } from "@/lib/motor";
import type { PlanoId } from "@/lib/tipos";
import { useApp } from "@/state/AppState";

export function PlanosMobile() {
  const { s, set, reiniciar } = useApp();
  const router = useRouter();
  const [assinando, setAssinando] = useState<PlanoId | null>(null);
  const [meio, setMeio] = useState("Pix");
  const c = cursoAtual(s);
  const rec: PlanoId = c.top ? "top" : "plus";

  const escolher = (id: PlanoId) => (id === "free" ? set((p) => ({ ...p, plano: "free" })) : setAssinando(id));
  const confirmar = () => {
    set((p) => ({ ...p, plano: assinando! }));
    setAssinando(null);
    router.push("/inicio");
  };
  const pa = assinando ? planoPorId(assinando) : null;

  return (
    <>
      <div className="h">Planos</div>
      <p className="sub">Comece grátis. Suba de degrau conforme a sua ambição de curso.</p>
      <div className="toggle">
        <button className={s.ciclo === "m" ? "on" : ""} onClick={() => set((p) => ({ ...p, ciclo: "m" }))}>Mensal</button>
        <button className={s.ciclo === "a" ? "on" : ""} onClick={() => set((p) => ({ ...p, ciclo: "a" }))}>Anual · até o ENEM</button>
      </div>

      {PLANOS.map((p) => {
        const cur = s.plano === p.id;
        const isRec = rec === p.id;
        return (
          <div key={p.id} className={`plan ${cur ? "cur" : ""} ${isRec && !cur ? "rec" : ""}`}>
            <div className="between">
              <div>
                <b style={{ fontSize: 15 }}>{p.nome}</b>{" "}
                {isRec && <Badge tom={p.id === "top" ? "top" : "pri"}>Recomendado p/ {c.nome}</Badge>}
                <div className="sub">{p.para}</div>
              </div>
              {cur && <Badge tom="good">Atual</Badge>}
            </div>
            <div className="price" style={{ marginTop: 6 }}>
              {p.mensal === 0 ? "R$ 0" : s.ciclo === "m"
                ? <>{brl(p.mensal)}<small>/mês</small></>
                : <>{brl(p.anual)}<small> à vista · {brl(p.anual / 12)}/mês</small></>}
            </div>
            <ul>{p.itens.map((i) => <li key={i}>{i}</li>)}</ul>
            {p.social && <p className="note" style={{ margin: "-4px 0 10px" }}>{p.social}</p>}
            {!cur && (
              <button className={`btn ${p.id === "top" ? "topo" : "ghost"}`} onClick={() => escolher(p.id)}>
                {RANK[p.id] > RANK[s.plano] ? `Escolher ${p.nome}` : `Mudar para ${p.nome}`}
              </button>
            )}
          </div>
        );
      })}
      <p className="note">Pagamento por Pix (inclusive Pix Automático) ou cartão no web; nas lojas, cobrança pelo Google Play/App Store. Protótipo: a troca de plano é simulada, sem cobrança.</p>
      <button className="btn small ghost" style={{ marginTop: 12 }} onClick={() => { reiniciar(); router.replace("/onboarding"); }}>
        Reiniciar protótipo
      </button>

      {pa && (
        <Sheet onClose={() => setAssinando(null)}>
          <div className="h">Assinar {pa.nome}</div>
          <p className="sub">{s.ciclo === "m" ? `${brl(pa.mensal)} por mês` : `${brl(pa.anual)} à vista até o ENEM`}</p>
          <div className="chips" style={{ margin: "12px 0" }}>
            {["Pix", "Pix Automático", "Cartão"].map((m) => (
              <button key={m} className={`chip ${meio === m ? "on" : ""}`} onClick={() => setMeio(m)}>{m}</button>
            ))}
          </div>
          <p className="note">Simulação: nenhum pagamento é feito no protótipo.</p>
          <button className="btn" onClick={confirmar}>Confirmar (simulado)</button>
          <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => setAssinando(null)}>Cancelar</button>
        </Sheet>
      )}
    </>
  );
}
