import { z } from "zod";

export const postEventCaptureSchema = z
  .object({
    eventId: z.string().uuid("Invalid event ID"),
    communitySlug: z.string().min(1),
    actualAttendance: z.number().int().nonnegative("Attendance cannot be negative"),
    actualSocialAttendance: z.number().int().nonnegative("Afters count cannot be negative"),
  })
  .refine((d) => d.actualSocialAttendance <= d.actualAttendance, {
    message: "Afters count cannot exceed actual attendance",
    path: ["actualSocialAttendance"],
  });
