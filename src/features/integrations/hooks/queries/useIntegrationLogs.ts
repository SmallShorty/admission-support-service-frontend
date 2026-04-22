import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { IntegrationLogFilters } from "../../model/types";
import { integrationLogKeys } from "./queryKeys";

export const useIntegrationLogs = (filters?: IntegrationLogFilters) => {
  return useQuery({
    queryKey: integrationLogKeys.list(filters),
    queryFn: () => integrationsApi.getIntegrationLogs(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
