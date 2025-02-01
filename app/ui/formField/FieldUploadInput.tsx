import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";

export default function FieldUploadInput() {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  return (
    <input
      {...register(fieldName)}
      type="file"
      id={fieldName}
      className={`text-sm mt-1 block w-full p-2 border ${
        errors.fieldName ? "border-red-500" : "border-gray-200"
      } rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200`}
      placeholder={fieldName}
    />
  );
}
