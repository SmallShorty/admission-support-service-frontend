import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { NotificationsFilters } from "../../model/types";
import { notificationKeys } from "./queryKeys";

export const useNotifications = (filters?: NotificationsFilters) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => integrationsApi.getNotifications(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
