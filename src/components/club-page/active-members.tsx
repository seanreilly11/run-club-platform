import type { ActiveMemberRow } from "@/lib/db/queries/communities";

interface ActiveMembersProps {
  members: ActiveMemberRow[];
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function ActiveMembers({ members }: ActiveMembersProps) {
  if (members.length === 0) {
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
          Active members
        </h2>
        <p style={{ fontSize: "13px", color: "#78716C" }}>
          Be the first to join!
        </p>
      </section>
    );
  }

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
        Active members
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {members.map((member) => (
          <div
            key={member.userId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "9px",
            }}
          >
            {/* Avatar */}
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
              {getInitial(member.name)}
            </div>

            {/* Name + pace */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#1C1917",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {member.name}
              </div>
              {member.preferredPaceGroup && (
                <div style={{ fontSize: "10px", color: "#A8A29E" }}>
                  {member.preferredPaceGroup}/km
                </div>
              )}
            </div>

            {/* Streak */}
            {member.currentStreak > 0 && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#F43F5E",
                }}
              >
                {member.currentStreak}wk streak
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
