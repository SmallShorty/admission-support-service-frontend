import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { templateKeys } from "../queries/queryKeys";

export const useDeactivateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesApi.deactivateTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};
