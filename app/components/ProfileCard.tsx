import type { Profile } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import { motion } from "motion/react";
import { BiGlasses } from "react-icons/bi";
import { FaDiceThree } from "react-icons/fa";
import { FiBookOpen, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router";
import GlassyBackground from "./Backgrounds/GlassyBackground";

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <motion.div
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
      className={joinClasses(
        "relative bg-white dark:bg-gray-800 rounded-xl",
        "shadow-lg transition-shadow duration-200 p-6",
        "border border-pink-300 bg-opacity-80 border-opacity-60",
        {
          "border-yellow-300 bg-yellow-50 dark:bg-yellow-900":
            profile.occupation === "teacher",
        }
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.profileImageUrl || "/default-avatar.jpg"}
            alt={profile.displayName}
            className={joinClasses(
              "w-16 h-16 rounded-full object-cover border-2",
              {
                "border-purple-500": profile.occupation !== "teacher",
                "border-yellow-500": profile.occupation === "teacher",
              }
            )}
          />
          <div>
            <h3
              className={joinClasses("text-lg font-bold", {
                "text-pink-400": profile.occupation !== "teacher",
                "text-yellow-600 dark:text-yellow-400":
                  profile.occupation === "teacher",
              })}
            >
              {profile.displayName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              @{profile.displayName}
            </p>
            {profile.occupation === "teacher" && (
              <div className="flex items-center gap-1 mt-1">
                <FiBookOpen
                  size={16}
                  className="text-yellow-600 dark:text-yellow-400"
                />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  Teacher
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 italic">
        {profile.biography}
      </p>
      <Link
        to={`/users/${profile.userId}/profile`}
        className={joinClasses(
          "bg-pink-400 hover:bg-pink-600 text-white px-4 py-2 rounded-lg",
          "text-sm font-bold text-center transition-colors duration-300",
          "flex items-center justify-center gap-2",
          {
            "bg-yellow-500 hover:bg-yellow-600":
              profile.occupation === "teacher",
          }
        )}
      >
        <FiMessageCircle size={16} />
        Посмотреть профиль
      </Link>
    </motion.div>
  );
}
export default ProfileCard;
