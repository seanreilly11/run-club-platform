import { useState } from "react";

const t = {
  bg: "#FFFBF7", surface: "#FFFFFF", surfaceAlt: "#FFF5F0",
  border: "#FECDD3", borderMuted: "#F5F0EB",
  text: "#1C1917", textMuted: "#78716C", textLight: "#A8A29E",
  primary: "#F43F5E", primaryLight: "#FFF1F2", primaryBg: "#FFE4E6",
  secondary: "#8B5CF6", accent: "#F59E0B", success: "#16A34A",
  venueBg: "#FEF3C7", venueText: "#B45309",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
};

const upcomingEvents = [
  { club: "Bondi Beach Runners", title: "Wednesday Evening 5K", date: "Wed 26 Mar · 6:30 PM", distance: "5 km", rsvpd: true, social: true, venue: "The Anchor", venueEmoji: "🍺" },
  { club: "Bondi Beach Runners", title: "Sunday Long Run", date: "Sun 30 Mar · 9:00 AM", distance: "12 km", rsvpd: true, social: false, venue: "Depot Café", venueEmoji: "☕" },
  { club: "Coogee Coastal Crew", title: "Saturday Social 10K", date: "Sat 29 Mar · 8:00 AM", distance: "10 km", rsvpd: false, social: false, venue: "Coogee Pavilion", venueEmoji: "🥐" },
  { club: "Bondi Beach Runners", title: "Wednesday Evening 5K", date: "Wed 2 Apr · 6:30 PM", distance: "5 km", rsvpd: false, social: false, venue: "The Anchor", venueEmoji: "🍺" },
];

const ownedClubs = [
  { name: "Bondi Beach Runners", city: "Sydney", members: 64, streak: 12, vibe: "social" },
  { name: "Manly Trail Runners", city: "Sydney", members: 18, streak: 4, vibe: "competitive" },
];

const memberClubs = [
  { name: "Coogee Coastal Crew", city: "Sydney", members: 89, streak: 22, vibe: "social" },
  { name: "Inner West Pacers", city: "Sydney", members: 156, streak: 8, vibe: "casual" },
];

const waitlistedClubs = [
  { name: "Surry Hills Speed Club", city: "Sydney", members: 30, waitDate: "3 days ago" },
];

const VibeBadge = ({ vibe }) => {
  const c = { social: { bg: "#FFF1F2", text: "#F43F5E" }, competitive: { bg: "#EDE9FE", text: "#7C3AED" }, casual: { bg: "#FEF3C7", text: "#B45309" } };
  const s = c[vibe];
  return <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "5px", fontWeight: 600, background: s.bg, color: s.text }}>{vibe}</span>;
};

export default function MyClubs() {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", justifyContent: "center", padding: "24px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div>
        <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>
          My Clubs — /my-clubs (owner view)
        </div>
        <div style={{
          width: "520px", borderRadius: "16px", overflow: "hidden",
          border: "3px solid #334155", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          background: t.bg,
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: t.text }}>

            {/* ===== NAV ===== */}
            <nav style={{ background: t.surface, borderBottom: `1px solid ${t.borderMuted}`, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "5px", background: t.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🔥</div>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "14px" }}>runclub</span>
              </div>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: t.textMuted }}>Explore</span>
                <span style={{ fontSize: "12px", color: t.primary, fontWeight: 600 }}>My Clubs</span>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: t.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: t.primary }}>JK</div>
              </div>
            </nav>

            <div style={{ padding: "20px" }}>

              {/* ===== HEADER ===== */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "22px", fontWeight: 800, margin: "0 0 2px 0" }}>My Clubs</h1>
                  <p style={{ fontSize: "13px", color: t.textMuted, margin: 0 }}>Your upcoming runs across all clubs</p>
                </div>
              </div>

              {/* ===== THIS WEEK ===== */}
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 700, margin: "0 0 10px 0" }}>This week</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {upcomingEvents.map((e, i) => (
                    <div key={i} style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", padding: "12px 14px", boxShadow: t.cardShadow }}>
                      <div style={{ fontSize: "10px", color: t.primary, fontWeight: 600, marginBottom: "4px" }}>{e.club}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{e.title}</span>
                            <span style={{ fontSize: "10px", padding: "1px 6px", background: t.surfaceAlt, borderRadius: "5px", color: t.textMuted }}>{e.distance}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "2px" }}>{e.date}</div>
                          <div style={{ fontSize: "10px", color: t.textLight, marginTop: "2px" }}>{e.rsvpd ? "28" : "23"} going · {e.rsvpd ? "18" : "8"} for afters</div>
                          <div style={{ display: "inline-flex", gap: "3px", alignItems: "center", padding: "2px 7px", background: t.venueBg, borderRadius: "5px", marginTop: "5px" }}>
                            <span style={{ fontSize: "9px" }}>{e.venueEmoji}</span>
                            <span style={{ fontSize: "9px", color: t.venueText, fontWeight: 600 }}>Afters at {e.venue}</span>
                          </div>
                        </div>
                        <div>
                          {e.rsvpd ? (
                            <div style={{ textAlign: "right" }}>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px" }}>
                                <span style={{ color: t.success, fontSize: "11px", fontWeight: 700 }}>✓</span>
                                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 600 }}>Going</span>
                              </div>
                              {e.social && (
                                <div style={{ fontSize: "9px", color: t.venueText, marginTop: "3px", textAlign: "right" }}>+ afters 🍺</div>
                              )}
                            </div>
                          ) : (
                            <button style={{ padding: "6px 14px", background: t.primary, color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", boxShadow: "0 2px 8px rgba(244,63,94,0.25)", whiteSpace: "nowrap" }}>I'm in! 🏃</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== MY CLUBS (combined) ===== */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 700, margin: 0 }}>My clubs</h2>
                  <button style={{ padding: "5px 12px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "11px", fontWeight: 600, color: t.textMuted, cursor: "pointer", fontFamily: "inherit" }}>+ Start a club</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[...ownedClubs.map(c => ({ ...c, role: "Owner" })), ...memberClubs.map(c => ({ ...c, role: null }))].map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", boxShadow: t.cardShadow }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(to top, #F59E0B 0%, #FB923C 30%, #F97066 60%, #F43F5E 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>🔥</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{c.name}</span>
                          {c.role && <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: t.primaryLight, color: t.primary, fontWeight: 600 }}>{c.role}</span>}
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "2px" }}>
                          <span style={{ fontSize: "11px", color: t.textMuted }}>{c.city} · {c.members} members</span>
                          <VibeBadge vibe={c.vibe} />
                          <span style={{ fontSize: "10px", color: t.primary }}>🔥 {c.streak}</span>
                        </div>
                      </div>
                      {c.role ? (
                        <button style={{ padding: "6px 14px", background: t.primaryLight, color: t.primary, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Manage →</button>
                      ) : (
                        <button style={{ padding: "6px 14px", background: t.surface, color: t.textMuted, border: `1px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>View →</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== WAITLISTED ===== */}
              <div>
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 700, margin: "0 0 10px 0" }}>Waitlisted</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {waitlistedClubs.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", boxShadow: t.cardShadow }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: t.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, opacity: 0.6 }}>🔥</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{c.name}</span>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "2px" }}>
                          <span style={{ fontSize: "11px", color: t.textMuted }}>{c.city} · {c.members} members</span>
                          <span style={{ fontSize: "10px", color: t.textLight }}>Joined waitlist {c.waitDate}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ display: "inline-flex", padding: "4px 10px", background: t.venueBg, borderRadius: "7px", fontSize: "11px", fontWeight: 600, color: t.venueText }}>Waitlisted</span>
                        <div style={{ fontSize: "9px", color: t.textLight, marginTop: "3px" }}>Organizer notified</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
