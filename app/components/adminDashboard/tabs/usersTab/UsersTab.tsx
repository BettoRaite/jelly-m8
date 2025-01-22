import { CreateUser } from "./CreateUser";
import { queryClient, queryKeys } from "@/lib/config";
import { constructFetchUrl } from "@/lib/utils";
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/Loader";
import { UserCard } from "./UserCard";
import { getAuth } from "@/hooks/useUser";

export function UsersTab() {
  const auth = getAuth();
  const { data: getUsersResponse, status } = useQuery<User[]>({
    queryKey: queryKeys.usersKey,
    queryFn: async () => {
      const response = await fetch(constructFetchUrl("/users"), {
        credentials: "include",
      });
      return (await response.json()).data;
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
      <CreateUser />
      <div className="grid grid-cols-3 items-center gap-4 mt-8 px-10">
        {getUsersResponse.map((u) => {
          if (auth.id === u.id) {
            return null;
          }
          return <UserCard key={u.id} user={u} />;
        })}
      </div>
    </div>
  );
}
