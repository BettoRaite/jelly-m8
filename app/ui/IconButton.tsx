import { joinClasses } from "@/lib/utils/strings";
import type { ComponentProps } from "react";

const sizeClasses = {
  sm: "p-1.5 text-sm",
  md: "p-2 text-base",
  lg: "p-3 text-lg",
};

const colorClasses = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-green-500 text-white hover:bg-green-600",
};

const variantClasses = {
  solid: "",
  outline: "bg-transparent border-2",
  ghost: "bg-transparent hover:bg-opacity-10",
};

type IconButtonProps = ComponentProps<"button"> & {
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "danger" | "success";
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

function IconButton({
  icon,
  color = "primary",
  variant = "solid",
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={joinClasses(
        "rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50",
        sizeClasses[size],
        colorClasses[color],
        variantClasses[variant],
        className
      )}
    >
      {icon}
    </button>
  );
}

export default IconButton;
