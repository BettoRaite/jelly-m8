import type { Profile } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";

type Props = {
  profile: Profile;
  theme?: "dark" | "white";
  avatarSize?: number; // Customizable avatar size
  borderColor?: string; // Customizable border color
  showDisplayName?: boolean; // Option to show/hide display name
  showUsername?: boolean; // Option to show/hide username
  textStyles?: {
    displayName?: string; // Customizable display name text styles
    username?: string; // Customizable username text styles
  };
  className?: string;
};

function UserAvatar({
  profile,
  theme = "white",
  avatarSize = 56, // Default size is 56px
  borderColor = "white/80", // Default border color
  showDisplayName = true,
  showUsername = true,
  textStyles = {},
  className,
}: Props) {
  return (
    <div className={joinClasses(className, "flex items-center gap-4")}>
      <img
        src={profile.profileImageUrl}
        alt={profile.displayName}
        className="rounded-full object-cover border-2 shadow-md"
        style={{
          width: avatarSize,
          height: avatarSize,
          borderColor: borderColor,
        }}
        loading="lazy"
      />
      <div>
        {showDisplayName && (
          <h3
            className={joinClasses("text-lg font-semibold", {
              "text-white": theme === "white",
              "text-slate-700": theme === "dark",
              [textStyles.displayName || ""]: !!textStyles.displayName,
            })}
          >
            {profile.displayName}
          </h3>
        )}
        {showUsername && (
          <p
            className={joinClasses(
              "text-sm",
              theme === "white" ? "text-slate-300" : "text-gray-500",
              textStyles.username || ""
            )}
          >
            @{profile.displayName}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserAvatar;
