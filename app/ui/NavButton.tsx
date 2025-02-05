import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { joinClasses } from "@/lib/utils/strings";
import * as motion from "motion/react-client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  classNameIcon?: string;
};
function NavButton({
  direction,
  onClick,
  disabled,
  ariaLabel,
  className,
  classNameIcon,
}: Props) {
  const Icon = direction === "left" ? FaChevronLeft : FaChevronRight;

  return (
    <motion.button
      onClick={onClick}
      className={joinClasses(
        "h-16 w-16",
        "border border-gray-300 rounded-full transition-transform duration-500 overflow-hidden",
        className
      )}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <motion.div
        whileTap={{ scale: 0.4 }} // Slightly reduced scale for tap effect
        className="h-full w-full flex justify-center items-center"
      >
        <Icon className={classNameIcon ?? ""} />
      </motion.div>
      <div className="bg-white w-full h-full blur-xl opacity-10 shadow-lg" />
    </motion.button>
  );
}

export default NavButton;
