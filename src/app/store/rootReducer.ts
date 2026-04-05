import { combineReducers } from "@reduxjs/toolkit";
import accountReducer from "@/app/entities/account/model/accountSlice";

export const rootReducer = combineReducers({
  account: accountReducer,
});
