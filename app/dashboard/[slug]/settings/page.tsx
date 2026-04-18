import { ChevronRight, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getClubBySlug } from "@/lib/db/queries/communities";

interface Props {
  params: Promise<{ slug: string }>;
}

interface SettingsRow {
  icon: string;
  label: string;
  description: string;
  href: string;
  proOnly?: boolean;
  destructive?: boolean;
}

export default async function DashboardSettingsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const isFree = community.tier === "free";

  const rows: SettingsRow[] = [
    {
      icon: "📝",
      label: "Club details",
      description: "Name, description, city, vibe, afters venue",
      href: `/dashboard/${slug}/settings/details`,
    },
    {
      icon: "💳",
      label: "Billing & subscription",
      description: isFree
        ? "Free plan · Upgrade to Pro"
        : "Pro plan · Manage subscription",
      href: `/dashboard/${slug}/settings/billing`,
    },
    {
      icon: "🎨",
      label: "Custom branding",
      description: "Theme colour for your club page",
      href: `/dashboard/${slug}/settings/branding`,
      proOnly: true,
    },
    {
      icon: "🔔",
      label: "Notifications",
      description: "Email preferences for reminders and digests",
      href: `/dashboard/${slug}/settings/notifications`,
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "640px", margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 0 16px 0",
          color: "#1C1917",
        }}
      >
        Settings
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginBottom: "24px",
        }}
      >
        {rows.map((row) => {
          const isLocked = row.proOnly && isFree;

          return (
            <Link
              key={row.label}
              href={isLocked ? `/dashboard/${slug}/settings/billing` : row.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "12px",
                textDecoration: "none",
                opacity: isLocked ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: "18px" }}>{row.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1C1917",
                    marginBottom: "1px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {row.label}
                  {isLocked && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "1px 5px",
                        background: "#FFE4E6",
                        color: "#F43F5E",
                        borderRadius: "4px",
                      }}
                    >
                      <Lock size={8} /> PRO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "11px", color: "#A8A29E" }}>
                  {row.description}
                </div>
              </div>
              <ChevronRight size={14} color="#A8A29E" />
            </Link>
          );
        })}
      </div>

      {/* Danger zone */}
      <div
        style={{
          background: "#FEF3C7",
          border: "1px solid #FDE68A",
          borderRadius: "12px",
          padding: "14px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#B45309",
            marginBottom: "4px",
          }}
        >
          Danger zone
        </div>
        <div
          style={{ fontSize: "11px", color: "#92400E", marginBottom: "10px" }}
        >
          Deactivating hides your club from explore and cancels upcoming events.
          All data is preserved and you can reactivate at any time.
        </div>
        <Link
          href={`/dashboard/${slug}/settings/deactivate`}
          style={{
            display: "inline-block",
            padding: "7px 14px",
            background: "rgba(255,255,255,0.7)",
            color: "#B45309",
            border: "1px solid #FDE68A",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Deactivate club
        </Link>
      </div>
    </div>
  );
}
