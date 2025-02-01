import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

interface Props<T extends FieldValues> {
  errors: FieldErrors;
  register: UseFormRegister<T>;
  fieldName: Path<T>;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "id">;
}
export function TextInput<T extends FieldValues>({
  errors,
  fieldName,
  register,
  inputProps = {},
}: Props<T>) {
  return (
    <input
      {...register(fieldName)}
      type="text"
      id={fieldName}
      className={`text-sm mt-1 block w-full p-2 border ${
        errors.fieldName ? "border-red-500" : "border-gray-200"
      } rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200 `}
      placeholder={fieldName}
      {...inputProps}
    />
  );
}
