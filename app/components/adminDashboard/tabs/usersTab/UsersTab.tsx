import { CreateUser } from "./CreateUser";
import { queryClient, queryKeys } from "@/lib/config";
import { constructFetchUrl } from "@/lib/utils";
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/Loader";
import { UserCard } from "./UserCard";
import { getAuth } from "@/hooks/useAuth";
import useUserQuery from "@/hooks/useUserQuery";

export function UsersTab() {
  const auth = getAuth();
  const { data: getUsersResponse, status } = useUserQuery({
    type: "users",
    queryKey: queryKeys.usersKey,
  });
  if (status === "pending") {
    return <Loader />;
  }
  if (status === "error") {
    return "Failed to load users";
  }

  return (
    <div className="grid grid-cols-[auto_1fr] mt-16 px-8">
      <CreateUser />
      <div className="flex justify-start flex-wrap items-start gap-10 px-10 mb-60">
        {getUsersResponse.map((u) => {
          if (auth?.id === u.id) {
            return null;
          }
          return <UserCard key={u.id} user={u} />;
        })}
      </div>
    </div>
  );
}
