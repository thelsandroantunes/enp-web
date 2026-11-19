"use client";

import { useDesktop } from "@/hooks/useDesktop";
import { QuestoesWeb } from "@/views/desktop/QuestoesWeb";
import { QuestoesMobile } from "@/views/mobile/QuestoesMobile";

export default function Pagina() {
  return useDesktop() ? <QuestoesWeb /> : <QuestoesMobile />;
}
