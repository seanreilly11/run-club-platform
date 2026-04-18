import { useState } from "react";

const t = {
  bg: "#FFFBF7", surface: "#FFFFFF", surfaceAlt: "#FFF5F0",
  border: "#FECDD3", borderMuted: "#F5F0EB",
  text: "#1C1917", textMuted: "#78716C", textLight: "#A8A29E",
  primary: "#F43F5E", primaryLight: "#FFF1F2", primaryBg: "#FFE4E6",
  amber: "#F59E0B", venueBg: "#FEF3C7", venueGradient: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
  venueBorder: "#FDE68A", venueText: "#B45309", venueDark: "#78350F",
  success: "#16A34A", successLight: "#F0FDF4", successBorder: "#BBF7D0",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
  heroBg: "linear-gradient(135deg, #F59E0B 0%, #FB923C 25%, #F97066 50%, #F43F5E 75%, #E879A0 100%)",
};

export default function EventPage() {
  const [rsvpState, setRsvpState] = useState("none"); // none | going | maybe
  const [selectedPace, setSelectedPace] = useState("steady");
  const [joinAfters, setJoinAfters] = useState(false);
  const [showAllAttendees, setShowAllAttendees] = useState(false);

  const paceGroups = [
    { id: "easy", name: "Easy", pace: "6:00+ /km", runners: 8 },
    { id: "steady", name: "Steady", pace: "5:00–6:00 /km", runners: 14 },
    { id: "fast", name: "Fast", pace: "< 5:00 /km", runners: 6 },
  ];

  const attendees = [
    { name: "Sarah C.", pace: "Steady", afters: true, streak: 16 },
    { name: "James R.", pace: "Fast", afters: true, streak: 8 },
    { name: "Mel K.", pace: "Easy", afters: false, streak: 4 },
    { name: "Tom H.", pace: "Steady", afters: true, streak: 12 },
    { name: "Lily W.", pace: "Steady", afters: true, streak: 3 },
    { name: "Dan P.", pace: "Fast", afters: false, streak: 7 },
    { name: "Nina S.", pace: "Easy", afters: true, streak: 20 },
    { name: "Alex M.", pace: "Steady", afters: true, streak: 1 },
  ];

  const handleRsvp = (type) => {
    if (rsvpState === type) return;
    setRsvpState(type);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", justifyContent: "center", padding: "20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ width: "375px", borderRadius: "24px", overflow: "hidden", border: "3px solid #334155", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", background: t.bg }}>

        {/* Nav */}
        <nav style={{ background: t.surface, borderBottom: `1px solid ${t.borderMuted}`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "5px", background: t.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🔥</div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "14px" }}>runclub</span>
          </div>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: t.textMuted }}>Explore</span>
            <span style={{ fontSize: "12px", color: t.textMuted }}>My Clubs</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: t.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: t.primary }}>JK</div>
          </div>
        </nav>

        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>

          {/* Breadcrumb */}
          <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
            <span style={{ color: t.primary, fontWeight: 500, cursor: "pointer" }}>Bondi Beach Runners</span>
            <span style={{ color: t.textLight }}>›</span>
            <span style={{ color: t.textLight }}>Events</span>
            <span style={{ color: t.textLight }}>›</span>
            <span style={{ color: t.textMuted }}>Wednesday Evening 5K</span>
          </div>

          <div style={{ padding: "12px 16px 24px" }}>

            {/* Header */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", padding: "2px 8px", background: t.primaryLight, borderRadius: "5px", color: t.primary, fontWeight: 600 }}>🏃 Running</span>
                <span style={{ fontSize: "10px", padding: "2px 8px", background: t.surfaceAlt, borderRadius: "5px", color: t.textMuted }}>5 km</span>
                <span style={{ fontSize: "10px", padding: "2px 8px", background: t.surfaceAlt, borderRadius: "5px", color: t.textMuted }}>Weekly</span>
              </div>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0", color: t.text, letterSpacing: "-0.02em" }}>Wednesday Evening 5K</h1>
              <span style={{ fontSize: "13px", color: t.primary, fontWeight: 600, cursor: "pointer" }}>Bondi Beach Runners</span>
            </div>

            {/* Key Info Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {/* Date/Time */}
              <div style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: t.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>📅</div>
                  <span style={{ fontSize: "10px", color: t.textLight, fontWeight: 600, textTransform: "uppercase" }}>When</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>Wed 26 March</div>
                <div style={{ fontSize: "12px", color: t.textMuted }}>6:30 PM</div>
                <div style={{ fontSize: "11px", color: t.primary, marginTop: "6px", cursor: "pointer", fontWeight: 500 }}>Add to calendar →</div>
              </div>
              {/* Meeting Point */}
              <div style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: t.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>📍</div>
                  <span style={{ fontSize: "10px", color: t.textLight, fontWeight: 600, textTransform: "uppercase" }}>Meeting Point</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>The Arch</div>
                <div style={{ fontSize: "12px", color: t.textMuted }}>Bondi Beach</div>
                <div style={{ fontSize: "11px", color: t.primary, marginTop: "6px", cursor: "pointer", fontWeight: 500 }}>Open in Maps →</div>
              </div>
            </div>

            {/* Route link */}
            <div style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", padding: "12px 14px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>🗺️</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: t.text }}>View route on Strava</div>
                  <div style={{ fontSize: "10px", color: t.textLight }}>Bondi to Bronte and back</div>
                </div>
              </div>
              <span style={{ fontSize: "11px", color: t.primary, fontWeight: 500 }}>→</span>
            </div>

            {/* Afters Venue Card */}
            <div style={{ background: t.venueGradient, border: `1px solid ${t.venueBorder}`, borderRadius: "14px", padding: "16px", marginBottom: "14px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: "radial-gradient(circle at top right, rgba(245,158,11,0.15), transparent)", borderRadius: "0 0 0 80px" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "10px", color: t.venueDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>🍺 Afters</div>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 700, color: t.venueDark, marginBottom: "4px" }}>The Anchor</div>
                <div style={{ fontSize: "12px", color: "#92400E", marginBottom: "8px", lineHeight: 1.5 }}>Happy hour until 8pm · Great burgers · Outdoor seating</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: t.venueDark }}>🍺 18 staying for afters</span>
                  <span style={{ fontSize: "11px", color: t.venueText, cursor: "pointer", fontWeight: 500 }}>Open in Maps →</span>
                </div>
                <div style={{ fontSize: "9px", color: "#D97706" }}>You'll be asked after you RSVP</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "14px", fontWeight: 700, margin: "0 0 6px 0" }}>About this run</h3>
              <p style={{ fontSize: "12px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>Our regular Wednesday evening 5K loop from The Arch along the coastal path to Bronte and back. All paces welcome — we split into groups so nobody gets left behind. Stick around for drinks at The Anchor after — it's the best bit.</p>
            </div>

            {/* Pace Group Selector */}
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "14px", fontWeight: 700, margin: "0 0 4px 0" }}>Choose your pace group</h3>
              <p style={{ fontSize: "11px", color: t.textLight, margin: "0 0 8px 0" }}>Pick a group so the organizer knows where you'll be</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {paceGroups.map(g => {
                  const selected = selectedPace === g.id;
                  return (
                    <button key={g.id} onClick={() => setSelectedPace(g.id)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 14px", background: selected ? t.primaryLight : t.surface,
                      border: `1.5px solid ${selected ? t.primary : t.borderMuted}`,
                      borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${selected ? t.primary : t.textLight}`, display: "flex", alignItems: "center", justifyContent: "center", background: selected ? t.primary : "transparent" }}>
                          {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>{g.name}</div>
                          <div style={{ fontSize: "11px", color: t.textMuted }}>{g.pace}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", color: t.textLight }}>🏃 {g.runners}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RSVP Section */}
            <div style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "16px", padding: "18px", marginBottom: "14px", boxShadow: t.cardShadow }}>
              {rsvpState === "none" ? (
                <>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 700, margin: "0 0 10px 0" }}>Are you coming?</h3>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleRsvp("going")} style={{ flex: 2, padding: "13px", background: t.primary, color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", cursor: "pointer", boxShadow: "0 3px 14px rgba(244,63,94,0.3)", transition: "transform 0.1s" }}>I'm in! 🏃</button>
                    <button onClick={() => handleRsvp("maybe")} style={{ flex: 1, padding: "13px", background: t.surface, color: t.textMuted, border: `1.5px solid ${t.borderMuted}`, borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Maybe</button>
                  </div>
                  <div style={{ fontSize: "11px", color: t.textLight, textAlign: "center", marginTop: "8px" }}>28 going · 8 maybe</div>
                </>
              ) : (
                <div>
                  {/* Confirmation */}
                  <div style={{ background: t.successLight, border: `1px solid ${t.successBorder}`, borderRadius: "10px", padding: "12px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: t.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#166534" }}>{rsvpState === "going" ? "You're in! 🎉" : "Maybe — we'll save you a spot"}</div>
                      <div style={{ fontSize: "11px", color: "#15803D" }}>Pace: {paceGroups.find(g => g.id === selectedPace)?.name}</div>
                    </div>
                  </div>

                  {/* Afters toggle */}
                  <div style={{ background: joinAfters ? t.venueBg : t.surfaceAlt, border: `1px solid ${joinAfters ? t.venueBorder : t.borderMuted}`, borderRadius: "10px", padding: "12px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", cursor: "pointer" }} onClick={() => setJoinAfters(!joinAfters)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px" }}>🍺</span>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: joinAfters ? t.venueDark : t.text }}>Staying for afters?</div>
                        <div style={{ fontSize: "10px", color: joinAfters ? "#92400E" : t.textLight }}>The Anchor · 18 others are</div>
                      </div>
                    </div>
                    {/* Toggle switch */}
                    <div style={{ width: "40px", height: "22px", borderRadius: "11px", background: joinAfters ? t.success : "#D1D5DB", padding: "2px", cursor: "pointer", transition: "background 0.2s" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transform: joinAfters ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
                    </div>
                  </div>

                  {/* Undo + change */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span style={{ color: t.primary, cursor: "pointer", fontWeight: 500 }}>Change to {rsvpState === "going" ? "Maybe" : "Going"}</span>
                    <span style={{ color: t.textLight, cursor: "pointer" }}>Undo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Attendees */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "14px", fontWeight: 700, margin: 0 }}>Who's coming</h3>
                <span style={{ fontSize: "11px", color: t.textLight }}>28 going · 18 afters · 8 maybe</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {attendees.slice(0, showAllAttendees ? attendees.length : 5).map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "10px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: t.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: t.primary, flexShrink: 0 }}>{a.name.split(" ").map(n => n[0]).join("")}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: t.text }}>{a.name}</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "1px" }}>
                        <span style={{ fontSize: "10px", padding: "1px 5px", background: t.surfaceAlt, borderRadius: "4px", color: t.textMuted }}>{a.pace}</span>
                        {a.streak > 0 && <span style={{ fontSize: "10px", color: t.primary }}>🔥 {a.streak}</span>}
                      </div>
                    </div>
                    {a.afters && <span style={{ fontSize: "12px" }}>🍺</span>}
                  </div>
                ))}
              </div>
              {!showAllAttendees && (
                <button onClick={() => setShowAllAttendees(true)} style={{ width: "100%", padding: "8px", background: "none", border: "none", color: t.primary, fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: "6px" }}>View all 28 attendees →</button>
              )}
            </div>

            {/* Share / Invite */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button style={{ flex: 1, padding: "10px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "10px", fontSize: "12px", fontWeight: 600, color: t.textMuted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share
              </button>
              <button style={{ flex: 1, padding: "10px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "10px", fontSize: "12px", fontWeight: 600, color: t.textMuted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Invite a friend
              </button>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", fontSize: "10px", color: t.textLight, padding: "8px 0", borderTop: `1px solid ${t.borderMuted}` }}>
              © 2026 runclub · Privacy · Terms · <span style={{ cursor: "pointer" }}>Feedback</span>
            </div>
          </div>
        </div>

        {/* Sticky RSVP bar (mobile) — only shows when scrolled past RSVP section */}
        {rsvpState === "none" && (
          <div style={{ position: "sticky", bottom: 0, background: t.surface, borderTop: `1px solid ${t.borderMuted}`, padding: "10px 16px", display: "flex", gap: "8px", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
            <button onClick={() => handleRsvp("going")} style={{ flex: 2, padding: "12px", background: t.primary, color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", cursor: "pointer", boxShadow: "0 2px 10px rgba(244,63,94,0.25)" }}>I'm in! 🏃</button>
            <button onClick={() => handleRsvp("maybe")} style={{ flex: 1, padding: "12px", background: t.surface, color: t.textMuted, border: `1.5px solid ${t.borderMuted}`, borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Maybe</button>
          </div>
        )}
      </div>
    </div>
  );
}
