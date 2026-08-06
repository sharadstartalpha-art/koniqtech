"use client";

import {
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;

  onClose: () => void;

  title?: string;

  description?: string;

  children: ReactNode;

  footer?: ReactNode;

  size?: "sm" | "md" | "lg" | "xl" | "full";

  closeOnOverlay?: boolean;

  closeOnEscape?: boolean;

  showCloseButton?: boolean;

  className?: string;
}

const sizes = {
  sm: "max-w-md",

  md: "max-w-xl",

  lg: "max-w-3xl",

  xl: "max-w-5xl",

  full: "max-w-[95vw] h-[95vh]",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        closeOnEscape
      ) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";

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
    typeof window === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() =>
          closeOnOverlay && onClose()
        }
      />

      {/* Dialog */}

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 mx-4 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200",

          sizes[size],

          className
        )}
      >
        {(title ||
          description ||
          showCloseButton) && (
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

            <div>

              {title && (
                <h2 className="text-2xl font-bold text-slate-900">
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

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            {footer}
          </div>
        )}

      </div>

    </div>,
    document.body
  );
}