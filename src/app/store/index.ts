import { configureStore, Middleware } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { rootReducer } from "./rootReducer";

// --- Middleware Configuration ---

const middlewares: Middleware[] = [];

// Configure logger for development mode
if (import.meta.env.DEV) {
  const logger = createLogger({
    collapsed: true, // Collapse logs by default to keep console clean
    duration: true, // Show how long each action took to process
    timestamp: true, // Show execution time
    colors: {
      title: () => "#139BFE",
      prevState: () => "#9E9E9E",
      action: () => "#141113",
      nextState: () => "#4CAF50",
      error: () => "#F20404",
    },
  });

  middlewares.push(logger);
}

// --- Store Initialization ---

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Essential for Redux Persist compatibility
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }).concat(middlewares),

  // Explicitly enable DevTools only in development
  devTools: import.meta.env.DEV,
});

// --- Types ---

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
