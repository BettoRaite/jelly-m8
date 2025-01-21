import { config } from "./config";

export const constructFetchUrl = (route: string) =>
  `${config.server.url}${route}`;
