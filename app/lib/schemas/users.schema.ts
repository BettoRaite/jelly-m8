import z from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(3),
  role: z.enum(["admin", "user"]),
  profilePicUrl: z.string().optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
