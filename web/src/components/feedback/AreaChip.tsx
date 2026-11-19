import { area } from "@/lib/dados";

export function AreaChip({ id }: { id: string }) {
  const a = area(id);
  return <span className="fb-area" style={{ background: a.cor }}>{a.emoji} {a.nome}</span>;
}
