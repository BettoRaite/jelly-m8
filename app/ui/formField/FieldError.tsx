import type { FieldErrors } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";

interface FieldErrorProps {
  className?: string;
}

export default function FieldError({ className }: FieldErrorProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  return (
    <>
      {errors[fieldName] && (
        <div
          className={`mt-4 text-sm text-red-500 text-center font-bold ${
            className || ""
          }`}
        >
          {errors[fieldName].message as unknown as string}
        </div>
      )}
    </>
  );
}
