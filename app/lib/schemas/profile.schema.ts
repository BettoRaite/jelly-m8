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
  return VALID_IMAGE_TYPES.has(file.type);
};
// OMG BRO DECIDED TO CREATE TWO IDENTICAL SCHEMAS PLS DO NOT DO LIKE THIS.
export const createProfileSchema = z.object({
  displayName: z.string().trim().min(3),
  biography: z.string().trim().min(3),
  quote: z.string().trim().optional(),
  gender: z.enum(["male", "female"]),
  occupation: z.enum(["student", "teacher"]),
  imageFile: z
    .any()
    .transform((fileList) => fileList?.[0])
    .refine(
      (file) => {
        return file instanceof File && file.size > 0;
      },
      {
        message: "File is required",
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

export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(3),
    biography: z.string().trim().min(3),
    gender: z.enum(["male", "female"]),
    isActivated: z.boolean(),
    quote: z.string().trim().optional(),
    imageFile: z
      .any()
      .transform((fileList) => fileList[0])
      .refine(
        (file) => {
          return file instanceof File && file.size > 0;
        },
        {
          message: "File is required",
        }
      )
      .refine(checkFileType, {
        message: IMAGE_TYPE_ERR_MESSAGE,
      }),
  })
  .partial();

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
