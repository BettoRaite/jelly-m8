import z from "zod";
import { hasAtLeastOneField } from "../utils/object";

const VALID_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const IMAGE_TYPE_ERR_MESSAGE = `Только ${Array.from(VALID_IMAGE_TYPES).join(
  " "
)} форматы файлов поддерживаются`;

const checkFileType = (file: File) => {
  return VALID_IMAGE_TYPES.has(file?.type);
};
// OMG BRO DECIDED TO CREATE TWO IDENTICAL SCHEMAS PLS DO NOT DO LIKE THIS.
export const createProfileSchema = z.object({
  displayName: z.string().trim().min(3, {
    message: "Имя должно содержать не менее 3 символов",
  }),
  biography: z
    .string()
    .trim()
    .min(3, {
      message: "Биография должна содержать не менее 3 символов",
    })
    .optional(),
  quote: z
    .any()
    .transform((v) => (v === null ? "" : v))
    .refine(
      (v) => {
        if (!v) return true;
        return typeof v === "string" && v.length > 3;
      },
      {
        message: "Цитата должна быть не менее 3 символов",
      }
    ),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Выберите пол: male или female" }),
  }),
  occupation: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Выберите occupation: student или teacher" }),
  }),
  imageFile: z
    .any()
    .transform((fileList) => fileList?.[0])
    .refine(
      (file) => {
        return file instanceof File && file.size > 0;
      },
      {
        message: "Файл обязателен",
      }
    )
    .refine(checkFileType, {
      message: IMAGE_TYPE_ERR_MESSAGE,
    }),
});

export type CreateProfilePayload = z.infer<typeof createProfileSchema>;

export const profileActivationSchema = z.object({
  activationSecret: z.string(),
});

export type ProfileActivationPayload = z.infer<typeof profileActivationSchema>;

export const updateProfileSchema = createProfileSchema.optional();

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
