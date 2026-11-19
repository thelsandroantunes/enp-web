"use client";

import { useDesktop } from "@/hooks/useDesktop";
import { SimuladoWeb } from "@/views/desktop/SimuladoWeb";
import { SimuladoMobile } from "@/views/mobile/SimuladoMobile";

export default function Pagina() {
  return useDesktop() ? <SimuladoWeb /> : <SimuladoMobile />;
}
