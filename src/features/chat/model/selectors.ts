import { RootState } from "@/app/store";
import { TicketMessage } from "./types";

// ========== Messages Selectors ==========
export const selectMessagesByTicket = (state: RootState) =>
  state.chat.messagesByTicket;

export const selectMessagesForTicket = (
  state: RootState,
  ticketId: string,
): TicketMessage[] => state.chat.messagesByTicket[ticketId] || [];

export const selectLastMessageForTicket = (
  state: RootState,
  ticketId: string,
): TicketMessage | null => {
  const messages = state.chat.messagesByTicket[ticketId];
  return messages && messages.length > 0 ? messages[messages.length - 1] : null;
};

export const selectHasMoreMessages = (
  state: RootState,
  ticketId: string,
): boolean => state.chat.hasMoreMessages[ticketId] ?? false;

export const selectNextCursor = (
  state: RootState,
  ticketId: string,
): string | null => state.chat.nextCursors[ticketId] ?? null;

export const selectMessagesLoading = (
  state: RootState,
  ticketId: string,
): boolean => state.chat.loadingMessages[ticketId] ?? false;

// ========== Chat Management Selectors ==========
export const selectOpenChats = (state: RootState): string[] =>
  state.chat.openChats;
export const selectActiveChatId = (state: RootState): string | null =>
  state.chat.activeChatId;
export const selectIsChatOpen = (state: RootState, ticketId: string): boolean =>
  state.chat.openChats.includes(ticketId);

export const selectIsActiveChat = (
  state: RootState,
  ticketId: string,
): boolean => state.chat.activeChatId === ticketId;

// ========== WebSocket Selectors ==========
export const selectIsConnected = (state: RootState): boolean =>
  state.chat.isConnected;

// ========== Typing Indicators Selectors ==========
export const selectTypingUsers = (
  state: RootState,
  ticketId: string,
): string[] => state.chat.typingUsers[ticketId] || [];

export const selectIsUserTyping = (
  state: RootState,
  ticketId: string,
  userId: string,
): boolean => state.chat.typingUsers[ticketId]?.includes(userId) ?? false;

export const selectHasTypingUsers = (
  state: RootState,
  ticketId: string,
): boolean => (state.chat.typingUsers[ticketId]?.length ?? 0) > 0;

export const selectTypingNames = (
  state: RootState,
  ticketId: string,
  users: Record<string, any>,
): string[] => {
  const userIds = state.chat.typingUsers[ticketId] || [];
  return userIds
    .map((id) => {
      const user = users[id];
      return user ? `${user.firstName} ${user.lastName}` : "";
    })
    .filter(Boolean);
};

// ========== Unread Counts Selectors ==========
export const selectUnreadCount = (state: RootState, ticketId: string): number =>
  state.chat.unreadCounts[ticketId] ?? 0;

export const selectTotalUnreadCount = (state: RootState): number =>
  Object.values(state.chat.unreadCounts).reduce((sum, count) => sum + count, 0);

export const selectUnreadTickets = (state: RootState): string[] =>
  Object.entries(state.chat.unreadCounts)
    .filter(([_, count]) => count > 0)
    .map(([ticketId]) => ticketId);

// ========== Helper Selectors ==========
export const selectChatStateForTicket = (
  state: RootState,
  ticketId: string,
) => ({
  messages: selectMessagesForTicket(state, ticketId),
  hasMore: selectHasMoreMessages(state, ticketId),
  loading: selectMessagesLoading(state, ticketId),
  unreadCount: selectUnreadCount(state, ticketId),
  isOpen: selectIsChatOpen(state, ticketId),
  isActive: selectIsActiveChat(state, ticketId),
  hasTyping: selectHasTypingUsers(state, ticketId),
});
