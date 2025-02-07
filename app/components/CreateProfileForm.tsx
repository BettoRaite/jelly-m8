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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CreateProfileFormFields extends CreateProfilePayload {
  userId: number;
}
type Props = {
  userId: number;
};
function CreateProfileForm({ userId }: Props) {
  const queryClient = useQueryClient();
  const methods = useForm<CreateProfileFormFields>({
    resolver: zodResolver(createProfileSchema),
  });
  const { handleSubmit } = methods;
  const profileMutation = useProfileMutation({
    options: {
      onSuccess: (_, { type }) => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.createProfileKey(userId),
        });
      },
    },
  });

  function handleCreateProfileSubmit(payload: CreateProfileFormFields) {
    profileMutation.mutate({
      userId,
      payload: jsonToFormData(payload as CreateProfilePayload),
      type: "create",
    });
    // reset();
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleCreateProfileSubmit)}
        className="max-w-md mx-auto p-6 bg-white rounded-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-3xl font-semibold mb-4 text-center first-letter:capitalize">
          Создай свой профиль
        </h2>

        <FormField<CreateProfileFormFields>
          fieldName="imageFile"
          translatedFieldName="Фото"
        >
          <FormField.Upload type="display-image" />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfileFormFields>
          fieldName="displayName"
          translatedFieldName="Имя"
        >
          <FormField.Label />
          <FormField.TextInput />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfileFormFields>
          fieldName="biography"
          translatedFieldName="Био"
        >
          <FormField.Label />
          <FormField.TextArea placeholder="Напиши что нибудь о себе)" />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfileFormFields>
          fieldName="gender"
          translatedFieldName="Пол"
          className="hidden"
        >
          <FormField.Label />
          <FormField.Select
            options={[
              {
                value: "male",
                label: "Мужской",
              },
              {
                value: "female",
                label: "Женский",
              },
            ]}
          />
          <FormField.Error />
        </FormField>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Создать
        </button>
      </form>
    </FormProvider>
  );
}

export default CreateProfileForm;
