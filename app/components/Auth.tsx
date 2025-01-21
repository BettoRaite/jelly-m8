import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { QUERY_USER_KEY } from "@/lib/constants";
import { constructFetchUrl } from "@/lib/utils";

type Props = {
  children: ReactNode;
};

export function Auth({ children }: Props) {
  useQuery({
    queryKey: [QUERY_USER_KEY],
    queryFn: async () => {
      const response = await fetch(constructFetchUrl("/users/me"), {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
  return <>{children}</>;
}
