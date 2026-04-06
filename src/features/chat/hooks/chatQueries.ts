// src/features/chat/hooks/chatQueries.ts
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { chatSocket } from "../api/chatSocket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setMessages,
  addOldMessages,
  addMessage,
  setMessagesLoading,
  setUnreadCount,
} from "../model/chatSlice";
import {
  TicketMessage,
  SendMessagePayload,
  MessageType,
  DeliveryStatus,
} from "../model/types";

// Query Keys
export const chatQueryKeys = {
  messages: (ticketId: string) => ["chat", "messages", ticketId] as const,
  unreadCount: (ticketId: string) => ["chat", "unread", ticketId] as const,
};

// Hook для получения истории сообщений с пагинацией (бесконечный скролл)
export const useTicketMessages = (ticketId: string, limit: number = 50) => {
  const dispatch = useAppDispatch();
  const hasMore = useAppSelector(
    (state) => state.chat.hasMoreMessages[ticketId] ?? true,
  );
  const nextCursor = useAppSelector(
    (state) => state.chat.nextCursors[ticketId] ?? null,
  );

  return useInfiniteQuery({
    queryKey: chatQueryKeys.messages(ticketId),
    queryFn: async ({ pageParam = null }) => {
      dispatch(setMessagesLoading({ ticketId, loading: true }));
      const response = await chatApi.getMessages(ticketId, limit, pageParam);

      if (!pageParam) {
        // Первая загрузка
        dispatch(
          setMessages({
            ticketId,
            messages: response.items,
            hasMore: response.hasMore,
            nextCursor: response.nextCursor,
          }),
        );
      } else {
        // Подгрузка старых сообщений
        dispatch(
          addOldMessages({
            ticketId,
            messages: response.items,
            hasMore: response.hasMore,
            nextCursor: response.nextCursor,
          }),
        );
      }

      return response;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null as string | null,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook для отправки сообщения
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.data);
  const userRole = useAppSelector((state) => state.account.data?.role);

  return useMutation({
    mutationFn: async ({
      ticketId,
      content,
    }: {
      ticketId: string;
      content: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Определяем тип автора
      const authorType: MessageType =
        userRole === "APPLICANT"
          ? MessageType.FROM_CUSTOMER
          : MessageType.FROM_AGENT;

      const payload: SendMessagePayload = {
        ticketId,
        authorId: user.id,
        content,
        authorType,
      };

      // Оптимистичное обновление
      const tempMessage: TicketMessage = {
        id: Date.now(),
        ticketId,
        authorId: user.id,
        authorType,
        content,
        status: DeliveryStatus.SENT,
        deliveredAt: null,
        seenAt: null,
        createdAt: new Date().toISOString(),
        author: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };

      dispatch(addMessage(tempMessage));

      // Отправляем через WebSocket
      chatSocket.sendMessage(payload);

      return tempMessage;
    },
    onSuccess: (_, { ticketId }) => {
      // Инвалидируем кэш после успешной отправки
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messages(ticketId),
      });
    },
  });
};

// Hook для получения непрочитанных сообщений
export const useUnreadCount = (ticketId: string) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: chatQueryKeys.unreadCount(ticketId),
    queryFn: async () => {
      const { count } = await chatApi.getUnreadCount(ticketId);
      dispatch(setUnreadCount({ ticketId, count }));
      return count;
    },
    enabled: !!ticketId,
    staleTime: 30 * 1000,
    refetchInterval: 30000, // Каждые 30 секунд
  });
};

// Hook для отметки сообщений как прочитанных
export const useMarkMessagesRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      messageIds,
    }: {
      ticketId: string;
      messageIds: number[];
    }) => chatApi.markAsRead(ticketId, messageIds),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.unreadCount(ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messages(ticketId),
      });
    },
  });
};

// Hook для управления WebSocket соединением
export const useChatConnection = () => {
  const user = useAppSelector((state) => state.account.data);
  const myTickets = useAppSelector((state) => state.tickets.myTickets.items);
  const openChats = useAppSelector((state) => state.chat.openChats);

  // Подключение при авторизации
  React.useEffect(() => {
    if (user?.id && user?.role) {
      chatSocket.connect(user.id, user.role);
    }

    return () => {
      chatSocket.disconnect();
    };
  }, [user?.id, user?.role]);

  // Подписка на мои тикеты
  React.useEffect(() => {
    myTickets.forEach((ticket) => {
      chatSocket.joinTicketChat(ticket.id);
    });
  }, [myTickets]);

  // Подписка на открытые чаты
  React.useEffect(() => {
    openChats.forEach((ticketId) => {
      chatSocket.joinTicketChat(ticketId);
    });
  }, [openChats]);

  return {
    isConnected: chatSocket.isConnected(),
    sendTypingStatus: chatSocket.sendTypingStatus.bind(chatSocket),
    markMessagesRead: chatSocket.markMessagesRead.bind(chatSocket),
    joinTicketChat: chatSocket.joinTicketChat.bind(chatSocket),
    leaveTicketChat: chatSocket.leaveTicketChat.bind(chatSocket),
  };
};

// Импортируем React для useEffect
import React from "react";
import { chatApi } from "./chatApi";
