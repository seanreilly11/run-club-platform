import { notFound } from "next/navigation";
import Link from "next/link";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { SettingsList } from "@/components/dashboard/settings-list";

interface Props {
  params: Promise<{ slug: string }>;
}

interface SettingsRow {
  label: string;
  description: string;
  href?: string;
  proOnly?: boolean;
  isClubDetails?: boolean;
}

export default async function DashboardSettingsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const isFree = community.tier === "free";

  const rows: SettingsRow[] = [
    {
      label: "Club details",
      description: "Name, description, city, vibe, afters venue",
      isClubDetails: true,
    },
    {
      label: "Team",
      description: "Manage admins and invitations",
      href: `/dashboard/${slug}/settings/team`,
    },
    {
      label: "Billing & subscription",
      description: isFree
        ? "Free plan · Upgrade to Pro"
        : "Pro plan · Manage subscription",
      href: `/dashboard/${slug}/settings/billing`,
    },
    {
      label: "Custom branding",
      description: "Theme colour for your club page",
      href: `/dashboard/${slug}/settings/branding`,
      proOnly: true,
    },
    {
      label: "Notifications",
      description: "Email preferences for reminders and digests",
      href: `/dashboard/${slug}/settings/notifications`,
    },
  ];

  const communityData = {
    slug: community.slug,
    name: community.name,
    city: community.city,
    description: community.description,
    vibe: community.vibe,
    postRunDefault: community.postRunDefault,
    instagramHandle: community.instagramHandle,
  };

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

      <div style={{ marginBottom: "24px" }}>
        <SettingsList rows={rows} community={communityData} isFree={isFree} />
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
