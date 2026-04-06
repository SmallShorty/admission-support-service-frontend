import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
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
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      console.error(
        `%c❌ [${serviceName}] Error ${status || "NETWORK"}: ${originalRequest?.url}`,
        "color: #F20404; font-weight: bold;",
        error.message,
      );
      if (status === 401 && !originalRequest?._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          })
            .then((token) => {
              if (originalRequest?.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest!);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest!._retry = true;
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_CORE_API_URL}/auth/refresh`,
            {
              refreshToken,
            },
          );
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          processQueue(null, accessToken);
          return instance(originalRequest!);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );
  return instance;
};
export const coreApi = setupInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_CORE_API_URL,
  }),
  "CORE",
);
export const applicantsApi = setupInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_APPLICANTS_MOCK_SERVICE_API_URL,
  }),
  "APPLICANTS",
);
export const ticketsApi = setupInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_TICKETS_PROCCESSOR_API_URL,
  }),
  "TICKETS",
);
