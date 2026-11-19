import { AREAS } from "@/lib/dados";
import type { Notas } from "@/lib/motor";
import type { Curso } from "@/lib/tipos";

const w = (nota: number) => Math.max(3, Math.min(100, (nota - 300) / 6));

export function AreasWeb({ ns, curso, antes }: { ns: Notas; curso?: Curso; antes?: Notas }) {
  const linhas = [...AREAS.map((a) => ({ id: a.id, nome: a.nome })), ...(curso ? [{ id: "RED" as const, nome: "Redação" }] : [])];
  return (
    <>
      {linhas.map((a) => {
        const n = ns[a.id];
        const d = antes ? n.nota - antes[a.id].nota : null;
        return (
          <div className="d-area" key={a.id}>
            <span>{a.nome}</span>
            <div className="d-barw"><b style={{ width: `${w(n.nota)}%`, background: a.id === "RED" ? "var(--d-hl)" : undefined }} /></div>
            <div className="v">
              <b>{n.nota.toFixed(0)}</b>
              {d !== null
                ? <small className={d >= 0 ? "d-up" : "d-down"}>{d >= 0 ? "+" : ""}{d.toFixed(0)}</small>
                : <small>{a.id === "RED" ? "informada" : `± ${n.se.toFixed(0)}`}{curso ? ` · p${curso.pesos[a.id]}` : ""}</small>}
            </div>
          </div>
        );
      })}
    </>
  );
}
