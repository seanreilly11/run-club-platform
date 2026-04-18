import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MemberRole } from "@/lib/db/queries/memberships";

interface SidebarItem {
  label: string;
  section: string;
  proOnly?: boolean;
}

const NAV_ITEMS: SidebarItem[] = [
  { label: "Overview", section: "" },
  { label: "Events", section: "events" },
  { label: "Members", section: "members" },
  { label: "Analytics", section: "analytics", proOnly: true },
  { label: "Settings", section: "settings" },
];

interface DashboardSidebarProps {
  community: { slug: string; name: string; tier: "free" | "pro" };
  userRole: MemberRole;
  currentPath: string;
}

export function DashboardSidebar({
  community,
  currentPath,
}: DashboardSidebarProps) {
  const isFree = community.tier === "free";

  return (
    <div className="flex flex-col h-full py-4">
      {/* Club header */}
      <div className="px-4 mb-4">
        <Link
          href="/my-clubs"
          className="block text-[10px] text-text-light uppercase tracking-wide hover:text-text-muted transition-colors"
        >
          {community.name}
        </Link>
        {isFree ? (
          <p className="text-[10px] text-text-muted mt-0.5">
            Free plan{" "}
            <Link
              href={`/dashboard/${community.slug}/settings`}
              className="text-primary font-semibold"
            >
              Upgrade →
            </Link>
          </p>
        ) : (
          <span className="inline-flex items-center rounded-md bg-[#FFF1F2] text-primary text-[9px] font-semibold px-1.5 py-0.5 mt-0.5">
            Pro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2">
        {NAV_ITEMS.map((item) => {
          const href =
            item.section === ""
              ? `/dashboard/${community.slug}`
              : `/dashboard/${community.slug}/${item.section}`;

          const isActive =
            item.section === ""
              ? currentPath === `/dashboard/${community.slug}` ||
                currentPath === `/dashboard/${community.slug}/`
              : currentPath.startsWith(
                  `/dashboard/${community.slug}/${item.section}`,
                );

          const isLocked = item.proOnly && isFree;

          return (
            <Link
              key={item.section}
              href={href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] transition-colors mb-0.5",
                isActive
                  ? "bg-surface-alt text-primary font-semibold"
                  : "text-text-muted hover:text-text hover:bg-surface-alt",
                isLocked && "opacity-50",
              )}
            >
              <span>{item.label}</span>
              {isLocked && <span className="ml-auto text-[9px]">PRO</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
