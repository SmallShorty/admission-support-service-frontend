import { combineReducers } from "@reduxjs/toolkit";
import accountReducer from "@/app/entities/account/model/accountSlice";
import ticketsReducer from "@/features/tickets/model/ticketsSlice";
import chatReducer from "@/features/chat/model/chatSlice";
import notificationsReducer from "@/features/integrations/model/notificationsSlice";

export const rootReducer = combineReducers({
  account: accountReducer,
  tickets: ticketsReducer,
  chat: chatReducer,
  notifications: notificationsReducer,
});
