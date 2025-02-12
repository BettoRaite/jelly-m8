import { useComplimentManager } from "@/hooks/useComplimentManager";
import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import { useLikeMutation } from "@/hooks/useLikeMutation";
import useLikeQuery from "@/hooks/useLikeQuery";
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
import { BiHeart, BiSave } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
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
  const {
    states: {
      compliment,
      complimentQueryLoadStatus,
      hasLiked,
      likeQueryLoadStatus,
      isEditing,
      formMethods,
      isDeleting,
      isUpdating,
      isLiking,
    },
    actions: { toggleLike, handleDelete, handleUpdate, setIsEditing },
  } = useComplimentManager(initialCompliment);
  if (complimentQueryLoadStatus === "pending") {
    return "....";
  }
  if (complimentQueryLoadStatus === "error") {
    return "err";
  }
  return (
    <FormProvider {...formMethods}>
      <motion.article
        animate={{
          scale: [0.6, 1],
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
            src={compliment?.author.profileImageUrl || "/default-avatar.png"}
            alt={compliment?.author.displayName}
            className="h-14 w-14 md:h-20 md:w-20 rounded-full object-cover border-2 border-white/80 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {compliment?.author.displayName}
            </h3>
            <p className="text-sm text-gray-500">
              @{compliment?.author.displayName}
            </p>
          </div>
        </div>

        <form
          onSubmit={formMethods.handleSubmit(handleUpdate)}
          className="space-y-2 relative"
        >
          <h2 className="text-xl font-bold text-gray-700">
            {compliment?.title}
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
              {compliment?.content}
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

        {!isEditing && (
          <button
            onClick={toggleLike}
            className=" flex items-center  space-x-2 p-2 rounded-lg hover:bg-gray-100
           transition-colors absolute right-2 bottom-2 text-gray-600"
            type="button"
          >
            {hasLiked ? (
              <IoMdHeart className="h-6 w-6 text-red-500" />
            ) : (
              <BiHeart className="h-6 w-6" />
            )}
            <span className="font-bold">{compliment?.likes}</span>
          </button>
        )}
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

/*

const {
  data: compliment,
  status,
  refetch: refetchCompliment,
} = useComplimentQuery(
  {
    type: "compliment",
    profileId: initialCompliment.profileId,
    complimentId: initialCompliment.id,
  },
  {
    initialData: initialCompliment,
  }
);
const {
  data: hasLiked,
  status: likeLoadStatus,
  refetch: refetchLike,
} = useLikeQuery({
  type: "has_liked",
  complimentId: initialCompliment.id,
});
const likeMutation = useLikeMutation();
const [isEditing, setIsEditing] = useState(false);
const [liked, setLiked] = useState(false);
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
if (hasLiked !== liked && likeLoadStatus === "success") {
  console.log("set");
  setLiked(hasLiked);
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
async function toggleLike() {
  likeMutation.mutate(
    {
      type: hasLiked ? "delete" : "create",
      complimentId: initialCompliment.id,
    },
    {
      onSuccess: () => {
        setLiked(true);
        refetchLike();
        refetchCompliment();
      },
    }
  );
}

*/
