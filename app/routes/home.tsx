import { Link } from "react-router";
import type { Route } from "./+types/home";
import { queryClient } from "@/lib/config";
import { useUser } from "@/hooks/useUser";
import { Loader } from "@/components/Loader";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data: getUserResponse, status } = useUser();

  if (status === "pending") {
    return <Loader />;
  }

  const { role } = getUserResponse?.data ?? {};

  const createLink = (to: string, name = to) => (
    <Link
      to={to}
      className="text-blue-400 font-bold text-2xl absolute right-4 top-4 capitalize"
    >
      {name}
    </Link>
  );

  return (
    <>
      {!role && createLink("login", "Рег")}
      {role === "admin" && createLink("dashboard")}
      {role === "user" && createLink("user-profile", "Профиль")}
    </>
  );
}
