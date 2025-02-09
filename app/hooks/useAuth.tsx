import { queryClient } from "@/lib/config";
import type { User } from "@/lib/types";
import { QUERY_KEYS } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { ApiError } from "@/lib/errors";

export const useAuth = (
  options: Partial<UseQueryOptions<User | undefined, ApiError>> = {}
) => {
  return useQuery<User | undefined, ApiError>({
    queryFn: async () => {
      const { data } = await fetchWithHandler<{
        data?: User;
      }>("/auth");
      return data;
    },
    queryKey: [QUERY_KEYS.AUTH],
    retry: false,
    ...options,
  });
};

export const getAuth = (): User | undefined =>
  queryClient.getQueryData([QUERY_KEYS.AUTH]);
