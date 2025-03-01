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
          "bg-pink-600 opacity-20 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] absolute rounded-full -left-10 -top-5 sm:-left-16 sm:-top-12",
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
          "bg-purple-600 opacity-20 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] absolute rounded-full -right-10 -bottom-5 sm:-right-16 sm:-bottom-12",
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
          "bg-blue-600 opacity-20 w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] absolute rounded-full -left-10 top-1/3 sm:-left-20 sm:top-1/2",
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
          "bg-green-600 opacity-20 w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] absolute rounded-full -right-4 bottom-1/3 sm:-right-14 sm:bottom-1/2",
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
