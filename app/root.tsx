import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Triodion&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Caveat:wght@400..700&family=Comfortaa:wght@300..700&family=Jost:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Pacifico&family=Triodion&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "prefetch",
    as: "image",
    href: "/pattern.jpg",
  },
  {
    rel: "prefetch",
    as: "image",
    href: "/flowersleft.png",
  },
  {
    rel: "prefetch",
    as: "image",
    href: "/flowersright.png",
  },
  {
    rel: "prefetch",
    as: "image",
    href: "/tokyonight.jpg",
  },
  {
    rel: "preload",
    as: "image",
    href: "/nihongoyama.jpg",
  },
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Jellym8🐙" },
    { name: "8TH OF MARCH", content: "Congrats with 8th of March" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-transparent font-nunito">
        {children}
        <Analytics />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
