import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import {
  type CreateComplimentPayload,
  createComplimentSchema,
} from "@/lib/schemas/compliment.schema";
import Button from "@/ui/Button";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { MdClose, MdEdit } from "react-icons/md";

type Props = {
  profileId: number;
};
function ComplimentForm({ profileId }: Props) {
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
  });
  const mutation = useComplimentMutation();
  function handleCreateCompliment(payload: CreateComplimentPayload) {
    mutation.mutate({
      type: "create",
      profileId,
      payload,
    });
  }
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleCreateCompliment)}
        className="relative border border-white font-comfortaa  bg-opacity-20
        p-8 w-11/12 max-w-[400px] flex flex-col gap-4 rounded-xl"
      >
        <div className="space-y-6">
          {/* Theme Select Field */}
          <FormField<CreateComplimentPayload> fieldName="title">
            <FormField.Select
              options={[
                {
                  value: "Если бы мы встречались то...",
                  label: "Если бы мы встречались то...",
                },
              ]}
            />
          </FormField>

          {/* Compliment Text Area */}
          <FormField<CreateComplimentPayload> fieldName="content">
            <FormField.TextArea placeholder="Напиши что-нибудь..." />
          </FormField>

          {/* Submit Button */}
        </div>
        <Button className="">Отправить</Button>
      </form>
    </FormProvider>
  );
}
export default ComplimentForm;
