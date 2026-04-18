import { EventDetailRow } from "@/lib/db/queries/events";

type Props = {
  event: EventDetailRow;
};

const RunRouteLink = ({ event }: Props) => {
  if (!event.routeUrl) {
    return null;
  }

  return (
    <a
      href={event.routeUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FFFFFF",
        border: "1px solid #F5F0EB",
        borderRadius: "12px",
        padding: "12px 14px",
        marginBottom: "12px",
        textDecoration: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "#1C1917" }}>
            View route
          </div>
          <div style={{ fontSize: "10px", color: "#A8A29E" }}>
            {event.routeUrl.replace(/^https?:\/\//, "").split("/")[0]}
          </div>
        </div>
      </div>
      <span style={{ fontSize: "11px", color: "#F43F5E", fontWeight: 500 }}>
        →
      </span>
    </a>
  );
};

export default RunRouteLink;
