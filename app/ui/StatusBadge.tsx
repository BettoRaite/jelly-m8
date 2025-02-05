import { joinClasses } from "@/lib/utils/strings";

type StatusBadgeProps = {
  isActive: boolean;
  className?: string;
};

function StatusBadge({ isActive, className }: StatusBadgeProps) {
  return (
    <div
      className={joinClasses(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        isActive
          ? "bg-green-100 text-green-800 animate-pulse"
          : "bg-red-100 text-red-800",
        className
      )}
    >
      <span
        className={joinClasses(
          "w-2 h-2 mr-1.5 rounded-full",
          isActive ? "bg-green-500" : "bg-red-500"
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </div>
  );
}

export default StatusBadge;
