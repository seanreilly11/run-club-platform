"use client";

import { useState } from "react";
import { inviteAdmin, removeAdmin } from "@/lib/actions/admin";
import type { TeamMember } from "@/lib/db/queries/memberships";

interface InviteAdminFormProps {
  members: TeamMember[];
  communitySlug: string;
  currentUserId: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function InviteAdminForm({ members: initialMembers, communitySlug, currentUserId }: InviteAdminFormProps) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleInvite() {
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    const result = await inviteAdmin({ communitySlug, email: email.trim() });
    setSending(false);
    if (result.success) {
      setEmail("");
      setInviteSent(true);
      setTimeout(() => setInviteSent(false), 3000);
    } else {
      setError(result.error);
    }
  }

  async function handleRemove(userId: string) {
    setRemovingId(userId);
    const result = await removeAdmin({ communitySlug, userId });
    setRemovingId(null);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } else {
      setError(result.error);
    }
  }

  return (
    <div>
      {/* Current team */}
      <div style={{ marginBottom: "20px" }}>
        {members.map((member) => (
          <div
            key={member.userId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "11px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#F43F5E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {initials(member.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1917", marginBottom: "1px" }}>
                {member.name}
              </div>
              <div style={{ fontSize: "11px", color: "#A8A29E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {member.email}
              </div>
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "2px 8px",
                background: member.role === "owner" ? "#FFF5F0" : "#F0FDF4",
                color: member.role === "owner" ? "#F43F5E" : "#16A34A",
                borderRadius: "6px",
                flexShrink: 0,
              }}
            >
              {member.role === "owner" ? "Owner" : "Admin"}
            </span>
            {member.role === "admin" && member.userId !== currentUserId && (
              <button
                onClick={() => handleRemove(member.userId)}
                disabled={removingId === member.userId}
                style={{
                  flexShrink: 0,
                  padding: "4px 10px",
                  background: "none",
                  border: "1px solid #FECACA",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#EF4444",
                  cursor: removingId === member.userId ? "default" : "pointer",
                  opacity: removingId === member.userId ? 0.5 : 1,
                  fontFamily: "inherit",
                }}
              >
                {removingId === member.userId ? "…" : "Remove"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invite card */}
      <div
        style={{
          padding: "16px",
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: "4px",
          }}
        >
          Invite an admin
        </div>
        <div style={{ fontSize: "11px", color: "#78716C", marginBottom: "12px" }}>
          They must already have an account. Admins can create and edit events.
        </div>

        {error && (
          <div
            style={{
              padding: "8px 10px",
              background: "#FEF2F2",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#DC2626",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}
        {inviteSent && (
          <div
            style={{
              padding: "8px 10px",
              background: "#F0FDF4",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#166534",
              marginBottom: "10px",
            }}
          >
            ✓ Admin role granted!
          </div>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            placeholder="their@email.com"
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1.5px solid #F5F0EB",
              fontSize: "13px",
              background: "#FFFBF7",
              outline: "none",
              color: "#1C1917",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button
            onClick={handleInvite}
            disabled={sending || !email.trim()}
            style={{
              padding: "9px 16px",
              background: "#F43F5E",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: sending || !email.trim() ? "default" : "pointer",
              opacity: sending || !email.trim() ? 0.6 : 1,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              flexShrink: 0,
            }}
          >
            {sending ? "…" : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
