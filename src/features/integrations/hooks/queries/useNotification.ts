import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { notificationKeys } from "./queryKeys";

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => integrationsApi.getNotificationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
