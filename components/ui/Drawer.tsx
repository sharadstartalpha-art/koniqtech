"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;

  onClose: () => void;

  children: ReactNode;

  title?: string;

  description?: string;

  footer?: ReactNode;

  side?: "left" | "right";

  width?: "sm" | "md" | "lg" | "xl" | "full";

  closeOnOverlay?: boolean;

  closeOnEscape?: boolean;

  showCloseButton?: boolean;

  className?: string;
}

const widths = {
  sm: "w-80",

  md: "w-[420px]",

  lg: "w-[600px]",

  xl: "w-[800px]",

  full: "w-screen",
};

export default function Drawer({
  open,
  onClose,
  children,
  title,
  description,
  footer,
  side = "right",
  width = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(
      e: KeyboardEvent
    ) {
      if (
        e.key === "Escape" &&
        closeOnEscape
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose, closeOnEscape]);

  if (
    !open ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">

      {/* Overlay */}

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() =>
          closeOnOverlay && onClose()
        }
      />

      {/* Drawer */}

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute top-0 flex h-full flex-col bg-white shadow-2xl transition-transform duration-300",

          widths[width],

          side === "right"
            ? "right-0 animate-in slide-in-from-right"
            : "left-0 animate-in slide-in-from-left",

          className
        )}
      >
        {/* Header */}

        {(title ||
          description ||
          showCloseButton) && (
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

            <div>

              {title && (
                <h2 className="text-xl font-bold text-slate-900">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-slate-500">
                  {description}
                </p>
              )}

            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            )}

          </div>
        )}

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}

        {footer && (
          <div className="border-t border-slate-200 bg-slate-50 p-6">
            {footer}
          </div>
        )}

      </div>

    </div>,
    document.body
  );
}