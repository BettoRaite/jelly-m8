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
    route("cards/tribute/:userId", "./routes/tribute.page.tsx"),
    route("users/:userId/profile", "./routes/profile.page.tsx"),
    layout("./routes/userDashboard/layout.tsx", [
      route("discovery", "./routes/userDashboard/discovery.page.tsx"),
      route(
        "compliments-feed",
        "./routes/userDashboard/complimentsFeed.page.tsx"
      ),
    ]),
  ]),
] satisfies RouteConfig;
