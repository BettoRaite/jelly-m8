import * as motion from "motion/react-client";
import { useRef } from "react";
import { MdFavorite } from "react-icons/md";

export default function DragConstraints() {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="absolute top-0 w-dvw h-dvh -z-0"
      ref={constraintsRef}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        className="h-10 w-10"
      >
        <MdFavorite className="text-7xl text-pink-400" />
      </motion.div>
    </motion.div>
  );
}
