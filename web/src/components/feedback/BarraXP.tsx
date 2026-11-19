import { nivel } from "@/lib/feedback";

export function BarraXP({ xp }: { xp: number }) {
  const n = nivel(xp);
  return (
    <div className="fb-xp" title={`${xp} XP`}>
      <div className="fb-nivel">N{n.n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
          <span>Nível {n.n}</span><span style={{ opacity: .7 }}>faltam {n.falta} XP</span>
        </div>
        <div className="fb-xpbar"><i style={{ width: `${n.progresso * 100}%` }} /></div>
      </div>
    </div>
  );
}
