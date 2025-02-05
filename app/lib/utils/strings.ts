import classnames from "classnames";
export const joinClasses = classnames;

export const splitCamelCaseToLowercase = (str: string) => {
  return str
    .split(/(?=[A-Z])/)
    .join(" ")
    .toLowerCase();
};
