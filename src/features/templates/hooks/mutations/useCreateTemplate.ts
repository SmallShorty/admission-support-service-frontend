import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { CreateTemplateDto } from "../../model/types";
import { templateKeys } from "../queries/queryKeys";
import { useAppSelector } from "@/app/hooks";

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const accountId = useAppSelector((state) => state.account.data?.id ?? "");

  return useMutation({
    mutationFn: (dto: Omit<CreateTemplateDto, "createdBy">) =>
      templatesApi.createTemplate({ ...dto, createdBy: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};
