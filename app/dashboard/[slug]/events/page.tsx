import Link from "next/link";
import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardEvents } from "@/lib/db/queries/events";
import { NewEventButton } from "@/components/dashboard/new-event-button";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_BADGE: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  upcoming: { label: "Upcoming", bg: "#F0FDF4", color: "#16A34A" },
  completed: { label: "Completed", bg: "#F5F0EB", color: "#78716C" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#DC2626" },
};

export default async function DashboardEventsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const allEvents = await getDashboardEvents(community.id);

  return (
    <div style={{ padding: "20px", maxWidth: "640px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
            color: "#1C1917",
          }}
        >
          Events
        </h2>
        <NewEventButton
          communitySlug={slug}
          communityName={community.name}
          variant="primary"
        />
      </div>

      {allEvents.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>📅</div>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1C1917",
              marginBottom: "4px",
            }}
          >
            No events yet
          </div>
          <div
            style={{ fontSize: "12px", color: "#78716C", marginBottom: "16px" }}
          >
            Create your first run to get started
          </div>
          <NewEventButton
            communitySlug={slug}
            communityName={community.name}
            variant="empty-state"
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {allEvents.map((event) => {
            const badge = STATUS_BADGE[event.status] ?? STATUS_BADGE.upcoming;
            const formattedDate = new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }).format(event.date);

            return (
              <div
                key={event.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "11px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1C1917",
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {event.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#A8A29E" }}>
                    {formattedDate} · {event.goingCount} RSVPs
                    {event.actualAttendance !== null && (
                      <> · {event.actualAttendance} attended</>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    background: badge.bg,
                    color: badge.color,
                    borderRadius: "6px",
                    flexShrink: 0,
                  }}
                >
                  {badge.label}
                </span>
                <Link
                  href={`/dashboard/${slug}/events/${event.id}/edit`}
                  style={{
                    flexShrink: 0,
                    fontSize: "11px",
                    color: "#A8A29E",
                    textDecoration: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: "#FFF5F0",
                  }}
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
