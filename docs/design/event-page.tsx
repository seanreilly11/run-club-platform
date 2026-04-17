const EventPage = () => {
  const [rsvp, setRsvp] = useState(null);
  const [social, setSocial] = useState(false);
  const [pace, setPace] = useState(null);
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav />
      <div style={{ padding: "14px 20px 0" }}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            fontSize: "11px",
            color: t.textLight,
            marginBottom: "14px",
          }}
        >
          <span style={{ color: t.primary }}>London City Runners</span>
          <ChevronRight size={11} />
          <span>Events</span>
          <ChevronRight size={11} />
          <span style={{ color: t.textMuted }}>Wed 5K</span>
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 7px",
              background: t.primaryLight,
              color: t.primary,
              borderRadius: "5px",
              fontWeight: 600,
            }}
          >
            🏃 Running
          </span>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 7px",
              background: t.surfaceAlt,
              color: t.textMuted,
              borderRadius: "5px",
            }}
          >
            5K
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 3px 0",
          }}
        >
          Wednesday Evening 5K
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: t.primary,
            fontWeight: 600,
            margin: "0 0 16px 0",
          }}
        >
          London City Runners
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "11px",
              padding: "12px",
              boxShadow: t.cardShadow,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <Calendar size={13} color={t.primary} />
              <span style={{ fontSize: "10px", color: t.textLight }}>
                Date & time
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              Wed 26 March 2026
            </div>
            <div style={{ fontSize: "12px", color: t.textMuted }}>6:30 PM</div>
          </div>
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "11px",
              padding: "12px",
              boxShadow: t.cardShadow,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <MapPin size={13} color={t.primary} />
              <span style={{ fontSize: "10px", color: t.textLight }}>
                Meeting point
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              The Arch Climbing Wall
            </div>
            <div
              style={{ fontSize: "11px", color: t.primary, fontWeight: 500 }}
            >
              Open in Maps →
            </div>
          </div>
        </div>
        {/* Venue card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
            border: "1px solid #FDE68A",
            borderRadius: "11px",
            padding: "14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: t.venueText,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "3px",
                }}
              >
                🍺 Afters
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "#78350F",
                }}
              >
                The Crown & Anchor
              </div>
              <div
                style={{ fontSize: "12px", color: "#92400E", marginTop: "2px" }}
              >
                Happy hour until 8pm
              </div>
            </div>
            <span
              style={{ fontSize: "11px", color: t.venueText, fontWeight: 600 }}
            >
              View →
            </span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#92400E" }}>
            <strong>31</strong> staying for afters
          </div>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: t.textMuted,
            lineHeight: 1.7,
            margin: "0 0 16px 0",
          }}
        >
          Meet outside The Arch, warm-up, then our 5K loop through Southwark
          Park. Three pace groups — nobody left behind.
        </p>
        {/* Pace groups */}
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            margin: "0 0 8px 0",
          }}
        >
          Choose your pace group
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginBottom: "16px",
          }}
        >
          {[
            { n: "🐇 Fast", p: "< 5:00/km", r: 8 },
            { n: "🏃 Steady", p: "5:00–6:00/km", r: 22 },
            { n: "🐢 Easy", p: "6:00+/km", r: 12 },
          ].map((g) => (
            <button
              key={g.n}
              onClick={() => setPace(g.n)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: "9px",
                cursor: "pointer",
                fontFamily: "inherit",
                background: pace === g.n ? t.primaryLight : t.surface,
                border: `1.5px solid ${pace === g.n ? t.primary : t.borderMuted}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {pace === g.n && (
                  <Check size={14} color={t.primary} strokeWidth={3} />
                )}
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{g.n}</div>
                  <div style={{ fontSize: "11px", color: t.textMuted }}>
                    {g.p}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", color: t.textLight }}>
                {g.r} runners
              </span>
            </button>
          ))}
        </div>
        {/* RSVP */}
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            padding: "16px",
            boxShadow: t.cardShadow,
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              margin: "0 0 10px 0",
            }}
          >
            Are you coming?
          </h3>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {[
              { id: "going", l: "I'm in! 🏃" },
              { id: "maybe", l: "Maybe" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setRsvp(o.id)}
                style={{
                  flex: o.id === "going" ? 2 : 1,
                  padding: "11px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: 600,
                  background:
                    rsvp === o.id
                      ? o.id === "going"
                        ? t.primary
                        : t.accent
                      : t.surface,
                  color: rsvp === o.id ? "white" : t.textMuted,
                  border: `1.5px solid ${rsvp === o.id ? "transparent" : t.borderMuted}`,
                  boxShadow:
                    rsvp === o.id && o.id === "going"
                      ? "0 2px 12px rgba(244,63,94,0.3)"
                      : "none",
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
          {(rsvp === "going" || rsvp === "maybe") && (
            <div
              onClick={() => setSocial(!social)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "9px",
                cursor: "pointer",
                background: social ? t.venueBg : t.surfaceAlt,
                border: `1.5px solid ${social ? "#FDE68A" : t.borderMuted}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>🍺</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: social ? "#78350F" : t.textMuted,
                  }}
                >
                  Staying for afters?
                </span>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "10px",
                  padding: "2px",
                  background: social ? t.success : "#D4D4D8",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "white",
                    transform: social ? "translateX(16px)" : "translateX(0)",
                    transition: "transform 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>
          )}
          {rsvp === "going" && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "6px",
                alignItems: "center",
                padding: "8px 10px",
                background: "#F0FDF4",
                borderRadius: "9px",
                border: "1px solid #BBF7D0",
              }}
            >
              <Check size={14} color={t.success} strokeWidth={3} />
              <span
                style={{ fontSize: "12px", color: "#166534", fontWeight: 500 }}
              >
                {social
                  ? "See you at The Crown & Anchor! 🎉"
                  : "See you at the start line 🏃"}
              </span>
            </div>
          )}
        </div>
        {/* Attendees */}
        <div
          style={{ fontSize: "11px", color: t.textLight, marginBottom: "8px" }}
        >
          42 going · 31 for afters · 6 maybe
        </div>
        {[
          { n: "Sarah C.", p: "Fast", s: true },
          { n: "Tom W.", p: "Steady", s: true },
          { n: "Priya P.", p: "Easy", s: true },
          { n: "James K.", p: "Steady", s: false },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "9px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: t.primaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 600,
                color: t.primary,
              }}
            >
              {m.n[0]}
            </div>
            <span style={{ flex: 1, fontSize: "12px", fontWeight: 500 }}>
              {m.n}
            </span>
            <span
              style={{
                fontSize: "9px",
                padding: "2px 6px",
                background: t.surfaceAlt,
                borderRadius: "4px",
                color: t.textMuted,
              }}
            >
              {m.p}
            </span>
            {m.s && <span style={{ fontSize: "11px" }}>🍺</span>}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "9px",
              border: `1.5px solid ${t.borderMuted}`,
              borderRadius: "9px",
              background: t.surface,
              fontSize: "12px",
              fontWeight: 600,
              color: t.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Share2 size={12} /> Share
          </button>
          <button
            style={{
              flex: 1,
              padding: "9px",
              border: `1.5px solid ${t.borderMuted}`,
              borderRadius: "9px",
              background: t.surface,
              fontSize: "12px",
              fontWeight: 600,
              color: t.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <UserPlus size={12} /> Invite
          </button>
        </div>
      </div>
    </div>
  );
};
