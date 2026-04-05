import { RootState } from "@/app/store";
import { AccountRole } from "./types";

export const selectAccount = (state: RootState) => state.account.data;
export const selectIsAuth = (state: RootState) => state.account.isAuth;
export const selectIsLoading = (state: RootState) => state.account.isLoading;

export const selectIsApplicant = (state: RootState) =>
  state.account.data?.role === AccountRole.APPLICANT;

export const selectFullName = (state: RootState) => {
  const account = state.account.data;
  if (!account) return "";
  return `${account.lastName} ${account.firstName} ${account.middleName ?? ""}`.trim();
};
