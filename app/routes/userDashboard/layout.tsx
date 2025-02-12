import { GoBack } from "@/components/GoBack";
import { Link, useLocation, useNavigate } from "react-router";
import { Outlet } from "react-router";
import { FaImages, FaHeart } from "react-icons/fa"; // Importing icons from react-icons
import { BiSearch } from "react-icons/bi";
import { getAuth, useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
import { HeartLoader } from "@/components/HeartLoader";
import ErrorScreen from "@/components/ErrorScreen";
import { useEffect } from "react";

export default function Layout() {
  const { data: user } = useAuth();
  const {
    data: profile,
    status,
    error,
  } = useProfileQuery(
    {
      type: "profile",
      userId: user?.id as number,
    },
    {
      enabled: Boolean(user),
      retry: false,
    }
  );

  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (error?.status === 404) {
      navigate(`/profiles/${user?.id}`);
    }
  }, [navigate, error, user]);

  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return <ErrorScreen description="Ошибка при загрузке вашего профиля" />;
  }
  return (
    <div className="bg-transparent">
      <div className="left-0 right-0 absolute flex justify-center top-10 z-50">
        <nav className="font-comfortaa text-sm">
          <ul
            className="flex flex-row gap-4 shadow-lg p-4 rounded-xl
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
    </div>
  );
}
