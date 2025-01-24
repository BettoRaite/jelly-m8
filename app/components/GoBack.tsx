import { Link } from "react-router";
import { RiArrowGoBackFill } from "react-icons/ri";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

export function GoBack({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="absolute top-4 left-4 z-10 rounded-lg shadow-lg p-2 border border-gray-200 hover:scale-110 hover:border-pink-400 text-gray-400 hover:text-pink-400 duration-300"
    >
      <MdKeyboardDoubleArrowLeft className="text-2xl" />
    </Link>
  );
}
