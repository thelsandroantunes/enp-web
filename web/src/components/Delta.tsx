import { pp } from "@/lib/formato";

export function Delta({ d }: { d: number }) {
  return <span className={`delta ${d >= 0 ? "up" : "down"}`}>{pp(d)}</span>;
}
