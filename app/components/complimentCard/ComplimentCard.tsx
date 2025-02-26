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
import UserAvatar from "./UserAvatar";
import toast from "react-hot-toast";
import { RiProfileFill } from "react-icons/ri";
import { useRef, useState } from "react";
import LoadingIndicator from "@/ui/LoadingIndicator";

type Props = {
  initialCompliment: Compliment;
  className?: string;
  isOwner: boolean;
  variant?: "default" | "special";
};
function ComplimentCard({
  initialCompliment,
  className,
  isOwner,
  variant = "default",
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
      likeMutation,
    },
    actions: { toggleLike, handleDelete, handleUpdate, setIsEditing },
  } = useComplimentManager(initialCompliment);
  const [limitLikes, setLimitLikes] = useState(false);
  const user = getAuth();
  const showEditTools = isOwner || user?.userRole === "admin";
  if (complimentQueryLoadStatus === "pending") {
    return "....";
  }
  if (complimentQueryLoadStatus === "error") {
    return "err";
  }
  function handleLikeClick() {
    if (!user) {
      return toast("Сперва создай свой профиль");
    }
    const debounceTime = 500;
    // Limiting the number of like clicks user can make
    setLimitLikes(true);
    setTimeout(() => {
      setLimitLikes(false);
    }, debounceTime);
    return toggleLike();
  }
  const likeBtnIcon = hasLiked ? (
    <IoMdHeart className="h-6 w-6 " />
  ) : (
    <BiHeart className="h-6 w-6" />
  );
  const isLikeLoading = isLiking || limitLikes;
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
        <UserAvatar
          profile={initialCompliment.recipient}
          theme={variant === "default" ? "dark" : "white"}
        />
        {variant === "special" && (
          <>
            <img
              src="/pattern.jpg"
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
        <form
          onSubmit={formMethods.handleSubmit(handleUpdate)}
          className={joinClasses("space-y-2 relative")}
        >
          <div>
            <h2
              className={joinClasses("font-bold text-[1.1rem]", {
                "text-slate-100": variant === "special",
                "text-gray-500": variant === "default",
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
            <div className={joinClasses("rounded-xl max-h-40 overflow-y-auto")}>
              <p
                className={joinClasses(" leading-relaxed break-all text-sm", {
                  "text-slate-200 font-bold ": initialCompliment.isAdmin,
                  "text-slate-500": !initialCompliment.isAdmin,
                })}
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
                "p-2 opacity-30 hover:opacity-100 transition duration-300 absolute top-4 right-2"
              )}
            >
              <BiSave />
            </button>
          )}
        </form>
        <UserAvatar
          profile={initialCompliment.author}
          theme={variant === "default" ? "dark" : "white"}
          className="justify-end px-2 gap-2"
          avatarSize={55}
          textStyles={{
            displayName: "text-[1rem]",
            username: "text-[0.9rem]",
          }}
        />
        {/* Like button */}
        {!isEditing && (
          <motion.button
            onClick={handleLikeClick}
            disabled={isLikeLoading}
            transition={{ duration: 0.05 }}
            whileHover={isLikeLoading ? {} : { scale: 1.2 }}
            whileTap={isLikeLoading ? {} : { scale: 0.3 }}
            className={joinClasses(
              "flex items-center space-x-2 p-2 rounded-lg hover:scale-105",
              "duration-200 hover:border-pink-400 hover:border",
              "transition-all absolute right-2 bottom-2 text-pink-500 text-opacity-90",
              !hasLiked && "border border-gray-100",
              {
                "border-none": variant === "special",
                "pointer-events-none opacity-40": isLikeLoading,
              }
            )}
            type="button"
          >
            {likeBtnIcon}
            <span className={joinClasses("font-bold")}>
              {compliment?.likes}
            </span>
          </motion.button>
        )}
        {/* Date */}
        <div
          className={joinClasses("mt-4 flex items-center gap-6 text-xs ", {
            "text-slate-400 text-opacity-80": !initialCompliment.isAdmin,
            "text-slate-200": initialCompliment.isAdmin,
          })}
        >
          {formatDate(compliment?.createdAt)}
        </div>
      </motion.article>
    </FormProvider>
  );
}

export default ComplimentCard;
