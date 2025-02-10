import { queryClient } from "@/lib/config";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </>
  );
}
