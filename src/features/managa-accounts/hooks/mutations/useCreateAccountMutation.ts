import { accountApi } from "@/app/entities/account/api/accountApi";
import { CreateAccountDto } from "@/app/entities/account/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsQueryKeys } from "../queries/queryKeys";

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAccountDto) => accountApi.register(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsQueryKeys.all });
    },
  });
};
