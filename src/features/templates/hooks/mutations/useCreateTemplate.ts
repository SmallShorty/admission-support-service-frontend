import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { CreateTemplateDto } from "../../model/types";
import { templateKeys } from "../queries/queryKeys";

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTemplateDto) => templatesApi.createTemplate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};
