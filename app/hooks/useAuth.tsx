import { useQuery } from "@tanstack/react-query";
import { constructFetchUrl } from "@/lib/utils";
import httpStatus from "http-status";
import { queryClient } from "@/lib/config";
import { queryKeys } from "@/lib/config";
import type { User } from "@/lib/types";
import useUserQuery from "./useUserQuery";

export const useAuth = () => {
  return useUserQuery(
    {
      type: "current_user",
      queryKey: queryKeys.authKey,
    },
    {
      retry: false,
    }
  );
};

export const getAuth = () => {
  return (
    (queryClient.getQueryData(queryKeys.authKey) as User | undefined) ?? {}
  );
};
