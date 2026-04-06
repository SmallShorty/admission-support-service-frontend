// src/features/tickets/api/ticketsApi.ts
import { coreApi } from "@/shared/axiosInstance";
import {
  Ticket,
  TicketListItem,
  TakeTicketResponse,
  EscalateTicketPayload,
  UpdateTicketStatusPayload,
  AllQueueFilters,
} from "../model/types";
import { PaginatedResponse } from "@/shared/types/pagination";

export const ticketsApi = {
  // Получить мои активные тикеты (IN_PROGRESS, ESCALATED)
  getMyTickets: async (): Promise<Ticket[]> => {
    const { data } = await coreApi.get<Ticket[]>("/tickets/my");
    return data;
  },

  // Получить доступную очередь (NEW, без агента)
  getAvailableQueue: async (
    limit: number = 50,
    offset: number = 0,
  ): Promise<PaginatedResponse<TicketListItem>> => {
    const { data } = await coreApi.get<PaginatedResponse<TicketListItem>>(
      "/tickets/available",
      {
        params: { limit, offset },
      },
    );
    return data;
  },

  // Получить общую очередь (только для ADMIN/SUPERVISOR)
  getAllQueue: async (
    limit: number = 50,
    offset: number = 0,
    filters?: AllQueueFilters,
  ): Promise<PaginatedResponse<Ticket>> => {
    const { data } = await coreApi.get<PaginatedResponse<Ticket>>(
      "/tickets/queue/all",
      {
        params: {
          limit,
          offset,
          status: filters?.status?.join(","),
          agentId: filters?.agentId,
        },
      },
    );
    return data;
  },

  // Взять тикет в работу
  takeTicket: async (ticketId: string): Promise<TakeTicketResponse> => {
    const { data } = await coreApi.post<TakeTicketResponse>(
      `/tickets/${ticketId}/take`,
    );
    return data;
  },

  // Эскалировать тикет
  escalateTicket: async (
    ticketId: string,
    payload: EscalateTicketPayload,
  ): Promise<Ticket> => {
    const { data } = await coreApi.post<Ticket>(
      `/tickets/${ticketId}/escalate`,
      payload,
    );
    return data;
  },

  // Обновить статус тикета
  updateTicketStatus: async (
    ticketId: string,
    payload: UpdateTicketStatusPayload,
  ): Promise<Ticket> => {
    const { data } = await coreApi.patch<Ticket>(
      `/tickets/${ticketId}/status`,
      payload,
    );
    return data;
  },

  // Получить детали тикета
  getTicketById: async (ticketId: string): Promise<Ticket> => {
    const { data } = await coreApi.get<Ticket>(`/tickets/${ticketId}`);
    return data;
  },
};
