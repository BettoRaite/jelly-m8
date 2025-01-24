import { Link } from "react-router";
import type { Route } from "./+types/home";
import { queryClient, queryKeys } from "@/lib/config";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { constructFetchUrl } from "@/lib/utils";
import type { User } from "@/lib/types";
import { UsersTab } from "@/components/adminDashboard/tabs/usersTab/UsersTab";
import { Tabs } from "@/components/adminDashboard/Tabs";
import { Loader } from "@/components/Loader";
import { GoBack } from "@/components/GoBack";

export default function AdminDashboard() {
  const { data: getUserResponse, status } = useUser();
  const user = getUserResponse?.data;

  const navigate = useNavigate();

  if (status === "pending") {
    return <Loader />;
  }
  if (status === "error") {
    return "How about you reload the page :??";
  }
  if (!user) {
    return navigate("/");
  }

  const { accessKey, id, name, role } = user;
  return (
    <div className="min-h-screen bg-gray-100">
      <GoBack to="/" />
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6" />
      </main>
      <Tabs />
    </div>
  );
}
