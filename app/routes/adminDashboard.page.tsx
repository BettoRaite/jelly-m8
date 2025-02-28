import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { Tabs } from "@/components/adminDashboard/Tabs";
import { Loader } from "@/components/Loader";
import { GoBack } from "@/components/GoBack";

export default function AdminDashboard() {
  const { data: getUserResponse, status } = useAuth();

  const navigate = useNavigate();

  if (status === "pending") {
    return <Loader />;
  }
  if (status === "error") {
    return "How about you reload the page :??";
  }

  const user = getUserResponse;
  if (!user || user.userRole !== "admin") {
    return navigate("/");
  }

  return (
    <div className="bg-gray-200 pb-20">
      <GoBack to="/" className="bg-gray-400 top-10" />
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      </header>
      <Tabs />
    </div>
  );
}
