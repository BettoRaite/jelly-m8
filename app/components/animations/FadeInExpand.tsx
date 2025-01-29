import * as motion from "motion/react-client";
import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export function FadeInExpand({ className, children }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      {children}
    </motion.div>
  );
}
