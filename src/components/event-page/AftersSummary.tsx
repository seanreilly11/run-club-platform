import { EventDetailRow } from "@/lib/db/queries/events";

type Props = {
  event: EventDetailRow;
};

const AftersSummary = ({ event }: Props) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
        border: "1px solid #FDE68A",
        borderRadius: "14px",
        padding: "16px",
        marginBottom: "14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "80px",
          height: "80px",
          background:
            "radial-gradient(circle at top right, rgba(245,158,11,0.15), transparent)",
          borderRadius: "0 0 0 80px",
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontSize: "10px",
            color: "#78350F",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}
        >
          Afters
        </div>
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#78350F",
            marginBottom: "4px",
          }}
        >
          {event.postRunVenueName}
        </div>
        {event.postRunVenueNotes && (
          <div
            style={{
              fontSize: "12px",
              color: "#92400E",
              marginBottom: "8px",
              lineHeight: 1.5,
            }}
          >
            {event.postRunVenueNotes}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#78350F" }}>
            {event.aftersCount} staying for afters
          </span>
          {event.postRunVenueUrl && (
            <a
              href={event.postRunVenueUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                color: "#B45309",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Open in Maps →
            </a>
          )}
        </div>
        <div style={{ fontSize: "9px", color: "#D97706" }}>
          You&apos;ll be asked after you RSVP
        </div>
      </div>
    </div>
  );
};

export default AftersSummary;
