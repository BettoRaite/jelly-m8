import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useSubmit } from "react-router";
import { config } from "@/lib/config";
import { HeartLoader } from "./HeartLoader";
import LoadingIndicator from "@/ui/LoadingIndicator";
import AnimatedGradientBackground from "./Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "./Backgrounds/GlassyBackground";

interface Props {
  children: ReactNode;
}

function Guard({ children }: Props) {
  const [apiKey, setApiKey] = useState("");
  const queryClient = useQueryClient();

  const { status } = useQuery({
    queryFn: async () => {
      const res = await fetch(`${config.server.url}/auth/api/status`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unauthenticated");
      return res.json();
    },
    queryKey: ["api-auth"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${config.server.url}/auth/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Authentication failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-auth"] });
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const renderContent = () => {
    switch (status) {
      case "pending":
        return <HeartLoader className="bg-black" />;
      case "success":
        return children;
      case "error":
        return (
          <main className="relative bg-black w-full min-h-dvh flex justify-center items-center">
            <GlassyBackground />
            <AnimatedGradientBackground />
            <div className="w-11/12 absolute z-10 bg-white/20 p-8 rounded-lg shadow-lg border border-white/20 max-w-sm">
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col space-y-4"
              >
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    name="secret"
                    placeholder="Введи секрет"
                    className="mb-4 px-4 py-2 bg-white/20 placeholder:text-gray-50 outline-none font-bold text-white rounded-md"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    autoComplete="current-password"
                  />
                  {mutation.isError && (
                    <p className="text-red-500 text-sm">Неправильный cекрет.</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {mutation.isPending ? <LoadingIndicator /> : "Отправить"}
                </button>
              </form>
            </div>
          </main>
        );
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}

export default Guard;
