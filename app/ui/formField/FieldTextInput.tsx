import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";
import type { HTMLProps } from "react";
import { joinClasses } from "@/lib/utils/strings";
export default function FieldTextInput(
  props: Omit<HTMLProps<HTMLInputElement>, "type" | "id"> = {}
) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { fieldName, translatedFieldName } = useFormFieldContext();
  return (
    <input
      {...register(fieldName)}
      type="text"
      id={fieldName}
      placeholder={translatedFieldName ?? fieldName}
      {...props}
      className={joinClasses(
        "w-full border border-slate-200 bg-transparent rounded-md px-3 py-2 transition",
        "duration-300 ease focus:outline-none focus:border-slate-400",
        "hover:border-slate-300 shadow-sm focus:shadow",
        {
          "border-red-500": errors.fieldName,
        },
        props.className
      )}
    />
  );
}
