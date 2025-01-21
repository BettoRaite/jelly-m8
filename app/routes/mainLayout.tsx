import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth } from "@/components/Auth";
import { queryClient } from "@/lib/config";

export default function Layout() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Auth>
          <Outlet />
        </Auth>
      </QueryClientProvider>
    </div>
  );
}
