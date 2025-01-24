import { queryClient, queryKeys } from "@/lib/config";
import { constructFetchUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/Loader";
import { getAuth } from "@/hooks/useUser";
import { runProfilesFetch } from "@/api/profiles.api";
import { ProfileCard } from "./ProfileCard";
import type { CreateProfileSchema } from "@/lib/schemas/profiles.schema";
import { CreateProfile } from "./CreateProfile";

export function ProfilesTab() {
  const auth = getAuth();
  const { data: getUsersResponse, status } = useQuery<CreateProfileSchema[]>({
    queryKey: queryKeys.profilesKey,
    queryFn: async () => {
      const res = await runProfilesFetch({
        type: "get",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch profiles ${await res.text()}`);
      }
      return (await res.json()).data;
    },
  });
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
        {getUsersResponse.map((p) => {
          return <ProfileCard key={p.id} profile={p} />;
        })}
      </div>
    </div>
  );
}
