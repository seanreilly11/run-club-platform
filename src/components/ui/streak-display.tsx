import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export function StreakDisplay({ streak, className }: StreakDisplayProps) {
  if (streak <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-bold text-primary",
        className,
      )}
    >
      🔥 {streak}wk
    </span>
  );
}
