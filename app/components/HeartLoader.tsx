import { joinClasses } from "@/lib/utils/strings";
import * as motion from "motion/react-client";
import { BiHeart } from "react-icons/bi";
type Props = {
  className?: string;
};
export function HeartLoader({ className }: Props) {
  return (
    <motion.div
      className={joinClasses(
        "absolute w-full h-dvh flex justify-center items-center ",
        className
      )}
    >
      <BiHeart className="text-4xl rounded-full text-pink-500 animate-scale-up-down" />
    </motion.div>
  );
}
