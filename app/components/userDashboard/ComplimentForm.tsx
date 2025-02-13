import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import { HiDotsVertical } from "react-icons/hi";
import {
  type CreateComplimentPayload,
  createComplimentSchema,
} from "@/lib/schemas/compliment.schema";
import type { Profile } from "@/lib/types";
import Button from "@/ui/Button";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { MdClose, MdSend } from "react-icons/md";

type Props = {
  profile: Profile;
  onClose: () => void;
};

function ComplimentForm({ profile, onClose }: Props) {
  const { data: compliments } = useComplimentQuery({
    type: "compliments",
  });
  const [hasMessaged, setHasMessaged] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
    defaultValues: {
      title: "Если бы мы встречались то...",
    },
  });

  const mutation = useComplimentMutation();

  async function handleCreateCompliment(payload: CreateComplimentPayload) {
    try {
      await mutation.mutateAsync({
        type: "create",
        profileId: profile.id,
        payload,
      });
    } catch (err) {
      setHasMessaged(false);
    }
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasMessaged(true);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <FormProvider {...methods}>
      <motion.form
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 260, damping: 20 },
        }}
        exit={{ y: 100, opacity: 0, scale: [1, 0.8] }}
        onSubmit={methods.handleSubmit(handleCreateCompliment)}
        className="fixed bottom-10 bg-white border border-gray-200 rounded-xl shadow-xl w-96 max-w-full flex flex-col"
      >
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2 relative">
            <img
              src={profile.profileImageUrl}
              alt={profile.profileImageUrl}
              className="h-10 w-10 rounded-full"
            />
            <h3 className="font-bold text-slate-700">{profile.displayName}</h3>
            {!hasMessaged && (
              <div className="absolute -bottom-2 left-12 text-sm text-slate-600 text-opacity-70">
                пишет
                <span className="animate-ping">.</span>
                <span className="animate-ping">.</span>
                <span className="animate-ping">.</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="p-4 flex-1 space-y-4 max-h-[400px] overflow-y-auto">
          {/* System Message */}
          {compliments?.map((c, index) => {
            if (c.profileId !== profile.id) return null;
            return (
              <motion.div key={c.id}>
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl max-w-[80%]">
                    <p className="text-slate-600">{c.title}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <div className="bg-blue-300 px-4 py-2 rounded-2xl max-w-[80%]">
                    <p className="text-slate-700">{c.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {hasMessaged && (
            <motion.div
              animate={{
                scale: [0, 1],
              }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 px-4 py-2 rounded-2xl max-w-[80%] relative">
                <p className="text-slate-600">Если бы мы встречались то...</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2 items-end">
            <FormField<CreateComplimentPayload> fieldName="content">
              <FormField.TextArea
                placeholder="Напиши что-нибудь..."
                rows={3}
                className="resize-none rounded-2xl bg-gray-50 px-4 py-2"
              />
            </FormField>
            <Button
              type="submit"
              variant="solid"
              className="mb-1 px-3 py-3 rounded-xl"
              disabled={mutation.isPending}
            >
              <MdSend size={18} />
            </Button>
          </div>
        </div>
      </motion.form>
    </FormProvider>
  );
}

export default ComplimentForm;
