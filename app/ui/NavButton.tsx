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
        className,
        "p-4 rounded-full transition-transform duration-500 overflow-hidden"
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
    </motion.button>
  );
}

export default NavButton;
