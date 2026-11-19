"use client";

import { EtapasWeb } from "@/views/desktop/EtapasWeb";
import { WebShell } from "@/views/desktop/WebShell";

/** Página de apresentação do projeto: sempre no visual web (também abre no celular) */
export default function Pagina() {
  return <WebShell><EtapasWeb /></WebShell>;
}
