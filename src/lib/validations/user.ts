import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  pacePreference: z.string().nullable().optional(),
});
