import { coreApi } from "@/shared/axiosInstance";
import { Account, AuthResponse } from "../model/types";

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await coreApi.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  getProfile: async (): Promise<Account> => {
    const { data } = await coreApi.get<Account>("/auth/profile");
    return data;
  },
};
