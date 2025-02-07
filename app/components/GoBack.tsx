import { Link } from "react-router";
import { RiArrowGoBackLine } from "react-icons/ri";
import { joinClasses } from "@/lib/utils/strings";

type Props = {
  to: string;
  className?: string;
  theme?: "light" | "dark";
};

export function GoBack({ to, className, theme }: Props) {
  return (
    <Link
      to={to}
      className={joinClasses(
        "absolute top-4 left-4 z-50 flex items-center gap-2",
        "rounded-lg shadow-lg p-3 transition-all duration-300",
        "text-gray-200 opacity-80 hover:opacity-100 hover:text-white",
        "font-jost font-bold hover:bg-gray-800/50",
        className,
        {
          "text-gray-500": theme === "dark",
        }
      )}
    >
      <RiArrowGoBackLine className="w-5 h-5" />
      <span>Обратно</span>
    </Link>
  );
}
