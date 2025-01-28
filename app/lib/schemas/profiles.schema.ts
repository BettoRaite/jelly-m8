import z from "zod";

const checkFileType = (file: File) => {
  console.log(file.type);
  return ["image/jpeg", "image/jpg"].includes(file.type); // MIME type for .xlsx
};

export const createProfileSchema = z.object({
  name: z.string().trim().min(3),
  bio: z.string().trim().min(3),
  profileImage: z
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

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;
