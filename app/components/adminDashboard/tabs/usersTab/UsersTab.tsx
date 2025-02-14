import { Loader } from "@/components/Loader";
import { getAuth } from "@/hooks/useAuth";
import useUserQuery from "@/hooks/useUserQuery";
import { CreateUser } from "./CreateUser";
import { UserCard } from "./UserCard";
import { QUERY_KEYS } from "@/lib/config";
import FailedToLoad from "@/components/FailedToLoad";

export function UsersTab() {
  const auth = getAuth();
  const {
    data: users,
    refetch,
    status,
  } = useUserQuery({
    type: "users",
  });

  if (status === "pending") {
    return <Loader />;
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] mt-16 md:px-8 px-4">
      <CreateUser />
      {status !== "error" ? (
        <div className="mt-10 flex justify-center lg:justify-start  flex-wrap items-start gap-10 md:px-10 mb-60">
          {users?.map((u) => {
            if (auth?.id === u.id) {
              return null;
            }
            return <UserCard key={u.id} initialUser={u} />;
          })}
        </div>
      ) : (
        <FailedToLoad description="Failed to load users" reload={refetch} />
      )}
    </div>
  );
}
