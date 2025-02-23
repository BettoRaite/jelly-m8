import { GoBack } from "@/components/GoBack";
import { Link, useLocation, useNavigate } from "react-router";
import { Outlet } from "react-router";
import { FaImages, FaHeart, FaExclamationCircle } from "react-icons/fa"; // Importing icons from react-icons
import { BiSearch } from "react-icons/bi";
import { getAuth, useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
import { HeartLoader } from "@/components/HeartLoader";
import ErrorScreen from "@/components/ErrorScreen";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  const { data: user, status } = useAuth();

  const location = useLocation();
  if (status === "pending") {
    return <HeartLoader />;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <div className="bg-transparent">
      <div className="left-0 right-0 absolute flex justify-center top-20 sm:top-10 z-50">
        <nav className="font-comfortaa text-sm">
          <ul
            className="flex flex-row gap-4 shadow-lg p-2 sm:p-4 text-xs sm:text-sm rounded-xl
            relative bg-white backdrop-blur-sm bg-opacity-20 border-gray-300 border"
          >
            <li>
              <Link
                to={"/discovery"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive("/discovery")
                    ? "bg-gradient-to-tr from-purple-400 to-purple-600 text-white font-bold"
                    : "text-gray-700 hover:bg-blue-500 hover:text-white duration-300"
                }`}
              >
                <BiSearch className="w-5 h-5" />
                <span>Поиск</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/compliments-feed"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive("/compliments-feed")
                    ? "bg-pink-500 text-white"
                    : "text-gray-700 hover:bg-pink-50"
                }`}
              >
                <FaHeart
                  className={`w-5 h-5 text-pink-500 ${
                    isActive("/compliments-feed")
                      ? "text-white"
                      : "text-pink-500"
                  }`}
                />
                <span>Комплименты</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
      <Toaster
        toastOptions={{
          error: {
            className:
              " flex justify-center items-center bg-red-50 border border-red-200 rounded-lg shadow-lg",
            icon: <FaExclamationCircle className="text-red-500" />,
          },
        }}
      />
    </div>
  );
}
