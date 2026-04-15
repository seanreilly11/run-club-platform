import type { CommunityStats } from "@/lib/db/schema";

interface ClubStatsProps {
  stats: CommunityStats;
}

function getMilestone(distanceKm: number): string | null {
  if (distanceKm >= 10000)
    return "🌍 That's London to Sydney — halfway around the world!";
  if (distanceKm >= 5000) return "🌍 That's Sydney to Tokyo!";
  if (distanceKm >= 4219.5) return "🏅 100 marathons worth of running!";
  if (distanceKm >= 1000) return "🌍 That's London to Barcelona!";
  return null;
}

interface StatCell {
  value: string;
  label: string;
}

export function ClubStats({ stats }: ClubStatsProps) {
  const totalDistance = parseFloat(stats.totalDistanceKm);
  const milestone = getMilestone(totalDistance);

  const statCells: StatCell[] = [
    {
      value: `🏃 ${totalDistance.toLocaleString()} km`,
      label: "run together",
    },
    {
      value: `🎉 ${stats.totalEvents}`,
      label: "runs completed",
    },
    {
      value: `👥 ${stats.uniqueRunners}`,
      label: "runners",
    },
  ];

  // Fourth stat: afters count if any, else avg turnout if available
  if (stats.totalAftersCount > 0) {
    statCells.push({
      value: `🍺 ${stats.totalAftersCount.toLocaleString()}`,
      label: "drinks earned",
    });
  } else if (stats.avgActualPerEvent) {
    statCells.push({
      value: `📊 ${Math.round(parseFloat(stats.avgActualPerEvent))}`,
      label: "avg turnout",
    });
  }

  return (
    <section>
      <div className="rounded-[14px] border border-border-muted bg-surface p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statCells.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-heading text-[20px] font-bold text-text">
                {value}
              </p>
              <p className="text-[11px] text-text-muted">{label}</p>
            </div>
          ))}
        </div>
        {milestone && (
          <p className="mt-3 border-t border-border-muted pt-3 text-center text-[11px] text-text-muted">
            {milestone}
          </p>
        )}
      </div>
    </section>
  );
}
