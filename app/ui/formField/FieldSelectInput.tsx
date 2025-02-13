import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";
import { joinClasses } from "@/lib/utils/strings";

interface FieldSelectInputProps {
  options: {
    label: string;
    value: string | number;
  }[]; // Array of options for the select field
  ctaText?: string;
  className?: string;
  useDefault?: boolean;
}

export default function FieldSelectInput({
  options,
  ctaText,
  className,
  useDefault,
}: FieldSelectInputProps) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { fieldName } = useFormFieldContext();

  return (
    <select
      {...register(fieldName)}
      id={fieldName}
      className={joinClasses(
        "w-full border border-slate-200 bg-transparent rounded-md px-3 py-2 transition",
        "duration-300 ease focus:outline-none focus:border-slate-400",
        "hover:border-slate-300 shadow-sm focus:shadow",
        {
          "border-red-500": errors.fieldName,
        },
        className
      )}
      defaultValue={useDefault ? options[0].value : ctaText ?? "Select"}
    >
      <option className="" value="" disabled>
        {ctaText ?? "Select"}
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
