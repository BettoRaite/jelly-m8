import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import { GoBack } from "@/components/GoBack";
import { useAuth } from "@/hooks/useAuth";
import { useSessionMutation } from "@/hooks/useSessionMutation";
import {
  userLoginSchema,
  type UserLoginPayload,
} from "@/lib/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router"; // Updated import for react-router-dom

export default function Login() {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginPayload>({
    resolver: zodResolver(userLoginSchema),
  });
  const mutation = useSessionMutation();
  const onSubmit = async (payload: UserLoginPayload) => {
    mutation.mutate({
      type: "login",
      payload,
    });
  };
  const errorMessage =
    mutation.error?.status === 403
      ? "Неправильный код доступа"
      : "Что-то пошло не так";
  return (
    <main className="flex justify-center items-center h-screen bg-transparent">
      <AnimatedGradientBackground />
      <GoBack to="/" />
      <div
        className="bg-white bg-opacity-20 border border-white border-opacity-20
        p-8 rounded-lg shadow-md w-11/12 max-w-96 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6 font-comfortaa text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Ключ доступа"
              {...register("accessSecret", {
                required: "Access Key is required",
              })}
              className={`w-full p-2 rounded focus:outline-none
                bg-white bg-opacity-20 text-gray-300 placeholder:text-black placeholder:text-opacity-20 font-bold  ${
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
            className={`w-full p-2 text-white font-semibold rounded-xl font-comfortaa
              bg-gradient-to-tr from-blue-500 via-blue-500 to-blue-800
              hover:scale-110
              ${isSubmitting && "bg-gray-400"} transition duration-500`}
          >
            {isSubmitting ? "Loading..." : "Войти"}
          </button>
          {mutation.isError && (
            <div className="mt-4 text-red-500 text-center text-opacity-65">
              Error: {errorMessage}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
