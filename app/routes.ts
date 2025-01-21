import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/mainLayout.tsx", [
    index("./routes/home.tsx"),
    route("profiles", "./routes/profiles.tsx"),
    route("login", "./routes/login.tsx"),
    route("dashboard", "./routes/adminDashboard.tsx"),
  ]),
] satisfies RouteConfig;
