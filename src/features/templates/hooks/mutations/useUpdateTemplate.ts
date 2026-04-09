import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { UpdateTemplateDto } from "../../model/types";
import { templateKeys } from "../queries/queryKeys";

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & UpdateTemplateDto) =>
      templatesApi.updateTemplate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};
