import { createContext, useContext } from "react";
import type { Path } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

type FormFieldContextModel<T extends FieldValues> = {
  fieldName: Path<T>;
};

export const FormFieldContext = createContext<
  FormFieldContextModel<FieldValues>
>({} as FormFieldContextModel<FieldValues>);

export const useFormFieldContext = <T extends FieldValues>() => {
  return useContext(FormFieldContext) as FormFieldContextModel<T>;
};
