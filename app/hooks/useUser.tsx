import { useQuery } from "@tanstack/react-query";
import { QUERY_USER_KEY } from "@/lib/constants";
import { constructFetchUrl } from "@/lib/utils";
import httpStatus from "http-status";
type User = {
  id: number;
  role: string;
  name: string;
  accessKey: string;
};
type GetUserResponse = {
  data: User;
};
export const useUser = () =>
  useQuery<GetUserResponse | null>({
    queryKey: [QUERY_USER_KEY],
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
