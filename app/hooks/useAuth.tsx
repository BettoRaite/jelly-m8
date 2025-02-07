import { queryClient } from "@/lib/config";
import type { User } from "@/lib/types";
import useUserQuery from "./useUserQuery";
import { QUERY_KEYS } from "@/lib/config";

export const useAuth = () => {
  return useUserQuery(
    {
      type: "current_user",
      queryKey: QUERY_KEYS.authKey,
    },
    {
      retry: false,
    }
  );
};

export const getAuth = () => {
  return (
    (queryClient.getQueryData(QUERY_KEYS.authKey) as User | undefined) ?? {}
  );
};
