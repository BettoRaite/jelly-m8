import type { Profile } from "@/lib/types";
import { motion } from "motion/react";
import { FaDiceThree } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router";

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
      className="relative bg-white dark:bg-gray-800 rounded-xl
    shadow-lg transition-shadow duration-200 p-6
    border border-pink-300 bg-opacity-80 border-opacity-60
    "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.profileImageUrl || "/default-avatar.jpg"}
            alt={profile.displayName}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
          />
          <div>
            <h3 className="text-lg font-bold text-pink-400">
              {profile.displayName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              @{profile.displayName}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 italic">
        {profile.biography}
      </p>
      <Link
        to={`/users/${profile.userId}/profile`}
        className="bg-pink-400 hover:bg-pink-600 text-white px-4 py-2 rounded-lg
          text-sm font-bold text-center transition-colors duration-300
          flex items-center justify-center gap-2
          "
      >
        <FiMessageCircle size={16} />
        Посмотреть профиль
      </Link>
    </motion.div>
  );
}
export default ProfileCard;
