import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

/* ─────────────────────────────────────────────────────────
   PWA service worker registration (offline support).
   Registered in production only, to avoid interfering with
   the development server and hot reloading.
────────────────────────────────────────────────────────── */
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .then((registration) => {
        // eslint-disable-next-line no-console
        console.info("Service worker registered:", registration.scope);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Service worker registration failed:", error);
      });
  });
}
