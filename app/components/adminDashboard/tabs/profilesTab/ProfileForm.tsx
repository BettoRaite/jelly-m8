import { useProfileMutation } from "@/hooks/useProfileMutation";
import useUserQuery from "@/hooks/useUserQuery";
import { QUERY_KEYS } from "@/lib/config";
import {
  createProfileSchema,
  updateProfileSchema,
  type CreateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Profile, User } from "@/lib/types";
import { jsonToFormData } from "@/lib/utils/conversion";
import SelectInput from "@/ui/form/SelectInput";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CreateProfileFormFields extends CreateProfilePayload {
  userId: number;
}
type Props =
  | {
      formType: "create";
      users: User[];
      profile?: Profile;
    }
  | {
      formType: "edit";
      users?: User[];
      profile: Profile;
    };
function ProfileForm({ formType, users, profile }: Props) {
  const isCreateForm = formType === "create";

  const methods = useForm<CreateProfileFormFields>({
    resolver: zodResolver(
      isCreateForm ? createProfileSchema : updateProfileSchema
    ),
    reValidateMode: "onChange",
    defaultValues: isCreateForm ? {} : profile,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const [userId, setUserId] = useState(1);
  const profileMutation = useProfileMutation(
    isCreateForm
      ? {}
      : {
          queryKey: QUERY_KEYS.createProfileKey(profile.userId),
        }
  );
  function handleCreateProfileSubmit(payload: CreateProfileFormFields) {
    if (formType === "edit") {
      profileMutation.mutate({
        userId,
        payload: jsonToFormData(payload as CreateProfilePayload),
        type: "update",
      });
      return;
    }
    profileMutation.mutate({
      userId,
      payload: jsonToFormData(payload as CreateProfilePayload),
      type: "create",
    });
    // reset();
  }
  const options = isCreateForm
    ? users.map((u) => ({
        label: u.username,
        value: u.id,
      }))
    : [];
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleCreateProfileSubmit)}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center first-letter:capitalize">
          {formType} profile
        </h2>

        {isCreateForm && (
          <SelectInput
            options={options}
            onChange={(id) => {
              setUserId(id as number);
            }}
          />
        )}

        <FormField<CreateProfileFormFields> fieldName="imageFile">
          <FormField.Label />
          <FormField.Upload />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfileFormFields> fieldName="displayName">
          <FormField.Label />
          <FormField.TextInput />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfileFormFields> fieldName="biography">
          <FormField.Label />
          <FormField.TextArea />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfileFormFields> fieldName="gender">
          <FormField.Label />
          <FormField.Select
            options={[
              {
                value: "female",
                label: "Female",
              },
              {
                value: "male",
                label: "Male",
              },
            ]}
          />
          <FormField.Error />
        </FormField>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isCreateForm ? "Create profile" : "Save"}
        </button>
      </form>
    </FormProvider>
  );
}

export default ProfileForm;
