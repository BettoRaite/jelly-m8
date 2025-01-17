import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("profiles", "./routes/profiles.tsx"),
] satisfies RouteConfig;
