import Link from "next/link";
import { notFound } from "next/navigation";
import { getClubBySlug, getCommunityStats } from "@/lib/db/queries/communities";
import { getAttendanceHistory } from "@/lib/db/queries/events";
import { getDashboardMembers } from "@/lib/db/queries/memberships";
import { AttendanceCharts } from "@/components/dashboard/attendance-charts";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardAnalyticsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const isFree = community.tier === "free";

  const [stats, history, members] = await Promise.all([
    getCommunityStats(community.id),
    getAttendanceHistory(community.id, 12),
    getDashboardMembers(community.id),
  ]);

  const statCells = [
    {
      label: "Avg turnout",
      value: stats?.avgActualPerEvent
        ? Math.round(parseFloat(stats.avgActualPerEvent))
        : "—",
      color: "#16A34A",
    },
    {
      label: "Show rate",
      value: stats?.avgShowRate
        ? `${Math.round(parseFloat(stats.avgShowRate) * 100)}%`
        : "—",
      color: "#8B5CF6",
    },
    {
      label: "Afters rate",
      value: stats?.avgSocialRate
        ? `${Math.round(parseFloat(stats.avgSocialRate) * 100)}%`
        : "—",
      color: "#F59E0B",
    },
    {
      label: "Events run",
      value: stats?.totalEvents ?? "—",
      color: "#1C1917",
    },
  ];

  // Prepare chart data
  const attendanceData = history.map((e) => ({
    label: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(e.date),
    rsvps: e.goingCount,
    actual: e.actualAttendance,
    afters: e.actualSocialAttendance,
  }));

  const showRateTrend = history.map((e) => ({
    label: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(e.date),
    rate:
      e.goingCount > 0 && e.actualAttendance !== null
        ? e.actualAttendance / e.goingCount
        : 0,
  }));

  const activeCount = members.filter((m) => m.status === "active").length;
  const newCount = members.filter((m) => m.status === "new").length;
  const atRiskCount = members.filter((m) => m.status === "at_risk").length;
  const lapsedCount = members.filter((m) => m.status === "lapsed").length;
  const memberHealth = [
    { name: "Active", value: activeCount, color: "#16A34A" },
    { name: "New", value: newCount, color: "#8B5CF6" },
    { name: "At risk", value: atRiskCount, color: "#F59E0B" },
    { name: "Lapsed", value: lapsedCount, color: "#DC2626" },
  ].filter((s) => s.value > 0);

  return (
    <div style={{ padding: "20px", maxWidth: "640px" }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 0 16px 0",
          color: "#1C1917",
        }}
      >
        Analytics
      </h2>

      {/* Stats grid — always visible */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          marginBottom: "16px",
        }}
        className="sm:grid-cols-4"
      >
        {statCells.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {isFree ? (
        /* Free tier: blurred charts + upgrade CTA */
        <div style={{ position: "relative" }}>
          <div
            style={{
              filter: "blur(4px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <AttendanceCharts
              attendanceData={
                attendanceData.length > 0
                  ? attendanceData
                  : [
                      { label: "Jan 1", rsvps: 18, actual: 14, afters: 8 },
                      { label: "Jan 8", rsvps: 22, actual: 19, afters: 11 },
                      { label: "Jan 15", rsvps: 20, actual: 16, afters: 9 },
                    ]
              }
              showRateTrend={
                showRateTrend.length > 0
                  ? showRateTrend
                  : [
                      { label: "Jan 1", rate: 0.78 },
                      { label: "Jan 8", rate: 0.86 },
                      { label: "Jan 15", rate: 0.8 },
                    ]
              }
              memberHealth={
                memberHealth.length > 0
                  ? memberHealth
                  : [
                      { name: "Active", value: 18, color: "#16A34A" },
                      { name: "New", value: 5, color: "#8B5CF6" },
                      { name: "At risk", value: 4, color: "#F59E0B" },
                      { name: "Lapsed", value: 3, color: "#DC2626" },
                    ]
              }
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "28px" }}>🔒</div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#1C1917",
                textAlign: "center",
              }}
            >
              Unlock full analytics
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#78716C",
                textAlign: "center",
                maxWidth: "240px",
              }}
            >
              See attendance trends, show rates, and member health with Pro
            </div>
            <Link
              href={`/dashboard/${slug}/settings`}
              style={{
                padding: "10px 20px",
                background: "#F43F5E",
                color: "white",
                borderRadius: "11px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
              }}
            >
              Upgrade to Pro →
            </Link>
          </div>
        </div>
      ) : (
        /* Pro tier: full charts */
        <AttendanceCharts
          attendanceData={attendanceData}
          showRateTrend={showRateTrend}
          memberHealth={memberHealth}
        />
      )}
    </div>
  );
}
