import type { ReactNode } from "react";
import { motion } from "motion/react";
type Props = {
  children: ReactNode;
  variant?: "user" | "other"; // Variant for user or other user messages
  className?: string; // Additional custom class names
};

function ChatMessage({
  children,
  variant = "other", // Default to "other" variant
  className = "",
}: Props) {
  // Define styles based on the variant
  const alignment = variant === "user" ? "justify-end" : "justify-start";
  const bgColor =
    variant === "user"
      ? "bg-blue-500"
      : "bg-gray-200 border border-white border-opacity-70";
  const textColor = variant === "user" ? "text-white" : "text-slate-600";
  const borderRadius =
    variant === "user" ? "rounded-br-none" : "rounded-bl-none";

  return (
    <motion.div
      animate={{ scale: [0, 1] }}
      className={`flex ${alignment} my-2`}
    >
      <div
        className={`${bgColor} ${textColor} px-4 py-2 rounded-2xl ${borderRadius} max-w-[80%] text-wrap ${className}`}
      >
        <p className="max-w-full break-words">{children}</p>
      </div>
    </motion.div>
  );
}

export default ChatMessage;
