import { GoBack } from "@/components/GoBack";
import useProfileQuery from "@/hooks/useProfileQuery";
import {
  createComplimentSchema,
  type CreateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import SelectInput from "@/ui/form/SelectInput";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as motion from "motion/react-client";

export default function UserDashboard() {
  const { data: profiles, status } = useProfileQuery({
    type: "profiles",
  });
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
  });
  if (status === "pending") {
    return "...loading";
  }
  if (status === "error") {
    return "error";
  }

  function handleCreateCompliment() {}
  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <GoBack to="/" className="hover:text-gray-700" />
      <FormProvider {...methods}>
        <motion.form
          animate={{
            scale: [0.5, 1],
          }}
          className="border border-gray-100 p-10 shadow-lg rounded-xl flex flex-col gap-4"
          onSubmit={methods.handleSubmit(handleCreateCompliment)}
        >
          <SelectInput
            options={profiles.map((p) => {
              return {
                value: p.id,
                label: p.displayName,
              };
            })}
            ctaText="Кто получит комплимент?"
          />
          <FormField<CreateComplimentPayload> fieldName="title">
            <FormField.Label label="Вопрос" />
            <FormField.Select
              ctaText="Выбери вопрос"
              options={[
                {
                  value: "Если бы мы встречались",
                  label: "Если бы мы встречались",
                },
              ]}
            />
          </FormField>
          <FormField<CreateComplimentPayload> fieldName="content">
            <FormField.Label label="Ответ" />
            <FormField.TextArea placeholder="Напиши что нибудь" />
          </FormField>
        </motion.form>
      </FormProvider>
    </main>
  );
}
