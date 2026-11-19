"use client";

import { useDesktop } from "@/hooks/useDesktop";
import { ChancesWeb } from "@/views/desktop/ChancesWeb";
import { ChancesMobile } from "@/views/mobile/ChancesMobile";

export default function Pagina() {
  return useDesktop() ? <ChancesWeb /> : <ChancesMobile />;
}
