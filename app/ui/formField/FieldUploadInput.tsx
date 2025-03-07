import { useRef, useState, type ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";

type Props = {
  containerClassName?: string;
  type?: "display-image" | "default";
  inputProps?: ComponentProps<"input">;
  defaultImage?: string;
};

export default function FieldUploadInput({
  containerClassName,
  type = "default",
  inputProps = {},
  defaultImage = "",
}: Props) {
  const {
    formState: { errors },
    register,
    setValue,
    control,
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const defaultPlaceholder = "Выбери своё фото";
  const [fileName, setFileName] = useState(defaultPlaceholder);

  const handleSetImage = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file && type === "display-image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // Set the image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {type === "display-image" && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt=""
            className="w-24 h-24 border-4 border-gray-300 rounded-full mb-2 object-cover"
          />
        </div>
      )}
      <Controller
        control={control}
        name={fieldName}
        render={({ field: { onChange, onBlur, ref } }) => (
          <div className="relative flex justify-center mt-2">
            {/* Custom file input button */}
            <label
              htmlFor={fieldName}
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
            >
              {fileName || defaultPlaceholder}
            </label>
            {/* Hidden file input */}
            <input
              accept="image/*"
              className="hidden"
              {...inputProps}
              type="file"
              id={fieldName}
              ref={(e) => {
                ref(e); // Assign the ref to the field
                fileInputRef.current = e; // Assign the ref to your custom ref if needed
              }}
              onChange={(e) => {
                if (type === "display-image") {
                  handleSetImage();
                }
                setFileName(e.target?.files?.[0]?.name ?? defaultPlaceholder);
                onChange(e.target.files); // Pass the file(s) to the form
              }}
              onBlur={onBlur}
            />
            {/* Display selected file name */}
          </div>
        )}
      />
    </div>
  );
}
