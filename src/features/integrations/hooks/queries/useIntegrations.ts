import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { IntegrationsFilters } from "../../model/types";
import { integrationKeys } from "./queryKeys";

export const useIntegrations = (filters?: IntegrationsFilters) => {
  return useQuery({
    queryKey: integrationKeys.list(filters),
    queryFn: () => integrationsApi.getIntegrations(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
