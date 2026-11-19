"use client";

import { useMemo } from "react";

const CORES = ["#7c3aed", "#db2777", "#f59e0b", "#10b981", "#3b82f6", "#f97316"];

/** Chuva de confete em CSS puro (some sozinha; respeita "reduzir movimento") */
export function Confete({ n = 28 }: { n?: number }) {
  const pecas = useMemo(
    () => Array.from({ length: n }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      bg: CORES[i % CORES.length],
      delay: `${Math.random() * 0.25}s`,
      x: `${(Math.random() - 0.5) * 120}px`,
      y: `${160 + Math.random() * 140}px`,
      r: `${(Math.random() - 0.5) * 720}deg`,
    })),
    [n],
  );
  return (
    <div className="fb-confete" aria-hidden>
      {pecas.map((p, i) => (
        <i key={i} style={{ left: p.left, background: p.bg, animationDelay: p.delay, ["--x" as string]: p.x, ["--y" as string]: p.y, ["--r" as string]: p.r }} />
      ))}
    </div>
  );
}
