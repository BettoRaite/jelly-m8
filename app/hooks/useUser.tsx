import { useQuery } from "@tanstack/react-query";
import { constructFetchUrl } from "@/lib/utils";
import httpStatus from "http-status";
import { queryClient } from "@/lib/config";
import { queryKeys } from "@/lib/config";
import type { User } from "@/lib/types";

type GetUserResponse = {
  data: User;
};

export const useUser = () => {
  const query = useQuery<GetUserResponse | null>({
    queryKey: queryKeys.authKey,
    queryFn: async () => {
      const response = await fetch(constructFetchUrl("/users/me"), {
        credentials: "include",
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    },
  });

  return query;
};

export const getAuth = () => {
  return (
    (queryClient.getQueryData(queryKeys.authKey) as GetUserResponse)?.data ?? {}
  );
};
