import { accountApi } from "@/app/entities/account/api/accountApi";
import { UpdateAccountDto } from "@/app/entities/account/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsQueryKeys } from "../queries/queryKeys";

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & UpdateAccountDto) =>
      accountApi.updateAccount(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsQueryKeys.all });
    },
  });
};
