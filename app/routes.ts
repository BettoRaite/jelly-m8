import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./routes/main.layout.tsx", [
    index("./routes/home.page.tsx"),
    route("cards", "./routes/cards.page.tsx"),
    route("login", "./routes/login.page.tsx"),
    route("dashboard", "./routes/adminDashboard.page.tsx"),
    ...prefix("cards", [
      route("profiles/:profileId", "./routes/profile.page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
