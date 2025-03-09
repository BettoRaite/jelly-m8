import { joinClasses } from "@/lib/utils/strings";
import * as motion from "motion/react-client";
import { BiHeart } from "react-icons/bi";
import TypingTextEffect from "./TypingText";
import { useEffect, useState } from "react";
type Props = {
  className?: string;
  text?: string;
  delayTextAppear?: number;
};
export function HeartLoader({ className, text, delayTextAppear = 1 }: Props) {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (text) {
      timeoutId = setTimeout(() => {
        setShowText(true);
      }, delayTextAppear * 1000);
    }
    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [delayTextAppear, text]);
  return (
    <motion.div
      className={joinClasses(
        "absolute w-full h-dvh flex flex-col justify-center items-center ",
        className
      )}
    >
      <BiHeart className="text-4xl rounded-full text-pink-500 animate-scale-up-down" />
      {text && showText && (
        <TypingTextEffect
          typingSpeed={60}
          text={text}
          className="text-center mt-10 text-white font-caveat sm:text-lg w-[320px]"
        />
      )}
    </motion.div>
  );
}
