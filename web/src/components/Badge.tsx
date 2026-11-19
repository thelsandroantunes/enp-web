import type { ReactNode } from "react";

type Tom = "good" | "warn" | "bad" | "pri" | "top";

export function Badge({ tom, children }: { tom: Tom; children: ReactNode }) {
  return <span className={`badge b-${tom}`}>{children}</span>;
}
