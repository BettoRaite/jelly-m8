import { queryClient } from "@/lib/config";
import type { User } from "@/lib/types";
import { QUERY_KEYS } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";

export const useAuth = () => {
  return useQuery({
    queryFn: async () => {
      const { data } = await fetchWithHandler<{
        data?: User;
      }>("/auth");
      return data;
    },
    queryKey: [QUERY_KEYS.AUTH],
    retry: false,
  });
};

export const getAuth = (): User | undefined =>
  queryClient.getQueryData([QUERY_KEYS.AUTH]);
