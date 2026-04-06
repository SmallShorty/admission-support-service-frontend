import { coreApi } from "@/shared/axiosInstance";
import { Account, AuthResponse } from "../model/types";

export const authApi = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const { data } = await coreApi.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await coreApi.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return data;
  },

  getProfile: async (): Promise<Account> => {
    const { data } = await coreApi.get<Account>("/auth/profile");
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refreshToken");
    await coreApi.post("/auth/logout", { refreshToken });
  },
};
