import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";

export default function FieldTextArea() {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  return (
    <textarea
      placeholder={fieldName}
      id={fieldName}
      {...register(fieldName)}
      className={`w-full border ${
        errors[fieldName] ? "border-red-500" : "border-gray-200"
      } rounded-lg focus:outline-0 focus:border-gray-400 duration-300 p-2 text-sm`}
    />
  );
}
