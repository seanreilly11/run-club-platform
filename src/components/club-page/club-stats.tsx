import type { CommunityStats } from "@/lib/db/schema";

interface ClubStatsProps {
  stats: CommunityStats;
}

export function ClubStats({ stats }: ClubStatsProps) {
  const avgTurnout = stats.avgActualPerEvent
    ? Math.round(parseFloat(stats.avgActualPerEvent)).toString()
    : "—";

  const aftersRate = stats.avgSocialRate
    ? Math.round(parseFloat(stats.avgSocialRate) * 100).toString() + "%"
    : "—";

  const streak =
    stats.streakRecord > 0 ? `${stats.streakRecord}wk` : "—";

  const statCells = [
    { value: avgTurnout, label: "Avg turnout" },
    { value: aftersRate, label: "Stay for afters" },
    { value: streak, label: "Club streak" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "6px",
      }}
    >
      {statCells.map((s) => (
        <div
          key={s.label}
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "12px",
            padding: "10px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#1C1917",
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: "9px", color: "#A8A29E" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
