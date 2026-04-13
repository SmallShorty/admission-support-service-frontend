import { useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { integrationKeys } from "../queries/queryKeys";

export const useDeactivateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => integrationsApi.deactivateIntegration(id),
    onSuccess: (data) => {
      queryClient.setQueryData(integrationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: integrationKeys.all });
    },
  });
};
