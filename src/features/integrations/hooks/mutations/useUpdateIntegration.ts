import { useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { UpdateIntegrationPayload } from "../../model/types";
import { integrationKeys } from "../queries/queryKeys";

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateIntegrationPayload;
    }) => integrationsApi.updateIntegration(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(integrationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: integrationKeys.all });
    },
  });
};
