"use client";

import { useDesktop } from "@/hooks/useDesktop";
import { PlanosWeb } from "@/views/desktop/PlanosWeb";
import { PlanosMobile } from "@/views/mobile/PlanosMobile";

export default function Pagina() {
  return useDesktop() ? <PlanosWeb /> : <PlanosMobile />;
}
