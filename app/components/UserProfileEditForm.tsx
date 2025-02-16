import { useProfileMutation } from "@/hooks/useProfileMutation";
import {
  updateProfileSchema,
  type UpdateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Profile } from "@/lib/types";
import { jsonToFormData } from "@/lib/utils/conversion";
import { joinClasses } from "@/lib/utils/strings";
import SelectInput from "@/ui/form/SelectInput";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";

type Props = {
  profile: Profile;
  onEditToggle: () => void;
};

function UserProfileEditForm({ profile, onEditToggle }: Props) {
  const methods = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: profile.displayName,
      biography: profile.biography,
    },
  });
  const mutation = useProfileMutation();
  const handleUpdateProfileClick = async (
    payload: Omit<UpdateProfilePayload, "isActivated">
  ) => {
    try {
      await mutation.mutateAsync({
        type: "update",
        userId: profile.userId,
        payload: payload.imageFile ? jsonToFormData(payload) : payload,
      });
      onEditToggle();
    } catch (err) {}
  };

  return (
    <FormProvider {...methods}>
      <div className="relative h-full ">
        <button
          onClick={onEditToggle}
          type="button"
          className="w-min self-end p-2 bg-slate-100 absolute right-2 top-2 rounded-xl"
        >
          <MdClose />
        </button>

        <form
          onSubmit={methods.handleSubmit(handleUpdateProfileClick)}
          className={joinClasses(
            "max-w-md mx-auto px-6 pt-10 bg-white rounded-lg h-full shadow-md flex flex-col gap-4"
          )}
        >
          <FormField<UpdateProfilePayload>
            translatedFieldName="Поменять фото"
            fieldName="imageFile"
          >
            <FormField.Label />
            <FormField.Upload
              type={"display-image"}
              defaultImage={profile?.profileImageUrl}
            />
            <FormField.Error />
          </FormField>

          <FormField<UpdateProfilePayload>
            translatedFieldName="имя"
            fieldName="displayName"
          >
            <FormField.Label />
            <FormField.TextInput />
            <FormField.Error />
          </FormField>

          <FormField<UpdateProfilePayload>
            translatedFieldName="био"
            fieldName="biography"
          >
            <FormField.Label />
            <FormField.TextArea />
            <FormField.Error />
          </FormField>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md
          hover:bg-blue-700 transition duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </FormProvider>
  );
}

export default UserProfileEditForm;
