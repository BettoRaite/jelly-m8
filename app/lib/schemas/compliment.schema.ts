import z from "zod";

export const createComplimentSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

export type CreateComplimentPayload = z.infer<typeof createComplimentSchema>;
