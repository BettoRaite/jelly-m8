import { useForm } from "react-hook-form";
import {
  type CreateUserPayload,
  createUserSchema,
} from "@/lib/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { config, queryClient, queryKeys } from "@/lib/config";
import {
  createProfileSchema,
  type CreateProfilePayload,
} from "@/lib/schemas/profile.schema";
import { runProfilesFetch } from "@/api/profiles.api";
import { Pass } from "postprocessing";
import useUserQuery from "@/hooks/useUserQuery";
import { useUserProfileMutation } from "@/hooks/useUserProfileMutation";
import { useState } from "react";
import { jsonToFormData } from "@/lib/utils/conversion";
import { FormField } from "@/ui/formField/FormField";
import { FormProvider } from "react-hook-form";
import type { label } from "motion/react-client";

interface CreateProfileFormFields extends CreateProfilePayload {
  userId: number;
}
export function CreateProfile() {
  const { data: users, status } = useUserQuery({
    type: "users",
    queryKey: queryKeys.usersKey,
  });
  const [userId, setUserId] = useState(1);
  if (status === "pending") {
    return "...loading";
  }
  if (status === "error") {
    return "failed to load users";
  }
  const methods = useForm<CreateProfileFormFields>({
    resolver: zodResolver(createProfileSchema),
    reValidateMode: "onChange",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const mutation = useUserProfileMutation();
  function handleCreateProfileSubmit(payload: CreateProfileFormFields) {
    mutation.mutate({
      userId,
      payload: jsonToFormData(payload as CreateProfilePayload),
      type: "create",
    });
    // reset();
  }
  const options = users.map((u) => {
    return {
      value: u.id,
      label: u.username,
    };
  });
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleCreateProfileSubmit)}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create profile
        </h2>

        <select
          value={userId}
          onChange={(e) => setUserId(Number.parseInt(e.currentTarget.value))}
          id={"userId"}
          className="mb-4 text-sm mt-1 block w-full p-2 border rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="first-letter:capitalize"
            >
              {option.label}
            </option>
          ))}
        </select>

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
          Create profile
        </button>
      </form>
    </FormProvider>
  );
}
