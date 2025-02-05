import { joinClasses } from "@/lib/utils/strings";
import type { ComponentProps } from "react";
import { FiLoader } from "react-icons/fi";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "solid" | "outline" | "ghost";
  isLoading?: boolean;
};

function Button({
  variant = "solid",
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={joinClasses(
        "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2",
        variantClasses[variant],
        className
      )}
    >
      {isLoading && <FiLoader className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
