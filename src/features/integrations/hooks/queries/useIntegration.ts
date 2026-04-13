import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { integrationKeys } from "./queryKeys";

export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: integrationKeys.detail(id),
    queryFn: () => integrationsApi.getIntegrationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
