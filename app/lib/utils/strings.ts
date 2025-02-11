import classnames from "classnames";
import { param } from "motion/react-client";
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

/**
 * Parses a string and constructs a query string.
 * @param {string} str - The input string with the pattern `param=value|param=value`.
 * @returns {string} - The constructed query string starting with `?`.
 * @throws {Error} - If the input string is invalid or contains empty parameters/values.
 */
export const constructQueryString = (
  str: string,
  {
    allowEmpty = true,
  }: {
    allowEmpty?: boolean;
  } = {}
): string => {
  if (!str) {
    if (!allowEmpty) throw new Error("Input string cannot be empty.");
    return "";
  }

  const queryParams = str.split("|").map((pair) => {
    const [param, value] = pair.split("=");
    if (!value.trim()) {
      return "";
    }
    if (!param?.trim()) {
      throw new Error(
        `Invalid input string: "${str}". Expected format: param=value|param=value.`
      );
    }

    return `${param.trim()}=${value.trim()}`;
  });

  const queryString = `?${queryParams.join("&")}`;
  return queryString;
};
