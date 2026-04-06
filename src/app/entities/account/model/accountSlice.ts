import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "./types";
interface AccountState {
  data: Account | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const initialState: AccountState = {
  data: null,
  accessToken: accessToken,
  refreshToken: refreshToken,
  isAuth: false,
  isLoading: true,
  isInitialized: false,
};
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (
      state,
      action: PayloadAction<{
        account: Account;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.data = action.payload.account;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuth = true;
      state.isLoading = false;
      state.isInitialized = true;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.data = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuth = false;
      state.isLoading = false;
      state.isInitialized = true;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      if (action.payload === true && state.isLoading === true) {
        state.isLoading = false;
      }
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
  },
});
export const { setAccount, logout, setLoading, setInitialized, updateTokens } =
  accountSlice.actions;
export default accountSlice.reducer;
