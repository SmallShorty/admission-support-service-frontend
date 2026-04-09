import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { templateKeys } from "../queries/queryKeys";

export const useActivateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templatesApi.activateTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};
