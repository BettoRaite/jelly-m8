import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import type { Compliment } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import { motion } from "motion/react";
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
      type: "user-compliment",
      profileId: initialCompliment.profileId,
    },
    {
      initialData: initialCompliment,
      enabled: false,
    }
  );
  if (status === "pending") {
    return "...";
  }
  if (status === "error") {
    return "...";
  }
  const complimentMutation = useComplimentMutation();
  function handleDelete() {
    if (!compliment) return;
    complimentMutation.mutate(
      {
        type: "delete",
        profileId: compliment.profileId,
        complimentId: compliment.id,
      },
      {
        onSuccess: () => {
          onRefetchCompliments();
        },
      }
    );
  }
  return (
    <motion.article
      animate={{
        scale: [0, 1],
        opacity: [0, 1],
      }}
      className={joinClasses(
        "group relative flex flex-col gap-4 rounded-xl p-4",
        "bg-white/80 backdrop-blur-sm transition-all hover:bg-white/90",
        "shadow-lg shadow-gray-200/40 hover:shadow-gray-200/60",
        "border border-gray-100/70 hover:border-gray-100/90",
        className
      )}
    >
      <button
        type="button"
        className={joinClasses(
          "border border-gray-400 absolute top-3 right-14 rounded-full hover:text-blue-400 text-gray-500",
          " p-2 opacity-30 hover:opacity-100 transition duration-300"
        )}
        onClick={handleDelete}
      >
        <MdEdit />
      </button>
      <button
        type="button"
        className={joinClasses(
          "border border-gray-400 absolute top-3 right-3 rounded-full hover:text-red-400 text-gray-500",
          " p-2 opacity-30 hover:opacity-100 transition duration-300"
        )}
        onClick={handleDelete}
      >
        <MdDelete />
      </button>
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

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-700">{compliment.title}</h2>
        <p className="text-gray-700 leading-relaxed">{compliment.content}</p>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          {/* <span>{new Date(compliment.createdAt).toLocaleDateString()}</span> */}
        </div>
      </div>
    </motion.article>
  );
}

export default ComplimentCard;
