import { constructFetchUrl } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient, queryKeys } from "@/lib/config";
import { useNavigate, Link } from "react-router"; // Updated import for react-router-dom
import { useForm } from "react-hook-form";
import {
  userLoginSchema,
  type UserLoginPayload,
} from "@/lib/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginPayload>({
    resolver: zodResolver(userLoginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: UserLoginPayload) => {
      console.log(data);
      const response = await fetch(constructFetchUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
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

  const onSubmit = (data: UserLoginPayload) => {
    mutation.mutate(data); // Trigger the mutation with the credentials
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Access Key"
              {...register("accessSecret", {
                required: "Access Key is required",
              })}
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.accessSecret ? "border-red-500" : ""
              }`}
            />
            {errors.accessSecret && (
              <span className="text-red-500 text-sm">
                {errors.accessSecret.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 text-white font-semibold rounded ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } transition duration-200`}
          >
            {isSubmitting ? "Loading..." : "Login"}
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
