import Link from "next/link";
import { MapPin } from "lucide-react";
import { VenueBadge } from "@/components/ui/venue-badge";
import { VibeBadge } from "@/components/ui/vibe-badge";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

interface ClubCardProps {
  club: ExploreClubRow;
  timezone: string;
}

// Instagram icon (removed from lucide-react ≥0.277)
function InstagramIcon({ size = 14 }: { size?: number }) {
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

function formatEventDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getRunDayLabel(date: Date, timezone: string): string {
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "long",
  }).format(date);
  return `${day}s`;
}

export function ClubCard({ club, timezone }: ClubCardProps) {
  return (
    <Link href={`/${club.slug}`}>
      <div
        className="block rounded-[14px] border bg-surface px-4 py-4 transition-shadow hover:shadow-md"
        style={{
          borderColor: "#F5F0EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        {/* Header row: club name + vibe badge + instagram */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3
            className="truncate font-bricolage text-[15px] font-bold"
            style={{ color: "#1C1917" }}
          >
            {club.name}
          </h3>
          <div className="flex items-center gap-2">
            <VibeBadge vibe={club.vibe} />
            {club.instagramHandle && (
              <a
                href={`https://instagram.com/${club.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0"
                style={{ color: "#78716C" }}
              >
                <InstagramIcon size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Location row */}
        <div
          className="mb-2 flex items-center gap-1"
          style={{ color: "#78716C", fontSize: "11px" }}
        >
          <MapPin size={11} className="flex-shrink-0" />
          <span>{club.city}</span>
        </div>

        {/* Quick stats row */}
        <div
          className="mb-3 flex flex-wrap gap-3"
          style={{ color: "#78716C", fontSize: "11px" }}
        >
          <span>👥 {club.memberCount} members</span>
          {club.streakRecord > 0 && (
            <span>🔥 Club streak: {club.streakRecord} wks</span>
          )}
          {club.nextEvent && (
            <span>📅 Runs {getRunDayLabel(club.nextEvent.date, timezone)}</span>
          )}
        </div>

        {/* Next event preview */}
        {club.nextEvent ? (
          <div className="mb-3">
            <div
              className="font-medium"
              style={{ color: "#1C1917", fontSize: "12px" }}
            >
              {formatEventDate(club.nextEvent.date, timezone)}
              {club.nextEvent.distanceKm && (
                <span> · {club.nextEvent.distanceKm} {club.nextEvent.distanceUnit}</span>
              )}
              {" · "}
              {club.nextEvent.meetingPointName}
            </div>
            <div
              className="font-medium"
              style={{ color: "#F43F5E", fontSize: "12px" }}
            >
              {club.nextEvent.goingCount} going
            </div>
          </div>
        ) : (
          <div
            className="mb-3"
            style={{ color: "#78716C", fontSize: "11px" }}
          >
            No upcoming events
          </div>
        )}

        {/* Description snippet (desktop only) */}
        {club.description && (
          <div
            className="mb-3 hidden sm:block"
            style={{ color: "#78716C", fontSize: "11px" }}
          >
            {club.description.length > 80
              ? `${club.description.slice(0, 80)}...`
              : club.description}
          </div>
        )}

        {/* Afters strip */}
        {club.nextEvent?.postRunVenueName && (
          <VenueBadge
            venueName={club.nextEvent.postRunVenueName}
            postRunDefault={club.postRunDefault}
            variant="small"
            className="w-full justify-center py-1.5 text-[11px]"
          />
        )}
      </div>
    </Link>
  );
}
