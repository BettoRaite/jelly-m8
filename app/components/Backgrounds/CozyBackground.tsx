import { joinClasses } from "@/lib/utils/strings";
import * as motion from "motion/react-client";

type Props = {
  className?: string;
};

function CozyBackground({ className }: Props) {
  return (
    <div className="absolute w-full h-full top-0 overflow-hidden">
      <motion.div
        className={joinClasses(
          "bg-pink-600 opacity-25 w-[30%] h-[50%] sm:w-[50%] sm:h-[40%] md:w-[15%] md:h-[30%] absolute rounded-full -left-24 -top-20 sm:-left-16 sm:-top-16",
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
          transition: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      />

      {/* Second animated circle */}
      <motion.div
        className={joinClasses(
          "bg-purple-600 opacity-25 w-[25%] h-[45%] sm:w-[15%] sm:h-[35%] md:w-[10%] md:h-[25%] absolute rounded-full -right-24 -bottom-20 sm:-right-16 sm:-bottom-16",
          className
        )}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -15, 15, 0],
          y: [0, 15, -15, 0],
          transition: {
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      />

      {/* Third animated circle */}
      <motion.div
        className={joinClasses(
          "bg-blue-600 opacity-25 w-[20%] h-[40%] sm:w-[10%] sm:h-[30%] md:w-[8%] md:h-[20%] absolute rounded-full -left-12 top-1/2 sm:-left-8",
          className
        )}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, -20, 0],
          y: [0, -20, 20, 0],
          transition: {
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      />

      {/* Fourth animated circle */}
      <motion.div
        className={joinClasses(
          "bg-green-600 opacity-25 w-[18%] h-[35%] sm:w-[12%] sm:h-[25%] md:w-[9%] md:h-[18%] absolute rounded-full -right-12 bottom-1/2 sm:-right-8",
          className
        )}
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -25, 25, 0],
          y: [0, 25, -25, 0],
          transition: {
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      />
    </div>
  );
}

export default CozyBackground;
