import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Columns =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6;

interface StatsGridProps {
  children: ReactNode;

  columns?: Columns;

  gap?: "sm" | "md" | "lg";

  className?: string;
}

const columnClasses: Record<Columns, string> = {
  1: "grid-cols-1",

  2: "grid-cols-1 md:grid-cols-2",

  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",

  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",

  5: "grid-cols-1 md:grid-cols-2 xl:grid-cols-5",

  6: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6",
};

const gapClasses = {
  sm: "gap-4",

  md: "gap-6",

  lg: "gap-8",
};

export default function StatsGrid({
  children,
  columns = 4,
  gap = "md",
  className,
}: StatsGridProps) {
  return (
    <section
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </section>
  );
}