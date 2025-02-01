import type { Profile } from "@/lib/types";
import { IoIosRemove } from "react-icons/io";
import { useUserProfileMutation } from "@/hooks/useUserProfileMutation";
import { useProfileMutation } from "@/hooks/useProfileMutation";
type Props = {
  profile: Profile;
};

export function ProfileCard({ profile }: Props) {
  const mutation = useUserProfileMutation();
  const profileMutation = useProfileMutation();
  function handleDeleteUserClick() {
    mutation.mutate({
      type: "delete",
      userId: profile.userId,
    });
  }

  return (
    <section className="flex p-6 items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800 capitalize">
          {profile.displayName}
        </h1>

        <p className="text-gray-600 mt-1">
          <span className="font-medium">{profile.biography}</span>
        </p>
      </div>
      <button
        className="bg-red-100 rounded-lg p-4 hover:bg-red-300 duration-300"
        type="button"
        onClick={handleDeleteUserClick}
      >
        <IoIosRemove />
      </button>
      <button
        className="bg-red-100 rounded-lg p-4 hover:bg-red-300 duration-300"
        type="button"
        onClick={() => {
          profileMutation.mutate({
            type: "deactivate",
            profileId: profile.id,
          });
        }}
      >
        d
      </button>
    </section>
  );
}
