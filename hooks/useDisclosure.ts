"use client";

import { useCallback, useState } from "react";

export interface UseDisclosureOptions {
  defaultOpen?: boolean;

  onOpen?: () => void;

  onClose?: () => void;

  onToggle?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
  isOpen: boolean;

  open: () => void;

  close: () => void;

  toggle: () => void;

  setOpen: (value: boolean) => void;
}

export function useDisclosure({
  defaultOpen = false,
  onOpen,
  onClose,
  onToggle,
}: UseDisclosureOptions = {}): UseDisclosureReturn {
  const [isOpen, setIsOpen] =
    useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);

    onOpen?.();

    onToggle?.(true);
  }, [onOpen, onToggle]);

  const close = useCallback(() => {
    setIsOpen(false);

    onClose?.();

    onToggle?.(false);
  }, [onClose, onToggle]);

  const toggle = useCallback(() => {
    setIsOpen((previous) => {
      const next = !previous;

      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }

      onToggle?.(next);

      return next;
    });
  }, [onOpen, onClose, onToggle]);

  const setOpen = useCallback(
    (value: boolean) => {
      setIsOpen(value);

      if (value) {
        onOpen?.();
      } else {
        onClose?.();
      }

      onToggle?.(value);
    },
    [onOpen, onClose, onToggle]
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
  };
}