import { config } from "./config";
import type { Methods } from "./types";

export const constructFetchUrl = (route: string) =>
  `${config.server.url}${route}`;

type FetchOptions = {
  method?: Methods;
  body?: FormData | Record<string, unknown>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

export async function fetchWithHandler<T>(
  route: string,
  options: FetchOptions = {},
  errorHandler?: (response: Response) => unknown
): Promise<T> {
  const { method = "GET", body, headers, credentials = "include" } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...headers,
    },
    credentials,
  };

  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body;
    } else {
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      };
    }
  }

  const response = await fetch(constructFetchUrl(route), fetchOptions);

  if (!response.ok) {
    throw new Error((await response.text()) || "Failed to fetch");
  }

  return response.json();
}
