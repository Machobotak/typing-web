"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  actions,
}: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-white/15 bg-base p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
      >
        <h2 className="font-mono text-sm text-secondary">{title}</h2>
        <div className="mt-4">{children}</div>
        {actions ? <div className="mt-6 flex gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
