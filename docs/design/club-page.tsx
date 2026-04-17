const ClubPage = () => {
  const [rsvp, setRsvp] = useState(null);
  const [showAfters, setShowAfters] = useState(false);
  const handleRsvp = () => {
    setRsvp("going");
    setShowAfters(true);
  };
  const handleAfters = (j) => {
    setRsvp(j ? "going+social" : "going");
    setShowAfters(false);
  };
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav />
      <div
        style={{
          background: t.heroBg,
          padding: "32px 20px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              gap: "5px",
              padding: "3px 10px",
              background: "rgba(255,255,255,0.18)",
              borderRadius: "16px",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <MapPin size={11} color="white" />
            <span style={{ fontSize: "11px", color: "white", fontWeight: 500 }}>
              Bermondsey, London
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              color: "white",
              margin: "0 0 6px 0",
              lineHeight: 1.1,
            }}
          >
            London City Runners
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 12px 0",
              lineHeight: 1.5,
            }}
          >
            Wednesday and Sunday runs through Bermondsey. All paces welcome.
            Always ends at a great venue.
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              color: "white",
              fontWeight: 600,
              flexWrap: "wrap",
            }}
          >
            <span>
              <Users size={12} /> 247 members
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>🏃 Social</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              <FlameIcon size={12} /> 24wk streak
            </span>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px 28px" }}>
        {/* Next event */}
        <div
          style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            boxShadow: "0 2px 12px rgba(244,63,94,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: t.heroBg,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: t.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Next run
              </span>
              <span style={{ fontSize: "10px", color: t.textLight }}>
                in 4 days
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: t.primary,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Details <ChevronRight size={12} style={{ display: "inline" }} />
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              margin: "0 0 6px 0",
            }}
          >
            Wednesday Evening 5K
          </h3>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              color: t.textMuted,
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            <span>Wed 26 Mar · 6:30 PM</span>
            <span
              style={{
                padding: "1px 6px",
                background: t.surfaceAlt,
                borderRadius: "5px",
                fontSize: "10px",
              }}
            >
              5K
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              fontSize: "12px",
              color: t.textMuted,
              marginBottom: "10px",
            }}
          >
            <MapPin size={12} color={t.textLight} /> The Arch Climbing Wall
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {["🐇 Fast", "🏃 Steady", "🐢 Easy"].map((pg) => (
              <span
                key={pg}
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  background: t.surfaceAlt,
                  color: t.textMuted,
                  borderRadius: "6px",
                }}
              >
                {pg}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 10px",
              background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
              border: "1px solid #FDE68A",
              borderRadius: "9px",
              marginBottom: "14px",
            }}
          >
            <span>🍺</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#78350F",
                flex: 1,
              }}
            >
              Afters at The Crown & Anchor
            </span>
            <span style={{ fontSize: "10px", color: "#92400E" }}>31 going</span>
          </div>
          {!rsvp && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={handleRsvp}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: t.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "11px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  boxShadow: "0 3px 14px rgba(244,63,94,0.3)",
                }}
              >
                I'm in! 🏃
              </button>
              <div style={{ textAlign: "center", minWidth: "44px" }}>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  42
                </div>
                <div style={{ fontSize: "9px", color: t.textLight }}>going</div>
              </div>
            </div>
          )}
          {showAfters && (
            <div style={{ animation: "slideDown 0.35s ease forwards" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 10px",
                  background: "#F0FDF4",
                  borderRadius: "9px",
                  border: "1px solid #BBF7D0",
                  marginBottom: "8px",
                }}
              >
                <Check size={14} color={t.success} strokeWidth={3} />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#166534",
                    fontWeight: 600,
                  }}
                >
                  You're in! 🎉
                </span>
              </div>
              <div
                style={{
                  background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
                  border: "1px solid #FDE68A",
                  borderRadius: "11px",
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#78350F",
                    marginBottom: "8px",
                  }}
                >
                  🍺 Staying for afters at The Crown & Anchor?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => handleAfters(true)}
                    style={{
                      flex: 1,
                      padding: "9px",
                      background: "#B45309",
                      color: "white",
                      border: "none",
                      borderRadius: "9px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    Count me in! 🍺
                  </button>
                  <button
                    onClick={() => handleAfters(false)}
                    style={{
                      padding: "9px 14px",
                      background: "rgba(255,255,255,0.7)",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                      borderRadius: "9px",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Just the run
                  </button>
                </div>
              </div>
            </div>
          )}
          {rsvp && !showAfters && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 12px",
                background: "#F0FDF4",
                borderRadius: "10px",
                border: "1px solid #BBF7D0",
              }}
            >
              <Check size={14} color={t.success} strokeWidth={3} />
              <span
                style={{
                  fontSize: "12px",
                  color: "#166534",
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {rsvp === "going+social"
                  ? "See you at The Crown & Anchor! 🎉"
                  : "See you at the start line! 🏃"}
              </span>
              <button
                onClick={() => {
                  setRsvp(null);
                  setShowAfters(false);
                }}
                style={{
                  fontSize: "10px",
                  color: t.textLight,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "inherit",
                }}
              >
                Undo
              </button>
            </div>
          )}
        </div>
        <button
          style={{
            width: "100%",
            padding: "11px",
            background: t.surface,
            color: t.primary,
            border: `1.5px solid ${t.border}`,
            borderRadius: t.radius,
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            marginBottom: "24px",
          }}
        >
          Join London City Runners
        </button>
        {/* Upcoming */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          Upcoming runs
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              t: "Sunday Long Run",
              d: "Sun 30 Mar · 9:00 AM",
              dist: "10K",
              v: "Brewed Awakening",
              vt: "cafe",
              r: 28,
              s: 22,
            },
            {
              t: "Track Tuesday",
              d: "Tue 1 Apr · 7:00 PM",
              dist: "6K",
              v: null,
              vt: null,
              r: 19,
              s: null,
            },
            {
              t: "Wednesday Evening 5K",
              d: "Wed 2 Apr · 6:30 PM",
              dist: "5K",
              v: "The Crown & Anchor",
              vt: "pub",
              r: 14,
              s: 9,
            },
          ].map((e, i) => (
            <div
              key={i}
              style={{
                background: t.surface,
                border: `1px solid ${t.borderMuted}`,
                borderRadius: t.radius,
                padding: "12px",
                boxShadow: t.cardShadow,
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
                    }}
                  >
                    {e.t}
                  </h3>
                  <span style={{ fontSize: "11px", color: t.textMuted }}>
                    {e.d}
                  </span>{" "}
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "1px 5px",
                      background: t.surfaceAlt,
                      borderRadius: "4px",
                      color: t.textMuted,
                    }}
                  >
                    {e.dist}
                  </span>
                </div>
                <div style={{ textAlign: "right", fontSize: "11px" }}>
                  <div style={{ fontWeight: 600 }}>{e.r} going</div>
                  {e.s && (
                    <div style={{ color: t.textLight }}>{e.s} for afters</div>
                  )}
                </div>
              </div>
              {e.v && (
                <div
                  style={{
                    marginTop: "6px",
                    display: "inline-flex",
                    gap: "4px",
                    alignItems: "center",
                    padding: "3px 8px",
                    background: t.venueBg,
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ fontSize: "11px" }}>{ve(e.vt)}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: t.venueText,
                      fontWeight: 600,
                    }}
                  >
                    Afters at {e.v}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* About + Stats */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 8px 0",
          }}
        >
          About
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: t.textMuted,
            lineHeight: 1.7,
            margin: "0 0 20px 0",
          }}
        >
          A social running club on Bermondsey's Beer Mile. Beginners to PB
          chasers. We always end at a local venue.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "6px",
            marginBottom: "24px",
          }}
        >
          {[
            { l: "Avg turnout", v: "36", i: "👟" },
            { l: "Stay for afters", v: "78%", i: "🍻" },
            { l: "Club streak", v: "24wk", i: "🔥" },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                background: t.surface,
                border: `1px solid ${t.borderMuted}`,
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
                boxShadow: t.cardShadow,
              }}
            >
              <div style={{ fontSize: "16px" }}>{s.i}</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: "9px", color: t.textLight }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Members */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          Active members
        </h2>
        {[
          { n: "Sarah Chen", s: 16, p: "5:00" },
          { n: "Tom Williams", s: 8, p: "5:30" },
          { n: "Priya Patel", s: 3, p: "6:30" },
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
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: t.primaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: t.primary,
              }}
            >
              {m.n[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 500 }}>{m.n}</div>
              <div style={{ fontSize: "10px", color: t.textLight }}>
                {m.p}/km
              </div>
            </div>
            <FlameIcon size={11} />
            <span
              style={{ fontSize: "10px", fontWeight: 600, color: t.primary }}
            >
              {m.s}wk
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
