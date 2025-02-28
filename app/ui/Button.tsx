import { joinClasses } from "@/lib/utils/strings";
import type { ComponentProps } from "react";
import { FiLoader } from "react-icons/fi";

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variantClasses;
  isLoading?: boolean;
  roundedness?: string;
  padding?: string;
  bg?: string;
};

const variantClasses = {
  solid: "bg-blue-600 text-white hover:bg-blue-700",
  outline:
    "border border-white border-opacity-20 bg-white bg-opacity-20 hover:border-opacity-70",
  ghost: "text-blue-600 hover:bg-blue-50",
  none: "",
};

function Button({
  variant = "outline",
  isLoading = false,
  className,
  children,
  roundedness = "rounded-lg",
  padding = "px-2 py-2 md:px-4 md:py-2",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={joinClasses(
        className,
        " transition-all duration-200 flex items-center justify-center gap-2",
        roundedness,
        padding,
        variantClasses[variant]
      )}
    >
      {isLoading && <FiLoader className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
