import SearchBar from "@/components/SearchBar";
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
export const constructSearchPattern = <T>(
  searchPatternConfig: Record<keyof T | string, unknown>
) => {
  const entries = Object.entries(searchPatternConfig);
  const len = entries.length;
  if (len === 0) {
    return;
  }
  let searchPattern = "";
  for (let i = 0; i < len; ++i) {
    const [key, value] = entries[i];
    if (value) {
      searchPattern += `${key}=${value}${i === len - 1 ? "" : "|"}`;
    }
  }
  return searchPattern;
};
const DIRECTIONS = ["desc", "asc"];
export const constructSortConfig = <T>(
  sort: Record<keyof T | string, "desc" | "asc" | unknown>
): {
  desc?: string;
  asc?: string;
} => {
  const config: Record<"desc" | "asc" | string, string> = {};
  for (const [key, value] of Object.entries(sort)) {
    if (typeof value !== "string") continue;
    const direction = value.trim();
    if (!DIRECTIONS.includes(direction)) continue;
    if (!config[direction]) config[direction] = "";
    config[direction] += `${config[direction] ? "," : ""}${key}`;
  }
  console.log(config);
  return config;
};
