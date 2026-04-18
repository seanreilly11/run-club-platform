import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardEvents } from "@/lib/db/queries/events";
import { NewEventButton } from "@/components/dashboard/new-event-button";
import { EventsList } from "@/components/dashboard/events-list";

interface Props {
  params: Promise<{ slug: string }>;
}

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
        <EventsList
          events={allEvents}
          communitySlug={slug}
          communityTimezone={community.timezone}
        />
      )}
    </div>
  );
}
