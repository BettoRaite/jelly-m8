import { useProfileMutation } from "@/hooks/useProfileMutation";
import { QUERY_KEYS } from "@/lib/config";
import {
  createProfileSchema,
  type CreateProfilePayload,
} from "@/lib/schemas/profile.schema";
import { jsonToFormData } from "@/lib/utils/conversion";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
type Props = {
  userId: number;
  onProfileRefetch: () => void;
};
function CreateProfileForm({ userId, onProfileRefetch }: Props) {
  const methods = useForm<CreateProfilePayload>({
    resolver: zodResolver(createProfileSchema),
  });
  const profileMutation = useProfileMutation({
    options: {
      onSuccess: () => {
        onProfileRefetch();
      },
    },
  });
  function handleCreateProfileSubmit(payload: CreateProfilePayload) {
    profileMutation.mutate({
      userId,
      payload: jsonToFormData(payload as CreateProfilePayload),
      type: "create",
    });
  }
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleCreateProfileSubmit)}
        className="max-w-md mx-auto p-6 bg-white rounded-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-3xl font-semibold mb-4 text-center first-letter:capitalize">
          Создай свой профиль
        </h2>

        <FormField<CreateProfilePayload>
          fieldName="imageFile"
          translatedFieldName="Фото"
        >
          <FormField.Upload type="display-image" />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfilePayload>
          fieldName="displayName"
          translatedFieldName="Имя"
        >
          <FormField.Label />
          <FormField.TextInput />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfilePayload>
          fieldName="biography"
          translatedFieldName="Био"
        >
          <FormField.Label />
          <FormField.TextArea placeholder="Напиши что нибудь о себе)" />
          <FormField.Error />
        </FormField>

        <FormField<CreateProfilePayload>
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
