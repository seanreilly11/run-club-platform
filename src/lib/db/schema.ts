import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const communityTypeEnum = pgEnum("community_type", ["run_club"]);
export const vibeEnum = pgEnum("vibe", ["competitive", "social", "casual"]);
export const postRunDefaultEnum = pgEnum("post_run_default", [
  "pub",
  "coffee",
  "brunch",
  "none",
]);
export const tierEnum = pgEnum("tier", ["free", "pro"]);
export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "admin",
  "member",
  "waitlisted",
]);
export const distanceUnitEnum = pgEnum("distance_unit", ["km", "mi"]);
export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "completed",
  "cancelled",
]);
export const rsvpStatusEnum = pgEnum("rsvp_status", ["going", "maybe"]);
export const memberStatusEnum = pgEnum("member_status", [
  "new",
  "active",
  "at_risk",
  "lapsed",
]);

// ─── users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  pacePreference: text("pace_preference"),
  currentOverallStreak: integer("current_overall_streak").notNull().default(0),
  longestOverallStreak: integer("longest_overall_streak").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── communities ──────────────────────────────────────────────────────────────

export const communities = pgTable(
  "communities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    type: communityTypeEnum("type").notNull().default("run_club"),
    city: text("city").notNull(),
    timezone: text("timezone").notNull(), // e.g. "Europe/London"
    locationLat: numeric("location_lat", { precision: 10, scale: 7 }),
    locationLng: numeric("location_lng", { precision: 10, scale: 7 }),
    coverImageUrl: text("cover_image_url"),
    instagramHandle: text("instagram_handle"), // stored without @
    vibe: vibeEnum("vibe").notNull(),
    postRunDefault: postRunDefaultEnum("post_run_default")
      .notNull()
      .default("none"),
    themeColor: text("theme_color"), // Pro only — hex string e.g. "#1E40AF"
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    memberCount: integer("member_count").notNull().default(0),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: tierEnum("tier").notNull().default("free"),
    lastWaitlistEmailSentAt: timestamp("last_waitlist_email_sent_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_communities_city").on(table.city),
    index("idx_communities_type").on(table.type),
    index("idx_communities_vibe").on(table.vibe),
  ],
);

// ─── memberships ──────────────────────────────────────────────────────────────

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("member"),
    attendanceCount: integer("attendance_count").notNull().default(0),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_memberships_user_community").on(
      table.userId,
      table.communityId,
    ),
    index("idx_memberships_user").on(table.userId),
    index("idx_memberships_community").on(table.communityId),
    index("idx_memberships_community_role").on(table.communityId, table.role),
  ],
);

// ─── events ───────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    meetingPointName: text("meeting_point_name").notNull(),
    meetingPointLat: numeric("meeting_point_lat", { precision: 10, scale: 7 }),
    meetingPointLng: numeric("meeting_point_lng", { precision: 10, scale: 7 }),
    distanceKm: numeric("distance_km", { precision: 6, scale: 2 }),
    distanceUnit: distanceUnitEnum("distance_unit").notNull().default("km"),
    routeUrl: text("route_url"),
    // jsonb array of { name: string, pace: string } objects
    paceGroups:
      jsonb("pace_groups").$type<Array<{ name: string; pace: string }>>(),
    postRunVenueName: text("post_run_venue_name"),
    postRunVenueUrl: text("post_run_venue_url"),
    postRunVenueNotes: text("post_run_venue_notes"),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurrenceRule: text("recurrence_rule"), // e.g. "WEEKLY:WED"
    status: eventStatusEnum("status").notNull().default("upcoming"),
    actualAttendance: integer("actual_attendance"),
    actualSocialAttendance: integer("actual_social_attendance"),
    postEventNote: text("post_event_note"),
    weatherConditions: text("weather_conditions"),
    reminderSent: boolean("reminder_sent").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_events_community_status").on(table.communityId, table.status),
    index("idx_events_date").on(table.date),
  ],
);

// ─── event_rsvps ──────────────────────────────────────────────────────────────

export const eventRsvps = pgTable(
  "event_rsvps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: rsvpStatusEnum("status").notNull().default("going"),
    joiningSocial: boolean("joining_social").notNull().default(false),
    paceGroup: text("pace_group"), // matches a name from events.pace_groups
    attended: boolean("attended").notNull().default(false),
    checkedIn: boolean("checked_in").notNull().default(false),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_event_rsvps_event_user").on(table.eventId, table.userId),
    index("idx_event_rsvps_event_user").on(table.eventId, table.userId),
  ],
);

// ─── community_stats (cache table — recomputed after each event completes) ────

export const communityStats = pgTable("community_stats", {
  communityId: uuid("community_id")
    .primaryKey()
    .references(() => communities.id, { onDelete: "cascade" }),
  totalEvents: integer("total_events").notNull().default(0),
  totalRsvps: integer("total_rsvps").notNull().default(0),
  totalActualAttendance: integer("total_actual_attendance")
    .notNull()
    .default(0),
  // sum of distance_km × actual_attendance for all completed events
  totalDistanceKm: numeric("total_distance_km", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0"),
  totalAftersCount: integer("total_afters_count").notNull().default(0),
  // count of distinct members who've attended ≥1 event
  uniqueRunners: integer("unique_runners").notNull().default(0),
  avgRsvpPerEvent: numeric("avg_rsvp_per_event", { precision: 6, scale: 2 }),
  avgActualPerEvent: numeric("avg_actual_per_event", {
    precision: 6,
    scale: 2,
  }),
  avgShowRate: numeric("avg_show_rate", { precision: 5, scale: 4 }), // 0.0–1.0
  avgSocialRate: numeric("avg_social_rate", { precision: 5, scale: 4 }),
  memberCount: integer("member_count").notNull().default(0),
  activeMemberCount: integer("active_member_count").notNull().default(0),
  retentionRate30d: numeric("retention_rate_30d", { precision: 5, scale: 4 }),
  streakRecord: integer("streak_record").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── member_attendance_stats (per-member per-community) ───────────────────────

export const memberAttendanceStats = pgTable(
  "member_attendance_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    eventsAttended: integer("events_attended").notNull().default(0),
    eventsRsvpd: integer("events_rsvpd").notNull().default(0),
    // sum of distance_km for events this member attended
    totalDistanceKm: numeric("total_distance_km", {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default("0"),
    // number of events where member stayed for afters
    aftersCount: integer("afters_count").notNull().default(0),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastAttendedAt: timestamp("last_attended_at", { withTimezone: true }),
    showRate: numeric("show_rate", { precision: 5, scale: 4 }), // 0.0–1.0
    joinsSocialRate: numeric("joins_social_rate", { precision: 5, scale: 4 }),
    preferredPaceGroup: text("preferred_pace_group"),
    status: memberStatusEnum("status").notNull().default("new"),
  },
  (table) => [
    uniqueIndex("uq_member_stats_user_community").on(
      table.userId,
      table.communityId,
    ),
  ],
);

// ─── Inferred types (use these throughout the codebase) ───────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Community = typeof communities.$inferSelect;
export type NewCommunity = typeof communities.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
export type CommunityStats = typeof communityStats.$inferSelect;
export type MemberAttendanceStats = typeof memberAttendanceStats.$inferSelect;
