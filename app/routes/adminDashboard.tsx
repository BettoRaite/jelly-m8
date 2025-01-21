import { Link } from "react-router";
import type { Route } from "./+types/home";
import { queryClient } from "@/lib/config";
import { QUERY_USER_KEY } from "@/lib/constants";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const { data: getUserResponse, status } = useUser();
  const navigate = useNavigate();

  if (status === "pending") {
    return "...loading";
  }
  if (status === "error") {
    return "error";
  }
  if (!getUserResponse?.data) {
    return navigate("/");
  }
  const { accessKey, id, name, role } = getUserResponse.data;
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="mb-4">
            <strong>ID:</strong> <span>{id}</span>
          </div>
          <div className="mb-4">
            <strong>Name:</strong> <span>{name}</span>
          </div>
          <div className="mb-4">
            <strong>Role:</strong> <span>{role}</span>
          </div>
          <div className="mb-4">
            <strong>Access Key:</strong> <span>{accessKey}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
