import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;

  className?: string;

  fluid?: boolean;

  padded?: boolean;
}

export default function PageContainer({
  children,
  className,
  fluid = false,
  padded = true,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-slate-50",

        padded && "p-6 lg:p-8",

        className
      )}
    >
      <div
        className={cn(
          fluid ? "w-full" : "mx-auto max-w-7xl",

          "space-y-8"
        )}
      >
        {children}
      </div>
    </main>
  );
}