"use client";

import { useRouter } from "next/navigation";
import { CURSOS, MODALIDADES } from "@/lib/dados";
import { num2 } from "@/lib/formato";
import { chance, cursoAtual, opcaoPrincipal } from "@/lib/motor";
import { useApp } from "@/state/AppState";

export function OnboardingMobile() {
  const { s, set, pronto } = useApp();
  const router = useRouter();
  if (!pronto) return <div className="carregando">Carregando…</div>;

  if (s.onb === 0 || !s.curso) {
    return (
      <div className="ob">
        <div className="step">1 de 3</div>
        <div className="h xl">Onde você quer passar?</div>
        <p className="sub">Escolha o curso. Vamos calcular sua chance de aprovação a cada questão que você resolver.</p>
        <div className="chips" style={{ margin: "16px 0 20px" }}>
          {CURSOS.map((c) => (
            <button key={c.id} className={`chip ${s.curso === c.id ? "on" : ""}`}
              onClick={() => set((p) => ({ ...p, curso: c.id, ops: [] }))}>
              {c.nome}{c.top && <span className="t">TOP</span>}
            </button>
          ))}
        </div>
        <button className="btn" disabled={!s.curso} onClick={() => set((p) => ({ ...p, onb: 1 }))}>Continuar</button>
      </div>
    );
  }

  const c = cursoAtual(s);

  if (s.onb === 1) {
    const toggle = (i: number) =>
      set((p) => ({ ...p, ops: p.ops.includes(i) ? p.ops.filter((x) => x !== i) : p.ops.length < 5 ? [...p.ops, i] : p.ops }));
    return (
      <div className="ob">
        <div className="step">2 de 3 · {c.nome}</div>
        <div className="h xl">Quais universidades?</div>
        <p className="sub">Escolha até 5 opções. No plano grátis você acompanha 1; nos pagos, até 5.</p>
        <div style={{ margin: "14px 0" }}>
          {c.opcoes.map((o, i) => (
            <button key={i} className={`opt ${s.ops.includes(i) ? "on" : ""}`} onClick={() => toggle(i)}>
              <span>{o.universidade}<br /><small>Nota de corte {num2(o.corte)} · {o.real ? "Sisu 2026" : "ilustrativa"}</small></span>
              <span>{s.ops.includes(i) ? "✓" : ""}</span>
            </button>
          ))}
        </div>
        <p className="note">{c.faixa ? `${c.faixa}. As demais notas são ilustrativas.` : "Notas de corte ilustrativas para o protótipo."}</p>
        <div className="row" style={{ marginTop: 12, flexWrap: "nowrap" }}>
          <button className="btn ghost" style={{ width: 120 }} onClick={() => set((p) => ({ ...p, onb: 0 }))}>Voltar</button>
          <button className="btn" disabled={!s.ops.length} onClick={() => set((p) => ({ ...p, onb: 2 }))}>Continuar</button>
        </div>
      </div>
    );
  }

  const concluir = () => {
    set((p) => ({ ...p, onb: 3, hist: [chance(p, opcaoPrincipal(p)).p] }));
    router.push("/inicio");
  };

  return (
    <div className="ob">
      <div className="step">3 de 3</div>
      <div className="h xl">Como você vai concorrer?</div>
      <p className="sub">A modalidade muda a nota de corte. (A chance por cota é liberada a partir do plano Pro.)</p>
      <div style={{ margin: "14px 0" }}>
        {MODALIDADES.map((m) => (
          <button key={m.id} className={`opt ${s.mod === m.id ? "on" : ""}`} onClick={() => set((p) => ({ ...p, mod: m.id }))}>
            <span>{m.nome}</span><span>{s.mod === m.id ? "✓" : ""}</span>
          </button>
        ))}
      </div>
      <div className="card">
        <div className="k">Seu nível hoje nas provas objetivas</div>
        <div className="between"><span className="sub">Média do último ENEM ou simulado; se não souber, deixe 550</span><b>{s.prior}</b></div>
        <input type="range" min={400} max={800} step={10} value={s.prior} onChange={(e) => set((p) => ({ ...p, prior: +e.target.value }))} />
      </div>
      <div className="card">
        <div className="k">Sua redação hoje (estimativa)</div>
        <div className="between"><span className="sub">Ajuste depois que corrigir uma redação</span><b>{s.red}</b></div>
        <input type="range" min={300} max={960} step={20} value={s.red} onChange={(e) => set((p) => ({ ...p, red: +e.target.value }))} />
      </div>
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <button className="btn ghost" style={{ width: 120 }} onClick={() => set((p) => ({ ...p, onb: 1 }))}>Voltar</button>
        <button className="btn" onClick={concluir}>Ver minha chance</button>
      </div>
    </div>
  );
}
