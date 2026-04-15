import type { ActiveMemberRow } from "@/lib/db/queries/communities";

interface ActiveMembersProps {
  members: ActiveMemberRow[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ActiveMembers({ members }: ActiveMembersProps) {
  return (
    <section>
      <h2 className="mb-3 font-heading text-[16px] font-bold text-text">
        Active members
      </h2>

      {members.length === 0 ? (
        <p className="text-[13px] text-text-muted">
          Be the first to join! 👋
        </p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center gap-3 rounded-[10px] border border-border-muted bg-surface px-3 py-2"
            >
              {/* Avatar */}
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {getInitials(member.name)}
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-text">
                  {member.name}
                </p>
                <p className="text-[10px] text-text-light">
                  {member.eventsAttended} runs
                  {parseFloat(member.totalDistanceKm) > 0 &&
                    ` · ${parseFloat(member.totalDistanceKm).toFixed(0)} km`}
                  {member.currentStreak > 0 &&
                    ` · 🔥 ${member.currentStreak}`}
                </p>
              </div>
              {/* Pace badge */}
              {member.preferredPaceGroup && (
                <span className="shrink-0 rounded-[6px] bg-surface-alt px-1.5 py-0.5 text-[10px] text-text-muted">
                  {member.preferredPaceGroup}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
