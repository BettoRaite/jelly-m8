import { joinClasses } from "@/lib/utils/strings";
import * as motion from "motion/react-client";
type Props = {
  className?: string;
};
function CozyBackground({ className }: Props) {
  return (
    <div>
      <motion.div
        className={joinClasses(
          "bg-pink-600 opacity-25 w-[30%] h-[50%] absolute rounded-full -left-24 -top-20",
          className
        )}
        animate={{
          scale: [1, 1.2, 1], // Pulsating scale
          x: [0, 10, -10, 0], // Slight horizontal drift
          y: [0, -10, 10, 0], // Slight vertical drift
          transition: {
            duration: 4, // Animation duration
            repeat: Number.POSITIVE_INFINITY, // Loop the animation
            ease: "easeInOut", // Smooth easing
          },
        }}
      />
    </div>
  );
}

export default CozyBackground;
