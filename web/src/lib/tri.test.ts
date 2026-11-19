import { describe, expect, it } from "vitest";
import { notaArea, notaCurso, p3, Phi, probAprovacao } from "./tri";
import type { Resp } from "./tipos";

describe("motor TRI", () => {
  it("p3 respeita o acerto casual e o ponto de inflexão", () => {
    expect(p3(-10, 1.5, 0, 0.2)).toBeCloseTo(0.2, 3);
    expect(p3(0, 1.5, 0, 0.2)).toBeCloseTo(0.6, 6);
  });

  it("sem respostas, a nota é o prior com erro alto", () => {
    const n = notaArea([], 550);
    expect(n.nota).toBeCloseTo(550, 0);
    expect(n.se).toBeGreaterThan(90);
  });

  it("acertos sobem a nota e reduzem o erro", () => {
    const itens: Resp[] = Array.from({ length: 30 }, (_, i) => ({ a: 1.5, b: -1 + (i % 10) * 0.25, c: 0.2, u: 1 }));
    const n = notaArea(itens, 550);
    expect(n.nota).toBeGreaterThan(650);
    expect(n.se).toBeLessThan(60);
  });

  it("Phi e chance são coerentes", () => {
    expect(Phi(0)).toBeCloseTo(0.5, 6);
    expect(probAprovacao(700, 0, 700, 18)).toBeCloseTo(0.5, 6);
    expect(probAprovacao(800, 10, 700, 18)).toBeGreaterThan(0.99);
  });

  it("nota do curso pondera pelos pesos", () => {
    const ns = { LC: { nota: 500, se: 0, n: 0 }, CH: { nota: 500, se: 0, n: 0 }, CN: { nota: 500, se: 0, n: 0 },
      MT: { nota: 800, se: 0, n: 0 }, RED: { nota: 500, se: 0, n: 0 } };
    const r = notaCurso(ns, { LC: 1, CH: 1, CN: 1, MT: 2, RED: 1 });
    expect(r.nota).toBeCloseTo(600, 6);
  });
});
