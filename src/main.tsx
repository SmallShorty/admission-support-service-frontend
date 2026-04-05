import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store";
import { Provider } from "@/components/ui/provider";
import { router } from "./routes";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </ReduxProvider>
  </StrictMode>,
);
