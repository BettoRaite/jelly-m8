import { Loader } from "@/components/Loader";
import useProfileQuery from "@/hooks/useProfileQuery";
import useUserQuery from "@/hooks/useUserQuery";
import { queryKeys } from "@/lib/config";
import { AnimatePresence } from "motion/react";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import ErrorScreen from "@/components/ErrorScreen";

export function ProfilesTab() {
  const { data: profiles, status: profilesQueryStatus } = useProfileQuery({
    type: "profiles",
  });
  const { data: users, status: usersQueryStatus } = useUserQuery({
    type: "users",
    queryKey: queryKeys.usersKey,
  });

  if (profilesQueryStatus === "pending") {
    return <Loader />;
  }
  if (profilesQueryStatus === "error") {
    return <ErrorScreen description="Failed to load profiles" />;
  }

  if (usersQueryStatus === "pending") {
    return <Loader />;
  }
  if (usersQueryStatus === "error") {
    return <ErrorScreen description="Failed to load users" />;
  }
  const usersWithoutProfile = users.filter((u) => {
    return !profiles.find((p) => p.userId === u.id);
  });
  return (
    <div className="md:grid  grid-cols-[auto_1fr] mt-16 px-8">
      <ProfileForm users={usersWithoutProfile} formType="create" />
      <div className="mt-20 md:mt-0 flex justify-center md:justify-start flex-wrap items-start gap-10 px-10 mb-60">
        <AnimatePresence>
          {profiles.map((p) => {
            return <ProfileCard key={p.id} initialProfile={p} />;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
