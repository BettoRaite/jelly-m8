import { Link } from "react-router";
import { RiArrowGoBackLine } from "react-icons/ri";
import { joinClasses } from "@/lib/utils/strings";

type Props = {
  to?: string | number;
  className?: string;
  theme?: "light" | "dark";
};

export function GoBack({ to = -1, className, theme = "light" }: Props) {
  return (
    <Link
      viewTransition
      to={to as unknown as string}
      className={joinClasses(
        className,
        "absolute top-4 left-4 z-50 flex items-center gap-2",
        "rounded-lg shadow-lg p-3 transition-all duration-300 opacity-70 hover:opacity-100",
        "font-jost font-bold hover:border-opacity-100",
        {
          "bg-white bg-opacity-20 border border-white border-opacity-20 text-white hover:border-opacity-60":
            theme === "light",
          "text-gray-500": theme === "dark",
        }
      )}
    >
      GoBack
    </Link>
  );
}
