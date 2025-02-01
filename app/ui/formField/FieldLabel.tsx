import { useFormFieldContext } from "./FormFieldContext";

export default function FieldLabel() {
  const { fieldName } = useFormFieldContext();
  return (
    <label
      htmlFor={fieldName}
      className="first-letter:capitalize block text-sm font-medium text-gray-700 mb-1"
    >
      {fieldName}:
    </label>
  );
}
