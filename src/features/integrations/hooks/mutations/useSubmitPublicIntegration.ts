import { useMutation } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { PublicSubmitPayload } from "../../model/types";

export const useSubmitPublicIntegration = (slug: string) => {
  return useMutation({
    mutationFn: (payload: PublicSubmitPayload) =>
      integrationsApi.submitPublicIntegration(slug, payload),
  });
};
