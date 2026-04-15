import { cn } from "@/lib/utils";

interface VibeBadgeProps {
  vibe: "competitive" | "social" | "casual";
  className?: string;
}

const vibeStyles: Record<
  VibeBadgeProps["vibe"],
  { bg: string; color: string }
> = {
  social: { bg: "#FFF1F2", color: "#F43F5E" },
  competitive: { bg: "#EDE9FE", color: "#7C3AED" },
  casual: { bg: "#FEF3C7", color: "#B45309" },
};

const vibeLabels: Record<VibeBadgeProps["vibe"], string> = {
  social: "Social",
  competitive: "Competitive",
  casual: "Casual",
};

export function VibeBadge({ vibe, className }: VibeBadgeProps) {
  const { bg, color } = vibeStyles[vibe];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-[6px] py-[1px] text-[9px] font-semibold",
        className,
      )}
      style={{ background: bg, color }}
    >
      {vibeLabels[vibe]}
    </span>
  );
}
