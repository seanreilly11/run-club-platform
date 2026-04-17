const MyClubsPage = () => (
  <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
    <Nav loggedIn active="my-clubs" />
    <div style={{ padding: "20px 20px 28px" }}>
      <h1
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          margin: "0 0 4px 0",
        }}
      >
        My Clubs
      </h1>
      <p style={{ fontSize: "13px", color: t.textMuted, margin: "0 0 20px 0" }}>
        Your upcoming runs across all clubs
      </p>
      {/* Upcoming across clubs */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          margin: "0 0 10px 0",
        }}
      >
        Coming up
      </h2>
      {[
        {
          club: "London City Runners",
          event: "Wednesday Evening 5K",
          date: "Wed 26 Mar · 6:30 PM",
          dist: "5K",
          v: "The Crown & Anchor",
          vt: "pub",
          rsvp: true,
        },
        {
          club: "London City Runners",
          event: "Sunday Long Run",
          date: "Sun 30 Mar · 9:00 AM",
          dist: "10K",
          v: "Brewed Awakening",
          vt: "cafe",
          rsvp: false,
        },
        {
          club: "Hackney Half Pacers",
          event: "Tuesday Track Session",
          date: "Tue 1 Apr · 7:00 PM",
          dist: "8K",
          v: null,
          vt: null,
          rsvp: false,
        },
      ].map((e, i) => (
        <div
          key={i}
          style={{
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            padding: "12px",
            marginBottom: "8px",
            boxShadow: t.cardShadow,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: t.primary,
              fontWeight: 600,
              marginBottom: "3px",
            }}
          >
            {e.club}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  margin: "0 0 2px 0",
                }}
              >
                {e.event}
              </h3>
              <span style={{ fontSize: "11px", color: t.textMuted }}>
                {e.date}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "1px 5px",
                  background: t.surfaceAlt,
                  borderRadius: "4px",
                  color: t.textMuted,
                  marginLeft: "5px",
                }}
              >
                {e.dist}
              </span>
            </div>
            {e.rsvp ? (
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  background: "#F0FDF4",
                  color: "#166534",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                Going ✓
              </span>
            ) : (
              <button
                style={{
                  fontSize: "10px",
                  padding: "4px 10px",
                  background: t.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                RSVP
              </button>
            )}
          </div>
          {e.v && (
            <div
              style={{
                marginTop: "5px",
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
                padding: "3px 7px",
                background: t.venueBg,
                borderRadius: "5px",
              }}
            >
              <span style={{ fontSize: "10px" }}>{ve(e.vt)}</span>
              <span
                style={{ fontSize: "9px", color: t.venueText, fontWeight: 600 }}
              >
                Afters at {e.v}
              </span>
            </div>
          )}
        </div>
      ))}
      {/* Clubs list */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          margin: "20px 0 10px 0",
        }}
      >
        Your clubs
      </h2>
      {[
        { n: "London City Runners", m: 247, s: 16, city: "Bermondsey" },
        { n: "Hackney Half Pacers", m: 156, s: 4, city: "Hackney" },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            marginBottom: "8px",
            boxShadow: t.cardShadow,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: t.heroBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlameIcon size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {c.n}
            </div>
            <div style={{ fontSize: "11px", color: t.textMuted }}>
              {c.city} · {c.m} members
            </div>
          </div>
          <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
            <FlameIcon size={11} />
            <span
              style={{ fontSize: "11px", fontWeight: 600, color: t.primary }}
            >
              {c.s}wk
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
