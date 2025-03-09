import { QueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export const queryClient = new QueryClient();

export const QUERY_KEYS = {
  AUTH: "auth",
  USERS: "users",
  PROFILES: "profiles",
  COMPLIMENTS: "compliments",
  LIKES: "likes",
  QUESTIONS: "questions",
};

export const config = {
  env: import.meta.env.ENV,
  server: {
    url: import.meta.env.VITE_API_BASE_URL,
  },
  video: {
    url: import.meta.env.VITE_VIDEO_URL,
  },
};
