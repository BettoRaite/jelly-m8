import type { ReactNode } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { TextInput } from "../form/TextInput";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";
import { FormFieldContext } from "./FormFieldContext";
import FieldTextInput from "./FieldTextInput";
import FieldTextArea from "./FieldTextArea";
import FieldSelectInput from "./FieldSelectInput";
import FieldUploadInput from "./FieldUploadInput";
import { joinClasses } from "@/lib/utils/strings";

type Props<T extends FieldValues> = {
  children: ReactNode;
  fieldName: Path<T>;
  className?: string;
};

export function FormField<T extends FieldValues>({
  children,
  fieldName,
  className,
}: Props<T>) {
  return (
    <FormFieldContext.Provider value={{ fieldName }}>
      <div
        className={joinClasses(
          "placeholder:text-slate-400 text-slate-700 text-[0.95rem]",
          className
        )}
      >
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

FormField.TextArea = FieldTextArea;
FormField.TextInput = FieldTextInput;
FormField.Error = FieldError;
FormField.Label = FieldLabel;
FormField.Select = FieldSelectInput;
FormField.Upload = FieldUploadInput;
