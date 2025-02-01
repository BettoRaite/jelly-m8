import type { FieldErrors } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";

export default function FieldError() {
  const {
    formState: { errors },
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  return (
    <>
      {errors.name && (
        <p className="mt-1 text-sm text-red-500">
          {errors.name.message as unknown as string}
        </p>
      )}
    </>
  );
}
