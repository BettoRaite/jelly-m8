import { Link } from "react-router";
import { RiArrowGoBackLine } from "react-icons/ri";
import { joinClasses } from "@/lib/utils/strings";

type Props = { to: string; className?: string };
export function GoBack({ to, className }: Props) {
  return (
    <Link
      to={to}
      className={joinClasses(
        "absolute top-4 left-4 z-50 rounded-lg shadow-lg p-4 transition-opacity duration-300",
        "opacity-40 hover:opacity-100 hover:text-white",
        className
      )}
    >
      <RiArrowGoBackLine className="text-lg" />
    </Link>
  );
}
