import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { integrationKeys } from "./queryKeys";

export const useIntegrationBySlug = (slug: string) => {
  return useQuery({
    queryKey: integrationKeys.bySlug(slug),
    queryFn: () => integrationsApi.getIntegrationBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
