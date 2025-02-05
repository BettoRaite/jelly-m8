import { queryClient, queryKeys } from "@/lib/config";
import { constructFetchUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/Loader";
import { runProfilesFetch } from "@/api/profiles.api";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import useProfileQuery from "@/hooks/useProfileQuery";
import useUserQuery from "@/hooks/useUserQuery";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

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
    return "Failed to load profiles";
  }

  if (usersQueryStatus === "pending") {
    return <Loader />;
  }
  if (usersQueryStatus === "error") {
    return "failed to load users";
  }
  return (
    <div className="md:grid  grid-cols-[auto_1fr] mt-16 px-8">
      <ProfileForm users={users} formType="create" />
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
