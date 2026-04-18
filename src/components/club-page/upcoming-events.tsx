import type { UpcomingEventRow } from "@/lib/db/queries/events";

interface UpcomingEventsProps {
  events: UpcomingEventRow[];
  timezone: string;
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

export function UpcomingEvents({
  events,
  timezone,
}: UpcomingEventsProps) {
  if (events.length === 0) return null;

  return (
    <section>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          margin: "0 0 10px 0",
          color: "#1C1917",
        }}
      >
        Upcoming runs
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {events.map((event) => {
          return (
            <div
              key={event.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "14px",
                padding: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      margin: "0 0 2px 0",
                      color: "#1C1917",
                    }}
                  >
                    {event.title}
                  </h3>
                  <span style={{ fontSize: "11px", color: "#78716C" }}>
                    {formatEventDate(event.date, timezone)}
                  </span>{" "}
                  {event.distanceKm && (
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        background: "#FFF5F0",
                        borderRadius: "4px",
                        color: "#78716C",
                      }}
                    >
                      {event.distanceKm}
                      {event.distanceUnit}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "right", fontSize: "11px" }}>
                  <div style={{ fontWeight: 600, color: "#1C1917" }}>
                    {event.goingCount} going
                  </div>
                  {event.aftersCount > 0 && (
                    <div style={{ color: "#A8A29E" }}>
                      {event.aftersCount} for afters
                    </div>
                  )}
                </div>
              </div>

              {event.postRunVenueName && (
                <div
                  style={{
                    marginTop: "6px",
                    display: "inline-flex",
                    gap: "4px",
                    alignItems: "center",
                    padding: "3px 8px",
                    background: "#FEF3C7",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#B45309",
                      fontWeight: 600,
                    }}
                  >
                    Afters at {event.postRunVenueName}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
