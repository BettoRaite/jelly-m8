import { joinClasses } from "@/lib/utils/strings";

interface SelectInputProps {
  options: {
    label: string;
    value: string | number;
  }[]; // Array of options for the select field
  ctaText?: string; // Call-to-action text for the default option
  onChange?: (value: string | number) => void; // Optional onChange handler
  value?: string | number; // Optional value for controlled input
  className?: string; // Optional additional class names
  error?: boolean; // Optional error state
}

export default function SelectInput({
  options,
  ctaText = "Select",
  onChange,
  value,
  className = "",
  error = false,
}: SelectInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={joinClasses(
        "placeholder:text-slate-400 text-slate-700 text-sm",
        "w-full border border-slate-200 bg-transparent rounded-md px-3 py-2 transition",
        "duration-300 ease focus:outline-none focus:border-slate-400",
        "hover:border-slate-300 shadow-sm focus:shadow",
        {
          "border-red-500": error,
        },
        className
      )}
    >
      <option value="" disabled>
        {ctaText}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="first-letter:capitalize"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
