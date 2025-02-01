import z from "zod";

export const createUserSchema = z.object({
  username: z.string().trim().min(3),
  userRole: z.enum(["admin", "user"]),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
