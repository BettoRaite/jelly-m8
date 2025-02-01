import { queryClient, queryKeys } from "@/lib/config";
import { constructFetchUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/Loader";
import { runProfilesFetch } from "@/api/profiles.api";
import { ProfileCard } from "./ProfileCard";
import { CreateProfile } from "./CreateProfile";
import useProfileQuery from "@/hooks/useProfileQuery";

export function ProfilesTab() {
  const { data, status } = useProfileQuery({
    type: "profiles",
    queryKey: queryKeys.profilesKey,
  });
  console.log(data);
  if (status === "pending") {
    return <Loader />;
  }
  if (status === "error") {
    return "Failed to load users";
  }

  return (
    <div>
      <CreateProfile />
      <div className="grid grid-cols-3 items-center gap-4 mt-8 px-10">
        {data.map((p) => {
          return <ProfileCard key={p.id} profile={p} />;
        })}
      </div>
    </div>
  );
}
