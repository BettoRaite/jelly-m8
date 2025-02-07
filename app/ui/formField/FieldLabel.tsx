import type { HTMLProps } from "react";
import { useFormFieldContext } from "./FormFieldContext";
import { joinClasses, splitCamelCaseToLowercase } from "@/lib/utils/strings";
interface Props extends HTMLProps<HTMLLabelElement> {
  content?: string;
}
export default function FieldLabel({ content, ...props }: Props) {
  const { fieldName, translatedFieldName } = useFormFieldContext();
  return (
    <label
      {...props}
      htmlFor={fieldName}
      className={joinClasses(
        "first-letter:capitalize block text-sm font-medium text-gray-700 mb-1",
        props.className
      )}
    >
      {translatedFieldName ?? content ?? splitCamelCaseToLowercase(fieldName)}{" "}
      {!translatedFieldName && ":"}
    </label>
  );
}
