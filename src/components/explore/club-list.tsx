import { ClubCard } from "@/components/explore/club-card";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

interface ClubListProps {
  clubs: ExploreClubRow[];
  totalCount: number;
}

export function ClubList({ clubs, totalCount }: ClubListProps) {
  return (
    <div>
      {/* Result count line */}
      <div
        className="mb-3 text-[12px]"
        style={{ color: "#78716C" }}
      >
        {totalCount} club{totalCount !== 1 ? "s" : ""}
      </div>

      {/* Empty state or club list */}
      {clubs.length === 0 ? (
        <div
          className="rounded-[14px] border bg-surface p-8 text-center"
          style={{ borderColor: "#F5F0EB" }}
        >
          <div className="mb-1 text-2xl">🏃</div>
          <h2
            className="mb-1 font-bricolage text-[15px] font-semibold"
            style={{ color: "#1C1917" }}
          >
            No clubs match your filters
          </h2>
          <p
            className="mb-4 text-[13px]"
            style={{ color: "#78716C" }}
          >
            Try broadening your search or changing the vibe / afters filter.
          </p>
          <a
            href="/create"
            className="inline-block rounded-[12px] px-4 py-2 text-[13px] font-bold text-white"
            style={{
              backgroundColor: "#F43F5E",
              boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
            }}
          >
            Start your own club →
          </a>
        </div>
      ) : (
        <div className="space-y-2.5">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} timezone="UTC" />
          ))}
        </div>
      )}
    </div>
  );
}
