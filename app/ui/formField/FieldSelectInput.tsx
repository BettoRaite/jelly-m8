import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";

interface FieldSelectInputProps {
  options: {
    label: string;
    value: string | number;
  }[]; // Array of options for the select field
}

export default function FieldSelectInput({ options }: FieldSelectInputProps) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { fieldName } = useFormFieldContext();

  return (
    <select
      {...register(fieldName)}
      id={fieldName}
      className={`text-sm mt-1 block w-full p-2 border ${
        errors[fieldName] ? "border-red-500" : "border-gray-200"
      } rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200`}
    >
      <option value="" disabled>
        Select {fieldName}
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
