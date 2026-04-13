import { IntegrationsFilters, NotificationsFilters } from "../../model/types";

export const integrationKeys = {
  all: ["integrations"] as const,
  list: (filters?: IntegrationsFilters) =>
    [...integrationKeys.all, "list", filters] as const,
  detail: (id: string) => [...integrationKeys.all, "detail", id] as const,
  bySlug: (slug: string) => [...integrationKeys.all, "slug", slug] as const,
  public: (slug: string) => [...integrationKeys.all, "public", slug] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (filters?: NotificationsFilters) =>
    [...notificationKeys.all, "list", filters] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
};
