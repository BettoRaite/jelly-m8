import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
export const config = {
  server: {
    url: "http://localhost:5000/api/v1",
  },
};
