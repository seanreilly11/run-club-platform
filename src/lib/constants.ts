// Slugs that cannot be used by run clubs — reserved for platform routes
export const RESERVED_SLUGS = [
  "explore",
  "login",
  "signup",
  "dashboard",
  "my-clubs",
  "api",
  "admin",
  "settings",
  "profile",
  "about",
  "pricing",
  "blog",
  "help",
  "support",
  "terms",
  "privacy",
  "create",
] as const;

export const VIBE_OPTIONS = [
  { value: "competitive", label: "Competitive", emoji: "🏆" },
  { value: "social", label: "Social", emoji: "🤝" },
  { value: "casual", label: "Casual", emoji: "😎" },
] as const;

export const POST_RUN_OPTIONS = [
  { value: "pub", label: "Pub", emoji: "🍺" },
  { value: "coffee", label: "Café", emoji: "☕" },
  { value: "brunch", label: "Brunch", emoji: "🥐" },
  { value: "none", label: "We don't do afters", emoji: "🚫" },
] as const;

export const VENUE_EMOJI: Record<string, string> = {
  pub: "🍺",
  coffee: "☕",
  brunch: "🥐",
  none: "📍",
};

export const DISTANCE_UNITS = ["km", "mi"] as const;

export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const MEMBER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  WAITLISTED: "waitlisted",
} as const;

// Active members = anyone who can RSVP and be counted
export const ACTIVE_ROLES = ["owner", "admin", "member"] as const;

export const FREE_TIER_MEMBER_LIMIT = 30;
export const FREE_TIER_EVENTS_PER_MONTH = 4;
export const FREE_TIER_RECURRING_ALLOWED = false;
export const FREE_TIER_ADMINS_ALLOWED = 1;

export const PRO_PRICE_PER_MONTH = 19;

// Number of upcoming recurring events to maintain ahead
export const RECURRING_EVENTS_WINDOW = 4;

// Hours after event start that status auto-transitions to 'completed'
export const EVENT_COMPLETION_HOURS = 3;

// Streak milestone thresholds (weeks) for Pro dashboard insight cards
export const STREAK_MILESTONES = [4, 10, 20, 52] as const;
