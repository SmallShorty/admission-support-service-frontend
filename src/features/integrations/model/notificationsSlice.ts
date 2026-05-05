import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationDto } from "./types";

export type NotificationItem = NotificationDto & { integrationName: string };

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const MAX_ITEMS = 50;

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    prependNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
      if (state.items.length > MAX_ITEMS) {
        state.items.length = MAX_ITEMS;
      }
      state.unreadCount += 1;
    },
    resetUnread(state) {
      state.unreadCount = 0;
    },
  },
});

export const { prependNotification, resetUnread } = notificationsSlice.actions;
export default notificationsSlice.reducer;
