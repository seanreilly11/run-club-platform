"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createEventSchema } from "@/lib/validations/event";
import { createEvent } from "@/lib/actions/event";

type FormData = z.infer<typeof createEventSchema>;

const t = {
  bg: "#FFFBF7",
  surface: "#FFFFFF",
  surfaceAlt: "#FFF5F0",
  border: "#FECDD3",
  borderMuted: "#F5F0EB",
  text: "#1C1917",
  textMuted: "#78716C",
  textLight: "#A8A29E",
  primary: "#F43F5E",
  primaryLight: "#FFF1F2",
  primaryBg: "#FFE4E6",
  success: "#16A34A",
  venueBg: "#FEF3C7",
  venueText: "#B45309",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
};

interface Props {
  communitySlug: string;
  communityName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: `1.5px solid ${t.borderMuted}`,
  fontSize: "14px",
  background: t.bg,
  outline: "none",
  boxSizing: "border-box" as const,
  color: t.text,
  fontFamily: "'DM Sans', sans-serif",
};

const labelStyle = {
  fontSize: "13px",
  color: t.text,
  fontWeight: 600 as const,
  display: "block" as const,
  marginBottom: "5px",
};

const fieldWrap = { marginBottom: "16px" };
const hintStyle = { fontSize: "11px", color: t.textLight, marginTop: "4px" };
const errorStyle = { fontSize: "11px", color: t.primary, marginTop: "4px" };

function SectionHeader({
  title,
  number,
}: {
  title: string;
  number: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "14px",
        paddingBottom: "10px",
        borderBottom: `1px solid ${t.borderMuted}`,
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: t.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 700,
          color: t.primary,
        }}
      >
        {number}
      </div>
      <span
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: t.text,
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        {title}
      </span>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  sublabel,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  sublabel?: string;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        background: checked ? t.surfaceAlt : t.surface,
        border: `1.5px solid ${checked ? t.border : t.borderMuted}`,
        marginBottom: "12px",
      }}
    >
      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "1px" }}>
            {sublabel}
          </div>
        )}
      </div>
      <div
        style={{
          width: "40px",
          height: "22px",
          borderRadius: "11px",
          padding: "2px",
          background: checked ? t.success : "#D4D4D8",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "white",
            transform: checked ? "translateX(18px)" : "translateX(0)",
            transition: "transform 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      </div>
    </div>
  );
}

export function CreateEventModal({
  communitySlug,
  communityName,
  onClose,
  onSuccess,
}: Props) {
  const [showAfters, setShowAfters] = useState(true);
  const [venueType, setVenueType] = useState("pub");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      communitySlug,
      distanceUnit: "km",
      isRecurring: false,
      paceGroups: [
        { name: "Fast", pace: "< 5:00/km" },
        { name: "Steady", pace: "5:00 – 6:00/km" },
        { name: "Easy", pace: "6:00+/km" },
      ],
    },
  });

  const { fields: paceFields, append, remove } = useFieldArray({
    control,
    name: "paceGroups",
  });

  const isRecurring = watch("isRecurring");
  const watchedTitle = watch("title");
  const watchedDate = watch("date");
  const watchedTime = watch("time");
  const watchedMeeting = watch("meetingPointName");
  const watchedPaceGroups = watch("paceGroups");
  const watchedVenueName = watch("postRunVenueName");

  const previewDate =
    watchedDate && watchedTime
      ? new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date(`${watchedDate}T${watchedTime}`))
      : "Wed 26 Mar · 6:30 PM";


  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setServerError(null);
    const result = await createEvent(data);
    setSubmitting(false);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    onSuccess();
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.bg,
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "'DM Sans', sans-serif",
          color: t.text,
          textAlign: "left",
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            flexShrink: 0,
            background: t.surface,
            borderBottom: `1px solid ${t.borderMuted}`,
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "20px",
                fontWeight: 800,
                margin: "0 0 2px 0",
                letterSpacing: "-0.01em",
              }}
            >
              New Event
            </h1>
            <p style={{ fontSize: "12px", color: t.textMuted, margin: 0 }}>
              {communityName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "4px 10px",
              background: "transparent",
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "8px",
              fontSize: "12px",
              color: t.textMuted,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ flex: 1, overflowY: "auto", padding: "24px" }}
        >
          {/* ===== SECTION 1: EVENT DETAILS ===== */}
          <SectionHeader title="Event details" number={1} />

          <div style={fieldWrap}>
            <label style={labelStyle}>
              Event title <span style={{ color: t.primary }}>*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Wednesday Evening 5K"
              style={inputStyle}
            />
            {errors.title && (
              <div style={errorStyle}>{errors.title.message}</div>
            )}
            <div style={hintStyle}>
              Keep it simple — members see this in their feed
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Date <span style={{ color: t.primary }}>*</span>
              </label>
              <input
                {...register("date")}
                type="date"
                style={inputStyle}
              />
              {errors.date && (
                <div style={errorStyle}>{errors.date.message}</div>
              )}
            </div>
            <div>
              <label style={labelStyle}>
                Time <span style={{ color: t.primary }}>*</span>
              </label>
              <input
                {...register("time")}
                type="time"
                style={inputStyle}
              />
              {errors.time && (
                <div style={errorStyle}>{errors.time.message}</div>
              )}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea
              {...register("description")}
              placeholder="What should members expect? Route details, what to bring, any notes..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <div style={hintStyle}>
              Optional but recommended — helps new members feel welcome
            </div>
          </div>

          <Toggle
            checked={isRecurring}
            onChange={() => setValue("isRecurring", !isRecurring)}
            label="Recurring event"
            sublabel="Automatically create this event every week"
          />

          {isRecurring && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                background: t.surfaceAlt,
                borderRadius: "10px",
                border: `1px solid ${t.borderMuted}`,
              }}
            >
              <div style={fieldWrap}>
                <label style={labelStyle}>
                  Repeat on <span style={{ color: t.primary }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    {...register("recurrenceRule")}
                    defaultValue="WEEKLY:WED"
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  >
                    {[
                      ["WEEKLY:MON", "Every Monday"],
                      ["WEEKLY:TUE", "Every Tuesday"],
                      ["WEEKLY:WED", "Every Wednesday"],
                      ["WEEKLY:THU", "Every Thursday"],
                      ["WEEKLY:FRI", "Every Friday"],
                      ["WEEKLY:SAT", "Every Saturday"],
                      ["WEEKLY:SUN", "Every Sunday"],
                    ].map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: t.textLight,
                      pointerEvents: "none",
                      fontSize: "12px",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===== SECTION 2: ROUTE ===== */}
          <div style={{ marginTop: "8px" }}>
            <SectionHeader title="Route & meeting point" number={2} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>
              Meeting point <span style={{ color: t.primary }}>*</span>
            </label>
            <input
              {...register("meetingPointName")}
              placeholder="e.g. Outside The Arch Climbing Wall, Bermondsey"
              style={inputStyle}
            />
            {errors.meetingPointName && (
              <div style={errorStyle}>{errors.meetingPointName.message}</div>
            )}
            <div style={hintStyle}>Be specific — new members need to find you</div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Distance</label>
              <input
                {...register("distanceKm")}
                placeholder="e.g. 5"
                style={inputStyle}
              />
              <div style={hintStyle}>In km</div>
            </div>
            <div>
              <label style={labelStyle}>Distance unit</label>
              <div style={{ position: "relative" }}>
                <select
                  {...register("distanceUnit")}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  <option value="km">Kilometres</option>
                  <option value="mi">Miles</option>
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: t.textLight,
                    pointerEvents: "none",
                    fontSize: "12px",
                  }}
                >
                  ▼
                </span>
              </div>
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Route link</label>
            <input
              {...register("routeUrl")}
              placeholder="https://strava.com/routes/..."
              style={inputStyle}
            />
            {errors.routeUrl && (
              <div style={errorStyle}>{errors.routeUrl.message}</div>
            )}
            <div style={hintStyle}>
              Optional — paste a Strava route, Google Maps link, or Komoot route
            </div>
          </div>

          {/* Map placeholder */}
          <div
            style={{
              height: "120px",
              background: t.surfaceAlt,
              borderRadius: "10px",
              border: `1.5px dashed ${t.borderMuted}`,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "12px", color: t.textMuted, fontWeight: 500 }}>
              Click to set meeting point on map
            </span>
            <span style={{ fontSize: "10px", color: t.textLight }}>
              Or enter an address above
            </span>
          </div>

          {/* ===== SECTION 3: PACE GROUPS ===== */}
          <SectionHeader title="Pace groups" number={3} />

          <div style={{ marginBottom: "16px" }}>
            {paceFields.map((field, i) => (
              <div
                key={field.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginBottom: "8px",
                  padding: "10px 12px",
                  background: t.surface,
                  border: `1px solid ${t.borderMuted}`,
                  borderRadius: "10px",
                  boxShadow: t.cardShadow,
                }}
              >
                <div style={{ flex: 1 }}>
                  <input
                    {...register(`paceGroups.${i}.name`)}
                    placeholder="Group name (e.g. Fast)"
                    style={{
                      width: "100%",
                      padding: "6px 0",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "transparent",
                      outline: "none",
                      color: t.text,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>
                <input
                  {...register(`paceGroups.${i}.pace`)}
                  placeholder="Pace range"
                  style={{
                    width: "120px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: `1px solid ${t.borderMuted}`,
                    fontSize: "12px",
                    background: t.bg,
                    outline: "none",
                    color: t.textMuted,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: `1px solid ${t.borderMuted}`,
                    background: t.surface,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    color: t.textLight,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ name: "", pace: "" })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1.5px dashed ${t.borderMuted}`,
                borderRadius: "10px",
                background: "transparent",
                cursor: "pointer",
                fontSize: "13px",
                color: t.primary,
                fontWeight: 600,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              + Add pace group
            </button>
            <div style={{ fontSize: "11px", color: t.textLight, marginTop: "6px" }}>
              Pace groups help runners find the right speed. Members choose a group
              when they RSVP.
            </div>
          </div>

          {/* ===== SECTION 4: AFTERS ===== */}
          <SectionHeader title="Afters" number={4} />

          <Toggle
            checked={showAfters}
            onChange={() => setShowAfters(!showAfters)}
            label="Include an afters venue"
            sublabel="Where is the group heading after the run?"
          />

          {showAfters && (
            <div
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
                border: "1px solid #FDE68A",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              {/* Venue type */}
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#78350F",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Venue type
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[
                    { id: "pub", label: "Pub" },
                    { id: "cafe", label: "Café" },
                    { id: "brunch", label: "Brunch" },
                    { id: "other", label: "Other" },
                  ].map((vt) => (
                    <button
                      key={vt.id}
                      type="button"
                      onClick={() => setVenueType(vt.id)}
                      style={{
                        flex: 1,
                        padding: "8px 4px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "12px",
                        fontWeight: 600,
                        background:
                          venueType === vt.id
                            ? "#B45309"
                            : "rgba(255,255,255,0.7)",
                        color: venueType === vt.id ? "white" : "#92400E",
                        border:
                          venueType === vt.id
                            ? "1px solid #B45309"
                            : "1px solid #FDE68A",
                      }}
                    >
                      {vt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue name */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#78350F",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Venue name <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  {...register("postRunVenueName")}
                  placeholder="e.g. The Crown & Anchor"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #FDE68A",
                    fontSize: "14px",
                    background: "rgba(255,255,255,0.8)",
                    outline: "none",
                    boxSizing: "border-box" as const,
                    color: "#78350F",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                />
              </div>

              {/* Venue link */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#78350F",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Venue link
                </label>
                <input
                  {...register("postRunVenueUrl")}
                  placeholder="Google Maps link or website"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #FDE68A",
                    fontSize: "13px",
                    background: "rgba(255,255,255,0.8)",
                    outline: "none",
                    boxSizing: "border-box" as const,
                    color: "#78350F",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                {errors.postRunVenueUrl && (
                  <div style={{ ...errorStyle, color: "#92400E" }}>
                    {errors.postRunVenueUrl.message}
                  </div>
                )}
                <div
                  style={{
                    fontSize: "10px",
                    color: "#92400E",
                    marginTop: "3px",
                  }}
                >
                  Paste a Google Maps link so members can find it easily
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#78350F",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Notes for attendees
                </label>
                <input
                  {...register("postRunVenueNotes")}
                  placeholder="e.g. Happy hour until 8pm, reserved area at the back"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #FDE68A",
                    fontSize: "13px",
                    background: "rgba(255,255,255,0.8)",
                    outline: "none",
                    boxSizing: "border-box" as const,
                    color: "#78350F",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>
          )}

          {/* ===== PREVIEW ===== */}
          <div style={{ marginTop: "8px", marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "10px",
                color: t.textLight,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              Preview — how members will see it
            </div>
            <div
              style={{
                background: t.surface,
                border: `1.5px solid ${t.border}`,
                borderRadius: "14px",
                padding: "14px",
                boxShadow: "0 2px 12px rgba(244,63,94,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Sunrise accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    "linear-gradient(to right, #F59E0B, #FB923C, #F97066, #F43F5E, #E879A0)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: t.primary,
                    textTransform: "uppercase",
                  }}
                >
                  Next run
                </span>
                <span style={{ fontSize: "10px", color: t.textLight }}>
                  in 4 days
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  margin: "0 0 4px 0",
                }}
              >
                {watchedTitle || "Wednesday Evening 5K"}
              </h3>
              <div
                style={{
                  fontSize: "12px",
                  color: t.textMuted,
                  marginBottom: "6px",
                }}
              >
                {previewDate} · 📍 {watchedMeeting || "The Arch Climbing Wall"}
              </div>
              {(watchedPaceGroups ?? []).filter((p) => p.name).length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {(watchedPaceGroups ?? [])
                    .filter((p) => p.name)
                    .map((pg, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "10px",
                          padding: "2px 7px",
                          background: t.surfaceAlt,
                          color: t.textMuted,
                          borderRadius: "5px",
                        }}
                      >
                        {pg.name}
                      </span>
                    ))}
                </div>
              )}
              {showAfters && watchedVenueName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 9px",
                    background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
                    border: "1px solid #FDE68A",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#78350F",
                    }}
                  >
                    Afters at {watchedVenueName}
                  </span>
                </div>
              )}
              <div
                style={{
                  padding: "10px",
                  background: t.primaryBg,
                  borderRadius: "9px",
                  textAlign: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: t.primary,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                I&apos;m in!
              </div>
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              style={{
                padding: "10px 14px",
                background: "#FFF1F2",
                border: "1px solid #FECDD3",
                borderRadius: "10px",
                fontSize: "13px",
                color: t.primary,
                marginBottom: "16px",
              }}
            >
              {serverError}
            </div>
          )}

          {/* ===== SUBMIT ===== */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "13px",
                background: t.surface,
                color: t.textMuted,
                border: `1.5px solid ${t.borderMuted}`,
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Save as draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                padding: "13px",
                background: submitting ? "#F5F0EB" : t.primary,
                color: submitting ? t.textMuted : "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: submitting ? "default" : "pointer",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: submitting ? "none" : "0 2px 12px rgba(244,63,94,0.3)",
              }}
            >
              {submitting ? "Publishing..." : "Publish event 🚀"}
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: t.textLight,
              marginTop: "8px",
            }}
          >
            Members will be notified 24 hours before the event
          </div>
        </form>
      </div>
    </div>
  );
}
