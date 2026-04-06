import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store";
import { Provider } from "@/shared/components/ui/provider";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthInitializer } from "./shared/components/AuthInitializer";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const root = createRoot(container);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <Provider>
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </Provider>
      </ReduxProvider>
    </QueryClientProvider>
  </StrictMode>,
);
