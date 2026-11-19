"use client";

import { useDesktop } from "@/hooks/useDesktop";
import { PainelWeb } from "@/views/desktop/PainelWeb";
import { InicioMobile } from "@/views/mobile/InicioMobile";

export default function Pagina() {
  return useDesktop() ? <PainelWeb /> : <InicioMobile />;
}
