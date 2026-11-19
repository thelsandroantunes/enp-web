"use client";

const LETRAS = "ABCDE";

interface Props {
  alternativas: string[];
  selecionada: number | null;
  onSelect: (i: number) => void;
  /** quando definido, mostra o gabarito (verde/vermelho) */
  correta?: number;
}

export function Alternativas({ alternativas, selecionada, onSelect, correta }: Props) {
  const corrigida = correta !== undefined;
  return (
    <div>
      {alternativas.map((t, i) => {
        let cls = "";
        if (corrigida) cls = i === correta ? "ok" : i === selecionada ? "no" : "";
        else if (i === selecionada) cls = "sel";
        return (
          <button key={i} className={`alt ${cls}`} disabled={corrigida} onClick={() => onSelect(i)}>
            <span className="L">{LETRAS[i]}</span>
            <span>{t}</span>
          </button>
        );
      })}
    </div>
  );
}

export const letra = (i: number) => LETRAS[i];
