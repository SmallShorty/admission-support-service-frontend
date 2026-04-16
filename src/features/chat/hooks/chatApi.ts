import { coreApi } from "@/shared/axiosInstance";
import {
  TicketMessage,
  MessagesResponse,
  SendMessagePayload,
  VariableResolvedDto,
} from "../model/types";

export const chatApi = {
  // Получить историю сообщений с cursor пагинацией
  getMessages: async (
    ticketId: string,
    limit: number = 50,
    cursor?: string | null,
  ): Promise<MessagesResponse> => {
    const { data } = await coreApi.get<MessagesResponse>(
      `/tickets/${ticketId}/messages`,
      {
        params: {
          limit,
          cursor: cursor || undefined,
        },
      },
    );
    return data;
  },

  // Отправить сообщение (через REST, как fallback если WebSocket недоступен)
  sendMessage: async (payload: SendMessagePayload): Promise<TicketMessage> => {
    const { data } = await coreApi.post<TicketMessage>(
      "/tickets/messages",
      payload,
    );
    return data;
  },

  // Отметить сообщения как прочитанные
  markAsRead: async (ticketId: string, messageIds: number[]): Promise<void> => {
    await coreApi.post(`/tickets/${ticketId}/messages/read`, { messageIds });
  },

  // Получить количество непрочитанных сообщений
  getUnreadCount: async (ticketId: string): Promise<{ count: number }> => {
    const { data } = await coreApi.get<{ count: number }>(
      `/tickets/${ticketId}/messages/unread`,
    );
    return data;
  },

  // Получить доступные переменные для подстановки
  getTicketVariables: async (ticketId: string): Promise<VariableResolvedDto[]> => {
    const { data } = await coreApi.get<VariableResolvedDto[]>(
      `/tickets/${ticketId}/variables`,
    );
    return data;
  },
};
