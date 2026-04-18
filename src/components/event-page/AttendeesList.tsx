import { EventDetailRow, getEventAttendees } from "@/lib/db/queries/events";

type Props = {
  event: EventDetailRow;
};

const AttendeesList = async ({ event }: Props) => {
  const attendees = await getEventAttendees(event.id);

  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            margin: 0,
            color: "#1C1917",
          }}
        >
          Who&apos;s coming
        </h3>
        <span style={{ fontSize: "11px", color: "#A8A29E" }}>
          {event.goingCount} going · {event.aftersCount} afters ·{" "}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {attendees.map((a) => (
          <div
            key={a.userId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#FFE4E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: "#F43F5E",
                flexShrink: 0,
              }}
            >
              {a.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#1C1917",
                }}
              >
                {a.name}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                  marginTop: "1px",
                }}
              >
                {a.paceGroup && (
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 5px",
                      background: "#FFF5F0",
                      borderRadius: "4px",
                      color: "#78716C",
                    }}
                  >
                    {a.paceGroup}
                  </span>
                )}
                {a.currentStreak > 0 && (
                  <span style={{ fontSize: "10px", color: "#F43F5E" }}>
                    {a.currentStreak}wk streak
                  </span>
                )}
              </div>
            </div>
            {a.joiningSocial && (
              <span
                style={{
                  fontSize: "10px",
                  color: "#B45309",
                  fontWeight: 600,
                }}
              >
                afters
              </span>
            )}
          </div>
        ))}
      </div>
      {event.goingCount > attendees.length && (
        <button
          style={{
            width: "100%",
            padding: "8px",
            background: "none",
            border: "none",
            color: "#F43F5E",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            marginTop: "6px",
          }}
        >
          View all {event.goingCount} attendees →
        </button>
      )}
    </div>
  );
};

export default AttendeesList;
