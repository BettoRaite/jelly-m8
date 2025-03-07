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

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
            className="w-24 h-24 border border-gray-300 rounded-full mb-2 object-cover"
          />
        </div>
      )}
      <Controller
        control={control}
        name={fieldName}
        render={({ field: { onChange, onBlur, ref } }) => (
          <input
            className="hidden"
            {...inputProps}
            type="file"
            id={fieldName}
            ref={(e) => {
              ref(e); // Assign the ref to the field
              fileInputRef.current = e; // Assign the ref to your custom ref if needed
            }}
            placeholder={fieldName}
            onChange={(e) => {
              if (type === "display-image") {
                handleSetImage();
              }
              setFileName(e.target?.files?.[0]?.name ?? defaultPlaceholder);
              onChange(e.target.files); // Pass the file(s) to the form
            }}
            onBlur={onBlur}
          />
        )}
      />
      <button
        type="button"
        onClick={handleFileInputClick}
        className={`text-sm mt-1 block w-full p-2 border ${
          errors[fieldName] ? "border-red-500" : "border-gray-200"
        } rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200`}
      >
        {fileName}
      </button>
    </div>
  );
}
