import { GoBack } from "@/components/GoBack";
import { Link, useLocation } from "react-router";
import { Outlet } from "react-router";
import { FaImages, FaHeart } from "react-icons/fa"; // Importing icons from react-icons
import { BiSearch } from "react-icons/bi";

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
                    : "text-gray-700 hover:bg-blue-50"
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
