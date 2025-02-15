import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface TypingTextProps {
  text: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
  className?: string;
}

function TypingTextEffect({
  text,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 1500,
  className,
}: TypingTextProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Typing phase
      if (currentText.length < text.length) {
        setCurrentText(text.slice(0, currentText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, text, typingSpeed]);

  return (
    <p className={className}>
      {currentText.slice(0, currentText.length - 1)}
      <motion.span
        key={currentText.length}
        animate={{
          scale: [0, 1.1],
          opacity: [0, 1],
        }}
      >
        {currentText.slice(currentText.length - 1)}
      </motion.span>
      <motion.span
        style={{ opacity: 1 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Number.MAX_SAFE_INTEGER }}
      >
        |
      </motion.span>
    </p>
  );
}

export default TypingTextEffect;
