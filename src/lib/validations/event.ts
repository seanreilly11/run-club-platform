import { z } from "zod";

export const createEventSchema = z.object({
  communitySlug: z.string().min(1),
  title: z.string().min(1, "Title is required").max(100),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  description: z.string().max(2000).optional().or(z.literal("")),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
  meetingPointName: z.string().min(1, "Meeting point is required"),
  distanceKm: z
    .string()
    .regex(/^\d*\.?\d*$/, "Invalid distance")
    .optional()
    .or(z.literal("")),
  distanceUnit: z.enum(["km", "mi"]),
  routeUrl: z.url("Invalid URL").optional().or(z.literal("")),
  paceGroups: z
    .array(
      z.object({
        name: z.string().min(1, "Group name required"),
        pace: z.string(),
      }),
    )
    .optional(),
  postRunVenueName: z.string().max(100).optional().or(z.literal("")),
  postRunVenueUrl: z.url("Invalid URL").optional().or(z.literal("")),
  postRunVenueNotes: z.string().max(200).optional().or(z.literal("")),
});

export const updateEventSchema = z.object({
  eventId: z.string().uuid(),
  communitySlug: z.string(),
  title: z.string().min(1, "Title is required").max(100),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  meetingPointName: z.string().min(1, "Meeting point is required"),
  distanceKm: z
    .string()
    .regex(/^\d*\.?\d*$/, "Invalid distance")
    .optional()
    .or(z.literal("")),
  distanceUnit: z.enum(["km", "mi"]),
  routeUrl: z.url("Invalid URL").optional().or(z.literal("")),
  paceGroups: z
    .array(z.object({ name: z.string().min(1, "Group name required"), pace: z.string() }))
    .optional(),
  postRunVenueName: z.string().max(100).optional().or(z.literal("")),
  postRunVenueUrl: z.url("Invalid URL").optional().or(z.literal("")),
  postRunVenueNotes: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
});

export const cancelEventSchema = z.object({
  eventId: z.string().uuid(),
  communitySlug: z.string(),
});

export const duplicateEventSchema = z.object({
  eventId: z.string().uuid(),
  communitySlug: z.string(),
});

export const postEventCaptureSchema = z
  .object({
    eventId: z.string().uuid("Invalid event ID"),
    communitySlug: z.string().min(1),
    actualAttendance: z
      .number()
      .int()
      .nonnegative("Attendance cannot be negative"),
    actualSocialAttendance: z
      .number()
      .int()
      .nonnegative("Afters count cannot be negative"),
  })
  .refine((d) => d.actualSocialAttendance <= d.actualAttendance, {
    message: "Afters count cannot exceed actual attendance",
    path: ["actualSocialAttendance"],
  });
