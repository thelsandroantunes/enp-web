"use client";

import { useDesktop } from "@/hooks/useDesktop";
import { OnboardingWeb } from "@/views/desktop/OnboardingWeb";
import { WebShell } from "@/views/desktop/WebShell";
import { OnboardingMobile } from "@/views/mobile/OnboardingMobile";
import { useApp } from "@/state/AppState";

export default function Pagina() {
  const desktop = useDesktop();
  const { pronto } = useApp();
  if (!desktop) return <><div className="aviso">Protótipo · dados ilustrativos · pagamentos simulados</div><OnboardingMobile /></>;
  return <WebShell>{pronto ? <OnboardingWeb /> : null}</WebShell>;
}
