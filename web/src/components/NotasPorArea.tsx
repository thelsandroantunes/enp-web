import { AREAS } from "@/lib/dados";
import type { Notas } from "@/lib/motor";
import type { Curso } from "@/lib/tipos";

const largura = (nota: number) => Math.max(4, Math.min(100, (nota - 300) / 6));

export function NotasPorArea({ ns, curso, red, antes }: { ns: Notas; curso?: Curso; red?: number; antes?: Notas }) {
  return (
    <>
      {AREAS.map((a) => {
        const n = ns[a.id];
        const d = antes ? n.nota - antes[a.id].nota : null;
        return (
          <div className="area" key={a.id}>
            <b>{a.nome}</b>
            <div className="bar"><i style={{ width: `${largura(n.nota)}%` }} /></div>
            <div className="v">
              {n.nota.toFixed(0)}
              {d !== null ? (
                <small className={`delta ${d >= 0 ? "up" : "down"}`}>{d >= 0 ? "+" : ""}{d.toFixed(0)}</small>
              ) : (
                <small>± {n.se.toFixed(0)}{curso ? ` · peso ${curso.pesos[a.id]}` : ""}</small>
              )}
            </div>
          </div>
        );
      })}
      {red !== undefined && curso && (
        <div className="area">
          <b>Redação</b>
          <div className="bar"><i style={{ width: `${(red - 300) / 6.6}%`, background: "var(--top)" }} /></div>
          <div className="v">{red}<small>informada · peso {curso.pesos.RED}</small></div>
        </div>
      )}
    </>
  );
}
