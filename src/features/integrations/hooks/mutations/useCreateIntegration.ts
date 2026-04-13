import { useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { CreateIntegrationPayload } from "../../model/types";
import { integrationKeys } from "../queries/queryKeys";

export const useCreateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIntegrationPayload) =>
      integrationsApi.createIntegration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.all });
    },
  });
};
