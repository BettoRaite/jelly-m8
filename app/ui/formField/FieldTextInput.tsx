import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";
import type { HTMLProps } from "react";
export default function FieldTextInput(
  inputProps: Omit<HTMLProps<HTMLInputElement>, "type" | "id"> = {}
) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  return (
    <input
      {...register(fieldName)}
      type="text"
      id={fieldName}
      placeholder={fieldName}
      {...inputProps}
      className={`text-sm bg-white mt-1 block w-full p-2 border text-gray-700 ${
        errors.fieldName ? "border-red-500" : "border-gray-200"
      } rounded-md focus:outline-none transition-colors duration-200 ${
        inputProps.className ?? ""
      }`}
    />
  );
}
