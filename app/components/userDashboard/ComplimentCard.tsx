import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { getAuth } from "@/hooks/useAuth";
import { useComplimentManager } from "@/hooks/useComplimentManager";
import type { UpdateComplimentPayload } from "@/lib/schemas/compliment.schema";
import type { Compliment } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import { FormField } from "@/ui/formField/FormField";
import { motion } from "motion/react";
import { FormProvider } from "react-hook-form";
import { BiHeart, BiSave } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router";
type Props = {
  initialCompliment: Compliment;
  className?: string;
  isOwner: boolean;
  theme?: "default" | "special";
  onRefetchCompliments: () => void;
};
function ComplimentCard({
  initialCompliment,
  className,
  isOwner,
  onRefetchCompliments,
  theme = "default",
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
  const user = getAuth();
  const showEditTools = isOwner || user?.userRole === "admin";
  if (complimentQueryLoadStatus === "pending") {
    return "....";
  }
  if (complimentQueryLoadStatus === "error") {
    return "err";
  }
  return (
    <FormProvider {...formMethods}>
      <motion.article
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 350,
            damping: 20,
          },
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
          "relative overflow-hidden",
          className
        )}
      >
        {theme === "special" && (
          <>
            <img
              src="./public/pattern.jpg"
              alt=""
              className={joinClasses(
                "absolute w-full h-full top-0 left-0 object-cover -z-10 opacity-100"
              )}
            />
            <GlassyBackground className={joinClasses("-z-10")} />
          </>
        )}
        {showEditTools && (
          <div className={joinClasses("absolute top-3 right-3 flex gap-4")}>
            <button
              type="button"
              className={joinClasses(
                "rounded-full hover:text-blue-400 text-gray-500",
                "p-2 opacity-30 bg-gray-200 bg-opacity-100 hover:opacity-100 hover:border-opacity-0 transition duration-300"
              )}
              onClick={() => setIsEditing(!isEditing)}
            >
              <MdEdit />
            </button>
            <button
              type="button"
              className={joinClasses(
                "rounded-full hover:text-red-400 text-gray-500",
                "p-2 opacity-30 bg-gray-200 bg-opacity-100 hover:opacity-100 hover:border-opacity-0 transition duration-300"
              )}
              onClick={handleDelete}
            >
              <MdDelete />
            </button>
          </div>
        )}
        <div className={joinClasses("flex items-center gap-4")}>
          <img
            src={compliment?.author.profileImageUrl || "/default-avatar.png"}
            alt={compliment?.author.displayName}
            className={joinClasses(
              "h-14 w-14 md:h-20 md:w-20 rounded-full object-cover border-2 border-white/80 shadow-md"
            )}
          />
          <div>
            <h3
              className={joinClasses("text-lg font-semibold text-gray-800", {
                "text-white": initialCompliment.isAdmin,
              })}
            >
              {compliment?.author.displayName}
            </h3>
            <p
              className={joinClasses("text-sm text-gray-500", {
                "text-slate-300": initialCompliment.isAdmin,
              })}
            >
              @{compliment?.author.displayName}
            </p>
          </div>
        </div>

        <form
          onSubmit={formMethods.handleSubmit(handleUpdate)}
          className={joinClasses("space-y-2 relative")}
        >
          <h2
            className={joinClasses(
              "text-xl font-bold text-gray-700 font-caveat",
              {
                "text-slate-100": initialCompliment.isAdmin,
              }
            )}
          >
            {compliment?.title}
          </h2>

          {isEditing ? (
            <FormField<UpdateComplimentPayload>
              fieldName="content"
              translatedFieldName="..."
            >
              <FormField.TextArea
                className={joinClasses("shadow-none h-40", {
                  "text-white border-none": initialCompliment.isAdmin,
                })}
              />
            </FormField>
          ) : (
            <p
              className={joinClasses(
                "text-gray-700 leading-relaxed font-caveat font-bold",
                {
                  "text-slate-200": initialCompliment.isAdmin,
                }
              )}
              style={{ whiteSpace: "pre-line" }}
            >
              {compliment?.content}
            </p>
          )}

          {isEditing && (
            <button
              type="submit"
              className={joinClasses(
                "border border-gray-400 rounded-full hover:text-blue-400 text-gray-500",
                "p-2 opacity-30 hover:opacity-100 transition duration-300 absolute -bottom-10 right-0"
              )}
            >
              <BiSave />
            </button>
          )}
        </form>

        {!isEditing && (
          <motion.button
            onClick={toggleLike}
            disabled={isLiking || likeQueryLoadStatus !== "success"}
            transition={{ duration: 0.05 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.3 }}
            className={joinClasses(
              "flex items-center space-x-2 p-2 rounded-lg hover:scale-105",
              "duration-200 hover:border-pink-400 hover:border",
              "transition-all absolute right-2 bottom-2 text-pink-500 text-opacity-90",
              !hasLiked && "border border-gray-100",
              {
                "border-none": initialCompliment.isAdmin,
              }
            )}
            type="button"
          >
            {hasLiked ? (
              <IoMdHeart className="h-6 w-6 " />
            ) : (
              <BiHeart className="h-6 w-6" />
            )}
            <span className={joinClasses("font-bold")}>
              {compliment?.likes}
            </span>
          </motion.button>
        )}
        <div
          className={joinClasses(
            "mt-4 flex items-center gap-6 text-xs text-pink-500"
          )}
        >
          <Link to={`/profiles/${initialCompliment.profileId}`}>
            Получатель: @вика
          </Link>
        </div>
      </motion.article>
    </FormProvider>
  );
}

export default ComplimentCard;
