"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDesktop } from "@/hooks/useDesktop";
import { Landing } from "@/views/desktop/Landing";
import { WebShell } from "@/views/desktop/WebShell";
import { useApp } from "@/state/AppState";

/** Web: página de apresentação. Celular: vai direto para o app. */
export default function Raiz() {
  const desktop = useDesktop();
  const { s, pronto } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (pronto && !desktop) router.replace(s.onb < 3 ? "/onboarding" : "/inicio");
  }, [pronto, desktop, s.onb, router]);
  if (desktop) return <WebShell><Landing /></WebShell>;
  return <div className="carregando">Carregando…</div>;
}
