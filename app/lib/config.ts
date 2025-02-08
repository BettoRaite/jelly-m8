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
  createProfileKey(userId: number) {
    return [this.PROFILES, userId.toString()];
  },
  createProfileKeyWithParams(userId: number, params: Record<string, any>) {
    return [this.PROFILES, userId.toString(), params];
  },

  createUserKey(userId: number) {
    return [this.USERS, userId.toString()];
  },
};

export const config = {
  server: {
    url: "http://localhost:5000/api/v1",
  },
};
