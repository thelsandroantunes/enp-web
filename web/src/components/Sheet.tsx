"use client";

import type { ReactNode } from "react";

export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal" role="dialog" aria-modal onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">{children}</div>
    </div>
  );
}
