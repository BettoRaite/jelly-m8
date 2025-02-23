import z, { coerce } from "zod";

export const createQuestionSchema = z.object({
  content: z.string().min(3),
});

export type CreateQuestionPayload = z.infer<typeof createQuestionSchema>;
