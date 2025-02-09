import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import {
  updateComplimentSchema,
  type UpdateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import type { Compliment } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiSave } from "react-icons/bi";
import { MdDelete, MdEdit } from "react-icons/md";
type Props = {
  initialCompliment: Compliment;
  className?: string;
  isOwner: boolean;
  onRefetchCompliments: () => void;
};
function ComplimentCard({
  initialCompliment,
  className,
  isOwner,
  onRefetchCompliments,
}: Props) {
  const { data: compliment, status } = useComplimentQuery(
    {
      type: "compliment",
      profileId: initialCompliment.profileId,
      complimentId: initialCompliment.id,
    },
    {
      initialData: initialCompliment,
    }
  );
  const [isEditing, setIsEditing] = useState(false);
  const methods = useForm({
    resolver: zodResolver(updateComplimentSchema),
    defaultValues: {
      content: compliment?.content,
    },
  });
  const complimentMutation = useComplimentMutation();
  if (status === "pending") {
    return "...";
  }
  if (status === "error") {
    return "...";
  }
  function handleDelete() {
    if (!compliment) return;
    complimentMutation.mutate(
      {
        type: "delete",
        profileId: initialCompliment.profileId,
        complimentId: initialCompliment.id,
      },
      {
        onSuccess: () => {
          onRefetchCompliments();
        },
      }
    );
  }

  async function handleUpdate(payload: UpdateComplimentPayload) {
    if (!compliment) return;
    try {
      await complimentMutation.mutateAsync({
        type: "update",
        profileId: initialCompliment.profileId,
        complimentId: initialCompliment.id,
        payload,
      });
      setIsEditing(!isEditing);
    } catch (err) {
      toast.error("Ошибка...", { position: "bottom-center" });
    }
  }
  return (
    <FormProvider {...methods}>
      <motion.article
        animate={{
          scale: [0, 1],
          opacity: [0, 1],
        }}
        exit={{
          scale: [1, 0],
          opacity: [1, 0],
        }}
        className={joinClasses(
          "group relative flex flex-col gap-4 rounded-xl p-4",
          "bg-white/80 backdrop-blur-sm transition-all hover:bg-white/90",
          "shadow-lg shadow-gray-200/40 hover:shadow-gray-200/60",
          "border border-gray-100/70 hover:border-gray-100/90",
          className
        )}
      >
        <div className="absolute top-3 right-3 flex gap-4">
          <button
            type="button"
            className={joinClasses(
              "border border-gray-400 rounded-full hover:text-blue-400 text-gray-500",
              " p-2 opacity-30 hover:opacity-100 transition duration-300"
            )}
            onClick={() => setIsEditing(!isEditing)}
          >
            <MdEdit />
          </button>
          <button
            type="button"
            className={joinClasses(
              "border border-gray-400 rounded-full hover:text-red-400 text-gray-500",
              " p-2 opacity-30 hover:opacity-100 transition duration-300"
            )}
            onClick={handleDelete}
          >
            <MdDelete />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={compliment.author.profileImageUrl || "/default-avatar.png"}
            alt={compliment.author.displayName}
            className="h-14 w-14 md:h-20 md:w-20 rounded-full object-cover border-2 border-white/80 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {compliment.author.displayName}
            </h3>
            <p className="text-sm text-gray-500">
              @{compliment.author.displayName}
            </p>
          </div>
        </div>

        <form
          onSubmit={methods.handleSubmit(handleUpdate)}
          className="space-y-2 relative"
        >
          <h2 className="text-xl font-bold text-gray-700">
            {compliment.title}
          </h2>

          {isEditing ? (
            <FormField<UpdateComplimentPayload>
              fieldName="content"
              translatedFieldName="..."
            >
              <FormField.TextArea className="shadow-none h-40" />
            </FormField>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {compliment.content}
            </p>
          )}

          {isEditing && (
            <button
              type="submit"
              className={joinClasses(
                "border border-gray-400 rounded-full hover:text-blue-400 text-gray-500",
                " p-2 opacity-30 hover:opacity-100 transition duration-300 absolute -bottom-10 right-0"
              )}
            >
              <BiSave />
            </button>
          )}
        </form>

        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {/* <span>{new Date(compliment.createdAt).toLocaleDateString()}</span> */}
          </div>
        </div>
      </motion.article>
    </FormProvider>
  );
}

export default ComplimentCard;
