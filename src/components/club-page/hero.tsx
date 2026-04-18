import { MapPin } from "lucide-react";
import type { Community, CommunityStats } from "@/lib/db/schema";

function InstagramIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface HeroProps {
  community: Community;
  stats: CommunityStats | null;
}

export function Hero({ community, stats }: HeroProps) {
  const sunriseGradient =
    "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)";

  let heroGradient = sunriseGradient;
  if (community.tier === "pro" && community.themeColor) {
    heroGradient = `linear-gradient(to top, ${community.themeColor}, ${community.themeColor}dd)`;
  }

  return (
    <section
      style={{
        background: heroGradient,
        padding: "32px 20px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
        {/* Location pill */}
        <div
          style={{
            display: "inline-flex",
            gap: "5px",
            padding: "3px 10px",
            background: "rgba(255,255,255,0.18)",
            borderRadius: "16px",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <MapPin size={11} color="white" />
          <span style={{ fontSize: "11px", color: "white", fontWeight: 500 }}>
            {community.city}
          </span>
        </div>

        {/* Club name */}
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "26px",
            fontWeight: 800,
            color: "white",
            margin: "0 0 6px 0",
            lineHeight: 1.1,
          }}
        >
          {community.name}
        </h1>

        {/* Description */}
        {community.description && (
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 12px 0",
              lineHeight: 1.5,
            }}
          >
            {community.description}
          </p>
        )}

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: "12px",
            color: "white",
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          <span>👥 {community.memberCount} members</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            🏃{" "}
            {community.vibe.charAt(0).toUpperCase() + community.vibe.slice(1)}
          </span>
          {stats && stats.streakRecord > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>🔥 {stats.streakRecord}wk streak</span>
            </>
          )}
          {community.instagramHandle && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <a
                href={`https://instagram.com/${community.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <InstagramIcon size={12} />@{community.instagramHandle}
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
