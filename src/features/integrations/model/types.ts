export enum EventType {
  INFORMATIONAL = "INFORMATIONAL",
  FAILURE = "FAILURE",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export interface IntegrationDto {
  id: string;
  slug: string;
  name: string;
  eventType: EventType;
  theme: string;
  source: string;
  content: Record<string, unknown>;
  isActive: boolean;
  isTypeEditable: boolean;
  isThemeEditable: boolean;
  isSourceEditable: boolean;
  isContentEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationListResponse {
  items: IntegrationDto[];
  total: number;
}

export interface IntegrationsFilters {
  searchTerm?: string;
  eventType?: EventType;
  page?: number;
  limit?: number;
}

export interface CreateIntegrationPayload {
  slug: string;
  name: string;
  eventType: EventType;
  theme: string;
  source: string;
  content: Record<string, unknown>;
  isTypeEditable?: boolean;
  isThemeEditable?: boolean;
  isSourceEditable?: boolean;
  isContentEditable?: boolean;
}

export interface UpdateIntegrationPayload {
  slug?: string;
  name?: string;
  eventType?: EventType;
  theme?: string;
  source?: string;
  content?: Record<string, unknown>;
  isTypeEditable?: boolean;
  isThemeEditable?: boolean;
  isSourceEditable?: boolean;
  isContentEditable?: boolean;
}

export interface PublicSubmitPayload {
  theme?: string;
  eventType?: EventType;
  source?: string;
  content?: Record<string, unknown>;
}

export interface NotificationPayload {
  eventType: EventType;
  theme: string;
  source: string;
  content: Record<string, unknown>;
}

export interface NotificationDto {
  id: string;
  integrationId: string;
  payload: NotificationPayload;
  status: NotificationStatus;
  error: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationDto[];
  total: number;
}

export interface NotificationsFilters {
  integrationId?: string;
  status?: NotificationStatus;
  page?: number;
  limit?: number;
}
