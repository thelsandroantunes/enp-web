import type { ReactNode } from "react";

export function Ring({ p, cor = "var(--pri)", children }: { p: number; cor?: string; children: ReactNode }) {
  const r = 56, C = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg width="132" height="132" aria-hidden>
        <circle cx="66" cy="66" r={r} stroke="var(--track, #eef0f3)" strokeWidth="12" fill="none" />
        <circle cx="66" cy="66" r={r} stroke={cor} strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: "stroke-dashoffset .4s" }} />
      </svg>
      <div className="c">{children}</div>
    </div>
  );
}
