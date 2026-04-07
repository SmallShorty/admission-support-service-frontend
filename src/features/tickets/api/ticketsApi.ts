// src/features/tickets/api/ticketsApi.ts
import { coreApi } from "@/shared/axiosInstance";
import {
  TicketListItem,
  TakeTicketResponse,
  EscalateTicketPayload,
  UpdateTicketStatusPayload,
  AllQueueFilters,
  TicketFilters,
  TicketCounts,
  TicketDetail,
  TicketMessage,
} from "../model/types";
import { PaginatedResponse } from "@/shared/types/pagination";

export const ticketsApi = {
  // ========== Queue & List Operations ==========

  // Get my active tickets (IN_PROGRESS, ESCALATED)
  getMyTickets: async (): Promise<TicketListItem[]> => {
    const { data } = await coreApi.get<TicketListItem[]>("/tickets/my");
    return data;
  },

  // Get available queue (NEW, without agent)
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

  // Get all queue (ADMIN/SUPERVISOR only)
  getAllQueue: async (
    limit: number = 50,
    offset: number = 0,
    filters?: AllQueueFilters,
  ): Promise<PaginatedResponse<TicketListItem>> => {
    const { data } = await coreApi.get<PaginatedResponse<TicketListItem>>(
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

  // Get paginated tickets with filters (universal Kanban endpoint)
  getTickets: async (
    filters?: TicketFilters,
  ): Promise<PaginatedResponse<TicketListItem>> => {
    const { data } = await coreApi.get<PaginatedResponse<TicketListItem>>(
      "/tickets",
      {
        params: {
          status: filters?.status,
          agentId: filters?.agentId,
          limit: filters?.limit,
          offset: filters?.offset,
        },
      },
    );
    return data;
  },

  // Get ticket counts by status
  getTicketCounts: async (): Promise<TicketCounts> => {
    const { data } = await coreApi.get<TicketCounts>("/tickets/counts");
    return data;
  },

  // ========== Ticket Management ==========

  // Get ticket details with 360-degree data
  getTicketById: async (ticketId: string): Promise<TicketDetail> => {
    const { data } = await coreApi.get<TicketDetail>(`/tickets/${ticketId}`);
    return data;
  },

  // Take a ticket (assign to current agent)
  takeTicket: async (ticketId: string): Promise<TakeTicketResponse> => {
    const { data } = await coreApi.post<TakeTicketResponse>(
      `/tickets/${ticketId}/take`,
    );
    return data;
  },

  // Escalate a ticket to another agent
  escalateTicket: async (
    ticketId: string,
    payload: EscalateTicketPayload,
  ): Promise<TicketListItem> => {
    const { data } = await coreApi.post<TicketListItem>(
      `/tickets/${ticketId}/escalate`,
      payload,
    );
    return data;
  },

  // Update ticket status (RESOLVED or CLOSED only)
  updateTicketStatus: async (
    ticketId: string,
    payload: UpdateTicketStatusPayload,
  ): Promise<TicketListItem> => {
    const { data } = await coreApi.patch<TicketListItem>(
      `/tickets/${ticketId}/status`,
      payload,
    );
    return data;
  },
};
