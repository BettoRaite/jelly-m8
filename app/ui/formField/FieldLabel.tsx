import { useFormFieldContext } from "./FormFieldContext";
type Props = {
  label?: string;
};
export default function FieldLabel({ label }: Props) {
  const { fieldName } = useFormFieldContext();
  return (
    <label
      htmlFor={fieldName}
      className="first-letter:capitalize block text-sm font-medium text-gray-700 mb-1"
    >
      {label ?? fieldName}:
    </label>
  );
}
