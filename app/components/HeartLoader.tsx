import * as motion from "motion/react-client";

import { BiHeart } from "react-icons/bi";
export function HeartLoader() {
  return (
    <motion.div className="absolute w-full h-dvh flex justify-center items-center ">
      <BiHeart className="text-4xl rounded-full text-pink-500 animate-scale-up-down" />
    </motion.div>
  );
}
