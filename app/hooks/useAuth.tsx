import { queryClient } from "@/lib/config";
import type { User } from "@/lib/types";
import useUserQuery from "./useUserQuery";
import { QUERY_KEYS } from "@/lib/config";

export const useAuth = () => {
  return useUserQuery(
    {
      type: "current_user",
    },
    {
      retry: false,
    }
  );
};

export const getAuth = (): User | undefined =>
  queryClient.getQueryData([QUERY_KEYS.AUTH]);
