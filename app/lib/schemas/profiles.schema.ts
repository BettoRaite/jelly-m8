import z from "zod";

export const createProfileSchema = z.object({
  name: z.string().trim().min(3),
  bio: z.string().trim().min(3),
});

export type CreateProfilePayload = z.infer<typeof createProfileSchema>;
