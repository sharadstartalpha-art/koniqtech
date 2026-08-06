"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: ReactNode;

  children: ReactNode;

  side?: "top" | "bottom" | "left" | "right";

  align?: "start" | "center" | "end";

  delay?: number;

  className?: string;
}

export default function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 300,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delay}
    >
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={8}
            className={cn(
              "z-50 max-w-xs rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl",
              "animate-in fade-in zoom-in-95",
              className
            )}
          >
            {content}

            <TooltipPrimitive.Arrow className="fill-slate-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}