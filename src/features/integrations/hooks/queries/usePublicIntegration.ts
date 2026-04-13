import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { integrationKeys } from "./queryKeys";

export const usePublicIntegration = (slug: string) => {
  return useQuery({
    queryKey: integrationKeys.public(slug),
    queryFn: () => integrationsApi.getPublicIntegration(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
