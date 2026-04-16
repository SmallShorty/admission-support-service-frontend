// src/features/chat/model/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, TicketMessage, VariableResolutionError } from "./types";

const initialState: ChatState = {
  messagesByTicket: {},
  openChats: [],
  activeChatId: null,
  isConnected: false,
  typingUsers: {},
  unreadCounts: {},
  hasMoreMessages: {},
  nextCursors: {},
  loadingMessages: {},
  variableError: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // ========== Messages Management ==========

    // Установить сообщения для тикета (при первой загрузке)
    setMessages: (
      state,
      action: PayloadAction<{
        ticketId: string;
        messages: TicketMessage[];
        hasMore: boolean;
        nextCursor: string | null;
      }>,
    ) => {
      const { ticketId, messages, hasMore, nextCursor } = action.payload;
      state.messagesByTicket[ticketId] = messages;
      state.hasMoreMessages[ticketId] = hasMore;
      state.nextCursors[ticketId] = nextCursor;
      state.loadingMessages[ticketId] = false;
    },

    // Добавить старые сообщения (при подгрузке истории)
    addOldMessages: (
      state,
      action: PayloadAction<{
        ticketId: string;
        messages: TicketMessage[];
        hasMore: boolean;
        nextCursor: string | null;
      }>,
    ) => {
      const { ticketId, messages, hasMore, nextCursor } = action.payload;
      const existingMessages = state.messagesByTicket[ticketId] || [];
      state.messagesByTicket[ticketId] = [...messages, ...existingMessages];
      state.hasMoreMessages[ticketId] = hasMore;
      state.nextCursors[ticketId] = nextCursor;
      state.loadingMessages[ticketId] = false;
    },

    // Добавить новое сообщение (при получении через WebSocket или после отправки)
    addMessage: (state, action: PayloadAction<TicketMessage>) => {
      const message = action.payload;
      if (!state.messagesByTicket[message.ticketId]) {
        state.messagesByTicket[message.ticketId] = [];
      }

      // Избегаем дубликатов
      const exists = state.messagesByTicket[message.ticketId].some(
        (m) => m.id === message.id,
      );
      if (!exists) {
        state.messagesByTicket[message.ticketId].push(message);
      }
    },

    // Обновить статус сообщения (SENT -> DELIVERED -> SEEN)
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        ticketId: string;
        messageId: number;
        status: string;
        seenAt?: string;
      }>,
    ) => {
      const { ticketId, messageId, status, seenAt } = action.payload;
      const messages = state.messagesByTicket[ticketId];
      if (messages) {
        const message = messages.find((m) => m.id === messageId);
        if (message) {
          message.status = status as any;
          if (seenAt) {
            message.seenAt = seenAt;
          }
        }
      }
    },

    // ========== Chat Management ==========

    // Открыть чат (добавить вкладку)
    openChat: (state, action: PayloadAction<string>) => {
      const ticketId = action.payload;
      if (!state.openChats.includes(ticketId)) {
        state.openChats.push(ticketId);
      }
      state.activeChatId = ticketId;
      // Сбросить счетчик непрочитанных при открытии
      if (state.unreadCounts[ticketId]) {
        state.unreadCounts[ticketId] = 0;
      }
    },

    // Закрыть чат (удалить вкладку)
    closeChat: (state, action: PayloadAction<string>) => {
      const ticketId = action.payload;
      state.openChats = state.openChats.filter((id) => id !== ticketId);
      if (state.activeChatId === ticketId) {
        state.activeChatId = state.openChats[0] || null;
      }
    },

    // Переключить активный чат
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
      if (action.payload && state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },

    // Закрыть все чаты
    closeAllChats: (state) => {
      state.openChats = [];
      state.activeChatId = null;
    },

    // ========== WebSocket Status ==========

    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // ========== Typing Indicators ==========

    setTypingStatus: (
      state,
      action: PayloadAction<{
        ticketId: string;
        userId: string;
        isTyping: boolean;
      }>,
    ) => {
      const { ticketId, userId, isTyping } = action.payload;
      if (!state.typingUsers[ticketId]) {
        state.typingUsers[ticketId] = [];
      }

      if (isTyping) {
        if (!state.typingUsers[ticketId].includes(userId)) {
          state.typingUsers[ticketId].push(userId);
        }
      } else {
        state.typingUsers[ticketId] = state.typingUsers[ticketId].filter(
          (id) => id !== userId,
        );
      }
    },

    clearTypingStatus: (state, action: PayloadAction<string>) => {
      const ticketId = action.payload;
      delete state.typingUsers[ticketId];
    },

    // ========== Unread Counts ==========

    incrementUnreadCount: (
      state,
      action: PayloadAction<{ ticketId: string; increment?: number }>,
    ) => {
      const { ticketId, increment = 1 } = action.payload;
      // Не увеличиваем счетчик если чат активен
      if (state.activeChatId !== ticketId) {
        state.unreadCounts[ticketId] =
          (state.unreadCounts[ticketId] || 0) + increment;
      }
    },

    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const ticketId = action.payload;
      state.unreadCounts[ticketId] = 0;
    },

    setUnreadCount: (
      state,
      action: PayloadAction<{ ticketId: string; count: number }>,
    ) => {
      const { ticketId, count } = action.payload;
      state.unreadCounts[ticketId] = count;
    },

    // ========== Loading States ==========

    setMessagesLoading: (
      state,
      action: PayloadAction<{ ticketId: string; loading: boolean }>,
    ) => {
      const { ticketId, loading } = action.payload;
      state.loadingMessages[ticketId] = loading;
    },

    // ========== Variable Errors ==========

    setVariableError: (state, action: PayloadAction<VariableResolutionError>) => {
      state.variableError = action.payload;
    },

    clearVariableError: (state) => {
      state.variableError = null;
    },

    // ========== Cleanup ==========

    clearChat: (state, action: PayloadAction<string>) => {
      const ticketId = action.payload;
      delete state.messagesByTicket[ticketId];
      delete state.hasMoreMessages[ticketId];
      delete state.nextCursors[ticketId];
      delete state.loadingMessages[ticketId];
      delete state.typingUsers[ticketId];
      delete state.unreadCounts[ticketId];
      state.openChats = state.openChats.filter((id) => id !== ticketId);
      if (state.activeChatId === ticketId) {
        state.activeChatId = state.openChats[0] || null;
      }
    },

    clearAllChats: (state) => {
      state.messagesByTicket = {};
      state.openChats = [];
      state.activeChatId = null;
      state.typingUsers = {};
      state.unreadCounts = {};
      state.hasMoreMessages = {};
      state.nextCursors = {};
      state.loadingMessages = {};
    },

    resetChatState: () => initialState,
  },
});

export const {
  // Messages
  setMessages,
  addOldMessages,
  addMessage,
  updateMessageStatus,

  // Chat Management
  openChat,
  closeChat,
  setActiveChat,
  closeAllChats,

  // WebSocket
  setConnected,

  // Typing
  setTypingStatus,
  clearTypingStatus,

  // Unread
  incrementUnreadCount,
  resetUnreadCount,
  setUnreadCount,

  // Loading
  setMessagesLoading,

  // Variable Errors
  setVariableError,
  clearVariableError,

  // Cleanup
  clearChat,
  clearAllChats,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
