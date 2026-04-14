"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileTab {
  emoji: string;
  label: string;
  section: string;
}

const TABS: MobileTab[] = [
  { emoji: "🏠", label: "Overview", section: "" },
  { emoji: "📅", label: "Events", section: "events" },
  { emoji: "👥", label: "Members", section: "members" },
  { emoji: "📊", label: "Analytics", section: "analytics" },
  { emoji: "⚙️", label: "Settings", section: "settings" },
];

interface DashboardMobileTabsProps {
  slug: string;
  className?: string;
}

export function DashboardMobileTabs({
  slug,
  className,
}: DashboardMobileTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex overflow-x-auto border-b border-border-muted bg-surface",
        className,
      )}
    >
      {TABS.map((tab) => {
        const href =
          tab.section === ""
            ? `/dashboard/${slug}`
            : `/dashboard/${slug}/${tab.section}`;

        const isActive =
          tab.section === ""
            ? pathname === `/dashboard/${slug}` ||
              pathname === `/dashboard/${slug}/`
            : pathname.startsWith(`/dashboard/${slug}/${tab.section}`);

        return (
          <Link
            key={tab.section}
            href={href}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-[11px] font-medium transition-colors border-b-2",
              isActive
                ? "text-primary border-primary"
                : "text-text-muted border-transparent hover:text-text",
            )}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
