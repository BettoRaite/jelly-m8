import z, { coerce } from "zod";

export const createComplimentSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

export const updateComplimentSchema = z
  .object({
    content: z.string().min(3),
  })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Either first or second should be filled in."
  );

export type CreateComplimentPayload = z.infer<typeof createComplimentSchema>;
export type UpdateComplimentPayload = z.infer<typeof updateComplimentSchema>;

export const paramsComplimentIdSchema = z.object({
  complimentId: coerce.number().positive(),
});

export type ParamsComplimentId = z.infer<typeof paramsComplimentIdSchema>;
