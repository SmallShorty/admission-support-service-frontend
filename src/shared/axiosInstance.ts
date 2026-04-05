import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * Configures interceptors for a specific Axios instance
 * Includes: Auth token injection and Development logging
 */
const setupInterceptors = (
  instance: AxiosInstance,
  serviceName: string,
): AxiosInstance => {
  // --- Request Interceptor ---
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request only in development mode
    if (import.meta.env.DEV) {
      console.groupCollapsed(
        `%c🚀 [${serviceName}] Request: ${config.method?.toUpperCase()} ${config.url}`,
        "color: #61dafb; font-weight: bold;",
      );
      console.log("Base URL:", config.baseURL);
      console.log("Full URL:", `${config.baseURL}${config.url}`);
      if (config.data) console.log("Payload:", config.data);
      console.groupEnd();
    }

    return config;
  });

  // --- Response Interceptor ---
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful response in development
      if (import.meta.env.DEV) {
        console.log(
          `%c✅ [${serviceName}] Success: ${response.status} ${response.config.url}`,
          "color: #4caf50; font-weight: bold;",
        );
      }
      return response;
    },
    (error) => {
      const status = error.response?.status || "NETWORK_ERROR";
      const message = error.message || "Unknown error";
      const url = error.config?.url || "unknown url";

      // Error logging for debugging
      console.error(
        `%c❌ [${serviceName}] Error ${status}: ${url}`,
        "color: #f44336; font-weight: bold;",
        message,
      );

      // TODO: Add Toast notification logic here

      return Promise.reject(error);
    },
  );

  return instance;
};

// --- API Instances Initialization ---

export const coreApi = setupInterceptors(
  axios.create({ baseURL: import.meta.env.VITE_CORE_API_URL }),
  "CORE",
);

export const applicantsApi = setupInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_APPLICANTS_MOCK_SERVICE_API_URL,
  }),
  "APPLICANTS",
);

export const ticketsApi = setupInterceptors(
  axios.create({ baseURL: import.meta.env.VITE_TICKETS_PROCCESSOR_API_URL }),
  "TICKETS",
);
