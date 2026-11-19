"use client";

import Link from "next/link";
import { Alternativas } from "@/components/Alternativas";
import { Badge } from "@/components/Badge";
import { ApoioSimulado } from "@/components/feedback/ApoioSimulado";
import { AreaChip } from "@/components/feedback/AreaChip";
import { NotasPorArea } from "@/components/NotasPorArea";
import { Sheet } from "@/components/Sheet";
import { useSimulado } from "@/hooks/useSimulado";
import { curto, pct, tempo } from "@/lib/formato";
import { chance, faixa, notas, opcaoPrincipal, pago } from "@/lib/motor";

export function SimuladoMobile() {
  const { s, sim, piorArea, limite, esgotado, setEsgotado, iniciar, marcar, avancar, sair } = useSimulado();

  if (!sim) {
    return (
      <>
        <div className="h">Simulado rápido TRI</div>
        <p className="sub">8 questões (2 por área), 3 min por questão. Ao final você vê sua nota estimada por área e quanto a chance mudou.</p>
        <div className="espaco" />
        <div className="card">
          <div className="between"><span>Simulados usados este mês</span><b>{s.simUsados}{limite !== null ? `/${limite}` : " · ilimitado"}</b></div>
        </div>
        <button className="btn" onClick={iniciar}>Começar simulado</button>
        <p className="note">No produto: simulado completo de 180 questões e simulados por área, com a mesma régua TRI do Inep.</p>
        {esgotado && (
          <Sheet onClose={() => setEsgotado(false)}>
            <div className="h">Simulados do mês esgotados</div>
            <p className="sub">Seu plano inclui {limite} simulado(s) por mês. No Plus eles são ilimitados.</p>
            <Link className="btn" href="/planos">Ver planos</Link>
          </Sheet>
        )}
      </>
    );
  }

  if (sim.fim) {
    const op = opcaoPrincipal(s);
    const dep = chance(s, op).p;
    return (
      <>
        <div className="h">Resultado do simulado</div>
        {sim.t === 0 && <p className="sub">Tempo esgotado</p>}
        <div className="espaco" />
        <ApoioSimulado acertos={sim.acertos.filter(Boolean).length} total={sim.qs.length} piorArea={piorArea} />
        <div className="card"><NotasPorArea ns={notas(s)} antes={sim.notasAntes} /></div>
        <div className="card">
          <div className="between">
            <span>Chance em {curto(op.universidade)}</span>
            {pago(s) ? <b>{pct(sim.antes)} → {pct(dep)}</b> : <Badge tom={faixa(dep)[1]}>{faixa(dep)[0]}</Badge>}
          </div>
          <p className="note">Acertar questões difíceis pesa mais que acertar fáceis: é assim que a TRI do ENEM funciona, e é o que o motor reproduz.</p>
        </div>
        <Link className="btn" href="/chances" onClick={sair}>Ver todas as chances</Link>
      </>
    );
  }

  const q = sim.qs[sim.i];
  return (
    <>
      <div className="between"><b>Questão {sim.i + 1} de {sim.qs.length}</b><span className="timer">{tempo(sim.t)}</span></div>
      <div className="progress">{sim.qs.map((_, k) => <i key={k} className={k < sim.i ? "d" : ""} />)}</div>
      <AreaChip id={q.area} />
      <div className="q-stem">{q.enunciado}</div>
      <Alternativas alternativas={q.alternativas} selecionada={sim.marcadas[sim.i]} onSelect={marcar} />
      <button className="btn" disabled={sim.marcadas[sim.i] === null} onClick={avancar}>
        {sim.i < sim.qs.length - 1 ? "Próxima" : "Finalizar"}
      </button>
    </>
  );
}
