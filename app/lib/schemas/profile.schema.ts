import z from "zod";
import { hasAtLeastOneField } from "../utils/object";

const checkFileType = (file: File) => {
  console.log(file.type);
  return ["image/jpeg", "image/jpg", "image/png"].includes(file.type); // MIME type for .xlsx
};

export const createProfileSchema = z.object({
  displayName: z.string().trim().min(3),
  biography: z.string().trim().min(3),
  gender: z.enum(["male", "female"]),
  imageFile: z
    .any()
    .transform((fileList) => fileList[0])
    .refine(
      (file) => {
        console.log(file);
        return file instanceof File && file.size > 0;
      },
      {
        message: "File is required",
      }
    )
    .refine(checkFileType, {
      message: "Only .jpg, .jpeg file is supported",
    }),
});

export type CreateProfilePayload = z.infer<typeof createProfileSchema>;

export const profileActivationSchema = z.object({
  activationSecret: z.string().trim().min(3),
});

export type ProfileActivationPayload = z.infer<typeof profileActivationSchema>;

export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(3),
    biography: z.string().trim().min(3),
    gender: z.enum(["male", "female"]),
    isActivated: z.boolean(),
    activationSecret: z.string().trim().min(3),
  })
  .strict()
  .partial()
  .refine(
    (data) => hasAtLeastOneField(data),
    "Must container at least one field"
  );

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
