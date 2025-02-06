import classnames from "classnames";
export const joinClasses = classnames;

export const splitCamelCaseToLowercase = (str: string) => {
  return str
    .split(/(?=[A-Z])/)
    .join(" ")
    .toLowerCase();
};

/**
 * Capitalizes the first character of a string.
 * @param {string} str - The input string.
 * @returns {string} - The string with the first character capitalized.
 */
export const capitalizeFirstChar = (str: string) => {
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }
  if (str.length === 0) return str; // Return empty string as is
  return str.charAt(0).toUpperCase() + str.slice(1);
};
