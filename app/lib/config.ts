import { QueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export const queryClient = new QueryClient();

export const queryKeys = {
  authKey: [uuidv4()],
  usersKey: [uuidv4()],
  profilesKey: [uuidv4()],
  complimentsKey: [uuidv4()],
};

export const QUERY_KEYS = {
  AUTH: "auth",
  USERS: "users",
  PROFILES: "profiles",
  COMPLIMENTS: "compliments",
  LIKES: "likes",
};

export const config = {
  server: {
    url: "https://jelly-m8-api.onrender.com/api/v1",
  },
};
