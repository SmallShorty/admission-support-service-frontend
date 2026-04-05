import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "./types";

interface AccountState {
  data: Account | null;
  accessToken: string | null;
  isAuth: boolean;
  isLoading: boolean;
}

const token = localStorage.getItem("accessToken");

const initialState: AccountState = {
  data: null,
  accessToken: token,
  isAuth: !!token,
  isLoading: !!token,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (
      state,
      action: PayloadAction<{ account: Account; accessToken: string }>,
    ) => {
      state.data = action.payload.account;
      state.accessToken = action.payload.accessToken;
      state.isAuth = true;
      state.isLoading = false;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.data = null;
      state.accessToken = null;
      state.isAuth = false;
      state.isLoading = false;
      localStorage.removeItem("accessToken");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAccount, logout, setLoading } = accountSlice.actions;
export default accountSlice.reducer;
