import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

/**
 * Configures interceptors for a specific Axios instance
 * Includes: Auth token injection and Development logging
 */
const logRequest = (service: string, config: InternalAxiosRequestConfig) => {
  if (!import.meta.env.DEV) return;

  console.groupCollapsed(
    `%c🚀 [${service}] ${config.method?.toUpperCase()} -> ${config.url}`,
    "color: #139BFE; font-weight: bold;",
  );
  console.log("Full URL:", `${config.baseURL}${config.url}`);
  if (config.data) console.log("Payload:", config.data);
  if (config.params) console.log("Params:", config.params);
  console.groupEnd();
};

export const setupInterceptors = (
  instance: AxiosInstance,
  serviceName: string,
): AxiosInstance => {
  // --- Request Interceptor ---
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      logRequest(serviceName, config);
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // --- Response Interceptor ---
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (import.meta.env.DEV) {
        console.log(
          `%c✅ [${serviceName}] Success: ${response.status}`,
          "color: #4CAF50; font-weight: bold;",
        );
      }
      return response;
    },
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config;

      // Логирование ошибки
      console.error(
        `%c❌ [${serviceName}] Error ${status || "NETWORK"}: ${originalRequest?.url}`,
        "color: #F20404; font-weight: bold;",
        error.message,
      );

      // --- Обработка 401 (Unauthorized) ---
      if (status === 401) {
        // Здесь можно вызвать logout() из Redux или просто очистить storage
        localStorage.removeItem("accessToken");

        // Если ты не на странице логина — можно редиректнуть
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      // TODO: Вызов toast.error(error.message) здесь будет очень кстати

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
