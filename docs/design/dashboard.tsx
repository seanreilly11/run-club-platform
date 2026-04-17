const attData = [
  { e: "Feb 5", rsvp: 38, actual: 32, social: 24 },
  { e: "Feb 12", rsvp: 30, actual: 21, social: 15 },
  { e: "Feb 19", rsvp: 42, actual: 35, social: 28 },
  { e: "Feb 26", rsvp: 40, actual: 34, social: 25 },
  { e: "Mar 5", rsvp: 45, actual: 38, social: 30 },
  { e: "Mar 12", rsvp: 48, actual: 41, social: 32 },
  { e: "Mar 19", rsvp: 44, actual: 36, social: 27 },
];
const showData = [
  { m: "Nov", r: 71 },
  { m: "Dec", r: 65 },
  { m: "Jan", r: 74 },
  { m: "Feb", r: 76 },
  { m: "Mar", r: 80 },
];
const healthData = [
  { name: "Active", value: 38, color: "#16A34A" },
  { name: "At Risk", value: 12, color: "#F59E0B" },
  { name: "Lapsed", value: 18, color: "#EF4444" },
  { name: "New", value: 6, color: "#8B5CF6" },
];

const DashboardPage = () => {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav loggedIn active="dashboard" />
      <div style={{ display: "flex", minHeight: "calc(100% - 45px)" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "180px",
            background: t.surface,
            borderRight: `1px solid ${t.borderMuted}`,
            padding: "16px 10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: t.textLight,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
              padding: "0 8px",
            }}
          >
            London City Runners
          </div>
          {[
            { id: "overview", icon: HomeIcon, l: "Overview" },
            { id: "events", icon: CalendarIcon, l: "Events" },
            { id: "members", icon: UsersIcon, l: "Members" },
            { id: "analytics", icon: ChartIcon, l: "Analytics" },
            { id: "settings", icon: SettingsIcon, l: "Settings" },
          ].map((i) => (
            <button
              key={i.id}
              onClick={() => setTab(i.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 10px",
                width: "100%",
                background: tab === i.id ? t.primaryLight : "transparent",
                border: "none",
                borderRadius: "8px",
                color: tab === i.id ? t.primary : t.textMuted,
                fontSize: "12px",
                fontWeight: tab === i.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: "2px",
              }}
            >
              <i.icon /> {i.l}
              {i.id === "analytics" && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "8px",
                    padding: "1px 5px",
                    background: t.primaryBg,
                    color: t.primary,
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  PRO
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {tab === "overview" && (
            <>
              {/* Post-event capture */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
                  border: "1px solid #FDE68A",
                  borderRadius: "12px",
                  padding: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#78350F",
                    marginBottom: "3px",
                  }}
                >
                  How did Wednesday's run go?
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#92400E",
                    marginBottom: "10px",
                  }}
                >
                  March 19 · Wednesday Evening 5K · 44 RSVPs
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#92400E",
                        marginBottom: "3px",
                      }}
                    >
                      Showed up
                    </div>
                    <input
                      type="number"
                      defaultValue="36"
                      style={{
                        width: "60px",
                        padding: "6px 8px",
                        borderRadius: "7px",
                        border: "1px solid #FDE68A",
                        background: "white",
                        fontSize: "15px",
                        fontWeight: 700,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        textAlign: "center",
                        color: "#78350F",
                      }}
                      readOnly
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#92400E",
                        marginBottom: "3px",
                      }}
                    >
                      For afters
                    </div>
                    <input
                      type="number"
                      defaultValue="27"
                      style={{
                        width: "60px",
                        padding: "6px 8px",
                        borderRadius: "7px",
                        border: "1px solid #FDE68A",
                        background: "white",
                        fontSize: "15px",
                        fontWeight: 700,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        textAlign: "center",
                        color: "#78350F",
                      }}
                      readOnly
                    />
                  </div>
                  <button
                    style={{
                      padding: "8px 16px",
                      background: "#B45309",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {[
                  { l: "Avg attendance", v: "31", c: t.success },
                  { l: "Show rate", v: "78%", c: t.secondary },
                  { l: "Afters rate", v: "74%", c: t.accent },
                  { l: "Active members", v: "38", c: t.text },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      background: t.surface,
                      border: `1px solid ${t.borderMuted}`,
                      borderRadius: "10px",
                      padding: "12px",
                      boxShadow: t.cardShadow,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: t.textLight,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "3px",
                      }}
                    >
                      {s.l}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: s.c,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
              {/* Next event */}
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.borderMuted}`,
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: t.cardShadow,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: t.textLight,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  Next event
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      Wednesday Evening 5K
                    </div>
                    <div style={{ fontSize: "12px", color: t.textMuted }}>
                      Wed 26 Mar · 6:30 PM · 42 RSVPs
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "6px 12px",
                      background: t.primaryLight,
                      color: t.primary,
                      border: `1px solid ${t.border}`,
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Manage →
                  </button>
                </div>
              </div>
            </>
          )}
          {tab === "analytics" && (
            <>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 14px 0",
                }}
              >
                Attendance Analytics
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                {[
                  { l: "Avg attendance", v: "31", s: "+12%", up: true },
                  { l: "Show rate", v: "78%", s: "+4%", up: true },
                  { l: "Afters rate", v: "74%", s: "-2%", up: false },
                  { l: "Active members", v: "38/74", s: "51%", up: null },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      background: t.surface,
                      border: `1px solid ${t.borderMuted}`,
                      borderRadius: "10px",
                      padding: "10px",
                      boxShadow: t.cardShadow,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: t.textLight,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        marginBottom: "2px",
                      }}
                    >
                      {s.l}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {s.v}
                    </div>
                    {s.up !== null && (
                      <div
                        style={{
                          fontSize: "10px",
                          color: s.up ? t.success : t.primary,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        {s.up ? <TrendUp size={10} /> : <TrendDown size={10} />}{" "}
                        {s.s}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Attendance chart */}
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.borderMuted}`,
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: t.cardShadow,
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Attendance Over Time
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={attData} barGap={2}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={t.borderMuted}
                    />
                    <XAxis
                      dataKey="e"
                      tick={{ fill: t.textLight, fontSize: 9 }}
                    />
                    <YAxis tick={{ fill: t.textLight, fontSize: 9 }} />
                    <Tooltip content={<CT />} />
                    <Bar
                      dataKey="rsvp"
                      name="RSVPs"
                      fill={t.borderMuted}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="actual"
                      name="Actual"
                      fill={t.success}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="social"
                      name="Afters"
                      fill={t.accent}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    fontSize: "10px",
                    color: t.textLight,
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  Grey = RSVPs · Green = showed up · Amber = stayed for afters
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                {/* Show rate */}
                <div
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "12px",
                    padding: "14px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Show Rate Trend
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={showData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={t.borderMuted}
                      />
                      <XAxis
                        dataKey="m"
                        tick={{ fill: t.textLight, fontSize: 9 }}
                      />
                      <YAxis
                        domain={[50, 100]}
                        tick={{ fill: t.textLight, fontSize: 9 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Area
                        type="monotone"
                        dataKey="r"
                        name="Show rate"
                        stroke={t.secondary}
                        fill={`${t.secondary}15`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Member health */}
                <div
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "12px",
                    padding: "14px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Member Health
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <ResponsiveContainer width="45%" height={100}>
                      <PieChart>
                        <Pie
                          data={healthData}
                          cx="50%"
                          cy="50%"
                          outerRadius={40}
                          innerRadius={25}
                          dataKey="value"
                          stroke="none"
                        >
                          {healthData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div>
                      {healthData.map((d) => (
                        <div
                          key={d.name}
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "2px",
                              background: d.color,
                            }}
                          />
                          <span
                            style={{ fontSize: "10px", color: t.textMuted }}
                          >
                            {d.name}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              marginLeft: "auto",
                            }}
                          >
                            {d.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Insights */}
              <div
                style={{
                  fontSize: "10px",
                  color: t.textLight,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Insights
              </div>
              {[
                { i: "📈", t: "Attendance up 22% this month", c: t.success },
                {
                  i: "🌧️",
                  t: "Rainy days reduce attendance ~28%",
                  c: t.accent,
                },
                {
                  i: "🍺",
                  t: "The Crown gets 18% more RSVPs than The Fox",
                  c: t.accent,
                },
                { i: "⚠️", t: "12 members at risk of lapsing", c: t.primary },
              ].map((ins, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    padding: "8px 10px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "8px",
                    marginBottom: "5px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{ins.i}</span>
                  <span style={{ fontSize: "11px", color: ins.c }}>
                    {ins.t}
                  </span>
                </div>
              ))}
            </>
          )}
          {tab === "events" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Events
                </h2>
                <button
                  style={{
                    padding: "7px 14px",
                    background: t.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={14} /> New event
                </button>
              </div>
              {[
                {
                  t: "Wednesday Evening 5K",
                  d: "Wed 26 Mar · 6:30 PM",
                  s: "upcoming",
                  r: 42,
                },
                {
                  t: "Sunday Long Run",
                  d: "Sun 30 Mar · 9:00 AM",
                  s: "upcoming",
                  r: 28,
                },
                {
                  t: "Wednesday Evening 5K",
                  d: "Wed 19 Mar · 6:30 PM",
                  s: "completed",
                  r: 44,
                  a: 36,
                },
                {
                  t: "Sunday Long Run",
                  d: "Sun 16 Mar · 9:00 AM",
                  s: "completed",
                  r: 32,
                  a: 26,
                },
              ].map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "10px",
                    marginBottom: "6px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {e.t}
                    </div>
                    <div style={{ fontSize: "11px", color: t.textMuted }}>
                      {e.d}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    {e.s === "completed" && (
                      <span style={{ fontSize: "10px", color: t.textMuted }}>
                        {e.a}/{e.r} attended
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "5px",
                        fontWeight: 600,
                        background:
                          e.s === "upcoming" ? "#F0FDF4" : t.surfaceAlt,
                        color: e.s === "upcoming" ? t.success : t.textLight,
                      }}
                    >
                      {e.s}
                    </span>
                    <MoreH size={14} color={t.textLight} />
                  </div>
                </div>
              ))}
            </>
          )}
          {tab === "members" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Members{" "}
                  <span
                    style={{
                      fontSize: "13px",
                      color: t.textLight,
                      fontWeight: 400,
                    }}
                  >
                    · 74
                  </span>
                </h2>
                <button
                  style={{
                    padding: "6px 12px",
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "7px",
                    background: t.surface,
                    fontSize: "11px",
                    color: t.textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "inherit",
                  }}
                >
                  <Download size={12} /> Export CSV
                </button>
              </div>
              {[
                {
                  n: "Sarah Chen",
                  r: "member",
                  s: "active",
                  att: 16,
                  sr: "100%",
                  p: "5:00/km",
                },
                {
                  n: "Tom Williams",
                  r: "admin",
                  s: "active",
                  att: 8,
                  sr: "88%",
                  p: "5:30/km",
                },
                {
                  n: "Priya Patel",
                  r: "member",
                  s: "new",
                  att: 3,
                  sr: "100%",
                  p: "6:30/km",
                },
                {
                  n: "Alex Morgan",
                  r: "member",
                  s: "at_risk",
                  att: 12,
                  sr: "72%",
                  p: "5:15/km",
                },
                {
                  n: "Mike Johnson",
                  r: "member",
                  s: "lapsed",
                  att: 5,
                  sr: "60%",
                  p: "6:00/km",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "9px",
                    marginBottom: "5px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: t.primaryBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: t.primary,
                    }}
                  >
                    {m.n[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>
                      {m.n}{" "}
                      {m.r === "admin" && (
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "1px 5px",
                            background: t.primaryLight,
                            color: t.primary,
                            borderRadius: "4px",
                            fontWeight: 600,
                          }}
                        >
                          Admin
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "10px", color: t.textLight }}>
                      {m.p} · {m.att} events · {m.sr} show rate
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 7px",
                      borderRadius: "5px",
                      fontWeight: 600,
                      background:
                        m.s === "active"
                          ? "#F0FDF4"
                          : m.s === "new"
                            ? "#EDE9FE"
                            : m.s === "at_risk"
                              ? "#FEF3C7"
                              : "#FEF2F2",
                      color:
                        m.s === "active"
                          ? t.success
                          : m.s === "new"
                            ? t.secondary
                            : m.s === "at_risk"
                              ? t.accent
                              : "#EF4444",
                    }}
                  >
                    {m.s === "at_risk" ? "At risk" : m.s}
                  </span>
                </div>
              ))}
            </>
          )}
          {tab === "settings" && (
            <>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 14px 0",
                }}
              >
                Settings
              </h2>
              {[
                "Club details",
                "Billing & subscription",
                "Custom branding",
                "Notifications",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "10px",
                    marginBottom: "6px",
                    boxShadow: t.cardShadow,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{s}</span>
                  <ChevronRight size={16} color={t.textLight} />
                </div>
              ))}
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#DC2626",
                    marginBottom: "3px",
                  }}
                >
                  Danger zone
                </div>
                <div style={{ fontSize: "12px", color: "#991B1B" }}>
                  Delete club permanently
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
