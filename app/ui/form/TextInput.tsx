import type { CreateProfileSchema } from "@/lib/schemas/profiles.schema";
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
}
export function TextInput<T extends FieldValues>({
  errors,
  fieldName,
  register,
}: Props<T>) {
  return (
    <div className="mb-4">
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {fieldName}:
      </label>
      <input
        {...register(fieldName, { required: "Name is required" })}
        type="text"
        id="name"
        className={`text-sm mt-1 block w-full p-2 border ${
          errors.name ? "border-red-500" : "border-gray-200"
        } rounded-md focus:outline-none focus:border-gray-400 duration-300`}
        placeholder="Name"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-500">
          {errors.name.message as unknown as string}
        </p>
      )}
    </div>
  );
}
