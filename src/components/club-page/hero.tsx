import { MapPin } from "lucide-react";
import { VibeBadge } from "@/components/ui/vibe-badge";
import type { Community, CommunityStats } from "@/lib/db/schema";

// Instagram icon (removed from lucide-react ≥0.277)
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

  // Pro clubs with themeColor get a derived gradient
  let heroGradient = sunriseGradient;
  if (community.tier === "pro" && community.themeColor) {
    heroGradient = `linear-gradient(to top, ${community.themeColor}, ${community.themeColor}dd)`;
  }

  return (
    <section
      style={{ background: heroGradient }}
      className="relative w-full px-5 py-8 pb-10"
    >
      {/* Dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10">
        {/* Location pill */}
        <div
          className="mb-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          <MapPin size={10} />
          {community.city}
        </div>

        {/* Club name */}
        <h1 className="mb-1 font-heading text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-white">
          {community.name}
        </h1>

        {/* Description */}
        {community.description && (
          <p
            className="mb-3 text-[13px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {community.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold text-white">
          <span>👥 {community.memberCount} members</span>
          <VibeBadge vibe={community.vibe} />
          {stats && stats.streakRecord > 0 && (
            <span>🔥 {stats.streakRecord} wk streak record</span>
          )}
          {community.instagramHandle && (
            <a
              href={`https://instagram.com/${community.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/90 hover:text-white"
            >
              <InstagramIcon size={12} />
              @{community.instagramHandle}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
