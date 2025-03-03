import { useProfileMutation } from "@/hooks/useProfileMutation";
import useUserQuery from "@/hooks/useUserQuery";
import { QUERY_KEYS } from "@/lib/config";
import {
  createProfileSchema,
  updateProfileSchema,
  type CreateProfilePayload,
  type UpdateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Profile, User } from "@/lib/types";
import { jsonToFormData } from "@/lib/utils/conversion";
import { joinClasses } from "@/lib/utils/strings";
import SelectInput from "@/ui/form/SelectInput";
import { FormField } from "@/ui/formField/FormField";
import LoadingIndicator from "@/ui/LoadingIndicator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaTruckLoading } from "react-icons/fa";

interface CreateProfileFormFields extends CreateProfilePayload {
  userId: number;
}

type BaseProps = {
  onRefetch?: () => void;
  onClose?: () => void;
  users?: User[];
};

type CreateProps = BaseProps & {
  formType: "create";
  users: User[];
  profile?: Profile;
};

type EditProps = BaseProps & {
  formType: "edit";
  profile: Profile;
  onRefetch: () => void;
  onClose: () => void;
};

type Props = CreateProps | EditProps;

function ProfileForm({ formType, users, profile, onRefetch, onClose }: Props) {
  const isCreateForm = formType === "create";
  const methods = useForm<CreateProfileFormFields>({
    resolver: zodResolver(
      isCreateForm ? createProfileSchema : updateProfileSchema
    ),
    reValidateMode: "onChange",
    defaultValues: isCreateForm ? {} : profile,
  });
  const [newProfileUserId, setNewProfileUserId] = useState(1);
  const profileMutation = useProfileMutation();

  async function handleCreateProfileSubmit(payload: CreateProfileFormFields) {
    if (isCreateForm) {
      profileMutation.mutate({
        userId: newProfileUserId,
        payload: jsonToFormData(payload as CreateProfilePayload),
        type: "create",
      });
    } else {
      await profileMutation.mutateAsync({
        userId: profile.userId,
        payload: payload.imageFile
          ? jsonToFormData(payload as Omit<UpdateProfilePayload, "isActivated">)
          : payload,
        type: "update",
      });
      onRefetch();
      onClose();
    }
    methods.reset();
  }
  const options = isCreateForm
    ? users.map((u) => ({
        label: u.username,
        value: u.id,
      }))
    : [];
  return (
    <FormProvider {...methods}>
      <div>
        {isCreateForm && (
          <SelectInput
            className="bg-white mb-2"
            options={options}
            onChange={(id) => {
              setNewProfileUserId(id as number);
              methods.reset();
            }}
          />
        )}
        <form
          onSubmit={methods.handleSubmit(handleCreateProfileSubmit)}
          className={joinClasses(
            "max-w-[500px] w-full mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col gap-4",
            {
              "bg-transparent shadow-none": formType === "edit",
            }
          )}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center first-letter:capitalize">
            {formType} profile
          </h2>

          <FormField<CreateProfileFormFields> fieldName="imageFile">
            <FormField.Label />
            <FormField.Upload
              type={"display-image"}
              defaultImage={profile?.profileImageUrl}
            />
            <FormField.Error />
          </FormField>

          <FormField<CreateProfileFormFields> fieldName="displayName">
            <FormField.Label />
            <FormField.TextInput />
            <FormField.Error />
          </FormField>

          <FormField<CreateProfileFormFields> fieldName="quote">
            <FormField.Label />
            <FormField.TextArea />
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

          <FormField<CreateProfileFormFields> fieldName="occupation">
            <FormField.Label />
            <FormField.Select
              options={[
                {
                  value: "student",
                  label: "Student",
                },
                {
                  value: "teacher",
                  label: "Teacher",
                },
              ]}
            />
            <FormField.Error />
          </FormField>

          <button
            disabled={profileMutation.isPending}
            type="submit"
            className="flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {!profileMutation.isPending && "Submit"}
            {profileMutation.isPending && <LoadingIndicator />}
          </button>
        </form>
      </div>
    </FormProvider>
  );
}

export default ProfileForm;
