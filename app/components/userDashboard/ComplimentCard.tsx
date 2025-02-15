import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { getAuth } from "@/hooks/useAuth";
import { useComplimentManager } from "@/hooks/useComplimentManager";
import type { UpdateComplimentPayload } from "@/lib/schemas/compliment.schema";
import type { Compliment } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
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
};
function ComplimentCard({
  initialCompliment,
  className,
  isOwner,
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
            type: "tween",
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          },
        }}
        exit={{
          scale: 0,
          opacity: 0,
          transition: {
            type: "tween",
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          },
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
              className={joinClasses("text-lg font-semibold text-slate-700", {
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
          <div
            className={joinClasses({
              "text-slate-100": initialCompliment.isAdmin,
              "text-slate-600": !initialCompliment.isAdmin,
            })}
          >
            <span className="font-thin">to:</span>
            <Link
              className="font-bold ml-1 text-pink-500"
              to={`/users/${initialCompliment.recipient.userId}/profile`}
            >
              @
              <span className="first-letter:capitalize">
                {compliment?.recipient.displayName}
              </span>
            </Link>
          </div>
          <div
            className={joinClasses({
              "text-slate-100": initialCompliment.isAdmin,
              "text-slate-600": !initialCompliment.isAdmin,
            })}
          >
            <span className="font-thin">вопрос:</span>
            <h2
              className={joinClasses("ml-1 font-bold inline", {
                "text-slate-100": initialCompliment.isAdmin,
                "text-slate-500": !initialCompliment.isAdmin,
              })}
            >
              {compliment?.title}
            </h2>
          </div>

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
            <div className="p-2 rounded-b-xl border-t-slate-400 max-h-40 overflow-y-auto">
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
            </div>
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
            "mt-4 flex items-center gap-6 text-xs text-slate-400 text-opacity-80"
          )}
        >
          {formatDate(compliment?.createdAt)}
        </div>
      </motion.article>
    </FormProvider>
  );
}

export default ComplimentCard;
