import axios from "axios";
import { coreApi } from "@/shared/axiosInstance";
import {
  IntegrationDto,
  IntegrationListResponse,
  IntegrationsFilters,
  CreateIntegrationPayload,
  UpdateIntegrationPayload,
  PublicSubmitPayload,
  NotificationDto,
  NotificationListResponse,
  NotificationsFilters,
  IntegrationLogDto,
  IntegrationLogListResponse,
  IntegrationLogFilters,
} from "../model/types";

// Unauthenticated instance for public endpoints
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL,
});

export const integrationsApi = {
  // ========== Integrations (authenticated) ==========

  getIntegrations: async (
    filters?: IntegrationsFilters,
  ): Promise<IntegrationListResponse> => {
    const { data } = await coreApi.get<IntegrationListResponse>(
      "/integrations",
      {
        params: {
          searchTerm: filters?.searchTerm,
          eventType: filters?.eventType,
          page: filters?.page,
          limit: filters?.limit,
        },
      },
    );
    return data;
  },

  getIntegrationById: async (id: string): Promise<IntegrationDto> => {
    const { data } = await coreApi.get<IntegrationDto>(`/integrations/${id}`);
    return data;
  },

  getIntegrationBySlug: async (slug: string): Promise<IntegrationDto> => {
    const { data } = await coreApi.get<IntegrationDto>(
      `/integrations/slug/${slug}`,
    );
    return data;
  },

  createIntegration: async (
    payload: CreateIntegrationPayload,
  ): Promise<IntegrationDto> => {
    const { data } = await coreApi.post<IntegrationDto>(
      "/integrations",
      payload,
    );
    return data;
  },

  updateIntegration: async (
    id: string,
    payload: UpdateIntegrationPayload,
  ): Promise<IntegrationDto> => {
    const { data } = await coreApi.patch<IntegrationDto>(
      `/integrations/${id}`,
      payload,
    );
    return data;
  },

  activateIntegration: async (id: string): Promise<IntegrationDto> => {
    const { data } = await coreApi.patch<IntegrationDto>(
      `/integrations/${id}/activate`,
    );
    return data;
  },

  deactivateIntegration: async (id: string): Promise<IntegrationDto> => {
    const { data } = await coreApi.patch<IntegrationDto>(
      `/integrations/${id}/deactivate`,
    );
    return data;
  },

  // ========== Public (unauthenticated) ==========

  getPublicIntegration: async (slug: string): Promise<IntegrationDto> => {
    const { data } = await publicApi.get<IntegrationDto>(
      `/public/integrations/${slug}`,
    );
    return data;
  },

  submitPublicIntegration: async (
    slug: string,
    payload: PublicSubmitPayload,
  ): Promise<NotificationDto> => {
    const { data } = await publicApi.post<NotificationDto>(
      `/public/integrations/${slug}/submit`,
      payload,
    );
    return data;
  },

  // ========== Notifications (authenticated, read-only) ==========

  getNotifications: async (
    filters?: NotificationsFilters,
  ): Promise<NotificationListResponse> => {
    const { data } = await coreApi.get<NotificationListResponse>(
      "/notifications",
      {
        params: {
          integrationId: filters?.integrationId,
          status: filters?.status,
          page: filters?.page,
          limit: filters?.limit,
        },
      },
    );
    return data;
  },

  getNotificationById: async (id: string): Promise<NotificationDto> => {
    const { data } = await coreApi.get<NotificationDto>(
      `/notifications/${id}`,
    );
    return data;
  },

  // ========== Integration Logs (authenticated, read-only) ==========

  getIntegrationLogs: async (
    filters?: IntegrationLogFilters,
  ): Promise<IntegrationLogListResponse> => {
    const { data } = await coreApi.get<IntegrationLogListResponse>(
      "/integration-logs",
      {
        params: {
          action: filters?.action,
          severity: filters?.severity,
          integrationId: filters?.integrationId,
          slug: filters?.slug,
          actorId: filters?.actorId,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          page: filters?.page,
          limit: filters?.limit,
        },
      },
    );
    return data;
  },

  getIntegrationLogById: async (id: string): Promise<IntegrationLogDto> => {
    const { data } = await coreApi.get<IntegrationLogDto>(
      `/integration-logs/${id}`,
    );
    return data;
  },
};
