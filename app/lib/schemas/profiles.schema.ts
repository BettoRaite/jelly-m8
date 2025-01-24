import z from "zod";

export const createProfileSchema = z.object({
  name: z.string().trim().min(3),
  bio: z.string().trim().min(3),
});

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;
