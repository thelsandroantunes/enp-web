/** Linha da evolução da chance (0–100%) — SVG simples, sem biblioteca */
export function GraficoChance({ pontos }: { pontos: number[] }) {
  const W = 600, H = 180, pl = 34, pr = 8, pt = 10, pb = 22;
  const n = pontos.length;
  const x = (i: number) => pl + (n <= 1 ? 0 : (i / (n - 1)) * (W - pl - pr));
  const y = (p: number) => pt + (1 - p) * (H - pt - pb);
  const linha = pontos.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(" ");
  const area = n > 1 ? `${linha} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z` : "";
  return (
    <svg className="d-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Evolução da chance">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <g key={g}>
          <line className="grid" x1={pl} x2={W - pr} y1={y(g)} y2={y(g)} />
          <text className="lbl" x={0} y={y(g) + 4}>{g * 100}%</text>
        </g>
      ))}
      {n > 1 && <path className="ar" d={area} />}
      {n > 1 && <path className="ln" d={linha} vectorEffect="non-scaling-stroke" />}
      <text className="lbl" x={pl} y={H - 4}>início</text>
      <text className="lbl" x={W - pr} y={H - 4} textAnchor="end">agora · {n} registros</text>
    </svg>
  );
}
