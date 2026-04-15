import { z } from "zod";
import { RESERVED_SLUGS } from "@/lib/constants";

export const slugSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(60, "At most 60 characters")
  .regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]{2}$/,
    "Lowercase letters, numbers, and hyphens only",
  )
  .refine((s) => !s.includes("--"), "No consecutive hyphens")
  .refine(
    (s) => !(RESERVED_SLUGS as readonly string[]).includes(s),
    "This URL is reserved",
  );

export const createCommunitySchema = z.object({
  name: z.string().min(1, "Club name is required").max(100),
  slug: slugSchema,
  city: z.string().min(1, "City is required"),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  vibe: z.enum(["competitive", "social", "casual"]),
  postRunDefault: z.enum(["pub", "coffee", "brunch", "none"]).default("none"),
  instagramHandle: z
    .string()
    .regex(
      /^[a-zA-Z0-9._]*$/,
      "Letters, numbers, periods and underscores only",
    )
    .max(30, "Maximum 30 characters")
    .optional()
    .or(z.literal("")),
  timezone: z.string().default("UTC"),
});

export type CreateCommunityData = z.infer<typeof createCommunitySchema>;
