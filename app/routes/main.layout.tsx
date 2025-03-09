import { queryClient } from "@/lib/config";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { FaExclamationCircle } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import Guard from "@/components/Guard";
import type { Route } from "./+types/main.layout";

export default function Layout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Guard>
          <Outlet />
        </Guard>
        <Toaster
          toastOptions={{
            icon: <MdInfo className="text-blue-500 text-xl " />,
            className:
              "font-caveat text-lg flex justify-center items-center bg-slate-200 border border-blue-200 rounded-lg shadow-lg",
            error: {
              className:
                " flex justify-center items-center bg-red-50 border border-red-200 rounded-lg shadow-lg",
              icon: <FaExclamationCircle className="text-red-500" />,
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}
