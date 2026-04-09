import { coreApi } from "@/shared/axiosInstance";
import {
  Account,
  AccountPaginatedResponse,
  AuthResponse,
  CreateAccountDto,
  GetAccountsFilters,
  UpdateAccountDto,
} from "../model/types";

export const accountApi = {
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

  getAccounts: async (
    params: GetAccountsFilters,
  ): Promise<AccountPaginatedResponse> => {
    const { data } = await coreApi.get<AccountPaginatedResponse>("/accounts", {
      params,
    });
    return data;
  },

  register: async (dto: CreateAccountDto): Promise<Account> => {
    const { data } = await coreApi.post<Account>("/auth/register", dto);
    return data;
  },

  updateAccount: async (id: string, dto: UpdateAccountDto): Promise<Account> => {
    const { data } = await coreApi.patch<Account>(`/accounts/${id}`, dto);
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refreshToken");
    await coreApi.post("/auth/logout", { refreshToken });
  },
};
