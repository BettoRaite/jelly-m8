import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "./FormFieldContext";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from "react";
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
  } = useFormContext();
  const { fieldName } = useFormFieldContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState(defaultImage);

  const fileInput = fileInputRef.current;
  const placeholder = fileInput?.files?.[0]?.name ?? "Выбери своё фото";

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    setValue(fieldName, fileInputRef.current?.files);
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
            className="w-24 h-24 border border-gray-300 rounded-full mb-2"
          />
        </div>
      )}
      <input
        className="hidden"
        {...inputProps}
        {...register(fieldName)}
        type="file"
        id={fieldName}
        ref={fileInputRef}
        placeholder={fieldName}
        onChange={type === "display-image" ? handleFileChange : () => {}}
      />
      <button
        type="button"
        onClick={handleFileInputClick}
        className={`text-sm mt-1 block w-full p-2 border ${
          errors[fieldName] ? "border-red-500" : "border-gray-200"
        } rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200`}
      >
        {placeholder}
      </button>
    </div>
  );
}
