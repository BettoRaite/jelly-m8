import { Link } from "react-router";
import type { Route } from "./+types/home";
import { constructFetchUrl } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient, queryKeys } from "@/lib/config";
import { useState } from "react";
import { useNavigate } from "react-router";
type Credentials = {
  accessKey: string;
};
export default function Home() {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState("");
  const mutation = useMutation({
    mutationFn: async (creds: Credentials) => {
      const response = await fetch(constructFetchUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(creds),
      });
      if (!response.ok) {
        throw new Error("Failed to login user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.authKey,
      });
      navigate("/");
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Login error:", error.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({
      accessKey,
    }); // Trigger the mutation with the credentials
  }

  const { status } = mutation;
  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Access Key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={status === "pending"}
            className={`w-full p-2 text-white font-semibold rounded ${
              status === "pending"
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            } transition duration-200`}
          >
            {status === "pending" ? "Loading..." : "Login"}
          </button>
          {mutation.isError && (
            <div className="mt-4 text-red-500 text-center">
              Error: {mutation.error.message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
