import { cn } from "@/lib/utils";

interface VenueBadgeProps {
  venueName: string;
  postRunDefault: "pub" | "coffee" | "brunch" | "none";
  variant?: "small" | "card";
  className?: string;
}

export function VenueBadge({
  venueName,
  postRunDefault: _postRunDefault,
  variant = "small",
  className,
}: VenueBadgeProps) {
  const label = `Afters at ${venueName}`;

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-1.5 rounded-[9px] border px-3 py-2 text-[12px] font-semibold",
          className,
        )}
        style={{
          background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
          borderColor: "#FDE68A",
          color: "#B45309",
        }}
      >
        {label}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[10px] font-semibold",
        className,
      )}
      style={{ background: "#FEF3C7", color: "#B45309" }}
    >
      {label}
    </span>
  );
}
