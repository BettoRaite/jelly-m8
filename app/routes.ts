import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/main.layout.tsx", [
    index("./routes/home.page.tsx"),
    route("profiles", "./routes/profiles.page.tsx"),
    route("login", "./routes/login.page.tsx"),
    route("dashboard", "./routes/adminDashboard.page.tsx"),
  ]),
] satisfies RouteConfig;
