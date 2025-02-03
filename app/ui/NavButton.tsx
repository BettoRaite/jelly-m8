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
      whileTap={{ scale: 0.5 }}
      onClick={onClick}
      className={joinClasses(
        "p-4 bg-transparent border border-gray-300 rounded-full transition-transform duration-500 overflow-hidden hover:scale-150",
        className
      )}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <Icon className={classNameIcon ?? ""} />
    </motion.button>
  );
}

export default NavButton;
